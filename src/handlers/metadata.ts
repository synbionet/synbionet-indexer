import { RouterContext } from 'koa-router';

import {
    ServiceMetadata,
    ExchangeTerms,
    saveServiceMetadata,
    getServiceMetadata,
    saveExchangeTerms,
    getExchangeTerms
} from '../permaweb';

// get: /metadata/service/:txid
export async function fetchServiceMetadata(ctx: RouterContext): Promise<void> {
    const result = await getServiceMetadata(ctx.arweave, ctx.params.txid);
    ctx.status = 200;
    ctx.body = result;
}

// get: /metadata/exchange/:txid
export async function fetchExchangeMetadata(ctx: RouterContext): Promise<void> {
    const result = await getExchangeTerms(ctx.arweave, ctx.params.txid);
    ctx.status = 200;
    ctx.body = result;
}


// post: /metadata/service
export async function storeServiceMetadata(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as ServiceMetadata;
    const txid = await saveServiceMetadata(ctx.arweave, ctx.wallet, data);
    ctx.status = 200;
    ctx.body = { txid: txid };
}

// post: /metadata/exchange
export async function storeExchangeTerms(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as ExchangeTerms;
    const txid = await saveExchangeTerms(ctx.arweave, ctx.wallet, data);
    ctx.status = 200;
    ctx.body = { txid: txid };
}

