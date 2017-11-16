import RPi.GPIO as GPIO
import time
import math
import sys
import pygame
from pygame.locals import *

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

""" GUI Functions """
pygame.init()
width,height = 700, 700
point_list = []
green = (0, 255, 0)
disp = pygame.display.set_mode((width, height))


## convert functions

def to_window(x, y):
    x, y = int(x), int(y)
    n_x = x+ width//2
    n_y = height // 2-y
    return ([n_x, n_y])

def to_radian(angle):
    x = (angle*3.14)/180
    return(x)

## draw function
def add_to_list(angle, distance):
    global point_list
    distance*=10
    angle = to_radian(angle)
    x,y = math.cos(angle)*distance, math.sin(angle)*distance
    pos = to_window(x,y)
    point_list.append(pos)

def draw_point(list_point, disp=disp):
    for point in list_point:
        pygame.draw.circle(disp, green, point, 2)

def draw_circles(disp=disp):
    radius = 50
    for x in range(1, width//2):
        n_radius = ((x//radius)+1)*radius
        pygame.draw.circle(disp, green, (width//2, height//2), n_radius, 2)

def draw_lines(angle, disp=disp):
    a = math.tan(to_radian(angle))
    y = height//2
    if a==0:
        y = 0
        if angle == 0:x = width/2
        elif angle == 180: x=-width/2
    else: x=y//a
    pos = to_window(x, y)
    pygame.draw.line(disp, green,(width/2, height/2), pos, 2)

def draw_text(disp, text, t_size):
    fontObj = pygame.font.Font('FreeSanBold.ttf', t_size)
    textSurface = fontObj.render(text, True, (255,255,255))
    disp.blit(textSurface, (0,0))

try:
    while True:
        disp.fill((0,0,0))
        ## servo part
        GPIO.output(trigger, False)
        servo.ChangeDutyCycle(currentDegree)  
        time.sleep(0.5)
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

        ## GUI work
        angle, dist = float(currentDegree), float(distance)
        if(currentDegree <= 0 or currentDegree >=0):point_list = []
        draw_circles(disp)
        draw_lines(angle)
        add_to_list(angle, dist)
        draw_point(point_list)
        #draw_text(disp, "angle = " + str(angle) + ", distance = "+str(dist), 15)
        for event in pygame.event.get():
            if(event.type == QUIT):
                servo.stop()
                GPIO.cleanup()
                pygame.quit()
                sys.exit()
        pygame.display.update()
        
        currentDegree = currentDegree + wheelspeed
        printDegree = round((currentDegree- MINDEGREE)/(MAXDEGREE - MINDEGREE)*90, 2)

        if((currentDegree > MAXDEGREE) or (currentDegree < MINDEGREE)):
            wheelspeed = -wheelspeed
except KeyboardInterrupt:   
    servo.stop()
    GPIO.cleanup()
