from van import Van

my_van = Van()

while not my_van.at_destination():
  if my_van.is_road_right():
    my_van.turn_right()
  else:
    my_van.move_forwards()
