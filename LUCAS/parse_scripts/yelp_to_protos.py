import sys
import os
from protos import review_pb2
from protos import review_set_pb2
from formatting import format_yelp_nyc_review_content

yelp_nyc_directory = sys.argv[1]

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(yelp_nyc_directory + '/reviewContent'), 'r') as f:
  for line in f:
    format_yelp_nyc_review_content(review_set.reviews.add(), f.readline())

with open(os.path.normpath(yelp_nyc_directory + '/normalisedReviewContent'), 'w') as f:
  f.write(str(review_set))
