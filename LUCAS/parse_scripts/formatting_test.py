from formatting import format_yelp_nyc_review_content

def _get_entry_text(userid, productid, date, content):
  return str(userid) + "\t" + str(productid) + "\t" + date + "\t" + content

def test_formatting_yelp_nyc_gives_correct_user_id():
  entry = _get_entry_text(2, 1, "2000-01-01", "abc")
  assert format_yelp_nyc_review_content(entry).user_id == 2

def test_formatting_yelp_nyc_gives_correct_product_id():
  entry = _get_entry_text(1, 3, "2000-01-01", "Blarg")
  assert format_yelp_nyc_review_content(entry).product_id == 3

def test_formatting_yelp_nyc_gives_correct_date():
  entry = _get_entry_text(1, 1, "2001-02-03", "abc")
  assert format_yelp_nyc_review_content(entry).date == "2001-02-03"

def test_formatting_yelp_nyc_gives_correct_review_content():
  entry = _get_entry_text(1, 1, "2000-01-01", "Blarg")
  assert format_yelp_nyc_review_content(entry).review_content == "Blarg"
