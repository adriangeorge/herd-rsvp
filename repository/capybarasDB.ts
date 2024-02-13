import { GenezioDeploy } from "@genezio/types";
import pg from "pg";
const { Pool } = pg;

@GenezioDeploy()
export class CapybaraDBService {
  pool = new Pool({
    connectionString: process.env.NEON_POSTGRES_URL,
    ssl: true,
  });

  async insertCapybara(name: string, phone: string): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt NUMERIC);"
    );

    // await this.pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
    await this.pool.query(
      "INSERT INTO capybaras (name,nrtel,status,arrivesAt) VALUES ($1, $2, $3, $4)",
      [name, phone, "WFH", 0]
    );
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }

  async setCapybaraStatus(
    name: string,
    status: "WFH" | "OFFICE"
  ): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt NUMERIC);"
    );

    await this.pool.query("UPDATE capybaras SET status = $1 WHERE name = $2", [
      status,
      name,
    ]);
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }

  async setCapybaraArrival(name: string, arrivesAt: number): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt NUMERIC);"
    );

    await this.pool.query(
      "UPDATE capybaras SET arrivesAt = $1 WHERE name = $2",
      [arrivesAt, name]
    );
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }
}
