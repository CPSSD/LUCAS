from flask import Flask
from flask import request
from flask import jsonify
from flask import json
from sklearn.externals import joblib

app = Flask(__name__)
nbayes = joblib.load("../training/lucas_model.pkl")
cv = joblib.load("../training/countVectorizer.pkl")

def classify_review(data):
  review = data["review"]
  reviewcv = cv.transform([review])
  predicted_class = 'Truthful' if nbayes.predict(reviewcv) == 1 else 'Deceptive'
  class_probs = nbayes.predict_proba(reviewcv)

  return jsonify(result= predicted_class, class_probs= class_probs.tolist())
        
@app.route('/')
def return_status():
  return 'Review Classifier Dockerized'

@app.route('/classify', methods=['POST'])
def classify():
  return classify_review(request.get_json())

if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0', port=80)
probability