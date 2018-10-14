from formatting import format_yelp_nyc_review_content
from formatting import format_yelp_chi_review
from protos import review_pb2
from id_map_service import IDMapService

def _get_entry_text(userid, productid, date, content):
  return str(userid) + "\t" + str(productid) + "\t" + date + "\t" + content

def test_formatting_yelp_nyc_gives_correct_user_id():
  review = review_pb2.Review()
  entry = _get_entry_text(2, 1, "2000-01-01", "abc")
  format_yelp_nyc_review_content(review, entry)
  assert review.user_id == 2

def test_formatting_yelp_nyc_gives_correct_product_id():
  review = review_pb2.Review()
  entry = _get_entry_text(1, 3, "2000-01-01", "Blarg")
  format_yelp_nyc_review_content(review, entry)
  assert review.product_id == 3

def test_formatting_yelp_nyc_gives_correct_date():
  review = review_pb2.Review()
  entry = _get_entry_text(1, 1, "2001-02-03", "abc")
  format_yelp_nyc_review_content(review, entry)
  assert review.date == "2001-02-03"

def test_formatting_yelp_nyc_gives_correct_review_content():
  review = review_pb2.Review()
  entry = _get_entry_text(1, 1, "2000-01-01", "Blarg")
  format_yelp_nyc_review_content(review, entry)
  assert review.review_content == "Blarg"

# Chicago

def _get_chi_metadata(userid="SL4aEwrM2q0HAXHpduMQ1Q", productid="rpP9iZsT3NC-Z4pUtQGoiA", date="1970-01-01"):
  return date + " xwPMoEzuvpn3J32IvTcsiQ " + userid + " " + productid + " Y 0 0 0 3" 

def _get_id_map_service():
  def get_id(map, key):
    return 1
  return IDMapService(get_id)

def _format_yelp_chi_review(review, content="", metadata=_get_chi_metadata(),
                            userid_map_service=_get_id_map_service(),
                            productid_map_service=_get_id_map_service()):
  return format_yelp_chi_review(review, content, metadata, userid_map_service, productid_map_service)

def test_formatting_yelp_chi_gives_correct_review_content():
  review = review_pb2.Review()
  _format_yelp_chi_review(review, content="I visited")
  assert review.review_content == "I visited"

def test_formatting_yelp_chi_gives_correct_date():
  review = review_pb2.Review()
  _format_yelp_chi_review(review, metadata=_get_chi_metadata(date="2012-12-21"))
  assert review.date == "2012-12-21"

def test_formatting_yelp_chi_gives_correct_userid():
  test_userid = "IErE0ydkkLfAoePgqrVdUQ"
  def get_id(map, key):
    if key == test_userid:
      return 123123
  map_service = IDMapService(get_id)

  review = review_pb2.Review()
  metadata=_get_chi_metadata(userid=test_userid)
  _format_yelp_chi_review(review, metadata=metadata, userid_map_service=map_service)
  assert review.user_id == 123123

def test_formatting_yelp_chi_gives_correct_productid():
  test_productid = "rpP9iZsT3NC-Z4pUtQGoiA"
  def get_id(map, key):
    if key == test_productid:
      return 321321
  map_service = IDMapService(get_id)

  review = review_pb2.Review()
  metadata=_get_chi_metadata(productid=test_productid)
  _format_yelp_chi_review(review, metadata=metadata, productid_map_service=map_service)
  assert review.product_id == 321321
