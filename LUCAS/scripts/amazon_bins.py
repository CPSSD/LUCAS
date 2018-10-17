import os
import xml.etree.ElementTree
import json

folderpath = '../data/amazonBooks/'

reviews = os.listdir(folderpath)

reviewfilepath = '../data/amazonBooks/reviewContent'

for review in reviews:
  print(review)
  if('xml' in review):
    e = xml.etree.ElementTree.parse(folderpath+review).getroot()

    attributes = e.attrib

    review_title = e[0].text
    review_body = e[1].text

    review_object = {"review_title": review_title, "review_body": review_body}

    for (k,v) in (attributes.items()):
      review_object[k] = v

    review_object = json.dumps(review_object)

    if('F' in review or 'T' in review):
      with open(reviewfilepath, 'a+') as f:
        f.write('{}, \n'.format(review_object))