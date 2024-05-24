const knex = require("knex")(require("../knexfile"));
const {phone} = require('phone');
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
    if (!data) {
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
    const updateRequest = await knex('warehouses').where('id', id).update(req.body);
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
      "contact_email")
    .from('warehouses').first()
    .where('id', id);

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Error updating Warehouse: ${err}`)
  }
}

const warehouseExists = async (id) => {
  const existingWarehouse = await knex('warehouses').where('id', id);
  return !!existingWarehouse.length;
};

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
 
 async function addNewWarehouse(req, res) {
  const body = req.body;

  const isValid = requiredKeys.every(field => body[field]);
  if (!isValid) {
    return res.status(400).send("Please make sure to fill in all fields in the request");
  }
  const validPhone = phone(body.contact_phone);
  if (!validPhone.isValid) {
    return res.status(400).send("Please provide a valid phone number");
  }
  const validEmail = emailValidator.validate(body.contact_email);
  if (!validEmail) {
    return res.status(400).send("Please provide a valid email address");
  }

  const newWarehouse = {
    warehouse_name: body.warehouse_name,
    address: body.address,
    city: body.city,
    country: body.country,
    contact_name: body.contact_name,
    contact_position: body.contact_position,
    contact_email: body.contact_email,
    contact_phone: validPhone.phoneNumber  
  };

  try {
    await knex('warehouses').insert(newWarehouse);
    const data = await knex('warehouses').where({ warehouse_name: newWarehouse.warehouse_name });
    res.status(201).send(data[0]);
  } catch (err) {
    res.status(400).send(`Error creating Warehouse: ${err.message}`);
  }
}

module.exports = {
  getWarehouses,
  getWarehouse,
  deleteWarehouse,
  editWarehouse,
  warehouseInventories,
  addNewWarehouse
};
