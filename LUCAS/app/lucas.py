import sys
from flask import Flask
from flask import request
from flask import jsonify
from flask import json
from sklearn.externals import joblib
from os.path import dirname, join, abspath
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from scripts.model_helpers import get_feature_weights, get_classification, get_confidence

app = Flask(__name__)

model = joblib.load("./models/pipe_svc_1.0.pkl")  
        
@app.route('/')
def return_status():
  return 'LUCAS API v0.2.0'

@app.route('/classify', methods=['POST'])
def classify():
  review = request.get_json()["review"]
  predicted_class = get_classification(model, review)
  class_confidence = get_confidence(model, review)
  feature_weights = get_feature_weights(model, review)
  return jsonify(result= predicted_class, confidence= class_confidence, feature_weights=feature_weights)

def start():
  app.run(debug=True,host='0.0.0.0', port=3005)

if __name__ == '__main__':
  start()
