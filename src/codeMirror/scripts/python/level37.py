from van import Van

my_van = Van()

while not my_van.at_destination():
  if my_van.is_road_forward():
    my_van.move_forwards()
  elif my_van.is_road_left():
    my_van.turn_left()
  else:
    my_van.turn_right()
