
from pymongo import MongoClient
<<<<<<< HEAD
from db.credentials import username, password
=======
from credentials import username, password
from elasticsearch import Elasticsearch
>>>>>>> 1c09bc8... Imporved Frontend Performance
import statistics 
import re
from collections import Counter
client = MongoClient('134.209.31.100',
                    username=username,
                    password=password,
                    authSource='admin')
dataset=client.yelp_dataset

<<<<<<< HEAD
=======
es = Elasticsearch()

>>>>>>> 1c09bc8... Imporved Frontend Performance
def calculateReviewStats(reviews):
  lengths = []
  dates = []
  stars = []
  for review in reviews:
    lengths.append(len(re.findall(r'\w+', review["text"])))
    dates.append(review["date"])
    stars.append(review["stars"])
<<<<<<< HEAD
  common_dates = [date for date in Counter(dates).most_common()]
=======
  biggest_day = [date for date in Counter(dates).most_common(1)]
>>>>>>> 1c09bc8... Imporved Frontend Performance
  average_length = sum(lengths)/len(lengths)
  rating_deviation = 0
  if len(stars) > 1:
    rating_deviation = statistics.stdev(stars)
<<<<<<< HEAD

  return {"average_length": average_length, "common_dates": common_dates[0:1], "rating_deviation": rating_deviation}
  
def populateStatistics():
=======
  return {"average_length": average_length, "biggest_day": biggest_day[0][0], "biggest_day_count": biggest_day[0][1], "rating_deviation": rating_deviation}
  
def populateStatistics():
  es.indices.create(index='stats', ignore=400)
>>>>>>> 1c09bc8... Imporved Frontend Performance
  users = dataset.users.find()
  total = users.count()
  dataset.reviews.create_index("user_id")
  dataset.statistics.create_index("user_id")
  print("Total Documents: " + str(total))
  for user in users:
    user_id = user["user_id"]    
<<<<<<< HEAD
    cachedUser = dataset.statistics.find_one({'user_id': user_id})
    if not cachedUser:
      user_reviews = dataset.reviews.find({'user_id': user_id})
      reviewStats = calculateReviewStats(user_reviews)
      data = {"user_id": user_id, "average_stars": user["average_stars"], "review_count": user["review_count"], "name": user["name"], "average_length": reviewStats["average_length"], "common_dates": reviewStats["common_dates"], "rating_deviation": reviewStats["rating_deviation"]}
      dataset.statistics.insert(data)
      print("Left " + str(total))
=======
    user_reviews = dataset.reviews.find({'user_id': user_id})
    reviewStats = calculateReviewStats(user_reviews)
    data = {"user_id": user_id, "average_stars": user["average_stars"], "review_count": user["review_count"], "name": user["name"], "average_length": reviewStats["average_length"], "biggest_day": reviewStats["biggest_day"],"biggest_day_count": reviewStats["biggest_day_count"], "rating_deviation": reviewStats["rating_deviation"]}
    res = es.index(index="stats", doc_type='statistics', id=user_id, body=data)
    print("Left " + str(total))
>>>>>>> 1c09bc8... Imporved Frontend Performance
    total -= 1
  print("Done")


if __name__ == '__main__':
  populateStatistics()