from formatting import format_yelp_nyc_review
from formatting import format_yelp_chi_review
from protos import review_pb2
from id_map_service import IDMapService

def _get_entry_text(userid=1, productid=2, date="2001-01-01", content=""):
  return str(userid) + "\t" + str(productid) + "\t" + date + "\t" + content

def _get_nyc_metadata(label=1):
  return "0\t0\t3.0\t" + str(label) + "\t2014-12-08"

def test_formatting_yelp_nyc_gives_correct_user_id():
  review = review_pb2.Review()
  entry = _get_entry_text(userid=2)
  format_yelp_nyc_review(review, entry, _get_nyc_metadata())
  assert review.user_id == 2

def test_formatting_yelp_nyc_gives_correct_product_id():
  review = review_pb2.Review()
  entry = _get_entry_text(productid=3)
  format_yelp_nyc_review(review, entry, _get_nyc_metadata())
  assert review.product_id == 3

def test_formatting_yelp_nyc_gives_correct_date():
  review = review_pb2.Review()
  entry = _get_entry_text(date="2001-02-03")
  format_yelp_nyc_review(review, entry, _get_nyc_metadata())
  assert review.date == "2001-02-03"

def test_formatting_yelp_nyc_gives_correct_review_content():
  review = review_pb2.Review()
  entry = _get_entry_text(content="Blarg")
  format_yelp_nyc_review(review, entry, _get_nyc_metadata())
  assert review.review_content == "Blarg"

def test_formatting_yelp_nyc_gives_correct_fake_label():
  review = review_pb2.Review()
  format_yelp_nyc_review(review, _get_entry_text(), _get_nyc_metadata(label=-1))
  assert review.label==True

def test_formatting_yelp_nyc_gives_correct_genuine_label():
  review = review_pb2.Review()
  format_yelp_nyc_review(review, _get_entry_text(), _get_nyc_metadata(label=1))
  assert review.label==False

# Chicago

def _get_chi_metadata(userid="SL4aEwrM2q0HAXHpduMQ1Q", productid="rpP9iZsT3NC-Z4pUtQGoiA", date="1970-01-01", label="Y"):
  return date + " xwPMoEzuvpn3J32IvTcsiQ " + userid + " " + productid + " " + label + " 0 0 0 3"

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

def test_formatting_yelp_chi_gives_correct_fake_label():
  review = review_pb2.Review()
  _format_yelp_chi_review(review, metadata=_get_chi_metadata(label="Y"))
  assert review.label == True

def test_formatting_yelp_chi_gives_correct_genuine_label():
  review = review_pb2.Review()
  _format_yelp_chi_review(review, metadata=_get_chi_metadata(label="N"))
  assert review.label == False
