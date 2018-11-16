from flask import Flask
from flask import request
from flask import jsonify
from flask import json
from sklearn.externals import joblib

app = Flask(__name__)

nbayes = joblib.load("../models/nbayes.pkl")
cv = joblib.load("../models/nbayes_cv.pkl")

def classify_review(data):
  reviewcv = cv.transform([data])
  predicted_class = 'Truthful' if nbayes.predict(reviewcv) == 1 else 'Deceptive'
  class_probs = nbayes.predict_proba(reviewcv)
  return {"result": predicted_class, "classProbs": class_probs.tolist()}
        
@app.route('/')
def return_status():
  return 'Review Classifier Dockerized'

@app.route('/classify', methods=['POST'])
def classify():
  review = classify_review(request.get_json()["review"])
  return jsonify(result= review["result"], classProbs= review["classProbs"])

@app.route('/bulkClassify', methods=['POST'])
def bulkClassify():
  weights = []
  for review in request.get_json()["reviews"]:
    weights.append(classify_review(review["text"]))
  return jsonify(weights= weights)

if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0', port=3005)

