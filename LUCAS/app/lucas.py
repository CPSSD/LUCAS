from flask import Flask
from flask import request
from sklearn.externals import joblib

app = Flask(__name__)
nbayes = joblib.load("../experiments/naive_bayes/chi-hotels-only-classify.pkl")
cv = joblib.load("../experiments/naive_bayes/chi-hotels-only-countvec.pkl")

def classify_review(review):
  reviewcv = cv.transform([review])
  predicted_class = 'Truthful' if nbayes.predict(reviewcv) == 1 else 'Deceptive'
  class_probs = nbayes.predict_proba(reviewcv)
  return '{}, {}'.format(predicted_class, class_probs)
        
@app.route('/')
def return_status():
  return 'Review Classifier Dockerized'

@app.route('/classify', methods=['POST'])
def classify():
  return classify_review(request.data)

if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0', port=80)