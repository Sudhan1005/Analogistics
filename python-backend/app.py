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

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id FROM register_users 
        WHERE email = %s OR name = %s
    """, (data["email"], data["name"]))

    if cursor.fetchone():
        return jsonify({"message": "User already exists"}), 409

    cursor.execute("""
        INSERT INTO register_users
        (name, email, password, recovery_question, recovery_answer)
        VALUES (%s, %s, %s, %s, %s)
    """, (
        data["name"],
        data["email"],
        generate_password_hash(data["password"]),
        data["recovery_question"],
        generate_password_hash(data["recovery_answer"])
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201


# ---------------- LOGIN ----------------
@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM register_users WHERE email = %s",
        (data["email"],)
    )

    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user and check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Login successful"}), 200

    return jsonify({"message": "Invalid email or password"}), 401


# ---------------- WAREHOUSES ----------------
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
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO warehouses
            (name, location, capacity, category, status, transportation_types)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["name"],
            data["location"],
            data["capacity"],
            data["category"],
            data["status"],
            ",".join(data.get("transportation_types", []))
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Warehouse created"}), 201


# ================== ZONES ==================

# -------- GET ZONES --------
@app.route("/api/zones", methods=["GET"])
def get_zones():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            z.id,
            w.name AS warehouse_name,
            z.zone_name,
            z.zone_type,
            z.product_category,
            z.status
        FROM warehouse_zones z
        JOIN warehouses w ON z.warehouse_id = w.id
    """)

    zones = cursor.fetchall()

    cursor.close()
    conn.close()

    return jsonify(zones), 200


# -------- CREATE ZONE --------
@app.route("/api/zones", methods=["POST"])
def create_zone():
    try:
        data = request.json
        print("Received zone:", data)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO warehouse_zones
            (warehouse_id, zone_name, zone_type, product_category, status)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            int(data["warehouse_id"]),
            data["zone_name"],
            data["zone_type"],
            data["product_category"],
            data["status"]
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Zone created successfully"}), 201

    except Exception as e:
        print("Create zone error:", e)
        return jsonify({"error": str(e)}), 500
@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.json
        print("Received product:", data)

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO warehouse_products (
                warehouse_id,
                product_name,
                product_type,
                product_category,
                quantity,
                order_date,
                order_time,
                delivery_date,
                delivery_time,
                status
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            int(data['warehouse_id']),
            data['product_name'],
            data['product_type'],
            data['product_category'],
            int(data['quantity']),
            data['order_date'],
            data['order_time'],
            data['delivery_date'],
            data['delivery_time'],
            data['status']
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Product entry created"}), 201

    except Exception as e:
        print("Product entry error:", e)
        return jsonify({"error": str(e)}), 500
        
# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)
