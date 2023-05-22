import { RouterContext } from 'koa-router';

import { Contact, getContact, saveContact } from "../db";


// post: /contact/create
export async function createOrUpdateContact(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body as Contact;
    await saveContact(ctx.dbconnection, data);
    ctx.status = 200;
}

// get: /contact/:address
export async function readContact(ctx: RouterContext): Promise<void> {
    const contact = await getContact(ctx.dbconnection, ctx.params.address);

    if (!contact || !contact.walletAddress) {
        ctx.status = 404;
        ctx.body = {
            reason: `contact for ${ctx.params.address} not found`
        };
        return;
    }
    ctx.status = 200;
    ctx.body = contact;
}