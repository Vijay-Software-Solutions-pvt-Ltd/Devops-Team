const { Pool } = require("pg");

const isCloudRun = !!process.env.K_SERVICE;

if (isCloudRun && !process.env.INSTANCE_CONNECTION_NAME) {
  console.error(
    "❌ INSTANCE_CONNECTION_NAME is required in Cloud Run but not set"
  );
  process.exit(1);
}

const poolConfig = isCloudRun
  ? {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      port: 5432,
    }
  : {
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      ssl: {
        rejectUnauthorized: false
      }
    };

const pool = new Pool({
  ...poolConfig,

  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on("connect", () => {
  console.log(
    `✅ PostgreSQL connected via ${
      isCloudRun ? "Cloud SQL socket" : "localhost"
    }`
  );
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error", err);
  process.exit(1);
});

module.exports = pool;