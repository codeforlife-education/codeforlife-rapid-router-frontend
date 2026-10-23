from van import Van

my_van = Van()

count = 0
my_van.turn_right()
while count < 5:
  if my_van.is_animal_crossing():
    my_van.sound_horn()
  my_van.turn_left()
  my_van.turn_right()
  count = count + 1
