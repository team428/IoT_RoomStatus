# -- coding: utf-8 --
#!flask/bin/python
import sys
import os
from flask import Flask, send_from_directory, render_template, request, redirect, Response, url_for
from werkzeug import secure_filename, SharedDataMiddleware

UPLOAD_FOLDER='./analyzed/pcap'
ALLOWED_EXTENSIONS = set(['pcap', 'pcapng'])

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
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


if __name__ == '__main__':
	# run!
	app.debug=True
	app.run(host="0.0.0.0")