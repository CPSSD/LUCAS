# This file is a work in progress, and will not work correctly right now.

import sys
import os
from os.path import dirname, join, abspath
from lucas.scripts import model_helpers, data_to_protos, amazon_bins
from lucas.training import svm
from subprocess import call

sys.path.insert(0, abspath('./scripts'))
if 'y' in input('Process Amazon data? [y/n] :'): 
  amazon_bins.bin_data()
  print('Processed Amazon review data successfully.')

if 'y' in input('Convert data to protobuffers? [y/n] :'): 
  data_to_protos.protify_data('data')
  print('Converted data to protobuffers successfully.')

sys.path.insert(0, abspath('./training'))
if 'y' in input('Train classifier? [y/n] :'): 
  model_name = input('Enter a name for this model: \n') if 'y' in input('Pickle model? [y/n] :') else None
  svm.train(model_name)
  print('Trained classifier and produced model successfully.')

sys.path.insert(0, abspath('./app'))
if 'y' in input('Launch API? [y/n] : '): 
  call(["python", "app/lucas.py"])
  print('Started API server successfully.')

