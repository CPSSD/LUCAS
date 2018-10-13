from protos import review_pb2

def format_yelp_nyc_review_content(content):
  review = review_pb2.Review()
  split_tokens = content.split("\t")
  review.review_content = split_tokens[3]
  review.date = split_tokens[2]
  review.user_id = int(split_tokens[0])
  review.product_id = int(split_tokens[1])
  return review
