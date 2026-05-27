"""CRUD для спринтов: список, создание, обновление прогресса"""
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
    sprint_id = path_parts[-1] if len(path_parts) > 1 and path_parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(
                f"""SELECT id, name, status, start_date, end_date,
                           total_tasks, done_tasks, team, velocity, burndown
                    FROM {SCHEMA}.sprints
                    ORDER BY id DESC"""
            )
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]
            sprints = []
            for row in rows:
                s = dict(zip(cols, row))
                s["burndown"] = s["burndown"] if isinstance(s["burndown"], list) else json.loads(s["burndown"])
                s["progress"] = round(s["done_tasks"] / s["total_tasks"] * 100) if s["total_tasks"] > 0 else 0
                sprints.append(s)
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(sprints, default=str)}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            name = body.get("name", "New Sprint").replace("'", "''")
            start_date = body.get("start_date", "").replace("'", "''")
            end_date = body.get("end_date", "").replace("'", "''")
            team = body.get("team", "").replace("'", "''")
            total_tasks = int(body.get("total_tasks", 0))
            cur.execute(
                f"""INSERT INTO {SCHEMA}.sprints (name, status, start_date, end_date, total_tasks, done_tasks, team, velocity, burndown)
                    VALUES ('{name}', 'active', '{start_date}', '{end_date}', {total_tasks}, 0, '{team}', 0, '[]')
                    RETURNING id, name, status, start_date, end_date, total_tasks, done_tasks, team, velocity, burndown"""
            )
            row = cur.fetchone()
            cols = [d[0] for d in cur.description]
            s = dict(zip(cols, row))
            s["burndown"] = s["burndown"] if isinstance(s["burndown"], list) else json.loads(s["burndown"])
            s["progress"] = 0
            conn.commit()
            return {"statusCode": 201, "headers": CORS, "body": json.dumps(s, default=str)}

        if method == "PUT" and sprint_id:
            body = json.loads(event.get("body") or "{}")
            updates = []
            if "done_tasks" in body:
                updates.append(f"done_tasks = {int(body['done_tasks'])}")
            if "total_tasks" in body:
                updates.append(f"total_tasks = {int(body['total_tasks'])}")
            if "status" in body:
                updates.append(f"status = '{body['status']}'")
            if "velocity" in body:
                updates.append(f"velocity = {int(body['velocity'])}")
            if "burndown" in body:
                updates.append(f"burndown = '{json.dumps(body['burndown'])}'")
            if updates:
                cur.execute(
                    f"""UPDATE {SCHEMA}.sprints SET {', '.join(updates)}
                        WHERE id = {int(sprint_id)}
                        RETURNING id, name, status, start_date, end_date, total_tasks, done_tasks, team, velocity, burndown"""
                )
                row = cur.fetchone()
                cols = [d[0] for d in cur.description]
                s = dict(zip(cols, row))
                s["burndown"] = s["burndown"] if isinstance(s["burndown"], list) else json.loads(s["burndown"])
                s["progress"] = round(s["done_tasks"] / s["total_tasks"] * 100) if s["total_tasks"] > 0 else 0
                conn.commit()
                return {"statusCode": 200, "headers": CORS, "body": json.dumps(s, default=str)}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
