#import requests
import urllib2
import datetime
import math
import json
from flask import jsonify
d = datetime.datetime.now()
print d.minute - 30

dataset = []

xpos = 99
ypos = 910

dataset.append({xpos:ypos})

dataset.append({xpos:ypos})

dataset.append({xpos:ypos})

dataset.append({xpos:ypos})

print json.dumps(dataset)
del dataset[:]
print dataset
print math.cos( 29.3)

print math.sin(29.3/180)
targetURL = "http://192.168.0.7:7579/Team428/ae-test1/cnt-ultrasonic/latest"
headers = {"Accept" : "application/json", "X-M2M-RI":"12345", "X-M2M-Origin":"Team428"}
req = urllib2.Request(targetURL, None, headers)
#req.add_header()
#r = requests.get("192.168.0.7:7579/Team428/ae-test1/cnt-ultrasnoic")


#resp = urllib2.urlopen(req)

#print r
#print resp.read()