#!/usr/bin/env node
import Inventory from './inventory.js';

const inventory = new Inventory();
inventory.setInventory('player.json');

inventory.takeItem('useless_dust', 1);

const _data = {bonus_dmg: 1337};
inventory.giveItem('wooden_stick', 1, _data);
console.dir(inventory.getInventory(), {depth: null});

const [count, slots] = inventory.hasItemStrict('wooden_stick');
console.log(`wooden_stick with extra damage (1337): ${count} of this item, ` +
`at inventory index(es): ${slots}`);

console.log(inventory.getItemAtIndex(slots[0]));

// console.log(inventory.getFoodHealth('strawberry'));
// console.log(inventory.getItemAtIndex(0));
