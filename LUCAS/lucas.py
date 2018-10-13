from flask import Flask
from flask import request
from sklearn.externals import joblib

app = Flask(__name__)
nbayes = joblib.load("lucas_model.pkl")
cv = joblib.load("countVectorizer.pkl")

def classify_review(review):
  return 'Truthful' if nbayes.predict(cv.transform([review])) == 1 else 'Deceptive'
        
@app.route('/')
def return_status():
  return 'Review Classifier Dockerized'

@app.route('/classify', methods=['POST'])
def classify():
  return classify_review(request.data)

if __name__ == '__main__':
  app.run(debug=True,host='0.0.0.0', port=80)