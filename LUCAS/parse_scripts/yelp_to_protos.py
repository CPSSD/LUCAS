import sys
import os
from protos import review_pb2

yelp_directory = sys.argv[1]

with open(os.path.normpath(yelp_directory + '/reviewContent')) as f:
  review = review_pb2.Review()
  review.review_content = f.readline().split("\t")[3]
