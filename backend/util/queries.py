from graphene_sqlalchemy import SQLAlchemyConnectionField
from graphene import relay
import graphene
from util.schema import BME280, BME280Data, BME280Attribute, CurrentData, CurrentDataAttribute, WeeklyAnalyticts
import util.queries
from util.use_bme280 import readData
import datetime
import calendar


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
    self.idx = (abs(self.std-amount)/self.alw)**exp
    return self.idx
  
  def normalizeN(self, amount, exp): # -のみの時
    self.idx = ((self.std-amount)/self.alw)**exp
    if self.idx < 0:
        self.idx = 0
    return self.idx

def calc_comfort_index(T, H, P, all_index=False): # T:temperature, H:humidity, P:pressure
    # 快適指数の計算
    T_idx = CalcIndex(25, 3).normalizeNP(T, 1.5)
    H_idx = CalcIndex(45, 12).normalizeNP(H, 1.2)
    P_idx = CalcIndex(1013.25, 13).normalizeN(P, 1)

    comfort_index = -100/3*(T_idx+H_idx+P_idx) + 100
    if not all_index:
        return round(comfort_index, 1)
    return round(comfort_index, 1), round(T_idx, 3), round(H_idx, 3), round(P_idx, 3)

def calc_change_rate(current_data, past_hour_data):
    """
    現在のデータと過去1時間のデータから変化率を計算します。

    Args:
        current_data: 最新のセンサーデータ
        past_hour_data: 過去1時間のセンサーデータ

    Returns:
        dict: 変化率データ
    """

    change_rate_data = {
        'temp': 0.0,
        'press': 0.0,
        'hum': 0.0,
        'comfort_index': 0.0
    }

    if past_hour_data:
        comfort_index = calc_comfort_index(current_data['temp'], current_data['hum'], current_data['press'])
        
        # 最新データと過去1時間前のデータを取得
        latest_past_data = past_hour_data[1]
        print(latest_past_data.timestamp)
        latest_comfort_index = calc_comfort_index(latest_past_data.temperature, latest_past_data.humidity, latest_past_data.pressure)

        # 変化率を計算
        # change_rate_data['temp'] = round((current_data['temp'] - latest_past_data.temperature) / latest_past_data.temperature * 100, 1)
        # change_rate_data['hum'] = round((current_data['hum'] - latest_past_data.humidity) / latest_past_data.humidity * 100, 1)
        # change_rate_data['press'] = round(current_data['press'] - latest_past_data.pressure, 1)
        # change_rate_data['comfort_index'] = round((comfort_index - latest_comfort_index) / latest_comfort_index * 100, 1)

        # 差分を計算
        change_rate_data['temp'] = round(current_data['temp'] - latest_past_data.temperature, 1)
        change_rate_data['hum'] = round(current_data['hum'] - latest_past_data.humidity, 1)
        change_rate_data['press'] = round(current_data['press'] - latest_past_data.pressure, 1)
        change_rate_data['comfort_index'] = round(comfort_index - latest_comfort_index, 1)
    return change_rate_data

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
    sensor_data_by_date_range = graphene.List(BME280Attribute, date_range=DateRangeInput())
    current_data = graphene.Field(CurrentDataAttribute)
    weekly_analyticts = graphene.Field(WeeklyAnalyticts)

    def resolve_average_sensor_data(self, info):
        return resolve_average_sensor_data(self, info)

    def resolve_sensor_data_by_date_range(self, info, date_range):
        start_date = date_range.get('start_date')
        end_date = date_range.get('end_date')

        data = BME280Data.query.filter(
            BME280Data.timestamp >= start_date,
            BME280Data.timestamp <= end_date
        ).all()

        enhanced_data = []

        # 開始日の00:00:00.000のnullデータ
        start_of_day = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
        enhanced_data.append({
            "id": None,
            "temperature": None,
            "pressure": None,
            "humidity": None,
            "timestamp": start_of_day,
            "room_id": None,
            "comfortIndex": None
        })

        for record in data:
            comfort_index = calc_comfort_index(record.temperature, record.humidity, record.pressure)
            enhanced_record = {
                "id": record.id,
                "temperature": record.temperature,
                "pressure": record.pressure,
                "humidity": record.humidity,
                "timestamp": record.timestamp,
                "room_id": record.room_id,
                "comfortIndex": comfort_index
            }
            enhanced_data.append(enhanced_record)
        
        # 終了日の23:59:59.999のnullデータ
        end_of_day = end_date.replace(hour=23-9, minute=59, second=59, microsecond=999)
        print(end_of_day)
        enhanced_data.append({
            "id": None,
            "temperature": None,
            "pressure": None,
            "humidity": None,
            "timestamp": end_of_day,
            "room_id": None,
            "comfortIndex": None
        })
        return enhanced_data
      
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

        # 過去1時間のデータを取得
        one_hour_ago = datetime.datetime.now() - datetime.timedelta(hours=1)
        past_hour_data = BME280Data.query.filter(
            BME280Data.timestamp >= one_hour_ago,
            BME280Data.timestamp <= datetime.datetime.now()
        ).all()

        # 変化率を計算
        change_rate_data = calc_change_rate(data, past_hour_data)

       # 今日記録されたレコード数
        today_commits = BME280Data.query.filter(
            BME280Data.timestamp >= datetime.datetime.now().date()
        ).count()

        # 全レコード数
        total_commits = BME280Data.query.count()
        indecies = calc_comfort_index(data['temp'], data['hum'], data['press'], all_index=True)
        print(indecies)

        # 読み込んだデータを CurrentDataAttribute オブジェクトに変換する
        current_data = CurrentDataAttribute(
            currentTimestamp=datetime.datetime.now(),
            currentTemperature=round(data['temp'], 1),
            changeRateTemperature=change_rate_data['temp'],
            currentPressure=round(data['press'], 1),
            changeRatePressure=change_rate_data['press'],
            currentHumidity=round(data['hum'], 1),
            changeRateHumidity=change_rate_data['hum'],
            currentComfortIndex=indecies[0],
            changeRateComfortIndex=change_rate_data['comfort_index'],
            todayCommits=today_commits,
            totalCommits=total_commits,
            currentTemperatureIndex=indecies[1],
            currentHumidityIndex=indecies[2],
            currentPressureIndex=indecies[3],
        )
        return current_data
    
    def resolve_weekly_analyticts(self, info):
        now = datetime.datetime.now()
        start_of_week = now - datetime.timedelta(days=now.weekday())  # 今週の月曜日の日付を取得

        weekly_commits = []
        weekly_columns = []

        for i in range(7):  # 月曜日から日曜日までの7日間をループ
            day = start_of_week + datetime.timedelta(days=i)
            commits_count = BME280Data.query.filter(
                BME280Data.timestamp >= day.date(),
                BME280Data.timestamp < (day + datetime.timedelta(days=1)).date()
            ).count()
            weekly_commits.append(commits_count)
            weekly_columns.append(calendar.day_name[i])

        return WeeklyAnalyticts(
            weeklyCommits=weekly_commits,
            weeklyColumns=weekly_columns
        )

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
  currentData{
    currentTimestamp
    currentTemperature
    changeRateTemperature
    currentPressure
    changeRatePressure
    currentHumidity
    changeRateHumidity
    currentComfortIndex
    changeRateComfortIndex
    currentTemperatureIndex
    currentHumidityIndex
    currentPressureIndex
  }
  sensorDataByDateRange(dateRange: { startDate: "2024-05-11T00:00:00", endDate: "2024-05-11T23:59:59" }){
    temperature
    pressure
    humidity
    timestamp
    comfortIndex
  }
}
""" 