import os
import numpy as np
import pandas as pd
from sklearn import metrics
from sklearn.externals import joblib
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import ComplementNB
from sklearn.model_selection import train_test_split

from get_df import get_data_frame

data_fm = get_data_frame()

data_fm.loc[data_fm['deceptive']=='d','deceptive']=1
data_fm.loc[data_fm['deceptive']=='t','deceptive']=0

data_x = data_fm['review']

data_y = np.asarray(data_fm['deceptive'],dtype=int)

X_train, X_test, y_train, y_test = train_test_split(data_x, data_y, test_size=0.3)

cv = CountVectorizer() # Works better than tf-idf

X_traincv = cv.fit_transform(X_train)
X_testcv = cv.transform(X_test)

nbayes = ComplementNB()

nbayes.fit(X_traincv, y_train)


joblib.dump(nbayes, "../models/nb_chihotels.pkl")
joblib.dump(cv, '../models/nb_chihotels_cv.pkl')

y_predictions_nbayes = list(nbayes.predict(X_testcv))

yp=["Genuine" if a==0 else "Deceptive" for a in y_predictions_nbayes]
output_fm = pd.DataFrame({'Review':list(X_test) ,'Genuine(0)/Deceptive(1)':yp})
print(output_fm)
print(metrics.classification_report(y_test, y_predictions_nbayes, target_names=set(yp)))
