import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';

import { AssetMetaData } from './metadata';

/**
 * Create an Arweave client
 * TODO: Make configurable for real network
 * @returns {Arweave} client
 */
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

/**
 * Wrapper around Arweave API to create and query an Asset
 */
export class PermaWeb {
    private client: Arweave;

    constructor(client: Arweave) {
        this.client = client;
    }

    /**
     * Store an Asset on Areave
     * @param asset
     * @param wallet 
     * @returns {string} the transaction id
     */
    async save(asset: AssetMetaData, wallet: JWKInterface): Promise<string> {
        let tx = await this.client.createTransaction(
            { data: JSON.stringify(asset) },
            wallet
        );
        tx.addTag('App-Name', 'SynBioNet');
        tx.addTag('MetaData', 'v1');

        await this.client.transactions.sign(tx, wallet);
        await this.client.transactions.post(tx);
        return tx.id;
    }

    /**
     * Get an asset given the transaction id
     * @param txid 
     * @returns 
     */
    async get(txid: string): Promise<AssetMetaData> {
        const rawData = await this.client.transactions.getData(txid);
        const decoded = Buffer.from(rawData.toString(), 'base64').toString();
        return JSON.parse(decoded);
    }
}