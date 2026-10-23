from van import Van

my_van = Van()

while not my_van.at_destination():
  if my_van.is_animal_crossing():
    my_van.sound_horn()
  elif my_van.is_road_forward():
    my_van.move_forwards()
  elif my_van.at_dead_end():
    my_van.turn_around()
    my_van.turn_right()
