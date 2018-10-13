import sys
import os
from protos import review_pb2
from formatting import format_yelp_nyc_review_content

yelp_directory = sys.argv[1]

with open(os.path.normpath(yelp_directory + '/reviewContent')) as f:
  review = format_yelp_nyc_review_content(f.readline())
