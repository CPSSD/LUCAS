import sys
from flask import Flask
from flask import request
from flask import json
import keras
from keras.preprocessing import text
from sklearn.externals import joblib
from os.path import dirname, join, abspath
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from scripts.training_helpers import get_feature_weights, get_classification, get_confidence

app = Flask(__name__)

stat_model = joblib.load("../models/pipe_svc_1.0.pkl")  
neural_model = keras.models.load_model('../models/mlp_opspam_86.h5')
neural_model._make_predict_function()
tokenizer = joblib.load('../models/opspam_tokenizer.pkl')
        
@app.route('/')
def return_status():
  return 'LUCAS API v0.3.0'

def classify_review(review):
  tokenized_review = tokenizer.texts_to_matrix([review], mode='tfidf')
  classification = get_classification(neural_model, tokenized_review)[0][0]
  class_confidence = abs(classification - 0.5)*2
  predicted_class = 'Genuine' if classification < 0.5 else 'Deceptive'
  feature_weights = get_feature_weights(stat_model, review)
  return{"result": predicted_class, "confidence": str(class_confidence), "feature_weights": feature_weights, "review": review}

@app.route('/classify', methods=['POST'])
def classify():
  review = request.get_json()["review"]
  return json.dumps(classify_review(review), sort_keys=False)
  
@app.route('/bulkClassify', methods=['POST'])
def bulkClassify():
  weights = []
  for review in request.get_json()["reviews"]:
    weights.append(classify_review(review["text"]))
  return json.dumps(weights, sort_keys=False)

def start():
  app.run(debug=True,host='0.0.0.0', port=3005)

if __name__ == '__main__':
  start()
