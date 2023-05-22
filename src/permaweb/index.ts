
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';

export type ServiceMetadata = {
    name: string,
    ownerAddress: string,
    description: string,
    terms: string,
}

export type ExchangeTerms = {
    description: string
}

export function client(): Arweave {
    return new Arweave({
        host: "127.0.0.1",
        port: 1984,
        protocol: "http"
    });
}

/**
 * Helper to fund a wallet with the given amount of arweave 'winstons'
 * @param client
 * @param wallet 
 * @param amount 
 */
export async function fundWallet(
    client: Arweave,
    wallet: JWKInterface,
    amount: number
): Promise<void> {
    const address = await client.wallets.getAddress(wallet);
    await client.api.get(`/mint/${address}/${amount}`);
    await client.api.get('/mine');
}

export async function saveServiceMetadata(
    client: Arweave,
    wallet: JWKInterface,
    meta: ServiceMetadata): Promise<string> {
    return await writeData(client, wallet, JSON.stringify(meta));
}

export async function saveExchangeTerms(
    client: Arweave,
    wallet: JWKInterface,
    terms: ExchangeTerms): Promise<string> {
    return await writeData(client, wallet, JSON.stringify(terms));
}

export async function getServiceMetadata(client: Arweave, txid: string): Promise<ServiceMetadata> {
    return await getByTxId<ServiceMetadata>(client, txid);
}

export async function getExchangeTerms(client: Arweave, txid: string): Promise<ExchangeTerms> {
    return await getByTxId<ExchangeTerms>(client, txid);
}

// ** private helpers ** //

async function getByTxId<T>(client: Arweave, txid: string): Promise<T> {
    const rawData = await client.transactions.getData(txid);
    const decoded = Buffer.from(rawData.toString(), 'base64').toString();
    return JSON.parse(decoded);
}

async function writeData(
    client: Arweave,
    wallet: JWKInterface,
    rawData: string): Promise<string> {

    let tx = await client.createTransaction(
        { data: rawData },
        wallet
    );
    tx.addTag('App-Name', 'SynBioNet');

    await client.transactions.sign(tx, wallet);
    await client.transactions.post(tx);
    return tx.id;
}