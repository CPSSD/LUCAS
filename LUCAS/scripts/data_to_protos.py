import sys
import os
import json
from os.path import dirname, join, abspath
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from protos import review_set_pb2
from formatting import format_yelp_nyc_review
from formatting import format_yelp_chi_review
from formatting import format_amazonBooks_review
from id_map_service import IDMapService

def id_func(map, key):
  return len(map)

# NYC

data_directory = sys.argv[1]

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(data_directory + '/YelpData/YelpNYC/reviewContent'), 'r') as f1:
  with open(os.path.normpath(data_directory + '/YelpData/YelpNYC/metadata'), 'r') as f2:
    for line in f1:
      format_yelp_nyc_review(review_set.reviews.add(), line, f2.readline())

with open(os.path.normpath(data_directory + '/normalizedData/yelpNYC'), 'wb') as f:
  f.write(review_set.SerializeToString())

# Chicago

userid_map_service = IDMapService(id_func)
productid_map_service = IDMapService(id_func)

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(data_directory+'/YelpData/YelpCHI/output_review_yelpHotelData_NRYRcleaned.txt'), 'r') as f1:
  with open(os.path.normpath(data_directory + '/YelpData/YelpCHI/output_meta_yelpHotelData_NRYRcleaned.txt'), 'r') as f2:
    for line in f1:
      format_yelp_chi_review(review_set.reviews.add(), line, f2.readline(), userid_map_service, productid_map_service)

with open(os.path.normpath(data_directory + '/normalizedData/yelpCHI-hotels'), 'w') as f:
  f.write(str(review_set))

userid_map_service = IDMapService(id_func)
productid_map_service = IDMapService(id_func)

review_set = review_set_pb2.ReviewSet()
with open(os.path.normpath(data_directory + '/YelpData/YelpCHI/output_review_yelpResData_NRYRcleaned.txt'), 'r') as f1:
  with open(os.path.normpath(data_directory + '/YelpData/YelpCHI/output_meta_yelpResData_NRYRcleaned.txt'), 'r') as f2:
    for line in f1:
      format_yelp_chi_review(review_set.reviews.add(), line, f2.readline(), userid_map_service, productid_map_service)

with open(os.path.normpath(data_directory + '/normalizedData/yelpCHI-restaurants'), 'w') as f:
  f.write(str(review_set))

# Amazon

review_set = review_set_pb2.ReviewSet()

userid_map_service = IDMapService(id_func)
productid_map_service = IDMapService(id_func)

with open(os.path.normpath(data_directory + '/amazonBooks/reviewContent'), 'r') as f:
  for line in f:
    reviewObj = json.loads(line.replace('},','}'))
    format_amazonBooks_review(review_set.reviews.add(), reviewObj, userid_map_service, productid_map_service)

with open(os.path.normpath(data_directory + '/normalizedData/amazonBooks'), 'w') as f:
  f.write(str(review_set))
