#!/usr/bin/env node
import Inventory from './inventory.js';

const storage = new Inventory();
storage.setInventory('storagetest.json');

const inventory = new Inventory();
inventory.setInventory('player.json');

function logInventory(inventory) {
  console.dir(inventory.getInventory(), {depth: null});
}

function logItem(inventory, item, data = null) {
  const finds = inventory.findItem(item, data);
  const counts = inventory.countItem(item, data);
  const has = inventory.hasItem(item, data);
  console.log(item, finds);
  console.log(item, counts);
  console.log(item, has);
}

function transfer(fromInventory, toInventory, itemID, itemAmount, data = null) {
  const idx = fromInventory.findItemStrict(itemID, data);
  if (idx.length === 0) {
    if (data) {
      console.error(`Item ${itemID} with data: ${JSON.stringify(data)} not found.`);
    } else {
      console.error(`Item ${itemID} not found.`);
    }
    return;
  }
  const {id, amount} = fromInventory.getItemAtIndex(idx);
  if (itemAmount > amount) {
    itemAmount = amount;
  }

  console.log(`Taking [${id}]x${itemAmount} from Storage`);
  fromInventory.takeItemAtIndex(idx, itemAmount);
  console.log(`Adding [${id}]x${itemAmount} to Inventory`);
  toInventory.giveItem(id, itemAmount, data);
}

// logItem(inventory, 'useless_dust');
// logItem(inventory, 'wooden_stick');

// Item Transfer Test Storage -> Inventory
// logItem(storage, 'useless_dust')


console.log('----------------Storage----------------');
logInventory(storage);
console.log('---------------Inventory---------------');
logInventory(inventory);
console.log('---------------------------------------');

const _dd = {bonus_dmg: 69};
transfer(storage, inventory, 'strawberry', 1);
transfer(storage, inventory, 'useless_dust', 5);
transfer(storage, inventory, 'wooden_stick', 1, _dd);

console.log('----------------Storage----------------');
logInventory(storage);
console.log('---------------Inventory---------------');
logInventory(inventory);
console.log('---------------------------------------');


// console.log(inventory.findItemStrict('wooden_stick', _dd))

// logInventory(storage);
// console.log(inventory.getItemAtIndex(slots[0]));

// console.log(inventory.getItemAtIndex(slots[0]));

// console.log(inventory.getFoodHealth('strawberry'));
// console.log(inventory.getItemAtIndex(0));
