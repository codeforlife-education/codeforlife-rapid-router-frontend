from van import Van

my_van = Van()

count = 0
while count < 3:
  my_van.turn_left()
  my_van.turn_left()
  my_van.turn_right()
  my_van.turn_right()
  count = count + 1
  
count = 0
while count < 3:
  my_van.move_forwards()
  count = count + 1
  
count = 0
while count < 3:
  my_van.turn_right()
  my_van.turn_right()
  my_van.turn_left()
  my_van.turn_left()
  count = count + 1
