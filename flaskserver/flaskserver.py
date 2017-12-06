# -- coding: utf-8 --
#!flask/bin/python
import sys
import os
import urllib2
import json
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

"""
app.add_url_rule('/uploads/<filename>', 'uploaded_file',
                 build_only=True)
app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
    '/uploads':  app.config['UPLOAD_FOLDER']
})
"""
@app.route('/', methods=['GET', 'POST'])
@app.route('/index', methods=['GET', 'POST'])
def index():
	# serve index template

	return render_template('index.html', name='Joe')

@app.route('/receiver', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	result = ''

	for item in data:
		# loop over every row
		result += str(item['make']) + '\n'

	return result


@app.route('/get_from_server', methods = ['POST', 'GET'])
def get_data_from_server():
	dataset = []

	req = urllib2.Request(app.config['TARGET_URL'][0], None, app.config['HEADERS'])
	resp = urllib2.urlopen(req)
	#for each_resp in resp:
	#	print "\n"
	#	print (type(each_resp))
	#	print each_resp
	#	print "\n"
	#for each_url in app.config['TARGET_URL']:
	#	req = urllib2.Request(each_url, None, app.config['HEADERS'])
	#	dataset.append(jsonfy(req.json()))
	#print req.get_json()
	#print resp.read()
	data = json.load(resp)
	for eachdata in data:
		print eachdata
		print data[eachdata]["con"]
	dataset.append(data)
	dataset.append(data)
	data = jsonify(data["m2m:cin"]["con"])
	print data
	return data



if __name__ == '__main__':
	# run!
	app.debug=True
	app.run(host="0.0.0.0")