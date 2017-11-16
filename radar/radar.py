import RPi.GPIO as GPIO
import time

""" Fundamental settings """
MAXDEGREE = 7.5                 ##middle = 7.5, -90 = 12.3, 90 = 2.7
MINDEGREE = 2.7
trigger = 24
echo    = 23
servopin   = 18

wheelspeed = -5/(MAXDEGREE-MINDEGREE)/4

""" pin setup part"""
GPIO.setmode(GPIO.BCM)
GPIO.setup(servopin, GPIO.OUT)
GPIO.setup(trigger, GPIO.OUT)
GPIO.setup(echo,    GPIO.IN)
servo = GPIO.PWM(servopin, 50)


currentDegree = MINDEGREE
printDegree = currentDegree/(MAXDEGREE - MINDEGREE)*90

servo.start(currentDegree)    # middle
GPIO.output(trigger, False)
time.sleep(0.5)

try:
    while True:
        ## servo part
        GPIO.output(trigger, False)
        servo.ChangeDutyCycle(currentDegree)  
        time.sleep(0.2)
        print "Degree: ",printDegree, "\'"
        ## ultrasonic part
        GPIO.output(trigger, True)
        time.sleep(0.00001)
        GPIO.output(trigger, False)

        while(GPIO.input(echo) == 0):
            pulse_start = time.time()
        while(GPIO.input(echo) == 1):
            pulse_end = time.time()

        ## Get distance
        pulse_duration = pulse_end - pulse_start
        distance = pulse_duration * 17000
        distance = round(distance, 2)
        print "Distance: ", distance, "cm"
        
        currentDegree = currentDegree + wheelspeed
        printDegree = round((currentDegree- MINDEGREE)/(MAXDEGREE - MINDEGREE)*90, 2)

        if((currentDegree > MAXDEGREE) or (currentDegree < MINDEGREE)):
            wheelspeed = -wheelspeed
except KeyboardInterrupt:   
    servo.stop()
    GPIO.cleanup()
