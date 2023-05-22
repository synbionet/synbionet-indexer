
import { RouterContext } from 'koa-router';

import {
    Exchange,
    saveExchange,
    getExchange,
    listExchangeByBuyer,
    listExchangeBySeller,
    listExchangesByService
} from "../db";


// post: /exchange/create
export async function createOrUpdateExchange(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as Exchange;
    await saveExchange(ctx.dbconnection, data);
    ctx.status = 200;
}

// get: /exchange/:id
export async function readExchange(ctx: RouterContext): Promise<void> {
    const id = Number.parseInt(ctx.params.id);
    if (!id) {
        ctx.status = 400;
        ctx.body = {
            reason: `invalid exchange id`
        };
        return;
    }
    const exchange = await getExchange(ctx.dbconnection, id);

    if (!exchange || !exchange.id) {
        ctx.status = 404;
        ctx.body = {
            reason: `exchange ${ctx.params.id} not found`
        };
        return;
    }
    ctx.status = 200;
    ctx.body = exchange;
}

// get: /exchange/buyer/:address
export async function exchangesByBuyer(ctx: RouterContext): Promise<void> {
    const results = await listExchangeByBuyer(ctx.dbconnection, ctx.params.address);
    if (!results || results.length === 0) {
        ctx.status = 404;
        ctx.body = [];
        return;
    }
    ctx.status = 200;
    ctx.body = results;
}

// get: /exchange/seller/:address
export async function exchangesBySeller(ctx: RouterContext): Promise<void> {
    const results = await listExchangeBySeller(ctx.dbconnection, ctx.params.address);
    if (!results || results.length === 0) {
        ctx.status = 404;
        ctx.body = [];
        return;
    }
    ctx.status = 200;
    ctx.body = results;
}

// get: /exchange/service/:id
export async function exchangesByService(ctx: RouterContext): Promise<void> {
    const id = Number.parseInt(ctx.params.id);
    if (!id) {
        ctx.status = 400;
        ctx.body = {
            reason: `invalid service id`
        };
        return;
    }
    const results = await listExchangesByService(ctx.dbconnection, id);
    ctx.status = 200;
    ctx.body = results;
}



