import RPi.GPIO as GPIO
import time

pin = 18
MAXDEGREE = 7.5                 ##middle = 7.5, -90 = 12.3, 90 = 2.7
MINDEGREE = 2.7
wheelspeed = 1/(MAXDEGREE-MINDEGREE)/4


GPIO.setmode(GPIO.BCM)
GPIO.setup(pin, GPIO.OUT)
p = GPIO.PWM(pin, 50)


currentDegree = MAXDEGREE
printDegree = currentDegree/(MAXDEGREE - MINDEGREE)*90

p.start(currentDegree)    # middle


try:
    while True:
        p.ChangeDutyCycle(currentDegree)  # middle
        time.sleep(0.06)
        print(printDegree)
        currentDegree = currentDegree + wheelspeed
        printDegree = (currentDegree- MINDEGREE)/(MAXDEGREE - MINDEGREE)*90
        #p.ChangeDutyCycle(12.3)    # -90dgree
        #time.sleep(1)
        #p.ChangeDutyCycle(2.7)    # +90dgree
        #time.sleep(1)    
        #p.ChangeDutyCycle(5)        # +45 degree
        #time.sleep(1)
        if((currentDegree > MAXDEGREE) or (currentDegree < MINDEGREE)):
            wheelspeed = -wheelspeed
except KeyboardInterrupt:   
    p.stop()
    GPIO.cleanup()
