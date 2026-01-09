from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_config import get_db_connection

app = Flask(__name__)
CORS(app)

# ---------------- REGISTER ----------------
@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    question = data["recovery_question"]
    answer = generate_password_hash(data["recovery_answer"])

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # 🔍 Check duplicate email or name
    cursor.execute("""
        SELECT id FROM register_users 
        WHERE email = %s OR name = %s
    """, (email, name))

    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({
            "message": "User already exists with this email or name"
        }), 409   # HTTP 409 Conflict

    # ✅ Insert new user
    cursor.execute("""
        INSERT INTO register_users 
        (name, email, password, recovery_question, recovery_answer)
        VALUES (%s, %s, %s, %s, %s)
    """, (name, email, password, question, answer))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201
# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM register_users WHERE email = %s",
        (email,)
    )
    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if user and check_password_hash(user["password"], password):
        return jsonify({
            "message": "Login successful",
            "name": user["name"],
            "email": user["email"]
        }), 200
    else:
        return jsonify({
            "message": "Invalid email or password"
        }), 401

# ---------------- FORGOT PASSWORD ----------------
@app.route("/api/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data["email"]
    answer = data["recovery_answer"]
    new_password = generate_password_hash(data["new_password"])

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM register_users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if user and check_password_hash(user["recovery_answer"], answer):
        cursor.execute("""
            UPDATE register_users 
            SET password=%s WHERE email=%s
        """, (new_password, email))
        conn.commit()
        msg = "Password reset successful"
    else:
        msg = "Recovery answer incorrect"

    cursor.close()
    conn.close()
    return jsonify({"message": msg})

@app.route("/api/warehouses", methods=["GET", "POST"])
def warehouses():
    if request.method == "GET":
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM warehouses")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data), 200

    if request.method == "POST":
        try:
            data = request.get_json()

            name = data.get("name")
            location = data.get("location")
            capacity = data.get("capacity")

            if not name or not location or capacity is None:
                return jsonify({"message": "Invalid data"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO warehouses (name, location, capacity) VALUES (%s, %s, %s)",
                (name, location, capacity)
            )

            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Warehouse created"}), 201

        except Exception as e:
            print("Warehouse POST error:", e)
            return jsonify({"message": "Server error"}), 500
@app.route("/api/hubs", methods=["GET", "POST"])
def hubs():
    if request.method == "GET":
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM hubs")
        data = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(data), 200

    if request.method == "POST":
        try:
            data = request.get_json()

            name = data.get("name")
            city = data.get("city")
            status = data.get("status")

            if not name or not city or not status:
                return jsonify({"message": "Invalid data"}), 400

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                "INSERT INTO hubs (name, city, status) VALUES (%s, %s, %s)",
                (name, city, status)
            )

            conn.commit()
            cursor.close()
            conn.close()

            return jsonify({"message": "Hub created"}), 201

        except Exception as e:
            print("Hub POST error:", e)
            return jsonify({"message": "Server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
