#!/usr/bin/env node
import {readFileSync} from 'fs';
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
class Inventory {
  /**
   * Creates an instance of Inventory.
   */
  constructor() {
    this.itemDB = {};
    this.playerData = {};
    this.inventory = [];
    this.isDebugMode = true;
    this.inventoryFile = null;
    this.itemDB = this.getJSON('itemsdb.json');
  }

  /**
   * Sets the player's inventory based on a specified file.
   * @param {string} file - The file path of the player's inventory.
   */
  setInventory(file) {
    this.inventoryFile = file;
    this.inventory = this.getJSON(this.inventoryFile).items;
  }

  /**
   * Returns the player's current inventory.
   * @returns {Array} - The player's inventory.
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

    if (!this.isDebugMode) {
      this.savePlayerInventory();
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

    if (!this.isDebugMode) {
      this.savePlayerInventory();
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

    if (!this.isDebugMode) {
      this.savePlayerInventory();
    }
  }

  /**
   * Checks if the player has a certain item in their inventory.
   * @param {string} id - The ID of the item.
   * @returns {number} - The total number of items found in the inventory.
   */
  hasItem(id) {
    // Retrieve item information from the database based on the given ID.
    const itemInDB = this.itemDB[id];

    // Initialize a variable to store the total number of items found.
    let totalAmount = 0;

    // Iterate through the player's inventory
    //  to find the item with the specified ID.
    for (const item of this.getInventory()) {
      // Check if we find an item
      //  with the same ID as the one we are looking for.
      if (item.id === id) {
        // If the item is stackable,
        //  add the item's stack size to the total amount.
        if (itemInDB.stackable) {
          totalAmount += item.amount;
        } else {
          // If the item is not stackable,
          //  increment the total amount by 1 (found one item).
          totalAmount += 1;
        }
      }
    }

    // Return the total number of items found in the inventory.
    return totalAmount;
  }

  /**
   * Returns the item at the specified index in the player's inventory.
   * @param {number} idx - The index of the item.
   * @returns {object} - The item at the specified index.
   */
  getItemAtIndex(idx) {
    return this.getInventory()[idx];
  }
  /**
   * Returns the name of the item.
   * @param {object} item - The item object.
   * @returns {string} - The name of the item.
   */
  getItemName(item) {
    return this.itemDB[item.id].name;
  }

  /**
   * Returns the type of the item.
   * @param {object} item - The item object.
   * @returns {string} - The type of the item.
   */
  getItemType(item) {
    return this.itemDB[item.id].type;
  }

  /**
   * Returns the quality of the item.
   * @param {object} item - The item object.
   * @returns {string} - The quality of the item.
   */
  getItemQuality(item) {
    return this.itemDB[item.id].quality;
  }

  /**
   * Returns the examine description of the item.
   * @param {object} item - The item object.
   * @returns {string} - The examine description of the item.
   */
  getItemExamine(item) {
    return this.itemDB[item.id].examine;
  }

  /**
   * Returns the amount of the item in the player's inventory.
   * Consider removing and use hasItem directly instead
   * @param {object} item - The item object.
   * @returns {number} - The amount of the item
   *  (stackables: amount in stack, non-stackables: amount of stacks).
   */
  getItemAmount(item) {
    return hasItem(item.id);
  }

  /**
   * Returns custom data associated with an item.
   * @param {object} item - The item object.
   * @returns {object} - Custom data associated with the item.
   */
  getItemData(item) {
    return item.data || {};
  }

  /**
   * Returns the healing value of a food item.
   * @param {object} item - The food item object.
   * @returns {number} - The healing value of the food item.
   */
  getFoodHealth(item) {
    return this.itemDB[item.id]?.health || 0;
  }

  /**
   * Retrieves item information from the item database based on the given ID.
   * @param {string} id - The ID of the item.
   * @returns {object} - Item information from the database.
   */
  getItemFromDB(id) {
    return this.itemDB[id];
  }

  /**
   * Reads and parses a JSON file at the specified path.
   * @param {string} path - The file path.
   * @returns {object | null} The parsed JSON object, or null if there was an error reading or parsing the file.
   * @throws {Error} If there is an error during file reading or parsing (error message in the console).
   */
  getJSON(path) {
    try {
      // Read the file content and parse it as JSON.
      const fileContent = readFileSync(path, 'utf-8');

      // Return the parsed JSON object.
      return JSON.parse(fileContent);
    } catch (error) {
      // Handle errors during file reading or parsing.
      console.error(`[${path}] Error reading or parsing file: ${error.message}`);

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
   * Unit test for the Inventory class.
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

// Unit Test
const inventory = new Inventory();
inventory.setInventory('player.json');

console.log(inventory.getInventory());

// console.log(inventory.getFoodHealth('strawberry'));
console.log(inventory.getItemAtIndex(0));
