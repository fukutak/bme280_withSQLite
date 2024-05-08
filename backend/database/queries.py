from graphene_sqlalchemy import SQLAlchemyConnectionField
from graphene import relay
import graphene
from database.schema import BME280, BME280Data
import database.queries


class DateRangeInput(graphene.InputObjectType):
    start_date = graphene.DateTime()
    end_date = graphene.DateTime()

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    sensor_list = SQLAlchemyConnectionField(BME280)
    
    sensor_data_by_date_range = graphene.List(BME280, date_range=DateRangeInput())

    def resolve_sensor_data_by_date_range(self, info, date_range):
        start_date = date_range.get('start_date')
        end_date = date_range.get('end_date')

        # 期間内のデータをフィルタリングして返す
        return BME280Data.query.filter(
            BME280Data.timestamp >= start_date,
            BME280Data.timestamp <= end_date
        ).all()

schema = graphene.Schema(query=Query)


"""
{
  sensorDataByDateRange(dateRange: { startDate: "2024-05-01T00:00:00", endDate: "2024-05-08T23:59:59" }) {
    temperature
    pressure
    humidity
    timestamp
  }
}

"""