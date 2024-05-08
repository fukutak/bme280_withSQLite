import sqlite3
import time
from datetime import datetime
from use_bme280 import readData
import os

# SQLiteデータベースのパス
db_path = "bme280_data.db"

# テーブル作成SQL文
create_table_sql = """
CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL,
    pressure REAL,
    humidity REAL,
    timestamp TEXT,
    room_id TEXT
);
"""

# データベースに接続し、カーソルを取得
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# テーブル作成
cursor.execute(create_table_sql)
conn.commit()

INTERVAL_TIME = 15 * 60 # sec
MAX_DB_SIZE = 2 * 1024 * 1024 * 1024  # 2GiB

# 15分ごとにデータを取得してSQLiteに格納
while True:
    # bme280からデータを取得
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"-----{timestamp}------")
    data = readData()
    temperature = round(data['temp'], 3)
    pressure = round(data['press'], 3)
    humidity = round(data['hum'], 3)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    room_id = 'my_room'

    # データをデータベースに格納
    insert_sql = """
    INSERT INTO sensor_data (temperature, pressure, humidity, timestamp, room_id)
    VALUES (?, ?, ?, ?, ?)
    """
    cursor.execute(insert_sql, (temperature, pressure, humidity, timestamp, room_id))
    conn.commit()

    # 15分待機
    time.sleep(INTERVAL_TIME)  # 15分 = 15 * 60秒
    db_size = os.path.getsize(db_path)
    if db_size >= MAX_DB_SIZE:
        print(f"Exceed max db size: {MAX_DB_SIZE}, now: {db_size}")
        print("Delete some records.")
        pass


# データベース接続をクローズ
conn.close()
