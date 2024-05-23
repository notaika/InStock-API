const knex = require("knex")(require("../knexfile"));

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
      res.status(500).send(`Error retrieving warehouse: ${err}`);
    }
  }

  module.exports = {
    getInventory
  };