import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)


trigger = 24
echo    = 23

GPIO.setup(trigger, GPIO.OUT)
GPIO.setup(echo,    GPIO.IN)

try:
    while True:
        GPIO.output(trigger, False)
        time.sleep(0.5)

        GPIO.output(trigger, True)
        time.sleep(0.00001)
        GPIO.output(trigger, False)

        while GPIO.input(echo) == 0 :
           pulse_start = time.time()

        while GPIO.input(echo) == 1 :
           pulse_end = time.time()

        pulse_duration = pulse_end - pulse_start
        distance = pulse_duration * 17000
        distance = round(distance, 2)

        print "Distance : ", distance, "cm"
except:
    print 1
    GPIO.cleanup()
