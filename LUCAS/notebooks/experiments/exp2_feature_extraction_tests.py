from exp2_feature_extraction import find_capitalised_word_ratio
from exp2_feature_extraction import find_avg_token_length
from exp2_feature_extraction import find_numerals_ratio
from exp2_feature_extraction import reviews_by_reviewer
from exp2_feature_extraction import max_date_occurrences

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

def test_find_capitalised_word_ratio_gives_neg_1_if_no_input():
  assert find_capitalised_word_ratio([]) == -1

def test_find_capitalised_word_ratio_gives_1_if_only_word_capitalised():
  assert find_capitalised_word_ratio(['Blarg']) == 1

def test_find_capitalised_word_ratio_gives_1_if_all_words_capitalised():
  assert find_capitalised_word_ratio(['Blarg', 'Booger']) == 1

def test_find_capitalised_word_ratio_gives_0_5_if_half_words_capitalised():
  assert find_capitalised_word_ratio(['Blarg', 'booger']) == 0.5

def test_find_numerals_ratio_is_0_on_empty_input():
  assert find_numerals_ratio([]) == -1

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

def test_extracting_structural_features_gives_review_length():
  review = review_pb2.Review()
  review.review_content = "lol"
  assert structural_features(review)[0] == 3

def test_extracting_structural_features_gives_avg_word_length():
  review = review_pb2.Review()
  review.review_content = "silly spot"
  assert structural_features(review)[1] == 4.5

def test_extracting_structural_features_gives_sentence_length():
  review = review_pb2.Review()
  review.review_content = "Cool place. Smelled funny"
  assert structural_features(review)[2] == 2

def test_extracting_structural_features_gives_avg_sentence_length():
  review = review_pb2.Review()
  review.review_content = "Cool place. Smelled funny."
  assert structural_features(review)[3] == 12.5

def test_extracting_structural_features_gives_numerals_ratio():
  review = review_pb2.Review()
  review.review_content = "10 days later, i'm still waiting on my 2 kebabs"
  assert structural_features(review)[4] == 0.5

def test_extracting_structural_features_gives_numerals_ratio():
  review = review_pb2.Review()
  review.review_content = "Aul James said he likes Ireland"
  assert structural_features(review)[5] == 0.5
