from formatting import format_yelp_nyc_review_content

def test_formatting_yelp_nyc_gives_correct_review_content():
  entry = "100000	100	2000-01-01	Blarg"
  assert format_yelp_nyc_review_content(entry).review_content == "Blarg"
