import tensorflow as tf
from tensorflow import keras
from keras.preprocessing import text
import numpy as np
import pandas as pd
import os
import matplotlib.pyplot as plt
from scripts import training_helpers
from sklearn.model_selection import train_test_split
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from keras import regularizers

df = training_helpers.get_data_frame()
X = df['review']
y = np.array(df['deceptive']).ravel()

label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

print(y)

NUM_WORDS = 2000
tokenizer = text.Tokenizer(num_words=NUM_WORDS)
tokenizer.fit_on_texts(X)

def tokenize(data):
    return tokenizer.texts_to_matrix(data, mode='tfidf')

X = np.array(tokenize(X))

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

kfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
early_stop = keras.callbacks.EarlyStopping(monitor='val_loss', patience=3)

# cvscores = []
# for train, test in kfold.split(X, y):
#     model = keras.Sequential([
#     keras.layers.Dense(4, activation=tf.nn.relu, input_shape=(NUM_WORDS,), kernel_regularizer=regularizers.l2(0.01)),
#     keras.layers.Dropout(0.25),
#     keras.layers.Dense(4, activation=tf.nn.relu, kernel_regularizer=regularizers.l2(0.01)),
#     keras.layers.Dense(1, activation=tf.nn.sigmoid)
#     ])
#     model.compile(optimizer='adam',
#               loss='binary_crossentropy',
#               metrics=['accuracy'])
#     model.fit(X[train], y[train], epochs=30, batch_size=32, validation_split=0.3, verbose=1, callbacks=[early_stop])
#     scores = model.evaluate(X[test], y[test], verbose=2)
#     print(model.metrics_names, scores)
#     print("%s: %.2f%%" % (model.metrics_names[1], scores[1]*100))
#     cvscores.append(scores[1] * 100)
    
# print("%.2f%% (+/- %.2f%%)" % (np.mean(cvscores), np.std(cvscores)))

final_model = keras.Sequential([
    keras.layers.Dense(8, activation=tf.nn.relu, input_shape=(NUM_WORDS,), kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dropout(0.25),
    keras.layers.Dense(8, activation=tf.nn.relu, kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dropout(0.25),
    keras.layers.Dense(8, activation=tf.nn.relu, kernel_regularizer=regularizers.l2(0.01)),
    keras.layers.Dense(1, activation=tf.nn.sigmoid)
])
final_model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])
history = final_model.fit(X_train, y_train, epochs=30, batch_size=16, validation_split=0.3, verbose=1, callbacks=[early_stop])
scores = final_model.evaluate(X_test, y_test, verbose=2)
print(scores)

acc = history.history['acc']
val_acc = history.history['val_acc']
loss = history.history['loss']
val_loss = history.history['val_loss']

epochs = range(1, len(acc) + 1)

# "bo" is for "blue dot"
plt.plot(epochs, loss, 'b', label='Training loss')
# b is for "solid blue line"
plt.plot(epochs, val_loss, 'bo', label='Validation loss')
plt.plot(epochs, acc, 'r', label='Training acc')
plt.plot(epochs, val_acc, 'ro', label='Validation acc')

plt.title('Training and validation losses and accuracies')
plt.xlabel('Epochs')
plt.ylabel('Loss & Acc')
plt.legend()
plt.show()

