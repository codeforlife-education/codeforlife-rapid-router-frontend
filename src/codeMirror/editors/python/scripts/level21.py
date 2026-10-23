from van import Van

my_van = Van()

count = 0
while count < 6:
  if my_van.is_road_left():
    my_van.turn_left()
    my_van.deliver()
    my_van.turn_right()
    if count == 5:
      my_van.deliver()
  else:
    my_van.move_forwards()
  count = count + 1
