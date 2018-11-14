from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse import coo_matrix, hstack
from sklearn.utils import shuffle
from protos import review_set_pb2, review_pb2
import gensim
from exp2_feature_extraction import reviews_by_reviewer
from exp2_feature_extraction import reviewer_features
from exp2_feature_extraction import preprocess_words, topic_features

def get_features_maker(all_reviews, bow_max_size=None):
  corpus = [x.review_content for x in all_reviews]
  unigram_count_vect = CountVectorizer(max_features=bow_max_size)
  unigram_count_vect.fit(corpus)

  def get_features(reviews):
    reviews_corpus = [x.review_content for x in reviews]
    features_ngram_bow = unigram_count_vect.transform(reviews_corpus)

    reviews_reviewer_map = reviews_by_reviewer(reviews)
    features_reviewer =\
        [reviewer_features(x.user_id, reviews_reviewer_map) for x in reviews]

    features = [features_reviewer for i in range(0, 4)]
    features.append(features_ngram_bow)

    return hstack([coo_matrix(x) for x in features])
  return get_features

def get_topic_features_maker(reviews_words, num_topics=100, bigrams=False):
  preprocessed_words =\
      [preprocess_words(x, bigrams=bigrams) for x in reviews_words]
  
  dictionary = gensim.corpora.Dictionary(preprocessed_words)
  dictionary.filter_extremes(no_below=15, no_above=0.33, keep_n=100000)
  bow_corpus = [dictionary.doc2bow(doc) for doc in preprocessed_words]
  lda_model = gensim.models.ldamodel.LdaModel(bow_corpus, num_topics=num_topics, id2word=dictionary, passes=2)
    
  def make_topic_features(review_words):
    topics = lda_model.get_document_topics(dictionary.doc2bow(preprocess_words(review_words, bigrams=bigrams)))
    return topic_features(topics, num_topics)

  def get_terms(topic_id):
    return [dictionary.id2token[x[0]] + " " + str(x[1]) for x in lda_model.get_topic_terms(topic_id, 5)]
  return (make_topic_features, get_terms)

def dense_features_maker(reviews_words, num_topics=100):
  return get_topic_features_maker(reviews_words, num_topics)[0]

def get_balanced_dataset():
  review_set = review_set_pb2.ReviewSet()
  with open("data/yelpZip", 'rb') as f:
    review_set.ParseFromString(f.read())

  fake_reviews = list(filter(lambda x: x.label, review_set.reviews))
  count_fake = len(fake_reviews)
  genuine_reviews = []
  unused_genuine_reviews = []
  counter_genuine = 0
  for review in shuffle(review_set.reviews):
    if review.label == True:
      continue
    if counter_genuine <= count_fake:
      genuine_reviews.append(review)
      counter_genuine += 1
    else:
      unused_genuine_reviews.append(review)
  return shuffle(fake_reviews + genuine_reviews), fake_reviews,\
         genuine_reviews, unused_genuine_reviews
  
