import tensorflow as tf
import keras
from keras import regularizers
from keras.preprocessing import text
import numpy as np
from sklearn.preprocessing import LabelEncoder
from scripts.training_helpers import pickle_model, get_data_frame

df = get_data_frame()
label_encoder = LabelEncoder()
tokenizer = text.Tokenizer(num_words=2000)

reviews = df['review']
tokenizer.fit_on_texts(reviews)
X = np.array(tokenizer.texts_to_matrix(reviews, mode='tfidf'))
y = label_encoder.fit_transform(np.array(df['deceptive']).ravel())

pickle_model(tokenizer, 'opspam_tokenizer.pkl')

early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=3)

final_model = keras.Sequential([
    keras.layers.Dense(4, activation=tf.nn.relu, input_shape=(2000,), kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(4, activation=tf.nn.relu, kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dense(1, activation=tf.nn.sigmoid)
])
final_model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])
history = final_model.fit(X, y, epochs=12, batch_size=16, validation_split=0.3, verbose=1)
final_model.save('../models/mlp_opspam_86.h5')