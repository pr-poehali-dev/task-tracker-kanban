"""CRUD для проектов: список, создание, обновление"""
import json
import os
import psycopg2

SCHEMA = "t_p69306450_task_tracker_kanban"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path_parts = (event.get("path") or "").strip("/").split("/")
    project_id = path_parts[-1] if len(path_parts) > 1 and path_parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(
                f"""SELECT p.id, p.name, p.color, p.progress,
                           COUNT(t.id) as tasks,
                           (SELECT COUNT(*) FROM {SCHEMA}.members) as members
                    FROM {SCHEMA}.projects p
                    LEFT JOIN {SCHEMA}.tasks t ON t.project_id = p.id
                    GROUP BY p.id
                    ORDER BY p.id"""
            )
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]
            projects = [dict(zip(cols, row)) for row in rows]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(projects, default=str)}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            name = body.get("name", "Новый проект").replace("'", "''")
            color = body.get("color", "#6366f1")
            cur.execute(
                f"""INSERT INTO {SCHEMA}.projects (name, color, progress)
                    VALUES ('{name}', '{color}', 0)
                    RETURNING id, name, color, progress"""
            )
            row = cur.fetchone()
            cols = [d[0] for d in cur.description]
            conn.commit()
            return {"statusCode": 201, "headers": CORS, "body": json.dumps(dict(zip(cols, row)), default=str)}

        if method == "PUT" and project_id:
            body = json.loads(event.get("body") or "{}")
            updates = []
            if "name" in body:
                updates.append(f"name = '{body['name'].replace(chr(39), chr(39)*2)}'")
            if "color" in body:
                updates.append(f"color = '{body['color']}'")
            if "progress" in body:
                updates.append(f"progress = {int(body['progress'])}")
            if updates:
                cur.execute(
                    f"""UPDATE {SCHEMA}.projects SET {', '.join(updates)}
                        WHERE id = {int(project_id)}
                        RETURNING id, name, color, progress"""
                )
                row = cur.fetchone()
                cols = [d[0] for d in cur.description]
                conn.commit()
                return {"statusCode": 200, "headers": CORS, "body": json.dumps(dict(zip(cols, row)), default=str)}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
