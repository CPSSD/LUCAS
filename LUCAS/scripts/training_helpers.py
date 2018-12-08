
import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.externals import joblib
from collections import OrderedDict
import re
from os.path import dirname, join, abspath
from sklearn.model_selection import cross_val_score

def plot_coefficients(model, top_features=20):
 classifier = model.named_steps['classifier']
 feature_names = model.named_steps['cv'].get_feature_names()

 coef = classifier.coef_.ravel()
 top_positive_coefficients = np.argsort(coef)[-top_features:]
 top_negative_coefficients = np.argsort(coef)[:top_features]
 top_coefficients = np.hstack([top_negative_coefficients, top_positive_coefficients])

 # create plot
 plt.figure(figsize=(15, 5))
 colors = ['red' if c < 0 else 'blue' for c in coef[top_coefficients]]
 plt.bar(np.arange(2 * top_features), coef[top_coefficients], color=colors)
 feature_names = np.array(feature_names)
 plt.xticks(np.arange(1, 1 + 2 * top_features), feature_names[top_coefficients], rotation=60, ha='right')
 plt.show()

def fit_model(model, X, y):
  model.fit(X, y)

def get_importance(feature_weights, k, cls):
  if cls:
    top_positive_coefficients = [(k,v) for k,v in sorted(feature_weights.items(), key=lambda x: x[1], reverse = True) if v > 0][:k]
  else:
    top_positive_coefficients = [(k,v) for k,v in sorted(feature_weights.items(), key=lambda x: x[1]) if v < 0][:k]
  return top_positive_coefficients

def pickle_model(model, name):
  joblib.dump(model, '../models/{}'.format(name))

def get_accuracy(model, X, y, cv):
  # Cross validates a Pipeline classifier, with transformers and a classifier implementing the fit method.
  cv_df = pd.DataFrame(index=range(cv))
  entries = []
  accuracies = cross_val_score(model, X, y, scoring='accuracy', cv=cv)
  for fold_idx, accuracy in enumerate(accuracies):
    entries.append((fold_idx, accuracy))
  cv_df = pd.DataFrame(entries, columns=['fold_idx', 'accuracy'])
  return(cv_df.accuracy.mean())

def get_strat_kfolds(X, y, k):
  from sklearn.model_selection import StratifiedKFold
  skf = StratifiedKFold(n_splits=5, random_state=None)
  # X is the feature set and y is the target
  for train_index, test_index in skf.split(X,y): 
    print("Train:", train_index, "Validation:", test_index) 
    X_train, X_test = X[train_index], X[test_index] 
    y_train, y_test = y[train_index], y[test_index]
  return X_train, X_test, y_train, y_test

def get_feature_weights(model, review):
  feature_weights = OrderedDict()
  cv = model.named_steps['cv']
  coef = model.named_steps['classifier'].coef_.ravel()
  pattern = re.compile('\W')
  for word in review.split():
    _word = re.sub(pattern, ' ', word)
    index = cv.vocabulary_.get(_word.lower())
    feature_weights[word] = coef[index] if index is not None else 0
  return feature_weights

def get_classification(model, review):
  return model.predict([review])

def get_confidence(model, review):
  return (model.decision_function([review])[0])

def classify_new(model):
  review = input()
  while review is not 'q':
    print(get_classification(model, review), get_feature_weights(model, review))
    review = input()

def get_data_frame():
  neg_deceptive_folder_path = r"../data/hotels/negative_polarity/deceptive_from_MTurk/"
  neg_true_folder_path = r'../data/hotels/negative_polarity/truthful_from_Web/'
  pos_deceptive_folder_path = r'../data/hotels/positive_polarity/deceptive_from_MTurk/'
  pos_true_folder_path = r'../data/hotels/positive_polarity/truthful_from_TripAdvisor/'

  sentiment_class = []
  reviews = []
  deceptive_class =[]

  for i in range(1,6):
    positive_true = pos_true_folder_path + 'fold' + str(i) 
    positive_deceptive = pos_deceptive_folder_path + 'fold' + str(i)
    negative_true = neg_true_folder_path + 'fold' + str(i) 
    negative_deceptive = neg_deceptive_folder_path + 'fold' + str(i) 
    for data_file in sorted(os.listdir(negative_deceptive)):
      sentiment_class.append('negative')
      deceptive_class.append(str(data_file.split('_')[0]))
      with open(os.path.join(negative_deceptive, data_file)) as f:
        contents = f.read()
        reviews.append(contents)
    for data_file in sorted(os.listdir(negative_true)):
      sentiment_class.append('negative')
      deceptive_class.append(str(data_file.split('_')[0]))
      with open(os.path.join(negative_true, data_file)) as f:
        contents = f.read()
        reviews.append(contents)
    for data_file in sorted(os.listdir(positive_deceptive)):
      sentiment_class.append('positive')
      deceptive_class.append(str(data_file.split('_')[0]))
      with open(os.path.join(positive_deceptive, data_file)) as f:
        contents = f.read()
        reviews.append(contents)
    for data_file in sorted(os.listdir(positive_true)):
      sentiment_class.append('positive')
      deceptive_class.append(str(data_file.split('_')[0]))
      with open(os.path.join(positive_true, data_file)) as f:
        contents = f.read()
        reviews.append(contents)

  df = pd.DataFrame({'sentiment':sentiment_class,'review':reviews,'deceptive':deceptive_class})

  df.loc[df['deceptive']=='d','deceptive']=1
  df.loc[df['deceptive']=='t','deceptive']=0

  df.loc[df['sentiment']=='positive','sentiment']=1
  df.loc[df['sentiment']=='negative','sentiment']=0

  return df
