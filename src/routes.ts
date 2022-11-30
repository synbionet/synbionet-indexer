import { RouterContext } from 'koa-router';

import { AssetDb } from './db/asset';
import { PermaWeb } from './permaweb';
import { AssetMetaData, isValidAsset } from './metadata';


/**
 * Given an asset object:
 * - validate it
 * - save to arweave
 * - save to local cache (db) with tx id from arweave (above)
 * - add the txid to the response 
 * @param ctx 
 */
export async function createAsset(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as AssetMetaData;
    if (!isValidAsset(data)) {
        ctx.status = 400; // bad request
        ctx.body = {
            reason: "missing or bad asset information"
        };
        return;
    }
    // save to arweave
    const perma = new PermaWeb(ctx.arweave);
    const txid = await perma.save(data, ctx.wallet);

    // save to db
    const db = new AssetDb(ctx.connection);
    await db.save(data, txid);

    ctx.status = 200;
    ctx.body = { txid: txid };
}

/**
 * Get an asset given the asset's 'did'
 * Looks up the asset in the local db and uses the txid to fetch
 * the asset from arweave 
 * @param ctx
 * @returns 
 */
export async function assetById(ctx: RouterContext): Promise<void> {
    const db = new AssetDb(ctx.connection);
    const asset = await db.get(ctx.params.did);

    if (!asset || !asset.txid) {
        ctx.status = 404;
        ctx.body = {
            reason: `asset ${ctx.params.did} not found or missing txid`
        };
        return;
    }

    const perma = new PermaWeb(ctx.arweave);
    ctx.status = 200;
    ctx.body = await perma.get(asset.txid);
}

export async function listAssets(ctx: RouterContext): Promise<void> {
    const db = new AssetDb(ctx.connection);
    const results = await db.list();
    ctx.status = 200;
    ctx.body = results;
}