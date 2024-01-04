# inventory-system-js

A RuneScape-like Inventory System.

## Usage

```js
import Inventory from './inventory.js';

const inventory = new Inventory();
inventory.setInventory('player.json');

inventory.giveItem('strawberry', 3);
inventory.takeItem('useless_dust', 2);
console.log(inventory.getInventory());

```

## Functions

- **Setting and Getting Inventory:**
  - `setInventory(inventoryFile: string): void`: Reads and sets the player's inventory from a JSON file.
  - `getInventory(): Array`: Returns the player's current inventory.

- **Managing Items:**
  - `giveItem(id: string, amount: number = 1, itemData: object | null = null): void`: Adds items to the player's inventory, considering stackable items.
  - `takeItem(id: string, amount: number = 1): void`: Removes items from the player's inventory, considering stackable items.
  - `takeItemAtIndex(idx: number, amount: number = 1): void`: Removes items from the player's inventory at a specific index.

- **Checking for Item Existence:**
  - `hasItem(id: string, data: any = null): boolean`: Checks if the player has a certain item in their inventory, returning the amount and indices of matching items.
  - `hasItemStrict(id: string, data: any = null): boolean`: Checks if the player has a certain item in their inventory with strict data checking, returning the amount and indices of matching items.

- **Retrieving Item Information:**
  - `getItemAtIndex(idx: number): object`: Returns the item at the specified index in the player's inventory.
  - `getItemAmount(item: object): number`: Returns the amount of the item in the player's inventory.
  - `getItemData(item: object): object`: Returns custom data associated with an item.

- **File Operations:**
  - `getJSON(path: string): object | null`: Reads and parses a JSON file at the specified path.
  - `savePlayerInventory(): void`: Attempts to save the player's inventory to a 'player.json' file.

- **Deep Object Comparison:**
  - `deepEqual(obj1: any, obj2: any): boolean`: Recursively checks if two objects are deeply equal.
