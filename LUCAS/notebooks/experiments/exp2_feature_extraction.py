import functools

def find_avg_token_length(tokens):
  average_word_length = 0
  for t in tokens:
    average_word_length += len(t)
  return average_word_length / len(tokens)

def find_numerals_ratio(tokens):
  if len(tokens) == 0:
    return -1
  return len([x for x in tokens if x.isdigit()]) / len(tokens)

def find_capitalised_word_ratio(tokens):
  total = len(tokens)
  if total == 0:
    return -1
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
