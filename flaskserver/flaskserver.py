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

@app.route('/uploader', methods = ['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		if('file' not in request.files or 
			request.form['casename'] == ''):
			return redirect(url_for('index'))

		print request.form
		pcapfile = request.files['file']
		reqCasename = request.form['casename']

		if('do-isp' in request.form):
			doIsp = request.form['do-isp']
		#print doIsp
		filename = secure_filename(pcapfile.filename)
		pcapfile.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

		return redirect(url_for('show_result_page', casename=reqCasename))

@app.route('/result_page')
@app.route('/result_page/<casename>')
def show_result_page(casename=None):
	print casename
	return render_template('result.html', casename=casename)


@app.route('/receiver', methods = ['POST'])
def worker():
	# read json + reply
	data = request.get_json()
	result = ''

	for item in data:
		# loop over every row
		result += str(item['make']) + '\n'

	return result





@app.route('/hello')
def hellopy():

	return "hello"



if __name__ == '__main__':
	# run!
	app.debug=True
	app.run(host="0.0.0.0")