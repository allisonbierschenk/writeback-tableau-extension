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
  // Mask password in logs
  const maskedStr = connStr ? connStr.replace(/:[^:@]+@/, ':****@') : 'not set';
  console.log("Testing database connection...");
  console.log("Connection string:", maskedStr);
  
  if (!connStr) {
    console.error("ERROR: DB_SERVER environment variable is not set!");
    return;
  }
  
  if (connStr.includes('localhost') || connStr.includes('127.0.0.1')) {
    console.warn("WARNING: Connection string uses localhost. If running in a container (Railway/Docker),");
    console.warn("localhost will not work - you need to use a cloud database or tunnel service.");
  }
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT 1 AS test');
    console.log("✓ Database connection successful!");
    client.release();
  } catch (err) {
    console.error("✗ Database connection failed!");
    console.error("Error:", err.message);
    if (err.code === 'ECONNREFUSED') {
      console.error("\nTROUBLESHOOTING:");
      console.error("- If running in Railway/Docker: localhost won't work. Use a cloud database.");
      console.error("- Check that PostgreSQL is running and accessible.");
      console.error("- Verify the connection string is correct.");
    }
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
    console.error("Error in updateRequest:", err);
    throw err; // Re-throw so the route can handle it
  }
};
