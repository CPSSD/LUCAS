def format_yelp_nyc_review_content(review, content):
  split_tokens = content.split("\t")
  review.review_content = split_tokens[3]
  review.date = split_tokens[2]
  review.user_id = int(split_tokens[0])
  review.product_id = int(split_tokens[1])
