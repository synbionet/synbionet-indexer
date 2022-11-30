import { Knex } from "knex";

import { META_TABLE } from "./init";
import { AssetMetaData } from "../metadata";

/**
 * Stucture of a row in the META_TABLE (TABLE)
 */
export interface AssetInfo {
    did: string,
    nftAddress: string,
    name: string,
    description: string,
    // arweave transaction id
    txid?: string
}

/**
 * Work with an Asset (CRU)
 */
export class AssetDb {
    private connection: Knex;

    constructor(connection: Knex) {
        this.connection = connection;
    }
    async save(meta: AssetMetaData, txid: string): Promise<void> {
        const asset: AssetInfo = {
            did: meta.did,
            nftAddress: meta.nftAddress,
            name: meta.name,
            description: meta.description,
            txid: txid
        };
        const results = await
            this.connection.table(META_TABLE).where({ did: asset.did });
        if (results.length == 0) {
            await this.connection.table(META_TABLE).insert(asset);
        } else {
            await this.connection.table(META_TABLE).update(asset);
        }
    }

    async get(did: string): Promise<AssetInfo | undefined> {
        let r = await this.connection(META_TABLE).where({ 'did': did });
        return r.length > 0 ? r[0] as AssetInfo : undefined;
    }

    async list(): Promise<AssetInfo[] | []> {
        const results = await this.connection(META_TABLE);
        return results;
    }
}

