# Real-time BME280 Sensor Data Visualization System
This system provides real-time visualization of temperature, humidity, and pressure using a BME280 sensor. It includes a set of source codes that connect to a Raspberry Pi, record the data to SQLite every 15 minutes, and display it.

![image](https://github.com/fukutak/bme280_withSQLite/assets/70702704/af64e8ed-4671-4225-83c0-47ab3751d846)

## Features:
- Real-time data visualization
- Temperature, humidity, and pressure readings
- 15-minute data logging to SQLite
- Raspberry Pi integration


## Getting Started:
### Clone the repository:
```
git clone https://github.com/fukutak/bme280_withSQLite.git
```

### Install libraries backend and frontend
Backend install dependencies and start api.py:
```
cd ~/bme280_withSQLite/backend/
python -m venv .venv
.venv/bin/activate
pip install -r requirements.txt
```

Frontend install dependencies and start npm start:
```
cd ~/bme280_withSQLite/frontend/horizon-ui-chakra/
npm install
```


### Run scripts:
### Data Logging:
Check getting data from BME280 sensor. It is success to dispay each parameter.
If this don't work, you can search bme280. There is a lot of docs.
```
cd ~/bme280_withSQLite/backend/
python util/use_bme280.py 
temp : 28.05  °C
pressure : 1009.14 hPa
hum :  46.78 ％
```
Sensor data is logged to an SQLite database named data.db every 15 minutes. The database file is located in the project directory, `~/bme280_withSQLite/backend/bme280_data.db`.
`bme280_data.db` file has some data already. If you restore data in db file and don't needed, Delete it.
RaspberryPi's cron settings:
```
crontab -e
# add below
*/15 * * * * cd /home/pi/Raspberry_PI_codes/bme280_withSQLite/backend; ./.venv/bin/python a_record_SQLite.py >> /tmp/cron.log 2>&1
```

Backend:
```
cd backend/
.venv/bin/activate
python api.py
```
Backennd has a graphql endpoint. To access http://localhost:5000/graphql, A below page is displayed and queries can be used.
![image](https://github.com/fukutak/bme280_withSQLite/assets/70702704/88e64f2b-d96d-472d-abb0-1d0b17c9cb84)

Queries:
```
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
```


### Frontend, Data Visualization:
```
cd frontend/
npm start
```
A web application is included to visualize the sensor data in real-time. To access the web application, open a web browser and navigate to:
http://localhost:3000


### Customization:
The script and web application can be customized to meet your specific needs. For example, you can change the data logging frequency, add additional data visualizations, or integrate with other systems.

### Contributing:
We welcome contributions to this project. Feel free to submit pull requests or open issues to report bugs or suggest improvements.
