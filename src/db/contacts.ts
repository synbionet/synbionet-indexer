
import { Knex } from "knex";
import { CONTACT_TABLE } from "./tables";

export type Contact = {
    walletAddress: string,
    email: string,
    phone: string,
    created: number,
    updated: number
}

/**
 * Insert or update contact information
 * @param connection 
 * @param params 
 */
export async function saveContact(
    connection: Knex,
    params: Contact): Promise<void> {
    const result = await
        connection.table(CONTACT_TABLE).where({ walletAddress: params.walletAddress });
    if (result.length == 0) {
        await connection.table(CONTACT_TABLE).insert(params);
    } else {
        await connection.table(CONTACT_TABLE).update(params);
    }
}

/**
 * Get a contact by account address
 * @param connection 
 * @param address 
 * @returns 
 */
export async function getContact(
    connection: Knex,
    address: string): Promise<Contact | undefined> {
    let r = await connection(CONTACT_TABLE).where({ walletAddress: address });
    return r.length > 0 ? r[0] as Contact : undefined;
}