import sql from "mssql";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();

const credential = new DefaultAzureCredential();

const connectDB = async () => {
  try {
    const tokenResponse = await credential.getToken(
      "https://database.windows.net/.default"
    );

    const config = {
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true
      },
      authentication: {
        type: "azure-active-directory-access-token",
        options: {
          token: tokenResponse.token
        }
      }
    };

    await sql.connect(config);

    console.log("Fabric Connected");
  } catch (err) {
    console.log(err);
  }
};

export { sql, connectDB };