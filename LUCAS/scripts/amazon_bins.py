import os
import xml.etree.ElementTree
import json

folderpath = '../data/amazonBooks/'

reviews = os.listdir(folderpath)

truefilepath = '../data/amazonBooks/truthful/truthful.txt'
deceptivefilepath = '../data/amazonBooks/deceptive/deceptive.txt'
unlabelledfilepath = '../data/amazonBooks/unlabelled/unknown.txt'

for review in reviews:
  print(review)
  if('xml' in review):
    e = xml.etree.ElementTree.parse(folderpath+review).getroot()

    attributes = e.attrib
    review_title = e[0].text
    review_body = e[1].text

    review_object = {}

    for (k,v) in (attributes.items()):
      review_object[k] = v
    review_object['review_title'] = review_title
    review_object['review_body'] = review_body

    if('F' in review):
      with open(deceptivefilepath, 'a+') as f:
        f.write('{}, \n'.format(str(review_object)))

    elif('T' in review):
      with open(truefilepath, 'a+') as t:
        t.write('{}, \n'.format(str(review_object)))

    elif('U' in review):
      with open(unlabelledfilepath, 'a+') as u:
        u.write('{}, \n'.format(str(review_object)))