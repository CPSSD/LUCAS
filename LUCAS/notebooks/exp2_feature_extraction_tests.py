from exp2_feature_extraction import find_capitalised_word_ratio
from exp2_feature_extraction import find_avg_token_length
from exp2_feature_extraction import find_numerals_ratio
from exp2_feature_extraction import reviews_by_reviewer

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
