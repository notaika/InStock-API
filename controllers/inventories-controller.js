const knex = require("knex")(require("../knexfile"));
const requiredKeys = ['warehouse_id', 'item_name', 'description', 'category', 'status', 'quantity'];

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
          "inventories.warehouse_id",
          "inventories.item_name",
          "inventories.description",
          "inventories.category",
          "inventories.status",
          "inventories.quantity"
      )
      .from("inventories")
      .innerJoin("warehouses", "inventories.warehouse_id", "warehouses.id")
      .where("inventories.id", id).first();
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

async function editInventoryItem(req, res) {
  const { id } = req.params;
  const warehouseId = req.body.warehouse_id;
  const quantity = req.body.quantity;

  const inventoryExists = await inventoryItemExists(id);
  if (!inventoryExists) {
    return res.status(404).send(`Inventory Id ${id} Not Found.`);
  }

  const warehouseIdExists = await warehouseExists(warehouseId);
  if (!warehouseIdExists) {
    return res.status(404).send(`Warehouse Id ${warehouseId} Not Found.`)
  } 

  const allRequiredSet = requiredKeys.every((i) => Object.keys(req.body).includes(i));
  const hasEmptyValues = Object.values(req.body).some(value => value === '' || value === null || value.length === 0);
  const requestValid = allRequiredSet && !hasEmptyValues;
  if (!requestValid) {
    return res.status(400).send({ error: `Invalid request. All fields must be set ${requiredKeys}.`});
  }

  if (!isNumber(quantity)) {
    return res.status(404).send(`Quanity is not a valid number.`)
  }

  try {
    const updateRequest = await knex('inventories').where('id', id).update(req.body);
    const data = await knex
    .select(
        "inventories.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
    )
    .from("inventories")
    .where("inventories.id", id).first()
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(`Error updating Inventory Item: ${err}`)
  }
}

const inventoryItemExists = async(id) => {
  const existingInventoryItem = await knex('inventories').where('id', id);
  return !!existingInventoryItem.length;
}; 

const warehouseExists = async (id) => {
  const existingWarehouse = await knex('warehouses').where('id', id);
  return !!existingWarehouse.length;
};

const isNumber = (num) => {
  if (typeof num === 'number' && !isNaN(num)) {
    return true;
  };
  if (typeof num === 'string' && num.trim() !== '' && !isNaN(Number(num))) {
    return true;
  }
  return false;
}


async function addInventoryItem(req, res) {
  const isValid = requiredKeys.every(field => req.body[field]);
  if (!isValid) {
    return res.status(400).send("Please make sure to fill in all required fields");
  }

  const quantity = parseInt(req.body.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return res.status(400).send("Please insert Quantity Value");
  }

  try {
    const warehouse = await knex('warehouses').where({ id: req.body.warehouse_id }).first();
    if (!warehouse) {
      return res.status(400).send(`Warehouse does not exist with id ${req.body.warehouse_id}`);
    }
    const newInventory = {
      item_name: req.body.item_name,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      warehouse_id: req.body.warehouse_id,
      quantity
    };
    
    const [newItem] = await knex("inventories").insert(newInventory);
    const data = await knex("inventories")
      .select(
        "inventories.id",
        "inventories.warehouse_id",
        "inventories.item_name",
        "inventories.description",
        "inventories.category",
        "inventories.status",
        "inventories.quantity"
      )
      .where({ id: newItem })
      .first();
    res.status(201).send(data);

  } catch (err) {
    return res.status(400).send("Error");
  }
}

module.exports = {
  getInventories,
  getInventory,
  deleteInventory,
  editInventoryItem,
  addInventoryItem
};
