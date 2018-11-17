import os
import xml.etree.ElementTree
import json

def bin_data():
  folderpath = '../data/amazonBooks/'
  reviews = os.listdir(folderpath)
  reviewfilepath = '../data/amazonBooks/reviewContent'
  f = open(reviewfilepath, 'a+')
  for review in reviews:
    if(review[-3:] in 'xml'):
      e = xml.etree.ElementTree.parse(folderpath+review).getroot()
      attributes = e.attrib
      review_title = e[0].text
      review_body = e[1].text
      review_object = {"review_title": review_title, "review_body": review_body}
      for (k,v) in (attributes.items()):
        review_object[k] = v
      review_object = json.dumps(review_object)
      if(review[0] in ['F', 'T']):
        f.write('{}, \n'.format(review_object))
  f.close()

if __name__ == '__main__':
  bin_data();