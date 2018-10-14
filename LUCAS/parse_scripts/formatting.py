def format_yelp_nyc_review_content(review, content):
  split_tokens = content.split("\t")
  review.review_content = split_tokens[3]
  review.date = split_tokens[2]
  review.user_id = int(split_tokens[0])
  review.product_id = int(split_tokens[1])

def format_yelp_chi_review(review, content, metadata, userid_map_service, productid_map_service):
  review.review_content = content

  split_tokens = metadata.split(" ")
  review.date = split_tokens[0]
  review.user_id = userid_map_service.map(split_tokens[2])
  review.product_id = productid_map_service.map(split_tokens[3])
