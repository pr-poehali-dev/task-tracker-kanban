"""CRUD для участников команды"""
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
    member_id = path_parts[-1] if len(path_parts) > 1 and path_parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(
                f"""SELECT m.id, m.name, m.role, m.avatar, m.color, m.online,
                           COUNT(t.id) as task_count
                    FROM {SCHEMA}.members m
                    LEFT JOIN {SCHEMA}.tasks t ON t.assignee = m.avatar
                    GROUP BY m.id
                    ORDER BY m.id"""
            )
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps([dict(zip(cols, r)) for r in rows], default=str)}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            name = body.get("name", "").replace("'", "''")
            role = body.get("role", "").replace("'", "''")
            avatar = body.get("avatar", "?")
            color = body.get("color", "#6366f1")
            cur.execute(
                f"""INSERT INTO {SCHEMA}.members (name, role, avatar, color, online)
                    VALUES ('{name}', '{role}', '{avatar}', '{color}', false)
                    RETURNING id, name, role, avatar, color, online"""
            )
            row = cur.fetchone()
            cols = [d[0] for d in cur.description]
            conn.commit()
            return {"statusCode": 201, "headers": CORS, "body": json.dumps(dict(zip(cols, row)), default=str)}

        if method == "PUT" and member_id:
            body = json.loads(event.get("body") or "{}")
            updates = []
            if "online" in body:
                updates.append(f"online = {'true' if body['online'] else 'false'}")
            if "role" in body:
                updates.append(f"role = '{body['role'].replace(chr(39), chr(39)*2)}'")
            if updates:
                cur.execute(
                    f"""UPDATE {SCHEMA}.members SET {', '.join(updates)}
                        WHERE id = {int(member_id)}
                        RETURNING id, name, role, avatar, color, online"""
                )
                row = cur.fetchone()
                cols = [d[0] for d in cur.description]
                conn.commit()
                return {"statusCode": 200, "headers": CORS, "body": json.dumps(dict(zip(cols, row)), default=str)}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
