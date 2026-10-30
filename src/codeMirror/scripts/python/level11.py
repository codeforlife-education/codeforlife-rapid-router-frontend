from van import Van

my_van = Van()

count = 0
while count < 4:
  my_van.move_forwards()
  my_van.turn_left()
  my_van.turn_right()
  count = count + 1
