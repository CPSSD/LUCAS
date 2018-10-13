from flask import Flask
app = Flask(__name__)
@app.route('/')

def hello_world():
    return 'Review Classifier Dockerized'

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=80)