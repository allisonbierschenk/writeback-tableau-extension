require('dotenv').config();
const { Pool } = require('pg');

// Configure for local database (no SSL needed)
const connectionString = process.env.DB_SERVER;

const poolConfig = {
  connectionString: connectionString
};

// Only use SSL if connection string explicitly requires it (for remote databases)
// Local databases typically don't need SSL
if (connectionString && (connectionString.includes('ssl=true') || connectionString.includes('render.com'))) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

// Test connection function
async function testConnection() {
  const connStr = process.env.DB_SERVER || '';
  
  if (!connStr) {
    return;
  }
  
  try {
    const client = await pool.connect();
    await client.query('SELECT 1 AS test');
    client.release();
  } catch (err) {
    // Silent fail
  }
}

// Call the test function
testConnection();

// Get all technicians
module.exports.getTechnicians = async () => {
  const query = `SELECT * FROM "technicians"`;
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    throw err;
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
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (err) {
    throw err;
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
    throw err;
  }
};
