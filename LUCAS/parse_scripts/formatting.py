from protos import review_pb2

def format_yelp_nyc_review_content(content):
  review = review_pb2.Review()
  review.review_content = content.split("\t")[3]
  return review
