import tensorflow as tf
import keras
from keras import regularizers
from keras.preprocessing import text
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from scripts.training_helpers import pickle_model, get_data_frame

df = get_data_frame()

X = df['review']
y = np.array(df['deceptive']).ravel()

label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

NUM_WORDS = 2000
tokenizer = text.Tokenizer(num_words=NUM_WORDS)

tokenizer.fit_on_texts(X)
pickle_model(tokenizer, 'opspam_tokenizer.pkl')

def tokenize(data):
    return tokenizer.texts_to_matrix(data, mode='tfidf')

X = np.array(tokenize(X))
yelp_X = np.array(tokenize(yelp_X))
yelp_Y = label_encoder.fit_transform(yelp_Y)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=3)

final_model = keras.Sequential([
    keras.layers.Dense(4, activation=tf.nn.relu, input_shape=(NUM_WORDS,), kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(4, activation=tf.nn.relu, kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dense(1, activation=tf.nn.sigmoid)
])
final_model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])
history = final_model.fit(X, y, epochs=12, batch_size=16, validation_split=0.3, verbose=1)
final_model.save('../models/mlp_opspam_86.h5')


