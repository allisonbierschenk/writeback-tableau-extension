require('dotenv').config();
const { Pool } = require('pg');

// Configure for local database (no SSL needed)
const connectionString = process.env.DB_SERVER;

const poolConfig = {
  connectionString: connectionString
};

// Enable SSL for any remote/managed Postgres (Render, Railway, etc.).
// Local connections (localhost / 127.0.0.1) skip SSL.
if (connectionString && !/localhost|127\.0\.0\.1/.test(connectionString)) {
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

// Get current values for a set of request IDs (used to pre-fill the bulk dialog).
module.exports.getRequestsBulk = async requestIDs => {
  const ids = requestIDs.map(id => parseInt(id, 10)).filter(Number.isFinite);
  if (ids.length === 0) return [];

  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const query = `
    SELECT request_id, technician_id, status, technician_comments
    FROM requests
    WHERE request_id IN (${placeholders})
  `;

  const result = await pool.query(query, ids);
  return result.rows;
};

// Bulk-update requests. `fields` is an object that may contain any of:
//   tech, status, comments. Only provided keys are written.
module.exports.updateRequestsBulk = async (requestIDs, fields) => {
  const ids = requestIDs.map(id => parseInt(id, 10)).filter(Number.isFinite);
  if (ids.length === 0) return 0;

  const sets = [];
  const params = [];
  if (Object.prototype.hasOwnProperty.call(fields, "tech")) {
    params.push(fields.tech === "" ? null : fields.tech);
    sets.push(`technician_id = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(fields, "status")) {
    params.push(fields.status);
    sets.push(`status = $${params.length}`);
  }
  if (Object.prototype.hasOwnProperty.call(fields, "comments")) {
    params.push(fields.comments);
    sets.push(`technician_comments = $${params.length}`);
  }
  if (sets.length === 0) return 0;

  const idPlaceholders = ids.map((_, i) => `$${params.length + i + 1}`).join(", ");
  params.push(...ids);

  const query = `
    UPDATE requests
    SET ${sets.join(", ")}
    WHERE request_id IN (${idPlaceholders})
  `;

  const result = await pool.query(query, params);
  return result.rowCount;
};
