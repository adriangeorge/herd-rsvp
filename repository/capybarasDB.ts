import { GenezioDeploy } from "@genezio/types";
import pg from "pg";
const { Pool } = pg;

export type CapybaraModel = {
  name: string;
  nrtel: string;
  status: string;
  arrivesat: string;
};
@GenezioDeploy()
export class CapybaraDBService {
  pool = new Pool({
    connectionString: process.env.NEON_POSTGRES_URL,
    ssl: true,
  });

  async insertCapybara(name: string, phone: string): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    // await this.pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
    await this.pool.query(
      "INSERT INTO capybaras (name,nrtel,status,arrivesAt) VALUES ($1, $2, $3, $4)",
      [name, phone, "WFH", "0"]
    );
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }

  async setCapybaraStatus(
    phone: string,
    status: "WFH" | "OFFICE"
  ): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    await this.pool.query("UPDATE capybaras SET status = $1 WHERE nrtel = $2", [
      status,
      phone,
    ]);
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }

  async setCapybaraArrival(phone: string, arrivesAt: string): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    await this.pool.query(
      "UPDATE capybaras SET arrivesAt = $1 WHERE nrtel = $2",
      [arrivesAt, phone]
    );
    const result = await this.pool.query("select * from capybaras");

    return JSON.stringify(result.rows);
  }

  async getCapybaras(): Promise<CapybaraModel[]> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    const result = await this.pool.query("select * from capybaras");

    console.log(result.rows);
    console.log(JSON.stringify(result.rows));
    console.log(JSON.parse(JSON.stringify(result.rows)));
    return JSON.parse(JSON.stringify(result.rows));
  }

  async getCapybaraByPhone(phone: string): Promise<CapybaraModel> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    const result = await this.pool.query(
      "select * from capybaras where nrtel = $1",
      [phone]
    );

    return JSON.parse(JSON.stringify(result.rows));
  }

  async nukeCapybaras(): Promise<string> {
    await this.pool.query(
      "CREATE TABLE IF NOT EXISTS capybaras (id serial PRIMARY KEY,name VARCHAR(255), nrtel VARCHAR(255), status VARCHAR(255), arrivesAt VARCHAR(255));"
    );

    await this.pool.query("DROP TABLE capybaras");
    return "Capybaras nuked";
  }
}
