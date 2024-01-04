import {readFileSync} from 'fs';

/**
 * Class representing an Item Database Definition
 */
export default class ItemDB {
  static itemsDBFile = 'itemsdb.json';

  /**
   * Retrieves the item database from the specified file.
   * @static
   * @return {Object} The parsed item database containing information
   *  about various items.
   * @throws {Error} If there is an error reading
   *  or parsing the item database file.
   */
  static getItemDB() {
    const fileContent = readFileSync(ItemDB.itemsDBFile, 'utf-8');
    return JSON.parse(fileContent);
  }

  /**
   * Returns the name of the item.
   * @param {object} item - The item object.
   * @return {string} - The name of the item.
   */
  static getItemName(item) {
    return this.itemDB[item.id].name;
  }

  /**
   * Returns the type of the item.
   * @param {object} item - The item object.
   * @return {string} - The type of the item.
   */
  static getItemType(item) {
    return this.itemDB[item.id].type;
  }

  /**
   * Returns the quality of the item.
   * @param {object} item - The item object.
   * @return {string} - The quality of the item.
   */
  static getItemQuality(item) {
    return this.itemDB[item.id].quality;
  }

  /**
   * Returns the examine description of the item.
   * @param {object} item - The item object.
   * @return {string} - The examine description of the item.
   */
  static getItemExamine(item) {
    return this.itemDB[item.id].examine;
  }


  /**
   * Returns the healing value of a food item.
   * @param {object} item - The food item object.
   * @return {number} - The healing value of the food item.
   */
  static getFoodHealth(item) {
    return this.itemDB[item.id]?.health || 0;
  }

  /**
   * Retrieves item information from the item database based on the given ID.
   * @param {string} id - The ID of the item.
   * @return {object} - Item information from the database.
   */
  static getItemFromDB(id) {
    return this.itemDB[id];
  }
}
