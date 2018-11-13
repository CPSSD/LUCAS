import sys
import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.svm import LinearSVC
from os.path import dirname, join, abspath
sys.path.insert(0, abspath(join(dirname(__file__), '..')))
from scripts.model_helpers import get_data_frame, fit_model, pickle_model, get_accuracy, classify_new, plot_coefficients

def train(model_name=None):
  data_fm = get_data_frame()
  X = data_fm['review']
  y = np.asarray(data_fm['deceptive'],dtype=int)
  cv = CountVectorizer(stop_words='english', ngram_range=(0, 2))
  tfidf = TfidfTransformer()
  classifier = LinearSVC(random_state=0) # Starting seed
  model = Pipeline([ ('cv', cv), ('tfidf', tfidf), ('classifier', classifier) ])
  fit_model(model, X, y)
  if model_name:
    pickle_model(model, '{}.pkl'.format(model_name))
  print(get_accuracy(model, X, y, 5))
  # plot_coefficients(model, 20)
  # classify_new(model)

if __name__ == '__main__':
    train(input('Enter a name for the model you wish to generate: \n') if 'y' in input('Do you wish to generate a model? [y/n] ') else None)