
from pymongo import MongoClient
from credentials import username, password
import statistics 
import re
from collections import Counter
client = MongoClient('134.209.31.100',
                    username=username,
                    password=password,
                    authSource='admin')
dataset=client.yelp_dataset

es = Elasticsearch()

def calculateReviewStats(reviews):
  lengths = []
  dates = []
  stars = []
  for review in reviews:
    lengths.append(len(re.findall(r'\w+', review["text"])))
    dates.append(review["date"])
    stars.append(review["stars"])
  biggest_day = [date for date in Counter(dates).most_common(1)]
  average_length = sum(lengths)/len(lengths)
  rating_deviation = 0
  if len(stars) > 1:
    rating_deviation = statistics.stdev(stars)

  return {"average_length": average_length, "biggest_day": biggest_day[0][0], "biggest_day_count": biggest_day[0][1], "rating_deviation": rating_deviation}
  
def populateStatistics():
  es.indices.create(index='stats', ignore=400)
  users = dataset.users.find()
  total = users.count()
  dataset.reviews.create_index("user_id")
  dataset.statistics.create_index("user_id")
  print("Total Documents: " + str(total))
  for user in users:
    user_id = user["user_id"]    
    user_reviews = dataset.reviews.find({'user_id': user_id})
    reviewStats = calculateReviewStats(user_reviews)
    data = {"user_id": user_id, "average_stars": user["average_stars"], "review_count": user["review_count"], "name": user["name"], "average_length": reviewStats["average_length"], "biggest_day": reviewStats["biggest_day"],"biggest_day_count": reviewStats["biggest_day_count"], "rating_deviation": reviewStats["rating_deviation"]}
    res = es.index(index="stats", doc_type='statistics', id=user_id, body=data)
    print("Left " + str(total))
    total -= 1
  print("Done")


if __name__ == '__main__':
  populateStatistics()