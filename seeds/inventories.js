/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

const inventoriesData = require('../seed-data/inventories')

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('inventories').del();
  await knex('inventories').insert(inventoriesData);
};