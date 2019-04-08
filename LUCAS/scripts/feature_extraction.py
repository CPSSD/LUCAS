import functools
import statistics
import nltk
from sklearn.preprocessing import StandardScaler
from sklearn.utils import shuffle
from protos import review_set_pb2

def max_date_occurrences(reviews):
  date_count_map = {}
  for review in reviews:
    date = review.date
    if date in date_count_map:
      date_count_map[date] += 1
    else: 
      date_count_map[date] = 1
  return functools.reduce(lambda x, y: x if x > y else y, date_count_map.values())

def reviews_by_reviewer(reviews):
  reviewer_map = {}
  for review in reviews:
    reviewer = review.user_id
    if reviewer not in reviewer_map:
      reviewer_map[reviewer] = []
    reviewer_map[reviewer].append(review)
  return reviewer_map

def reviewer_features(reviewer_id, reviews_by_reviewer):
  reviews = reviews_by_reviewer[reviewer_id]
  max_reviews_in_day = max_date_occurrences(reviews)
  average_review_length = functools.reduce(
      lambda total, review: total + len(review.review_content),
      reviews,
      0) / len(reviews)
  if len(reviews) == 1:
    ratings_stdev = 0
  else:
    ratings_stdev = statistics.stdev([x.rating for x in reviews])
  percent_pos_reviews =\
      len(list(filter(lambda x: x.rating > 3.0, reviews))) / len(reviews)
  percent_neg_reviews =\
      len(list(filter(lambda x: x.rating < 3.0, reviews))) / len(reviews)
  return (max_reviews_in_day, average_review_length, ratings_stdev,
          percent_pos_reviews, percent_neg_reviews)

def unscaled_reviewer_features(reviewset, entire_reviewset):
  reviewer_reviews = reviews_by_reviewer(entire_reviewset)
  return [list(reviewer_features(x.user_id, reviewer_reviews)) for x in reviewset]

def scaled_reviewer_features(reviewset, entire_reviewset):
  reviewer_predictors = unscaled_reviewer_features(reviewset, entire_reviewset)
  return StandardScaler().fit_transform(reviewer_predictors)

def get_entire_dataset(yelpDataPath="../../data/yelpZip"):
  review_set = review_set_pb2.ReviewSet()
  with open(yelpDataPath, 'rb') as f:
    review_set.ParseFromString(f.read())
  return [x for x in review_set.reviews]

def get_balanced_dataset(yelpDataPath="../../data/yelpZip", max_seq_len=320):
  review_set = review_set_pb2.ReviewSet()
  with open(yelpDataPath, 'rb') as f:
    review_set.ParseFromString(f.read())

  is_fake = lambda x: x.label
  fake_reviews = list(filter(is_fake, review_set.reviews))
  is_word = lambda w: w.isalpha()
  review_words = lambda r: list(filter(is_word, nltk.word_tokenize(r.review_content)))
  short_review = lambda r: len(review_words(r)) <= max_seq_len
  fake_short = list(filter(short_review, fake_reviews))

  count_fake = len(fake_short)

  genuine_reviews = []
  counter_genuine = 0
  for review in review_set.reviews:
    if review.label == True:
      continue
    if counter_genuine >= count_fake:
      break
    if len(review_words(review)) <= max_seq_len:
      genuine_reviews.append(review)
      counter_genuine += 1
  return shuffle(genuine_reviews + fake_short, random_state=1337)
