import { knex } from 'knex';

/**
 * 
 * @returns Connection to an in-memory SQLite database
 */
export const connect = () => knex({
    client: 'better-sqlite3',
    connection: {
        filename: ":memory:"
    },
    useNullAsDefault: true
});