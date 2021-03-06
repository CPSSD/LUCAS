class IDMapService:
  """
  This class is for remember ID mappings for a user id token to some type that
  is nicer to work with in the context of machine learning
  """

  def __init__(self, id_function):
    self._map = dict()
    self._id_function = id_function

  def map(self, key):
    id = -1
    if key in self._map:
      id = self._map[key]
    else:
      id = self._id_function(self._map, key)
      self._map[key] = id
    return id
