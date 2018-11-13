from sklearn.feature_extraction.text import CountVectorizer
from scipy.sparse import coo_matrix, hstack
from exp2_feature_extraction import reviews_by_reviewer
from exp2_feature_extraction import reviewer_features

def get_features_maker(all_reviews):
  corpus = [x.review_content for x in all_reviews]
  unigram_count_vect = CountVectorizer()
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
