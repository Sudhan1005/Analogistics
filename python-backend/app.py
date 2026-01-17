from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from db_config import get_db_connection
from datetime import timedelta, date, datetime
app = Flask(__name__)
CORS(app)
from datetime import timedelta

def serialize_row(row):
    if not row:
        return row

    for key, value in row.items():

        # TIME → HH:MM
        if isinstance(value, timedelta):
            seconds = int(value.total_seconds())
            row[key] = f"{seconds//3600:02d}:{(seconds%3600)//60:02d}"

        # DATE / DATETIME → YYYY-MM-DD
        elif isinstance(value, (date, datetime)):
            row[key] = value.strftime("%Y-%m-%d")

    return row
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
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data received"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT * FROM register_users WHERE email=%s", (email,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if not user:
        return jsonify({"message": "User not found"}), 401

    # 🔍 TEMP DEBUG (REMOVE AFTER SUCCESS)
    print("LOGIN EMAIL:", email)
    print("ENTERED PASSWORD:", password)
    print("DB HASH:", user["password"])

    if check_password_hash(user["password"], password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"]
            }
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401

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

@app.route('/api/zones/by-warehouse/<int:warehouse_id>', methods=['GET'])
def get_zones_by_warehouse(warehouse_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, zone_name, zone_type
        FROM warehouse_zones
        WHERE warehouse_id = %s
    """, (warehouse_id,))

    zones = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(zones), 200
@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        data = request.json

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO warehouse_products (
                warehouse_id,
                zone_id,
                product_name,
                product_type,
                product_category,
                quantity,
                order_date,
                order_time,
                delivery_date,
                delivery_time,
                status
            ) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            int(data['warehouse_id']),
            int(data['zone_id']),
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

        return jsonify({'message': 'Product entry created'}), 201

    except Exception as e:
        print('Product error:', e)
        return jsonify({'error': str(e)}), 500

@app.route('/api/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.*,
            w.name AS warehouse_name,
            z.zone_name,
            z.zone_type
        FROM warehouse_products p
        JOIN warehouses w ON p.warehouse_id = w.id
        LEFT JOIN warehouse_zones z ON p.zone_id = z.id
        WHERE p.status IN ('Inbound', 'Storage')
        ORDER BY p.id DESC
    """)

    products = cursor.fetchall()
    cursor.close()
    conn.close()

    products = [serialize_row(p) for p in products]
    return jsonify(products), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM warehouse_products WHERE id = %s",
        (product_id,)
    )
    product = cursor.fetchone()

    cursor.close()
    conn.close()

    if not product:
        return jsonify({"message": "Product not found"}), 404

    product = serialize_row(product)   # ✅ FIX
    return jsonify(product), 200
@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE warehouse_products SET
            warehouse_id=%s,
            zone_id=%s,
            product_name=%s,
            product_type=%s,
            product_category=%s,
            quantity=%s,
            order_date=%s,
            delivery_date=%s,
            driver_id=%s,
            delivery_slot_id=%s,
            status=%s
        WHERE id=%s
    """, (
        data['warehouse_id'],
        data['zone_id'],
        data['product_name'],
        data['product_type'],
        data['product_category'],
        data['quantity'],
        data['order_date'],
        data['delivery_date'],
        data.get('driver_id'),
        data.get('delivery_slot_id'),
        data['status'],
        product_id
    ))

    # 🔁 DRIVER STATUS SYNC
    if data.get('driver_id'):
        if data['status'] in ('Driver Assigned', 'Out for Delivery', 'Logistics Ongoing'):
            cursor.execute("""
                UPDATE drivers
                SET status='Busy'
                WHERE id=%s
            """, (data['driver_id'],))
        else:
            cursor.execute("""
                UPDATE drivers
                SET status='Available'
                WHERE id=%s
            """, (data['driver_id'],))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery updated"}), 200
    
@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM warehouse_products WHERE id=%s",
        (product_id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Product deleted successfully"}), 200

@app.route('/api/delivery/products', methods=['GET'])
def get_delivery_list():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.*,
            w.name AS warehouse_name,
            z.zone_name,
            z.zone_type,
            d.driver_name,
            CONCAT(
              s.slot_name,' (',s.start_time,'-',s.end_time,')'
            ) AS delivery_slot
        FROM warehouse_products p
        JOIN warehouses w ON p.warehouse_id = w.id
        LEFT JOIN warehouse_zones z ON p.zone_id = z.id
        LEFT JOIN drivers d ON p.driver_id = d.id
        LEFT JOIN delivery_slots s ON p.delivery_slot_id = s.id
        WHERE p.status IN (
  'Outbound',
  'Driver Yet to Assign',
  'Driver Assigned'
)
        ORDER BY p.id DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify([serialize_row(d) for d in data]), 200

@app.route('/api/delivery/assign/<int:product_id>', methods=['PUT'])
def assign_delivery(product_id):
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    # update product
    cursor.execute("""
        UPDATE warehouse_products
        SET driver_id=%s,
            delivery_slot_id=%s,
            status='Driver Assigned'
        WHERE id=%s
    """, (
        data['driver_id'],
        data['delivery_slot_id'],
        product_id
    ))

    # update driver status
    cursor.execute("""
        UPDATE drivers
        SET status='Driver Assigned'
        WHERE id=%s
    """, (data['driver_id'],))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Delivery assigned'}), 200

# ================= DELIVERY SLOTS =================

@app.route('/api/delivery-slots', methods=['GET'])
def get_delivery_slots():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, slot_name, start_time, end_time
        FROM delivery_slots
        ORDER BY id DESC
    """)

    data = cursor.fetchall()
    cursor.close()
    conn.close()

    data = [serialize_row(d) for d in data]
    return jsonify(data), 200


@app.route('/api/delivery-slots', methods=['POST'])
def create_delivery_slot():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO delivery_slots (slot_name, start_time, end_time)
        VALUES (%s, %s, %s)
    """, (
        data['slot_name'],
        data['start_time'],
        data['end_time']
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery slot created"}), 201


@app.route('/api/delivery-slots/<int:id>', methods=['GET'])
def get_delivery_slot(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT id, slot_name, start_time, end_time
        FROM delivery_slots
        WHERE id = %s
    """, (id,))

    slot = cursor.fetchone()
    cursor.close()
    conn.close()

    if not slot:
        return jsonify({"message": "Not found"}), 404

    slot = serialize_row(slot)
    return jsonify(slot), 200


@app.route('/api/delivery-slots/<int:id>', methods=['PUT'])
def update_delivery_slot(id):
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE delivery_slots
        SET slot_name=%s, start_time=%s, end_time=%s
        WHERE id=%s
    """, (
        data['slot_name'],
        data['start_time'],
        data['end_time'],
        id
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery slot updated"}), 200


@app.route('/api/delivery-slots/<int:id>', methods=['DELETE'])
def delete_delivery_slot(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM delivery_slots WHERE id=%s",
        (id,)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"message": "Delivery slot deleted"}), 200

# ================== DRIVERS ==================

@app.route('/api/drivers', methods=['GET'])
def get_drivers():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            d.id,
            d.driver_name,
            d.gender,
            d.phone,
            CONCAT(d.govt_id_type, ' - ', d.govt_id_number) AS govt_id,
            CASE
                WHEN EXISTS (
                    SELECT 1 FROM warehouse_products p
                    WHERE p.driver_id = d.id
                    AND p.status IN (
                        'Driver Assigned',
                        'Out for Delivery',
                        'Logistics Ongoing'
                    )
                )
                THEN 'Assigned'
                ELSE 'Available'
            END AS status
        FROM drivers d
        ORDER BY d.id DESC
    """)

    drivers = cursor.fetchall()
    cursor.close()
    conn.close()

    return jsonify(drivers), 200

@app.route('/api/drivers/<int:id>', methods=['GET'])
def get_driver(id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT * FROM drivers WHERE id=%s", (id,))
    driver = cursor.fetchone()

    cursor.close()
    conn.close()
    return jsonify(driver), 200


@app.route('/api/drivers/<int:id>', methods=['PUT'])
def update_driver(id):
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE drivers SET
          driver_name=%s,
          gender=%s,
          email=%s,
          phone=%s,
          last_company=%s,
          govt_id_type=%s,
          govt_id_number=%s
        WHERE id=%s
    """, (
        data['driver_name'],
        data['gender'],
        data.get('email'),
        data.get('phone'),
        data.get('last_company'),
        data['govt_id_type'],
        data['govt_id_number'],
        id
    ))

    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({'message': 'Driver updated'}), 200


@app.route('/api/drivers/<int:id>', methods=['DELETE'])
def delete_driver(id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM drivers WHERE id=%s", (id,))
    conn.commit()

    cursor.close()
    conn.close()
    return jsonify({'message': 'Driver deleted'}), 200

@app.route('/api/logistics', methods=['GET'])
def get_logistics_list():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("""
        SELECT
            p.id,
            p.product_name,
            p.product_type,
            p.product_category,
            p.quantity,
            p.delivery_date,

            w.name AS warehouse_name,
            z.zone_name,

            l.id AS logistics_id,
            l.transport_type,
            l.vehicle_type,
            l.vehicle_number

        FROM warehouse_products p
        JOIN warehouses w ON p.warehouse_id = w.id
        LEFT JOIN warehouse_zones z ON p.zone_id = z.id
        LEFT JOIN logistics_assignments l ON l.product_id = p.id

        WHERE p.status = 'Out for Delivery'
        ORDER BY p.delivery_date ASC
    """)

    data = cur.fetchall()
    cur.close()
    conn.close()

    return jsonify(data), 200

@app.route('/api/logistics', methods=['POST'])
def save_logistics():
    data = request.json
    product_id = data['product_id']

    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # 1️⃣ Get delivery / product details
    cur.execute("""
        SELECT warehouse_id, zone_id
        FROM warehouse_products
        WHERE id = %s
    """, (product_id,))
    product = cur.fetchone()

    if not product:
        return jsonify({'message': 'Product not found'}), 404

    # 2️⃣ Insert logistics assignment
    cur.execute("""
        INSERT INTO logistics_assignments (
            product_id,
            from_warehouse_id,
            from_zone_id,
            transport_type,
            vehicle_type,
            vehicle_number,
            status
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        product_id,
        product['warehouse_id'],
        product['zone_id'],
        data['transport_type'],
        data['vehicle_type'],
        data['vehicle_number'],
        'Out for Delivery'
    ))

    # 3️⃣ Update product status
    cur.execute("""
        UPDATE warehouse_products
        SET status = 'Out for Delivery'
        WHERE id = %s
    """, (product_id,))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Logistics saved successfully'}), 201

@app.route('/api/logistics/<int:product_id>', methods=['PUT'])
def update_logistics(product_id):
    data = request.json

    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE logistics_assignments
        SET transport_type=%s,
            vehicle_type=%s,
            vehicle_number=%s
        WHERE product_id=%s
    """, (
        data['transport_type'],
        data['vehicle_type'],
        data['vehicle_number'],
        product_id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Logistics updated'}), 200

@app.route('/api/logistics/<int:product_id>', methods=['DELETE'])
def delete_logistics(product_id):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute(
        "DELETE FROM logistics_assignments WHERE product_id=%s",
        (product_id,)
    )

    cur.execute(
        "UPDATE warehouse_products SET status='Driver Assigned' WHERE id=%s",
        (product_id,)
    )

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': 'Logistics deleted'}), 200

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)