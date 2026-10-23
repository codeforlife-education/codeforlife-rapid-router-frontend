from van import Van

my_van = Van()

number = 0

for count in range(4):
  my_van.turn_right()
  for forward in range(number):
    my_van.move_forwards()
  number = number + 1

my_van.turn_right()

while not my_van.at_destination():
  for count in range(number):
    my_van.move_forwards()
  my_van.turn_left()
  number = int(number / 2)
