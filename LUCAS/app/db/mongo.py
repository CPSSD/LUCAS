from pymongo import MongoClient
from flask import Blueprint
from flask import request
from bson.json_util import dumps
from db.credentials import username, password
import statistics 
import re
from collections import Counter
client = MongoClient('134.209.31.100',
                    username=username,
                    password=password,
                    authSource='admin')
dataset=client.yelp_dataset

db = Blueprint('db', __name__)

def calculateReviewStats(reviews):
  lengths = []
  dates = []
  stars = []
  for review in reviews:
    lengths.append(len(re.findall(r'\w+', review["text"])))
    dates.append(review["date"])
    stars.append(review["stars"])
  common_dates = [date for date in Counter(dates).most_common()]
  average_length = sum(lengths)/len(lengths)
  rating_deviation = 0
  if len(stars) > 1:
    rating_deviation = statistics.stdev(stars)

  return {"average_length": average_length, "common_dates": common_dates[0:1], "rating_deviation": rating_deviation}

@db.route("/db/")
def status():
    return "ok"

@db.route("/db/getStats", methods=['POST'])
def getStats():
  user_ids = request.get_json()["userIds"]
  userArray = []
  cachedUsers = []
  for user_id in user_ids:
    cachedUser = dataset.statistics.find_one({'user_id': user_id})
    if cachedUser:
      cachedUsers.append(cachedUser)
    else:
      user = dataset.users.find_one({'user_id': user_id})
      user_reviews = dataset.reviews.find({'user_id': user_id})
      reviewStats = calculateReviewStats(user_reviews)
      data = {"user_id": user_id, "average_stars": user["average_stars"], "review_count": user["review_count"], "name": user["name"], "average_length": reviewStats["average_length"], "common_dates": reviewStats["common_dates"], "rating_deviation": reviewStats["rating_deviation"]}
      userArray.append(data)
  if userArray:
    dataset.statistics.insert(userArray)
  
  return dumps(userArray+cachedUsers)





