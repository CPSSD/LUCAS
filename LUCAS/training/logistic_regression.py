import os
import numpy as np
import pandas as pd
from sklearn import metrics
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

from get_df import get_data_frame

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

logreg = LogisticRegression(random_state=0, solver='lbfgs', multi_class='multinomial') # Starting seed
logreg.fit(X_train_tfidf, y_train) 

joblib.dump(logreg, "../models/logreg_chihotels.pkl")
joblib.dump(cv, '../models/logreg_chihotels_cv.pkl')
joblib.dump(tfidf, '../models/logreg_chihotels_tfidf.pkl')

y_predictions_logreg = logreg.predict(X_test_tfidf)

yp=["Genuine" if prediction == 0 else "Deceptive" for prediction in list(y_predictions_logreg)]
output_fm = pd.DataFrame({'Review':list(X_test) ,'True(0)/Deceptive(1)':yp})
print(output_fm)
print(np.std(X_train_tfidf, 0)*logreg.coef_)
print(metrics.classification_report(y_test, y_predictions_logreg, target_names=set(yp)))