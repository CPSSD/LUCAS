import os
import numpy as np
import pandas as pd
from sklearn import metrics
from sklearn import preprocessing
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import f1_score
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.feature_selection import chi2
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

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

data_fm = pd.DataFrame({'sentiment':sentiment_class,'review':reviews,'deceptive':deceptive_class})

print(data_fm.head())


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

logreg = LogisticRegression(random_state=0) # Starting seed
logreg.fit(X_train_tfidf, y_train) 

joblib.dump(logreg, "../models/logreg_chihotels.pkl")
joblib.dump(cv, '../models/logreg_chihotels_cv.pkl')
joblib.dump(tfidf, '../models/logreg_chihotels_tfidf.pkl')

y_predictions_logreg = logreg.predict(X_test_tfidf)

yp=["Genuine" if a==0 else "Deceptive" for a in list(y_predictions_logreg)]
output_fm = pd.DataFrame({'Review':list(X_test) ,'True(0)/Deceptive(1)':yp})

print(output_fm)
print(metrics.classification_report(y_test, y_predictions_logreg, target_names=set(yp)))