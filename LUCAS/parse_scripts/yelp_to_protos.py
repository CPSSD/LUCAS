import sys
import os
from protos import review_set_pb2
from formatting import format_yelp_nyc_review
from formatting import format_yelp_chi_review
from id_map_service import IDMapService

# NYC

yelp_nyc_directory = sys.argv[1]

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(yelp_nyc_directory + '/reviewContent'), 'r') as f1:
  with open(os.path.normpath(yelp_nyc_directory + '/metadata'), 'r') as f2:
    for line in f1:
      format_yelp_nyc_review(review_set.reviews.add(), line, f2.readline())

with open(os.path.normpath(yelp_nyc_directory + '/normalisedReviewContent'), 'w') as f:
  f.write(str(review_set))

# Chicago

yelp_chi_directory = sys.argv[2]

def id_func(map, key):
  return len(map)

userid_map_service = IDMapService(id_func)
productid_map_service = IDMapService(id_func)

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(yelp_chi_directory + '/output_review_yelpHotelData_NRYRcleaned.txt'), 'r') as f1:
  with open(os.path.normpath(yelp_chi_directory + '/output_meta_yelpHotelData_NRYRcleaned.txt'), 'r') as f2:
    for line in f1:
      format_yelp_chi_review(review_set.reviews.add(), line, f2.readline(), userid_map_service, productid_map_service)

with open(os.path.normpath(yelp_chi_directory + '/normalisedReviewContent'), 'w') as f:
  f.write(str(review_set))
