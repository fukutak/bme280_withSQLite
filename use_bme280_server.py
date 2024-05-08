from flask import Flask, request, jsonify
from flask_graphql import GraphQL
from graphqlalchemy import Schema
from graphqlalchemy.pagination import paginate

from models import SensorData # 既存のモデルをインポート

app = Flask(__name__)

# GraphQLスキーマ定義
schema = Schema(models=[SensorData])

# GraphQLエンドポイント
graphql_app = GraphQL(schema)
app.add_url_rule("/graphql", view_func=graphql_app.view_func)

# 期間指定で時系列データを取得するGraphQLクエリ
@app.route("/api/sensor-data", methods=["POST"])
def get_sensor_data():
    # リクエストボディから期間を取得
    start_date = request.json["start_date"]
    end_date = request.json["end_date"]

    # 期間内のデータを取得
    data = SensorData.query.filter(SensorData.timestamp >= start_date, SensorData.timestamp <= end_date).all()

    # データをJSON形式に変換
    response_data = []
    for sensor_data in data:
        response_data.append({
            "id": sensor_data.id,
            "temperature": sensor_data.temperature,
            "humidity": sensor_data.humidity,
            "pressure": sensor_data.pressure,
            "timestamp": sensor_data.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        })

    # JSONデータを返す
    return jsonify({"data": response_data})

# メイン処理
if __name__ == "__main__":
    app.run(debug=True)
