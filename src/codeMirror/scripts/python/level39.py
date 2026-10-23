from van import Van

my_van = Van()

while not my_van.at_destination():
  if my_van.is_animal_crossing():
    my_van.sound_horn()
  elif my_van.is_road_forward():
    my_van.move_forwards()
  else:
    my_van.turn_left()
