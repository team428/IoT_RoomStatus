# -- coding: utf-8 --
#!flask/bin/python
import sys
import os
import urllib2
import json
import datetime
import math
from flask import Flask, send_from_directory, render_template, request, redirect, Response, url_for
from flask import jsonify
from werkzeug import secure_filename, SharedDataMiddleware



"""
Settings for getting data from mobius server
"""
MOBIUS_URL = "http://192.168.0.7"
MOBIUS_PORT = "7579"
AE_NAME = "ae-test1"
APP_NAME = "Team428"
CNT_NAME = ["cnt-ultrasonic0", "cnt-ultrasonic1", "cnt-ultrasonic2", "cnt-ultrasonic3"]
DATA_TYPE = "json"
TARGET_URL = []
HEADERS = {}
HEADERS['Accept'] = "application/" + DATA_TYPE
HEADERS['X-M2M-RI'] = "12345"
HEADERS['X-M2M-Origin'] = "Team428"
MAXDISTANCE = 25


datasetMap = []
datasetGraph =[]


for each_container in CNT_NAME:
	url = MOBIUS_URL +":" + MOBIUS_PORT + "/" + APP_NAME + "/" + AE_NAME + "/" + each_container + "/latest"
	TARGET_URL.append(url)

app = Flask(__name__)
app.config['MOBIUS_URL'] = MOBIUS_URL
app.config['AE_NAME'] = AE_NAME
app.config['CNT_NAME'] = CNT_NAME
app.config['DATA_TYPE'] = DATA_TYPE
app.config['TARGET_URL'] = TARGET_URL
app.config['HEADERS'] = HEADERS
app.config['TARGET_URL'] = TARGET_URL



def datasetGraphProc():
	if(len(datasetGraph) >= 10):
		datasetGraph.pop(0)

	today = datetime.datetime.now()
	print today
	value = len(datasetMap)
	if(value > 10):
		value = 100
	else:
		value = 10*value
	curTime = str(today.hour) + ":" + str(today.minute)
	datasetGraph.append([curTime, value])


@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
	# serve index template

	return render_template('index.html', name='Joe')


@app.route('/get_map_data', methods = ['POST', 'GET'])
def get_data_from_server():


	for x in range(0,2):
		#print x, 123
		req = urllib2.Request(app.config['TARGET_URL'][x], None, app.config['HEADERS'])
		resp = urllib2.urlopen(req)
		rawdata = json.load(resp)

		rawdata = rawdata["m2m:cin"]["con"]
		#print rawdata
		rawdata = rawdata.split(" ")
		#print rawdata
		degree = float(rawdata[1])
		distance = float(rawdata[3])

		if(distance == 0 or distance < 0 or distance > MAXDISTANCE):
			break;

		if(x == 0 and
			(degree > 85 or degree <0)):
			del datasetMap[:]
		#print "degree:", degree, "cos:",math.cos(degree)

		if(x ==1):
			xpos = int(distance * math.cos(degree/180))*800/MAXDISTANCE
			ypos = 400 - int(distance * math.sin(degree/180))*400/MAXDISTANCE
		elif(x == 0):
			xpos = 800 - int(distance * math.cos(degree/180))*800/MAXDISTANCE
			ypos = int(distance * math.sin(degree/180))*400/MAXDISTANCE

		if [xpos,ypos] in datasetMap:
			pass
		else:
			datasetMap.append(list([xpos, ypos]))


	print datasetMap;
	return jsonify(datasetMap)

@app.route('/get_graph_data', methods = ['POST', 'GET'])
def get_graph_data():
	print datasetGraph
	datasetGraphProc()
	#print jsonify(datasetGraph)

	return jsonify(datasetGraph)


if __name__ == '__main__':

	while(len(datasetGraph) <10):
		today = datetime.datetime.now()
		value = len(datasetMap)
		curTime = str(today.hour) + ":" + str(today.minute)
		datasetGraph.append([curTime, value])
	# run!
	app.debug=True
	app.run()