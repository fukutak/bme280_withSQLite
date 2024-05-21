from util.session_models import BME280Data, Room
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType


class BME280Attribute(graphene.ObjectType):
    temperature = graphene.Float(description='Temparature C')
    pressure = graphene.Float(description='Pressure HPa')
    humidity = graphene.Float(description='Humidity %')
    comfortIndex = graphene.Float(description='Comfort Index p')
    timestamp = graphene.DateTime(description='ID of Role')
    room_id = graphene.String(description='room_id')


class BME280(SQLAlchemyObjectType, BME280Attribute):
    class Meta:
        model = BME280Data
        interfaces = (relay.Node,)

Model = BME280

class CurrentDataAttribute(graphene.ObjectType):
    currentTemperature = graphene.Float(description='Temparature C')
    changeRateTemperature = graphene.Float(description='changeRate Temp')
    currentPressure = graphene.Float(description='Pressure HPa')
    changeRatePressure = graphene.Float(description='changeRate Pressure')
    currentHumidity = graphene.Float(description='Humidity %')
    changeRateHumidity = graphene.Float(description='changeRate Humidity')
    currentTimestamp = graphene.DateTime(description='ID of Role')
    currentComfortIndex = graphene.Float(description='Comfort Index')
    changeRateComfortIndex = graphene.Float(description='changeRate ComfortIndex')
    todayCommits = graphene.Int(description='Today Commits')
    totalCommits = graphene.Int(description='Total Commits')
    currentTemperatureIndex = graphene.Float(description='Index Temp')
    currentPressureIndex = graphene.Float(description='Index Pressure')
    currentHumidityIndex = graphene.Float(description='Index Humidity')

class WeeklyAnalytict(graphene.ObjectType):
    weeklyCommits = graphene.List(graphene.Int, description='List of weekly commits')
    weeklyColumns = graphene.List(graphene.String, description='List of weekly commits columns')



class CurrentData(SQLAlchemyObjectType, CurrentDataAttribute):
    class Meta:
        model = BME280Data
        interfaces = (relay.Node,)