import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.utils import to_categorical

def run_cross_validate(get_model, X, y, cv=5, categorical=False,
                       add_target_dim=False, verbose=1):
  skfSplitter = StratifiedKFold(n_splits=cv, shuffle=True)
  metrics = {
    "accuracies": [],
  }
    
  for train_indices, test_indices in skfSplitter.split(X, y):
    training_X = np.array([X[x] for x in train_indices])
    training_y = np.array([y[x] for x in train_indices])
    test_X = np.array([X[x] for x in test_indices])
    test_y = np.array([y[x] for x in test_indices])
    
    if categorical:
      training_y = to_categorical(training_y)
      test_y = to_categorical(test_y)
    if add_target_dim:
      training_y = np.array([[y] for y in training_y])
      test_y = np.array([[y] for y in test_y])
    
    model = get_model()
    print("Fitting with: ", np.array(training_X).shape, "labels",
          np.array(training_y).shape)
    model.fit(np.array(training_X), training_y, epochs=12, batch_size=16,
              validation_split=0.3, verbose=verbose,
              callbacks=[EarlyStopping(monitor='val_loss', patience=4)])
    metrics["accuracies"].append(model.evaluate(np.array(test_X), test_y)[1])
  return metrics
