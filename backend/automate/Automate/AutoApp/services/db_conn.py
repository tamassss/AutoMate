from django.db import connection

def fetch_all(sql, params=None):
    """Run a SELECT and return list of dicts."""
    params = params or []
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in cursor.fetchall()]

def execute(sql, params=None):
    """Run INSERT / UPDATE / DELETE."""
    params = params or []
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        return cursor.rowcount

def execute_return_id(sql, params=None):
    """INSERT and return newly created ID."""
    params = params or []
    with connection.cursor() as cursor:
        cursor.execute(sql, params)
        cursor.execute("SELECT LAST_INSERT_ID()")
        return cursor.fetchone()[0]
