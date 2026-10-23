from van import Van

my_van = Van()

for count in range(3):
  for forward in range(4):
    my_van.move_forwards()
  for left in range(2):
    my_van.turn_left()
  for forward in range(4):
    my_van.move_forwards()
  for right in range(2):
    my_van.turn_right()
