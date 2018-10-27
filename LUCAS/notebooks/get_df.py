import os
import pandas as pd

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