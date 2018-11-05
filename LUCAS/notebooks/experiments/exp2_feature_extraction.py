import functools

def find_avg_token_length(tokens):
  if len(tokens) == 0:
    return 0
  average_word_length = 0
  for t in tokens:
    average_word_length += len(t)
  return average_word_length / len(tokens)

def find_numerals_ratio(tokens):
  if len(tokens) == 0:
    return 0
  return len([x for x in tokens if x.isdigit()]) / len(tokens)

def find_capitalised_word_ratio(tokens):
  total = len(tokens)
  if total == 0:
    return 0
  capitalised = 0
  for t in tokens:
    if t[0].isupper():
      capitalised += 1
  return capitalised / total 

def reviews_by_reviewer(reviews):
  reviewer_map = {}
  for review in reviews:
    reviewer = review.user_id
    if reviewer not in reviewer_map:
      reviewer_map[reviewer] = []
    reviewer_map[reviewer].append(review)
  return reviewer_map

def max_date_occurrences(reviews):
  date_count_map = {}
  for review in reviews:
    date = review.date
    if date in date_count_map:
      date_count_map[date] += 1
    else: 
      date_count_map[date] = 1
  return functools.reduce(lambda x, y: x if x > y else y, date_count_map.values())

import nltk
find_words = lambda text: [x for x in nltk.tokenize.word_tokenize(text) if x.isalnum()]

def structural_features(review):
  review_content = review[0].review_content
  length_of_review = len(review_content)
  words = [x for x in review[1] if x.isalnum()]
  avg_word_length = find_avg_token_length(words)
  sentences = nltk.tokenize.sent_tokenize(review_content)
  sentence_length_of_review = len(sentences)
  avg_sentence_length = find_avg_token_length(sentences)
  numerals_ratio = find_numerals_ratio(words)
  capitalised_word_ratio = find_capitalised_word_ratio(words)
  return (length_of_review, avg_word_length, sentence_length_of_review,
          avg_sentence_length, numerals_ratio, capitalised_word_ratio)

from nltk.stem import WordNetLemmatizer, SnowballStemmer
import gensim

def lemmatize_words(words, stemmer, lemmatizer):
  lemmatized = []
  for word in words:
    lemmatized.append(stemmer.stem(lemmatizer.lemmatize(word, pos='v')))
  return lemmatized

def preprocess_words(words, stemmer=SnowballStemmer("english"),
                     lemmatizer = WordNetLemmatizer(),
                     stopwords=gensim.parsing.preprocessing.STOPWORDS):
  """
    This needs to be tested with two mocks chaining interactions. Not
    ideal.
  """
  return lemmatize_words(
    [x for x in words if len(x) > 3 and x not in stopwords],
    stemmer,
    lemmatizer)

def topic_features(topics, num_topics):
  t = [0] * num_topics
  for topic in topics:
    t[topic[0]] = topic[1]
  return t

def sentiment_features(words, sentiment_analyzer):
  polarities = []
  num_positive = 0
  num_negative = 0
  analyze = lambda word: sentiment_analyzer.polarity_scores(word)['compound']
  for polarity in [analyze(x) for x in words]:
    if (polarity > 0):
      num_positive += 1
    elif (polarity < 0):
      num_negative += 1
  total = len(words) 
  if total == 0:
    return (0, 0)
  return (num_positive / total, num_negative / total)
