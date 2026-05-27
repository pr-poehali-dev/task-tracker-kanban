"""CRUD для задач: список, создание, обновление статуса/колонки"""
import json
import os
import psycopg2

SCHEMA = "t_p69306450_task_tracker_kanban"

def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}
    path_parts = (event.get("path") or "").strip("/").split("/")
    task_id = path_parts[-1] if len(path_parts) > 1 and path_parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            project_id = params.get("project_id")
            if project_id:
                cur.execute(
                    f"""SELECT t.id, t.title, t.status, t.priority, t.assignee,
                               t.project_id, t.tags, t.estimate, t.sprint_id,
                               p.name as project_name, p.color as project_color
                        FROM {SCHEMA}.tasks t
                        LEFT JOIN {SCHEMA}.projects p ON p.id = t.project_id
                        WHERE t.project_id = {int(project_id)}
                        ORDER BY t.created_at""",
                )
            else:
                cur.execute(
                    f"""SELECT t.id, t.title, t.status, t.priority, t.assignee,
                               t.project_id, t.tags, t.estimate, t.sprint_id,
                               p.name as project_name, p.color as project_color
                        FROM {SCHEMA}.tasks t
                        LEFT JOIN {SCHEMA}.projects p ON p.id = t.project_id
                        ORDER BY t.created_at"""
                )
            rows = cur.fetchall()
            cols = [d[0] for d in cur.description]
            tasks = []
            for row in rows:
                task = dict(zip(cols, row))
                task["tags"] = task["tags"] if isinstance(task["tags"], list) else json.loads(task["tags"])
                tasks.append(task)
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(tasks, default=str)}

        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            title = body.get("title", "Новая задача")
            status = body.get("status", "todo")
            priority = body.get("priority", "medium")
            assignee = body.get("assignee", "")
            project_id = body.get("project_id")
            tags = json.dumps(body.get("tags", []))
            estimate = body.get("estimate", "")
            sprint_id = body.get("sprint_id")

            proj_val = str(int(project_id)) if project_id else "NULL"
            sprint_val = str(int(sprint_id)) if sprint_id else "NULL"
            assignee_esc = assignee.replace("'", "''")
            title_esc = title.replace("'", "''")
            estimate_esc = estimate.replace("'", "''")
            tags_esc = tags.replace("'", "''")

            cur.execute(
                f"""INSERT INTO {SCHEMA}.tasks (title, status, priority, assignee, project_id, tags, estimate, sprint_id)
                    VALUES ('{title_esc}', '{status}', '{priority}', '{assignee_esc}', {proj_val}, '{tags_esc}', '{estimate_esc}', {sprint_val})
                    RETURNING id, title, status, priority, assignee, project_id, tags, estimate, sprint_id"""
            )
            row = cur.fetchone()
            cols = [d[0] for d in cur.description]
            task = dict(zip(cols, row))
            task["tags"] = task["tags"] if isinstance(task["tags"], list) else json.loads(task["tags"])
            conn.commit()
            return {"statusCode": 201, "headers": CORS, "body": json.dumps(task, default=str)}

        if method in ("PUT", "PATCH") and task_id:
            body = json.loads(event.get("body") or "{}")
            updates = []
            if "title" in body:
                updates.append(f"title = '{body['title'].replace(chr(39), chr(39)*2)}'")
            if "status" in body:
                updates.append(f"status = '{body['status']}'")
            if "priority" in body:
                updates.append(f"priority = '{body['priority']}'")
            if "assignee" in body:
                updates.append(f"assignee = '{body['assignee'].replace(chr(39), chr(39)*2)}'")
            if "project_id" in body:
                v = str(int(body["project_id"])) if body["project_id"] else "NULL"
                updates.append(f"project_id = {v}")
            if "tags" in body:
                updates.append(f"tags = '{json.dumps(body['tags'])}'")
            if "estimate" in body:
                updates.append(f"estimate = '{body['estimate'].replace(chr(39), chr(39)*2)}'")
            if "sprint_id" in body:
                v = str(int(body["sprint_id"])) if body["sprint_id"] else "NULL"
                updates.append(f"sprint_id = {v}")

            if updates:
                updates.append("updated_at = NOW()")
                set_clause = ", ".join(updates)
                cur.execute(
                    f"""UPDATE {SCHEMA}.tasks SET {set_clause}
                        WHERE id = {int(task_id)}
                        RETURNING id, title, status, priority, assignee, project_id, tags, estimate, sprint_id"""
                )
                row = cur.fetchone()
                cols = [d[0] for d in cur.description]
                task = dict(zip(cols, row))
                task["tags"] = task["tags"] if isinstance(task["tags"], list) else json.loads(task["tags"])
                conn.commit()
                return {"statusCode": 200, "headers": CORS, "body": json.dumps(task, default=str)}

            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "no fields to update"})}

    finally:
        cur.close()
        conn.close()

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "not found"})}
