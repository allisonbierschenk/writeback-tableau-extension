require('dotenv').config();
const { Pool } = require('pg');


const pool = new Pool({
  connectionString: process.env.DB_SERVER,
  ssl: {
    rejectUnauthorized: false // CHANGE THIS BACK TO THIS CONFIGURATION
  }
});

// Test connection function
async function testConnection() {
  console.log("test connection is", process.env.DB_SERVER)
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 AS test');
    console.log("Connection successful! Test query result:", result.rows);
    client.release();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

// Call the test function
testConnection();

// Get all technicians
module.exports.getTechnicians = async () => {
  const query = `SELECT * FROM "technicians"`;
  try {
    const result = await pool.query(query);
    console.log("results", result.rows)
    return result.rows;
  } catch (err) {
    console.log(err);
  }
};

// Get a specific request by ID
module.exports.getRequest = async requestID => {
  const query = `
    SELECT request_id, request_time, property_name, unit, requests.technician_id AS technician_id, status, area, description, technician_comments
    FROM properties
    INNER JOIN units ON (properties.property_id = units.property_id)
    INNER JOIN requests ON (units.unit_id = requests.unit_id)
    LEFT JOIN technicians ON (requests.technician_id = technicians.technician_id)
    WHERE request_id = $1
  `;

  try {
    const result = await pool.query(query, [requestID]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
};

// Update a request
module.exports.updateRequest = async (requestID, data) => {
  const query = `
    UPDATE requests
    SET technician_id = $1, status = $2, technician_comments = $3
    WHERE request_id = $4
    RETURNING *
  `;

  try {
    const result = await pool.query(query, [
      data.tech,
      data.status,
      data.comments,
      requestID
    ]);
    // If one row was updated, return true
    return result.rowCount === 1;
  } catch (err) {
    console.log(err);
  }
};
