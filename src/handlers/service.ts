import { RouterContext } from 'koa-router';

import {
    Service,
    saveService,
    getService,
    listActiveServices,
    listActiveServicesByOwner
} from "../db";

// post: /service/create
export async function createOrUpdateService(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as Service;
    await saveService(ctx.dbconnection, data);
    ctx.status = 200;
}

// get: /service/:id
export async function readService(ctx: RouterContext): Promise<void> {
    const id = Number.parseInt(ctx.params.id);
    if (!id) {
        ctx.status = 400;
        ctx.body = {
            reason: `invalid service id`
        };
        return;
    }
    const service = await getService(ctx.dbconnection, id);

    if (!service || !service.id) {
        ctx.status = 404;
        ctx.body = {
            reason: `exchange ${ctx.params.id} not found`
        };
        return;
    }
    ctx.status = 200;
    ctx.body = service;
}

// get: /services
export async function listServices(ctx: RouterContext): Promise<void> {
    const results = await listActiveServices(ctx.dbconnection);
    ctx.status = 200;
    ctx.body = results;
}

// get: /services/owner/:address
export async function listServicesByOwner(ctx: RouterContext): Promise<void> {
    const results = await listActiveServicesByOwner(ctx.dbconnection, ctx.params.address);
    ctx.status = 200;
    ctx.body = results;
}
