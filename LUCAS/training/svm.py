import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn import metrics
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split

from get_df import get_data_frame

def plot_coefficients(classifier, feature_names, top_features=20):
 coef = classifier.coef_.ravel()
 top_positive_coefficients = np.argsort(coef)[-top_features:]
 top_negative_coefficients = np.argsort(coef)[:top_features]
 top_coefficients = np.hstack([top_negative_coefficients, top_positive_coefficients])
 # create plot
 plt.figure(figsize=(15, 5))
 colors = ['red' if c < 0 else 'blue' for c in coef[top_coefficients]]
 plt.bar(np.arange(2 * top_features), coef[top_coefficients], color=colors)
 feature_names = np.array(feature_names)
 print(top_coefficients)
 print(coef[top_coefficients])
 print(feature_names[top_coefficients])
 plt.xticks(np.arange(1, 1 + 2 * top_features), feature_names[top_coefficients], rotation=60, ha='right')
 plt.show()

data_fm = get_data_frame()

data_fm.loc[data_fm['deceptive']=='d','deceptive']=1
data_fm.loc[data_fm['deceptive']=='t','deceptive']=0

data_fm.loc[data_fm['sentiment']=='positive','sentiment']=1
data_fm.loc[data_fm['sentiment']=='negative','sentiment']=0

data_x = data_fm['review']

data_y = np.asarray(data_fm['deceptive'],dtype=int)

X_train, X_test, y_train, y_test = train_test_split(data_x, data_y, test_size=0.3, random_state=0)

cv = CountVectorizer()
tfidf = TfidfTransformer()

X_train_count = cv.fit_transform(X_train) # Transforming the Training reviews to count vectors and fitting for TF-idf
X_test_count = cv.transform(X_test) # Only transforming the test reviews to count vectors

X_train_tfidf = tfidf.fit_transform(X_train_count) # Transforming the fitted training Count Vectors
X_test_tfidf = tfidf.transform(X_test_count) 

feature_names = cv.get_feature_names()
print(tfidf._get_param_names())

model = LinearSVC(random_state=0) # Starting seed
model.fit(X_train_tfidf, y_train) 

# joblib.dump(logreg, "../models/logreg_chihotels.pkl")
# joblib.dump(cv, '../models/logreg_chihotels_cv.pkl')
# joblib.dump(tfidf, '../models/logreg_chihotels_tfidf.pkl')

y_predictions = model.predict(X_test_tfidf)

yp=["Genuine" if prediction == 0 else "Deceptive" for prediction in list(y_predictions)]
output_fm = pd.DataFrame({'Review':list(X_test_tfidf) ,'True(0)/Deceptive(1)':yp})
print(output_fm)
print(metrics.classification_report(y_test, y_predictions, target_names=set(yp)))
plot_coefficients(model, cv.get_feature_names())

i = input()
while i != 'q':
  i_cv = cv.transform([i])
  i_tfidf = tfidf.transform(i_cv)
  cv_indices = [cv.vocabulary_.get(word) for word in i.split()]

  print(cv_indices)
  print("Genuine" if model.predict(i_tfidf) == 0 else "Deceptive", model._predict_proba_lr)
  coef = model.coef_.ravel()
  print(coef[cv_indices])

  i = input()