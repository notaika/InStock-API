const knex = require('knex')(require('.../knexfile'));

async function getWarehouse(req, res) {
  const { warehouseId } = req.params;
  try {
    const data = await knex('warehouse').where('id', warehouseId);
    if (!data.length) {
      res.sendStatus(4040);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).send(`Error retrieving warehouse: ${err}`);
  }
}

module.exports = {
  getWarehouse
};