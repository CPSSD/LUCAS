from formatting import format_yelp_nyc_review_content
from protos import review_pb2

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
