#!/usr/bin/env node
import Inventory from './inventory.js';

const inventory = new Inventory();
inventory.setInventory('player.json');

inventory.takeItem('useless_dust', 1);

const _data = {bonus_dmg: 1337};
inventory.giveItem('wooden_stick', 1, _data);
console.dir(inventory.getInventory(), {depth: null});

{
  const finds = inventory.findItem('useless_dust');
  console.log('useless_dust', finds);
  const counts = inventory.countItem('useless_dust');
  console.log('useless_dust:', counts);
}
{
  const finds = inventory.findItem('wooden_stick');
  console.log('wooden_stick', finds);
  const counts = inventory.countItem('wooden_stick');
  console.log('wooden_stick:', counts);
}

{
  const has = inventory.hasItemStrict('wooden_stick', _data);
  console.log(`wooden_stick? ${has}`);
}


// console.log(inventory.getItemAtIndex(slots[0]));

// console.log(inventory.getFoodHealth('strawberry'));
// console.log(inventory.getItemAtIndex(0));
