from util.session_models import BME280Data, Room
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType


class BME280Attribute:
    temperature = graphene.Float(description='Temparature C')
    pressure = graphene.Float(description='Pressure HPa')
    humidity = graphene.Float(description='Humidity %')
    timestamp = graphene.DateTime(description='ID of Role')
    room_id = graphene.String(description='room_id')


class BME280(SQLAlchemyObjectType, BME280Attribute):
    class Meta:
        model = BME280Data
        interfaces = (relay.Node,)

Model = BME280Data

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


class CurrentData(SQLAlchemyObjectType, CurrentDataAttribute):
    class Meta:
        model = BME280Data
        interfaces = (relay.Node,)