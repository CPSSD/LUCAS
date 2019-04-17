import sys
from flask import Flask
from flask import request
from flask import json
import tensorflow as tf
from tensorflow import keras
from keras.preprocessing import text
import numpy as np
from sklearn.externals import joblib  
from os.path import dirname, join, abspath
from sklearn.metrics import roc_auc_score
from keras.preprocessing.sequence import pad_sequences
from keras import backend as K
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from scripts.training_helpers import get_feature_weights, get_classification, get_confidence

def auroc(y_true, y_pred):
  return tf.py_func(roc_auc_score, (y_true, y_pred), tf.double)

def f1(y_true, y_pred):
  def recall(y_true, y_pred):
      """Recall metric.
        Only computes a batch-wise average of recall.
        Computes the recall, a metric for multi-label classification of
      how many relevant items are selected.
      """
      true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
      possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
      recall = true_positives / (possible_positives + K.epsilon())
      return recall

  def precision(y_true, y_pred):
    """Precision metric.
      Only computes a batch-wise average of precision.
      Computes the precision, a metric for multi-label classification of
    how many selected items are relevant.
    """
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision
  precision = precision(y_true, y_pred)
  recall = recall(y_true, y_pred)
  return 2*((precision*recall)/(precision+recall+K.epsilon()))

app = Flask(__name__)

naive_bayes_model = joblib.load("../models/nbayes_opspam.pkl")
logreg_model = joblib.load("../models/logreg_opspam.pkl")
svm_model = joblib.load("../models/svc_opspam.pkl")

opspam_tokenizer = joblib.load('../models/opspam_tokenizer.pkl') 
yelp_tokenizer = joblib.load('../models/yelp_ffnn_tokenizer.pkl') 

ffnn_model = keras.models.load_model('../models/ffnn_uf_yelp.model', custom_objects={'auroc': auroc, 'f1':f1})
cnn_model = keras.models.load_model('../models/mlp_opspam_86.h5')
lstm_model = keras.models.load_model('../models/mlp_opspam_86.h5')
bert_model = keras.models.load_model('../models/mlp_opspam_86.h5')

@app.route('/')
def return_status():
  return 'LUCAS API v0.3.0'

def classify_review(review, model):
  fake_user_features = np.array([[0,0,0,0,0]])
  if model in ['nb', 'lr', 'svm']:
    if model == 'nb':
      clf = naive_bayes_model.named_steps['clf']
      cv = naive_bayes_model.named_steps['cv']
    if model == 'lr':
      clf = logreg_model.named_steps['clf']
      cv = logreg_model.named_steps['cv']
    if model == 'svm':
      clf = svm_model.named_steps['clf']
      cv = svm_model.named_steps['cv']
    vect = cv.transform([text])
    classification = clf.predict(vect)
    predicted_class = 'Deceptive' if classification == 1 else 'Genuine'
    class_confidence = max(clf.predict_proba(vect)) if 'svm' not in model else abs(clf.decision_function(vect))
    feature_weights = get_feature_weights(svm_model, text)

  else:
    tokenized_review = np.array(pad_sequences(yelp_tokenizer.texts_to_sequences([text]), maxlen=320))
    print(tokenized_review.shape, fake_user_features.shape)
    if model == 'ffnn':
      classification = get_classification(ffnn_model, [tokenized_review, fake_user_features])[0][0]
      print(classification)
    if model == 'cnn':
      classification = get_classification(cnn_model, tokenized_review)[0][0]
    if model == 'lstm':
      classification = get_classification(lstm_model, tokenized_review)[0][0]
    if model == 'bert':
      classification = get_classification(bert_model, tokenized_review)[0][0]
    class_confidence = abs(classification - 0.5)*2
    predicted_class = 'Genuine' if classification < 0.5 else 'Deceptive'
    feature_weights = get_feature_weights(svm_model, text)

  return{"result": predicted_class, "confidence": str(class_confidence), "feature_weights": feature_weights, "review": text, "user_id": review["user_id"], "stars": review["stars"]}

@app.route('/classify', methods=['POST'])
def classify():
  review = request.get_json()["review"]
  model = request.get_json()["model"]
  return json.dumps(classify_review(review, model), sort_keys=False)
  
@app.route('/bulkClassify', methods=['POST'])
def bulkClassify():
  weights = []
  for review in request.get_json()["reviews"]:
    weights.append(classify_review(review["text"], review["model"]))
  return json.dumps(weights, sort_keys=False)

def start():
  app.run(debug=True,host='0.0.0.0', port=3005)

if __name__ == '__main__':
  start()