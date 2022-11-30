import { Knex } from "knex";

export const META_TABLE = 'dids';

/**
 * Create the table(s)
 * @param connection
 */
export async function createDbTables(connection: Knex): Promise<void> {
    await connection.schema
        .createTable(META_TABLE, (table) => {
            table.string('did').primary;
            table.string('nftAddress');
            table.string('name');
            table.text('description');
            table.string('txid');
            table.primary(['did']);
        });
}