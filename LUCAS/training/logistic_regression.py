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
from sklearn.feature_extraction.text import TfidfVectorizer
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

print(data_fm.head())

tfidf = TfidfVectorizer(sublinear_tf=True, min_df=5, norm='l2', encoding='latin-1', ngram_range=(1, 2), stop_words='english')
features = tfidf.fit_transform(data_fm['review']).toarray()
labels = np.asarray(data_fm['deceptive'],dtype=int)
print(features.shape)

N = 10
for i in range(0, 2):
  features_chi2 = chi2(features, labels)
  indices = np.argsort(features_chi2[i])
  feature_names = np.array(tfidf.get_feature_names())[indices]
  unigrams = [v for v in feature_names if len(v.split(' ')) == 1]
  bigrams = [v for v in feature_names if len(v.split(' ')) == 2]
  print("# '{}':".format('Genuine' if i == 0 else 'Deceptive'))
  print("  . Most correlated unigrams:\n. {}".format('\n. '.join(unigrams[-N:])))
  print("  . Most correlated bigrams:\n. {}".format('\n. '.join(bigrams[-N:])))

quit()

data_x = data_fm['review']

data_y = np.asarray(data_fm['deceptive_class'],dtype=int)

X_train, X_test, y_train, y_test = train_test_split(data_x, data_y, test_size=0.3)

cv = CountVectorizer() # Works better than tf-idf

X_traincv = cv.fit_transform(X_train)
X_testcv = cv.transform(X_test)

nbayes = ComplementNB()

nbayes.fit(X_traincv, y_train)

joblib.dump(nbayes, "lucas_model.pkl")
joblib.dump(cv, 'countVectorizer.pkl')

y_predictions_nbayes = list(nbayes.predict(X_testcv))

yp=["True" if a==0 else "Deceptive" for a in y_predictions_nbayes]
output_fm = pd.DataFrame({'Review':list(X_test) ,'True(1)/Deceptive(0)':yp})

print(output_fm)

print(nbayes.feature_log_prob_)
print(nbayes.class_count_)
print(nbayes.feature_all_)

print("Accuracy % :",metrics.accuracy_score(y_test, y_predictions_nbayes)*100)
print("Precision Score: ", precision_score(y_test, y_predictions_nbayes, average='micro'))
print("Recall Score: ",recall_score(y_test, y_predictions_nbayes, average='micro') )
print("F1 Score: ",f1_score(y_test, y_predictions_nbayes, average='micro') )