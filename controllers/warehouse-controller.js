const knex = require("knex")(require("../knexfile"));
const { phone } = require('phone');
const emailValidator = require('email-validator');
const requiredKeys = ['warehouse_name', 'address', 'city', 'country', 'contact_name', 'contact_position', 'contact_phone', 'contact_email'];

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
    if (!data.length) {
      res.sendStatus(404)
    } else {
      res.status(200).json(data)
    }
  } catch (err) {
    res.status(400).send(`Error retrieving warehouse: ${err}`)
  }
}

async function editWarehouse(req, res) {
  const { id } = req.params;

  const allRequiredSet = requiredKeys.every((i) => Object.keys(req.body).includes(i));
  const hasEmptyValues = Object.values(req.body).some(value => value === '' || value === null || value.length === 0);
  const isPhoneValid = phone(req.body.contact_phone).isValid;
  const isEmailValid = emailValidator.validate(req.body.contact_email)
  const requestValid = allRequiredSet && !hasEmptyValues && isPhoneValid && isEmailValid

  if (!requestValid) {
    return res.status(400).send({ error: `Invalid request. All fields must be set: ${requiredKeys}`});
  }

  const exists = await warehouseExists(id);
  if (!exists) {
    return res.sendStatus(404);
  }

  try {
    const data = await knex('warehouses').where('id', id).update(req.body);
    res.status(200).json(Object.assign(req.params, req.body));
  } catch (err) {
    res.status(500).send(`Error updating Warehouse: ${err}`)
  }
}

const warehouseExists = async (id) => {
  const existingWarehouse = await knex('warehouses').where('id', id);
  return !!existingWarehouse.length;
};

module.exports = {
  getWarehouses,
  getWarehouse,
  deleteWarehouse,
  editWarehouse
};
