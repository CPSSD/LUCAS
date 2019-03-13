from protos import review_set_pb2, review_pb2
from sklearn.utils import shuffle

def get_balanced_dataset(yelpDataPath="../../data/yelpZip"):
  review_set = review_set_pb2.ReviewSet()
  with open(yelpDataPath, 'rb') as f:
    review_set.ParseFromString(f.read())

  fake_reviews = list(filter(lambda x: x.label, review_set.reviews))
  count_fake = len(fake_reviews)
  genuine_reviews = []
  unused_genuine_reviews = []
  counter_genuine = 0
  for review in review_set.reviews:
    if review.label == True:
      continue
    if counter_genuine <= count_fake:
      genuine_reviews.append(review)
      counter_genuine += 1
    else:
      unused_genuine_reviews.append(review)
  
  return shuffle(fake_reviews + genuine_reviews, random_state=1337)
