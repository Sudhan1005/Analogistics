import mysql.connector

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        port=3306,                 # MySQL default port
        user="root",
        password="Sudhan@1005s",
        database="analogistics_db",
        auth_plugin="mysql_native_password"
    )
