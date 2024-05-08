from database.session_models import BME280Data, Room
import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyConnectionField, SQLAlchemyObjectType


class BME280Attribute:
    temperature = graphene.Float(description='Temparature C')
    pressure = graphene.Float(description='Pressure HPa')
    humidity = graphene.Float(description='Humidity %')
    timestamp = graphene.DateTime(description='ID of Role')
    room_id = graphene.Int(description='room_id')


class BME280(SQLAlchemyObjectType, BME280Attribute):
    class Meta:
        model = BME280Data
        interfaces = (relay.Node,)


Model = BME280Data