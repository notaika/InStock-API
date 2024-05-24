const knex = require("knex")(require("../knexfile"));

async function getWarehouses(req, res) {
  try {
    const data = await knex('warehouses')
    res.status(200).json(data);
  } catch(err) {
    res.status(400).send(`Error retrieving warehouses: ${err}`);
  }
}

async function getWarehouse(req, res) {
  const { id } = req.params;
  try {
    const data = await knex
      .select(
        "id",
        "warehouse_name",
        "address",
        "city",
        "country",
        "contact_name",
        "contact_position",
        "contact_phone",
        "contact_email"
      )
      .from("warehouses")
      .where("id", id).first();
    if (!data) {
      res.sendStatus(404);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).send(`Error retrieving warehouse: ${err}`);
  }
}

async function deleteWarehouse(req, res) {
  const { id } = req.params;
  try {
    const data = await knex('warehouses').where('id', id).del();
    if (!data) {
      res.sendStatus(404)
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(400).send(`Error retrieving warehouse: ${err}`)
  }
}

async function warehouseInventories(req, res) {
  try {
    const data = await knex("inventories")
      .select(
        "id",
        "warehouse_id",
        "item_name",
        "category",
        "status",
        "quantity"
      )
      .where({ warehouse_id: req.params.id });
     
    res.status(200).json(data);
  } catch (err) {
    res
      .status(400)
      .send(
        `Error retrieving inventories for Warehouse ${req.params.id}: ${err}`
      );
  }
 }
 

module.exports = {
  getWarehouses,
  getWarehouse,
  deleteWarehouse,
  warehouseInventories
};
