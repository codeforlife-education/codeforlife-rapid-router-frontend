from van import Van

my_van = Van()

count = 0
while count < 3:
  if my_van.is_road_left():
    my_van.turn_left()
    my_van.turn_right()
  my_van.move_forwards()
  count = count + 1
