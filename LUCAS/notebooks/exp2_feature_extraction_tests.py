from exp2_feature_extraction import find_capitalised_word_ratio
from exp2_feature_extraction import find_avg_token_length
from exp2_feature_extraction import find_numerals_ratio

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
