import { knex, Knex } from 'knex';

/**
 * 
 * @returns Connection to an in-memory SQLite database
 */
export const connect = (): Knex => knex({
    client: 'better-sqlite3',
    connection: {
        filename: ":memory:"
    },
    useNullAsDefault: true
});