from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Column, DateTime, ForeignKey, Integer, String, func, Float
)
from sqlalchemy.orm import scoped_session, sessionmaker

engine = create_engine('sqlite:///bme280_data.db', convert_unicode=True)

Base = declarative_base()
Base.metadata.bind = engine

db_session = scoped_session(sessionmaker(bind=engine, expire_on_commit=False))
Base.query = db_session.query_property()

class BME280Data(Base):
    __tablename__ = "sensor_data"

    id = Column(Integer, primary_key=True)
    temperature = Column(Float)
    pressure = Column(Float)
    humidity = Column(Float)
    timestamp = Column(DateTime)
    # room_id = Column(Integer, ForeignKey("room.room_id"))
    room_id = Column(String)

class Room(Base):
    __tablename__ = "room"

    room_id = Column(Integer, primary_key=True)
    room_name = Column(String)
    room_user = Column(String)
    comment = Column(String)

Base.metadata.create_all(engine)