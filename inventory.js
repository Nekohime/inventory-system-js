import {readFileSync} from 'fs';

import ItemDB from './item-db.js';

// TODO: hasItem(id, itemData = null) - itemData support
//       TODO: Lookup Deep object equality
// TODO: takeItem(id, amount, itemData = null) - itemData support
// TODO: modifyItemAtIndex(idx, amount, itemData = null)
// TODO: getItemFromDB(id)
//       returns item db data for a given item

// TODO: Item Enchantment, Engraving, Item Naming
// TODO: ItemDB Static Class

/**
 * Class representing a player's inventory.
 */
export default class Inventory {
  /**
   * Creates an instance of Inventory.
   */
  constructor() {
    this.itemDB = ItemDB.getItemDB();
    // this.playerData = null;
    this.inventory = null;
  }

  /**
   * Sets the player's inventory based on a specified file.
   * @param {string} inventoryFile - The file path of the player's inventory.
   */
  setInventory(inventoryFile) {
    this.inventory = this.getJSON(inventoryFile).items;
  }

  /**
   * Returns the player's current inventory.
   * @return {Array} - The player's inventory.
   */
  getInventory() {
    return this.inventory;
  }

  /**
   * Adds items to the player's inventory, considering stackable items.
   * @param {string} id - The ID of the item.
   * @param {number} [amount] - The amount of items to give.
   * @param {object | null} [itemData] - Custom data associated
   *  with the item.
   */
  giveItem(id, amount = 1, itemData = null) {
    const itemInDB = this.itemDB[id];

    if (itemInDB.stackable) {
      const existingStack = this.inventory.find((item) => item.id === id);

      if (existingStack) {
        existingStack.amount += amount;
      } else {
        this.inventory.push({id, amount});
      }
    } else {
      for (let i = 0; i < amount; i++) {
        const newItem = itemData ? {id, data: itemData} : {id};
        this.inventory.push(newItem);
      }
    }
  }

  /**
   * Removes items from the player's inventory, considering stackable items.
   * @param {string} id - The ID of the item.
   * @param {number} [amount] - The amount of items to take.
   */
  takeItem(id, amount = 1) {
    const itemInDB = this.itemDB[id];
    let totalOfItemStack = 0;
    const indicesToRemove = [];

    for (let i = 0; i < this.inventory.length; i++) {
      const item = this.inventory[i];

      if (item.id !== id) {
        continue;
      }

      if (itemInDB.stackable) {
        item.amount -= amount;

        if (item.amount <= 0) {
          indicesToRemove.push(i);
        }

        break;
      } else {
        indicesToRemove.push(i);
        totalOfItemStack += 1;

        if (totalOfItemStack >= amount) {
          break;
        }
      }
    }

    while (indicesToRemove.length > 0) {
      const index = indicesToRemove.pop();
      this.inventory.splice(index, 1);
    }
  }

  /**
   * Removes items from the player's inventory at a specific index.
   * @param {number} idx - The index of the item to remove.
   * @param {number} [amount] - The amount of items to take.
   */
  takeItemAtIndex(idx, amount = 1) {
    if (idx < 0 || idx >= this.inventory.length) {
      console.log(
          'Invalid index. The index must be within the range of the inventory.',
      );
      return;
    }

    const item = this.inventory[idx];
    const itemInDB = this.itemDB[item.id];

    if (itemInDB.stackable) {
      item.amount -= amount;

      if (item.amount <= 0) {
        this.inventory.splice(idx, 1);
      }
    } else {
      this.inventory.splice(idx, 1);
    }
  }

  /**
   * Checks if the player has a certain item in their inventory.
   * Will return the amount regardless of extra data.
   *  Will also return the amount if extra data is given.
   * @param {string} id - The ID of the item.
   * @param {any} [data=null] - Optional data associated with the item.
   * @return {[number, number[]]} - An array containing the total number
   *  of items found in the inventory and an array of indices of matching items.
   */
  hasItem(id, data = null) {
  // Retrieve item information from the database based on the given ID.
    const itemInDB = this.itemDB[id];

    // If the item is not found in the database, return 0.
    if (!itemInDB) {
      return [0, []];
    }

    // Initialize a variable to store the total number of matching items found.
    let totalAmount = 0;
    // Initialize an array to store the indices of matching items.
    const matchingIndices = [];

    // Iterate through the player's inventory
    //  to find the item with the specified ID.
    for (let i = 0; i < this.getInventory().length; i++) {
      const item = this.getInventory()[i];

      // Check if we find an item with the same ID as the one we are looking for
      if (item.id === id) {
      // Check if the optional 'data' parameter is provided.
        if (data !== null) {
        // Check if the item has a 'data' property
        //  and if it matches the provided data.
          if (!item.data || !this.deepEqual(item.data, data)) {
            continue; // Skip to the next iteration if 'data' doesn't match.
          }
        }

        // If the item is stackable,
        //  add the item's stack size to the total amount.
        // If the item is not stackable,
        //  increment the total amount by 1 (found one item).
        totalAmount += itemInDB.stackable ? item.amount : 1;
        // Store the index of the matching item.
        matchingIndices.push(i);
      }
    }

    // Return an array with the total number of matching items
    //  and the array of indices.
    return [totalAmount, matchingIndices];
  }

  /**
   * Checks if the player has a certain item in their inventory.
   * Will strict check the data (or lack thereof)
 * Checks if the player has a certain item in their inventory.
 * Will strict check the data (or lack thereof)
 * @param {string} id - The ID of the item.
 * @param {any} [data=null] - Optional data associated with the item.
 * @return {[number, number[]]} - An array containing the total number
 *  of items found in the inventory and an array of indices of matching items.
 */
  hasItemStrict(id, data = null) {
    // Retrieve item information from the database based on the given ID.
    const itemInDB = this.itemDB[id];

    // If the item is not found in the database, return 0.
    if (!itemInDB) {
      return [0, []];
    }

    // Initialize a variable to store the total number of matching items found.
    let totalAmount = 0;
    // Initialize an array to store the indices of matching items.
    const matchingIndices = [];

    // Iterate through the player's inventory to find the item
    //  with the specified ID.
    for (let i = 0; i < this.getInventory().length; i++) {
      const item = this.getInventory()[i];

      // Check if we find an item with the same ID as the one we are looking for
      if (item.id === id) {
        // Check if the optional 'data' parameter is provided.
        if (data !== null) {
          // Check if the item has a 'data' property and if it matches
          //  the provided data.
          if (!item.data || !this.deepEqual(item.data, data)) {
            continue; // Skip to the next iteration if 'data' doesn't match.
          }
        } else {
          // If 'data' is null, check if the item has no 'data' property.
          if (item.data !== undefined) {
            continue; // Skip to the next iteration if 'data' is present.
          }
        }

        // If the item is stackable,
        //  add the item's stack size to the total amount.
        // If the item is not stackable,
        //  increment the total amount by 1 (found one item).
        totalAmount += itemInDB.stackable ? item.amount : 1;
        // Store the index of the matching item.
        matchingIndices.push(i);
      }
    }

    // Return an array with the total number of matching items
    //  and the array of indices.
    return [totalAmount, matchingIndices];
  }


  /**
   * Returns the item at the specified index in the player's inventory.
   * @param {number} idx - The index of the item.
   * @return {object} - The item at the specified index.
   */
  getItemAtIndex(idx) {
    return this.getInventory()[idx];
  }


  /**
   * Returns the amount of the item in the player's inventory.
   * Consider removing and use hasItem directly instead
   * @param {object} item - The item object.
   * @return {number} - The amount of the item
   *  (stackables: amount in stack, non-stackables: amount of stacks).
   */
  getItemAmount(item) {
    return this.hasItem(item.id);
  }

  /**
   * Returns custom data associated with an item.
   * @param {object} item - The item object.
   * @return {object} - Custom data associated with the item.
   */
  getItemData(item) {
    return item.data || {};
  }

  /**
   * Reads and parses a JSON file at the specified path.
   * @param {string} path - The file path.
   * @return {object | null} The parsed JSON object,
   *  or null if there was an error reading or parsing the file.
   * @throws {Error} If there is an error during file reading or parsing
   *  (error message in the console).
   */
  getJSON(path) {
    try {
      // Read the file content and parse it as JSON.
      const fileContent = readFileSync(path, 'utf-8');

      // Return the parsed JSON object.
      return JSON.parse(fileContent);
    } catch (error) {
      // Handle errors during file reading or parsing.
      console.error(
          `[${path}] Error reading or parsing file: ${error.message}`,
      );

      // Return null in case of an error.
      return null;
    }
  }

  /**
   * Attempts to save the player's inventory to a 'player.json' file.
   * TODO: FIX
   */
  savePlayerInventory() {
    // const playerDataFile = FileAccess.open('player.json', FileAccess.READ);
    const playerDataFile = readFile('player.json')
        .then((contents) => {
          console.log('File Content:', fileContent);
        });

    const stringJson = playerDataFile.get_as_text();
    const json = JSON.parse_string(stringJson);
    json.items = this.inventory;
    this.playerData = json;
    playerDataFile.close();

    // const file = FileAccess.open('player.json', FileAccess.WRITE);
    // file.store_string(JSON.stringify(json));
    // file.close();
  }

  /**
   * Recursively checks if two objects are deeply equal.
   *
   * @param {any} obj1 - The first object to compare.
   * @param {any} obj2 - The second object to compare.
   * @return {boolean} - Returns true if the objects are deeply equal,
   *  otherwise false.
   */
  deepEqual(obj1, obj2) {
    // Check if both are objects
    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    // Check if both are null
    if (obj1 === null && obj2 === null) {
      return true;
    }

    // Check if they have the same set of properties
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length ||
      !keys1.every((key) => keys2.includes(key))) {
      return false;
    }

    // Recursively check each property
    for (const key of keys1) {
      if (!this.deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    // If all checks pass, the objects are deeply equal
    return true;
  }

  /**
   * "Unit test" for the Inventory class.
   */
  unitTest() {
    const inventory = new Inventory();
    inventory.setInventory('player.json');

    inventory.giveItem('strawberry', 2);
    console.log('Strawberries: 0 PLUS 2 == 2:',
        inventory.hasItem('strawberry') === 2);

    inventory.takeItem('strawberry', 2);
    console.log('Strawberries: 2 MINUS 2 == 0:',
        inventory.hasItem('strawberry') === 0);

    inventory.takeItem('strawberry', 1);
    console.log('Strawberries: 0 MINUS 1 == 0:',
        inventory.hasItem('strawberry') === 0);
  }
}
