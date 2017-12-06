#import requests
import urllib2

targetURL = "http://192.168.0.7:7579/Team428/ae-test1/cnt-ultrasonic/latest"
headers = {"Accept" : "application/json", "X-M2M-RI":"12345", "X-M2M-Origin":"Team428"}
req = urllib2.Request(targetURL, None, headers)
#req.add_header()
#r = requests.get("192.168.0.7:7579/Team428/ae-test1/cnt-ultrasnoic")


resp = urllib2.urlopen(req)

#print r
print resp.read()