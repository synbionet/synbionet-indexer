import { Knex } from "knex";


export const SERVICE_TABLE = 'service';
export const EXCHANGE_TABLE = 'exchange';
export const CONTACT_TABLE = 'contact_info';

/**
 * Create the tables
 * @param connection
 */
export async function createDbTables(connection: Knex): Promise<void> {
    await connection.schema
        .createTable(CONTACT_TABLE, (table) => {
            table.string('walletAddress').primary;
            table.string('email')
            table.string('phone');
            table.date('created');
            table.date('updated');
        })
        .createTable(SERVICE_TABLE, (table) => {
            table.integer('id').primary;
            table.string('name');
            table.string('uri');
            table.string('ownerAddress');
            table.boolean('active').defaultTo(false);
            table.date('created');
            table.date('updated');
        })
        .createTable(EXCHANGE_TABLE, (table) => {
            table.integer('id').primary;
            table.integer('serviceId');
            table.string('buyerAddress');
            table.string('sellerAddress');
            table.string('moderatorAddress');
            table.integer('price').defaultTo(0);
            table.string('uri');
            table.integer('state').defaultTo(0);
            table.integer('refundType').defaultTo(0);
            table.date('created');
            table.date('updated');
        });
}