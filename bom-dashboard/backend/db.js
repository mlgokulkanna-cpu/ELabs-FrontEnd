import sql from "mssql";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();

const credential = new DefaultAzureCredential();

let pool;

const getConnection = async () => {

  try {

    if (pool) {
      return pool;
    }

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

    console.log(err);

  }

};

export {
  sql,
  getConnection
};