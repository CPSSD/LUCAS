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
