from van import Van

my_van = Van()

number = 6
while not my_van.at_destination():
  for count in range(number):
    my_van.move_forwards()
  my_van.turn_left()
  number = number - 2
