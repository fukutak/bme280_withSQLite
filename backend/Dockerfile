FROM python:3.7.3

WORKDIR /code

COPY /home/pi/Raspberry_PI_codes/bme280_withSQLite/requirements.txt /code/
RUN pip install --upgrade pip && \
    pip install -r requirements.txt
    
COPY /home/pi/Raspberry_PI_codes/bme280_withSQLite/backend/ /code/

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]