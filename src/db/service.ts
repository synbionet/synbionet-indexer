import { Knex } from "knex";

import { SERVICE_TABLE } from "./tables";

export type Service = {
    id: number,
    name: string,
    uri: string,
    ownerAddress: string,
    active: boolean,
    created: number,
    updated: number
}

export async function saveService(
    connection: Knex,
    params: Service): Promise<void> {
    const result = await
        connection.table(SERVICE_TABLE).where({ 'id': params.id });
    if (result.length == 0) {
        await connection.table(SERVICE_TABLE).insert(params);
    } else {
        await connection.table(SERVICE_TABLE).update(params);
    }
}

export async function getService(
    connection: Knex, id: number): Promise<Service | undefined> {
    let r = await connection(SERVICE_TABLE).where({ 'id': id });
    return r.length > 0 ? r[0] as Service : undefined;
}

export async function listActiveServices(connection: Knex): Promise<Array<Service> | []> {
    const results = await connection(SERVICE_TABLE).where({ 'active': true });
    return results;
}

export async function listActiveServicesByOwner(
    connection: Knex,
    owner: string): Promise<Array<Service> | []> {
    const results = await connection(SERVICE_TABLE).where({ 'ownerAddress': owner, 'active': true });
    return results;
}
