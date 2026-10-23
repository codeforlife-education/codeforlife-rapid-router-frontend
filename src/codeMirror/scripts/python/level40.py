from van import Van

my_van = Van()

for count in range(4):
  while not my_van.at_destination():
    if my_van.at_red_traffic_light():
      my_van.wait()
    elif my_van.is_road_left():
      my_van.turn_left()
    elif my_van.is_road_forward():
      my_van.move_forwards()
    elif my_van.is_road_right():
      my_van.turn_right()
    elif my_van.at_dead_end():
      my_van.turn_around()
  my_van.deliver()
