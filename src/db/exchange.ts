import { Knex } from "knex";
import { EXCHANGE_TABLE } from "./tables";


export enum ExchangeState {
    Offered,
    Funded,
    Disputed,
    Resolved,
    Completed,
    Voided
}

export enum ExchangeRefund {
    None,
    Partial,
    Full
};

export type Exchange = {
    id: number,
    serviceId: number,
    buyerAddress: string,
    sellerAddress: string,
    moderatorAddress: string,
    price: number,
    uri: string,
    state: ExchangeState,
    refundType: ExchangeRefund,
    created: number,
    updated: number
}

export async function saveExchange(
    connection: Knex,
    params: Exchange): Promise<void> {

    const result = await
        connection.table(EXCHANGE_TABLE).where({ 'id': params.id });
    if (result.length == 0) {
        await connection.table(EXCHANGE_TABLE).insert(params);
    } else {
        await connection.table(EXCHANGE_TABLE).update(params);
    }

}

export async function getExchange(
    connection: Knex,
    id: number): Promise<Exchange | undefined> {
    let r = await connection(EXCHANGE_TABLE).where({ 'id': id });
    return r.length > 0 ? r[0] as Exchange : undefined;
}

export async function listExchangeByBuyer(
    connection: Knex,
    addy: string): Promise<Array<Exchange> | []> {
    const results = await connection(EXCHANGE_TABLE).where({ 'buyerAddress': addy });
    return results;
}

export async function listExchangeBySeller(
    connection: Knex,
    addy: string): Promise<Array<Exchange> | []> {
    const results = await connection(EXCHANGE_TABLE).where({ 'sellerAddress': addy });
    return results;
}

export async function listExchangesByService(
    connection: Knex,
    sid: number): Promise<Array<Exchange> | []> {
    const results = await connection(EXCHANGE_TABLE).where({ 'serviceId': sid });
    return results;
}

