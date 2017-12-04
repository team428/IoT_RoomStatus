#!flask/bin/python
import sys

from flask import Flask, render_template, request, redirect, Response
import random, json

app = Flask(__name__)

@app.route('/')
def index():
	# serve index template
	return render_template('test.html', name='Joe')

@app.route('/hello')
def hellopy():

	return "hello"

@app.route('/result_page')
@app.route('/<testcase>')
def show_result_page(testcase=None):

	return resnder_template('result.html', testcase=testcase)

@app.route('/receiver', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	result = ''

	for item in data:
		# loop over every row
		result += str(item['make']) + '\n'

	return result

if __name__ == '__main__':
	# run!
	app.debug=True
	app.run(host="0.0.0.0")