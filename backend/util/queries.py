from graphene_sqlalchemy import SQLAlchemyConnectionField
from graphene import relay
import graphene
from util.schema import BME280, BME280Data, CurrentData, CurrentDataAttribute
import util.queries
from util.use_bme280 import readData
import datetime


class DateRangeInput(graphene.InputObjectType):
    start_date = graphene.DateTime()
    end_date = graphene.DateTime()

class AverageSensorData(graphene.ObjectType):
    temperature = graphene.Float()
    pressure = graphene.Float()
    humidity = graphene.Float()

class CalcIndex: # 快適指数の計算
  def __init__(self, std, alw):
    self.std = std
    self.alw = alw
  
  def normalizeNP(self, amount, exp): # +=の時
    self.idx = (abs(amount-self.alw)/self.std)**exp
    return self.idx
  
  def normalizeN(self, amount, exp): # -のみの時
    self.idx = ((amount-self.alw)/self.std)**exp
    return self.idx


def resolve_average_sensor_data(self, info):
    # BME280 センサーデータの平均値を計算する処理
    average_data = {
        'temperature': 0.0,
        'pressure': 0.0,
        'humidity': 0.0
    }

    # 計算結果を AverageSensorData オブジェクトに変換して返す
    return AverageSensorData(**average_data)


class Query(graphene.ObjectType):
    node = relay.Node.Field()
    sensor_list = SQLAlchemyConnectionField(BME280)
    average_sensor_data = graphene.Field(AverageSensorData)
    sensor_data_by_date_range = graphene.List(BME280, date_range=DateRangeInput())
    current_data = graphene.Field(CurrentDataAttribute)

    def resolve_average_sensor_data(self, info):
        return resolve_average_sensor_data(self, info)

    def resolve_sensor_data_by_date_range(self, info, date_range):
        start_date = date_range.get('start_date')
        end_date = date_range.get('end_date')

        # 期間内のデータをフィルタリングして返す
        return BME280Data.query.filter(
            BME280Data.timestamp >= start_date,
            BME280Data.timestamp <= end_date
        ).all()
      
    def resolve_current_data(self, info):
      """
      BME280 センサーから最新のデータを測定し、CurrentDataAttribute オブジェクトとして返します。

      Args:
          info: GraphQL context information

      Returns:
          CurrentDataAttribute: センサーの最新のデータ
      """

      # センサーからデータを読み取る
      data = readData()

      # 読み込んだデータを CurrentDataAttribute オブジェクトに変換する
      current_data = CurrentDataAttribute(
          currentTemperature=data['temp'],
          changeRateTemperature=0.0,  # 変化率は未実装なのでとりあえず 0
          currentPressure=data['press'],
          changeRatePressure=0.0,  # 変化率は未実装なのでとりあえず 0
          currentHumidity=data['hum'],
          changeRateHumidity=0.0,  # 変化率は未実装なのでとりあえず 0
          currentTimestamp=datetime.datetime.now(),
          currentComfortIndex=self.calculate_comfort_index(data['temp'], data['hum'], data['press']),  # 快適指数を計算
          changeRateComfortIndex=0.0,  # 変化率は未実装なのでとりあえず 0
      )

      return current_data

    # 快適指数を計算する関数 (実装例)
    def calculate_comfort_index(self, T, H, P): # T:temperature, H:humidity, P:pressure
      # 快適指数の計算
      T_idx = CalcIndex(25, 3).normalizeNP(T, 1,5)
      H_idx = CalcIndex(50, 10).normalizeNP(H, 1.2)
      P_idx = CalcIndex(1013.25, 13).normalizeN(P, 1)

      comfort_index = -100/3*(T_idx+H_idx+P_idx) + 100
      return comfort_index

class Subscription(graphene.ObjectType):
    sensor_data_updated = graphene.Field(graphene.List(BME280), date_range=DateRangeInput())

    def resolve_sensor_data_updated(self, info, date_range):
        # データベースから date_range に該当する BME280Data を取得
        data = BME280Data.query.filter(
            BME280Data.timestamp >= date_range.get('start_date'),
            BME280Data.timestamp <= date_range.get('end_date')
        ).all()

        # クライアントに通知を送信
        for client in info.context['channel']:
            client.send_json({'data': data})

schema = graphene.Schema(query=Query, subscription=Subscription)


"""
query{
  sensorDataByDateRange(dateRange: { startDate: "2024-05-01T00:00:00", endDate: "2024-05-09T23:59:59" }) {
    temperature
    pressure
    humidity
    timestamp
  }
}
"""