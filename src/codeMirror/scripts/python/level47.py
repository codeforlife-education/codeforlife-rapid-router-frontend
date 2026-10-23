from van import Van

my_van = Van()

number = 1
while not my_van.at_destination():
  my_van.turn_left()
  for count in range(number):
    my_van.move_forwards()
  number = number * 2
