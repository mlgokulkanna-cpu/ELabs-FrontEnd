import sql from "mssql";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();

let pool;

const getConnection = async () => {

  try {

    if (pool) {
      return pool;
    }

    if (!process.env.DB_SERVER || !process.env.DB_DATABASE) {
      console.log("DB connection skipped: DB_SERVER or DB_DATABASE not configured");
      return null;
    }

    const credential = new DefaultAzureCredential();

    const tokenResponse =
      await credential.getToken(
        "https://database.windows.net/.default"
      );

    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true,
        trustServerCertificate: false
      },
      authentication: {
        type: "azure-active-directory-access-token",
        options: {
          token: tokenResponse.token
        }
      },
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
      }
    };

    pool =
      await sql.connect(config);

    console.log("Fabric Connected");

    return pool;

  } catch (err) {

    console.log("DB connection failed:", err?.message ?? err);
    return null;

  }

};

export {
  sql,
  getConnection
};