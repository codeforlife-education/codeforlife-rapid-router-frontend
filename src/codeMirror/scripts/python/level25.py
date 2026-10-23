from van import Van

my_van = Van()

count = 0
while count < 16:
  if my_van.at_red_traffic_light():
    my_van.wait()
  elif my_van.is_road_left():
    my_van.turn_left()
  elif my_van.is_road_forward():
    my_van.move_forwards()
  else:
    my_van.turn_right()
  count = count + 1
