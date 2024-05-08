import sqlite3
import time
from datetime import datetime
from use_bme280 import readData
import shutil
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

# データ保存制限（2GiB）
max_db_size = 2 * 1024 * 1024 * 1024  # 2GiB

# 15分ごとにデータを取得してSQLiteに格納
while True:
    # bme280からデータを取得
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

    # データベースサイズをチェック
    db_size = os.path.getsize(db_path)

    # データベースサイズが制限を超えた場合、古いデータを削除
    if db_size > max_db_size:
        pass