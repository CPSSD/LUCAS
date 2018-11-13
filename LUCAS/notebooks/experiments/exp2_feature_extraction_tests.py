from exp2_feature_extraction import find_capitalised_word_ratio
from exp2_feature_extraction import find_avg_token_length
from exp2_feature_extraction import find_numerals_ratio
from exp2_feature_extraction import reviews_by_reviewer
from exp2_feature_extraction import max_date_occurrences
from exp2_feature_extraction import structural_features
from exp2_feature_extraction import preprocess_words
from exp2_feature_extraction import topic_features
from exp2_feature_extraction import sentiment_features
from exp2_feature_extraction import pos_features
from exp2_feature_extraction import reviewer_features

from unittest.mock import Mock
import nltk

import sys
from os.path import dirname, join, abspath
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from protos import review_pb2

def test_avg_token_length_of_one_token_is_length_of_token():
  assert find_avg_token_length(['a']) == 1 

def test_avg_token_length_of_two_identical_tokens_is_length_of_tokens():
  assert find_avg_token_length(['a', 'a']) == 1 

def test_avg_token_length_of_two_tokens_is_average():
  assert find_avg_token_length(['a', 'abc']) == 2

def test_avg_token_length_of_two_tokens_can_be_decimal():
  assert find_avg_token_length(['a', 'ab']) == 1.5

def test_find_capitalised_word_ratio_gives_zerzerono_input():
  assert find_capitalised_word_ratio([]) == 0

def test_find_capitalised_word_ratio_gives_1_if_only_word_capitalised():
  assert find_capitalised_word_ratio(['Blarg']) == 1

def test_find_capitalised_word_ratio_gives_1_if_all_words_capitalised():
  assert find_capitalised_word_ratio(['Blarg', 'Booger']) == 1

def test_find_capitalised_word_ratio_gives_0_5_if_half_words_capitalised():
  assert find_capitalised_word_ratio(['Blarg', 'booger']) == 0.5

def test_find_numerals_ratio_is_0_on_empty_input():
  assert find_numerals_ratio([]) == 0

def test_find_numerals_ratio_is_0_on_input_with_no_numerals():
  assert find_numerals_ratio(['abc']) == 0

def test_find_numerals_ratio_is_1_on_input_with_one_numeral():
  assert find_numerals_ratio(['1']) == 1

def test_find_numerals_ratio_is_0_5_on_input_containing_one_numeral():
  assert find_numerals_ratio(['abc', '1']) == 0.5

def reviews_equal(actual, expected):
  format_reviews = lambda reviews: [x.SerializeToString() for x in reviews]
  actual_serialized = format_reviews(actual)
  expected_serialized = format_reviews(expected)
  return actual_serialized == expected_serialized 

def test_reviews_by_reviewer_maps_single_review():
  review = review_pb2.Review()
  review.user_id = 101
  mapped = reviews_by_reviewer([review])
  assert list(mapped.keys()) == [101]
  assert reviews_equal(mapped[101], [review])

def test_reviews_by_reviewer_maps_reviews_with_same_reviewer():
  review1 = review_pb2.Review()
  review1.user_id = 101
  review2 = review_pb2.Review()
  review2.user_id = 101
  mapped = reviews_by_reviewer([review1, review2])
  assert list(mapped.keys()) == [101]
  assert reviews_equal(mapped[101], [review1, review2])

def test_reviews_by_reviewer_maps_reviews_with_different_reviewers():
  review1 = review_pb2.Review()
  review1.user_id = 101
  review2 = review_pb2.Review()
  review2.user_id = 102
  mapped = reviews_by_reviewer([review1, review2])
  assert list(mapped.keys()) == [101, 102]
  assert reviews_equal(mapped[101], [review1])
  assert reviews_equal(mapped[102], [review2])

def test_max_date_occurrences_counts_single_review_date():
  review = review_pb2.Review()
  review.date = "2000-01-01"
  assert max_date_occurrences([review]) == 1

def test_max_date_occurrences_counts_review_date_twice():
  review1 = review_pb2.Review()
  review1.date = "2000-01-01"
  review2 = review_pb2.Review()
  review2.date = "2000-01-01"
  assert max_date_occurrences([review1, review2]) == 2

def test_max_date_occurences_chooses_highest_date_count():
  review1 = review_pb2.Review()
  review1.date = "2000-01-01"
  review2 = review_pb2.Review()
  review2.date = "2000-02-01"
  review3 = review_pb2.Review()
  review3.date = "2000-02-01"
  assert max_date_occurrences([review1, review2, review3]) == 2

def get_review(content="", date="2000-01-01", rating=3.0):
  review = review_pb2.Review()
  review.review_content = content
  review.date = date 
  review.rating = rating
  return review

def review_tuple(content=""):
  return (get_review(content),
          [x for x in nltk.tokenize.word_tokenize(content) if x.isalnum()])

def test_extracting_structural_features_gives_review_length():
  review = review_tuple(content="lol")
  assert structural_features(review)[0] == 3

def test_extracting_structural_features_gives_avg_word_length():
  review = review_tuple(content="silly spot")
  assert structural_features(review)[1] == 4.5

def test_extracting_structural_features_gives_avg_word_length_when_no_words():
  review = review_tuple(content="")
  assert structural_features(review)[1] == 0

def test_extracting_structural_features_gives_sentence_length():
  review = review_tuple(content="Cool place. Smelled funny")
  assert structural_features(review)[2] == 2

def test_extracting_structural_features_gives_avg_sentence_length():
  review = review_tuple(content="Sweet place. Smelled funny")
  assert structural_features(review)[3] == 12.5

def test_extracting_structural_features_gives_numerals_ratio():
  review = review_tuple(
      content="10 days later, im still waiting on my 2 kebabs")
  print(review[1])
  assert structural_features(review)[4] == 0.2

def test_extracting_structural_features_gives_numerals_ratio_when_none():
  review = review_tuple(content="days later, i'm still waiting on my kebabs")
  assert structural_features(review)[4] == 0

def test_extracting_structural_features_gives_capitalised_ratio():
  review = review_tuple(content="Aul James said he likes Ireland")
  assert structural_features(review)[5] == 0.5

def test_extracting_structural_features_gives_capitalised_ratio_when_none():
  review = review_tuple(content="aul james said he likes ireland")
  assert structural_features(review)[5] == 0

def return_word(word, *args, **kwargs):
  return word

def noop_stemmer():
  mock = Mock()
  mock.stem = return_word
  return mock

def noop_lemmatizer():
  mock = Mock()
  mock.lemmatize = return_word
  return mock

def test_preprocess_words_gives_unigrams():
  stemmer = noop_stemmer()
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words(["alright", "welcome", "everyone"],
                               stemmer, lemmatizer, [])
  assert set(processed) == set(["alright", "welcome", "everyone"])


def test_preprocess_words_gives_bigrams():
  stemmer = noop_stemmer()
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words(["alright", "welcome", "everyone"],
                               stemmer, lemmatizer, [], bigrams=True)
  assert set(processed) == set(["alright welcome", "welcome everyone"])

def test_preprocess_words_handles_getting_bigrams_from_empty_word_list():
  stemmer = noop_stemmer()
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words([], stemmer, lemmatizer, [], bigrams=True)
  assert list(processed) == []

def test_preprocess_words_removes_lt_3_char_words():
  stemmer = noop_stemmer()
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words(["help", "me"],
                               stemmer, lemmatizer, [])
  assert list(processed) == ["help"]

def test_preprocess_words_removes_stopwords():
  stemmer = noop_stemmer()
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words(["Test", "YOLO"], stemmer, lemmatizer,
                               ["YOLO"])
  assert list(processed) == ["Test"]

def test_preprocess_words_lemmatizes_words():
  stemmer = noop_stemmer()
  lemmatizer = Mock()
  lemmatizer.lemmatize = lambda word, **kwargs: "a" if word == "bbbb" else word
  processed = preprocess_words(["bbbb", "dddd"], stemmer, lemmatizer, [])
  assert list(processed) == ["a", "dddd"]

def test_preprocess_words_stems_words():
  stemmer = Mock()
  stemmer.stem = lambda word: "1" if word == "aaaa" else word
  lemmatizer = noop_lemmatizer()
  processed = preprocess_words(["aaaa", "bbbb"], stemmer, lemmatizer, [])
  assert list(processed)  == ["1", "bbbb"]

def test_topic_features_creates_vector_of_topic_counts():
  assert topic_features([(1, 2), (2, 4), (8, 3)], 9)\
      == [0, 2, 4, 0, 0, 0, 0, 0, 3]

def test_sentiment_features_gives_pos_neg_percentages():
  analyzer = Mock()
  def analyze(word):
    return { "compound": {
      "good": 0.71,
      "bad": -0.3,
      "ok": 0.0
    }[word] }
  analyzer.polarity_scores = analyze

  assert sentiment_features(["good", "good", "ok", "bad"], analyzer)\
      == (0.5, 0.25)

def test_pos_features_gives_found_tag_percentage():
  tagger = Mock()
  def tag(words):
    tag_map = { "Hi": "NN" }
    return [(x, tag_map[x]) for x in words]
  tagger.pos_tag = tag
  features = pos_features(["Hi"], tagger)
  location_NN = 10
  print(features)
  assert features[location_NN] == 1

def test_pos_features_gives_correct_tag_percentages():
  tagger = Mock()
  def tag(words):
    tag_map = {
      "Hi": "NN",
      "my": "PRP$",
      "name": "NN",
      "is": "VBZ",
      "fred": "VBN"
    }
    return [(x, tag_map[x]) for x in words]
  tagger.pos_tag = tag
  features = pos_features(["Hi", "my", "name", "is", "fred"], tagger)
  print(features)
  location_NN = 10
  assert features[location_NN] == 0.4
  location_PRPdollar = 17
  assert features[location_PRPdollar] == 0.2
  location_VBZ = 30
  assert features[location_VBZ] == 0.2
  location_VBN = 28
  assert features[location_VBN] == 0.2

def test_reviewer_features_gives_max_date_occurrences():
  reviewer_review_map = {
    324: [get_review(date="2010-01-01"), get_review(date="2010-01-01"),
          get_review(date="2012-02-03")],
    101: [get_review(date="2001-01-01")]
  }
  assert reviewer_features(324, reviewer_review_map)[0] == 2

def test_reviewer_features_gives_average_review_length():
  reviewer_review_map = {
    324: [get_review(content="22"), get_review(content="55555")],
    101: [get_review(content="99999999")]
  }
  assert reviewer_features(324, reviewer_review_map)[1] == 3.5

def test_reviewer_features_gives_rating_stdevation():
  reviewer_review_map = {
    101: [get_review(rating=0), get_review(rating=2), get_review(rating=4)]
  }
  assert reviewer_features(101, reviewer_review_map)[2] == 2

def test_reviewer_features_gives_rating_stdevation_0_if_one_review():
  reviewer_review_map = {
    101: [get_review(rating=1)]
  }
  assert reviewer_features(101, reviewer_review_map)[2] == 0

def test_reviewer_features_gives_percentage_pos_ratings():
  reviewer_review_map = {
    324: [get_review(rating=5.0), get_review(rating=3.0),
          get_review(rating=4.0), get_review(rating=1.0)],
    101: [get_review(date="2001-01-01")]
  }
  assert reviewer_features(324, reviewer_review_map)[3] == 0.5

def test_reviewer_features_gives_percentage_neg_ratings():
  reviewer_review_map = {
    324: [get_review(rating=5.0), get_review(rating=3.0),
          get_review(rating=4.0), get_review(rating=1.0),
          get_review(rating=3.0)],
    101: [get_review(date="2001-01-01")]
  }
  assert reviewer_features(324, reviewer_review_map)[4] == 0.2
