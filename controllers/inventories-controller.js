const knex = require("knex")(require("../knexfile"));

async function getInventories(req, res) {
  try {
    const data = await knex
      .select(
        "inventories.id",
        "warehouses.warehouse_name",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .from("inventories")
      .join("warehouses", "warehouses.id", "inventories.warehouse_id");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error retrieving inventories: ${err}`);
  }
}

async function getInventory(req, res) {
  const { id } = req.params;
  try {
    const data = await knex
      .select(
          "inventories.id",
          "warehouses.warehouse_name",
          "inventories.item_name",
          "inventories.description",
          "inventories.category",
          "inventories.status",
          "inventories.quantity"
      )
      .from("inventories")
      .innerJoin("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", id)
    if (!data) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).send(`Error retrieving inventory: ${err}`);
  }
}

async function deleteInventory(req, res) {
  const { id } = req.params;
  try {
    const data = await knex('inventories').where('id', id).del();
    if (!data) {
      res.sendStatus(404)
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(400).send(`Error retrieving inventory: ${err}`)
  }
}

module.exports = {
  getInventories,
  getInventory,
  deleteInventory
};
