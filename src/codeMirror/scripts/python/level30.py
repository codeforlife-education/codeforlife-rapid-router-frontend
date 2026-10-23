from van import Van

my_van = Van()

while not my_van.at_destination():
  my_van.turn_left()
  my_van.turn_right()
  my_van.turn_right()
  my_van.turn_left()
