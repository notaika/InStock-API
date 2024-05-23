const knex = require("knex")(require("../knexfile"));

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

module.exports = {
  getWarehouse,
};
