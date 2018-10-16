from id_map_service import IDMapService

def _count_map_func(current_map, key):
  return len(current_map)

def test_id_map_service_maps_using_provided_function():
  map_service = IDMapService(_count_map_func)
  assert map_service.map("ABC") == 0
  assert map_service.map("DEF") == 1

def test_id_map_service_doesnt_remap_existing_map():
  map_service = IDMapService(_count_map_func)
  assert map_service.map("ABC") == 0
  assert map_service.map("ABC") == 0
