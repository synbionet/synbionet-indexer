// Core logic for the Express/Koa server etc...
import Koa from 'koa';
import json from 'koa-json';
import cors from '@koa/cors';
import { Server } from 'http';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import { Knex } from 'knex';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';

import { connect } from './db/connect';
import { createDbTables } from './db/init';
import { createAsset, assetById, listAssets } from './routes';

declare module 'koa' {
    interface BaseContext {
        address: string;
        arweave: Arweave;
        wallet: JWKInterface;
        connection: Knex;
    }
}

export default class SynBioNet {
    private port: number;
    private app = new Koa();
    private router = new Router();
    private server: Server | undefined;
    private dbconnection: Knex;

    constructor(port: number = 8081) {
        this.port = port;
        this.dbconnection = connect();
    }

    async start(wallet: JWKInterface, arweave: Arweave) {
        await createDbTables(this.dbconnection)

        // setup context
        this.app.context.wallet = wallet;
        this.app.context.arweave = arweave;
        this.app.context.connection = this.dbconnection;
        this.app.context.address = await arweave.wallets.getAddress(wallet);

        // routes
        this.router.post("/asset", createAsset);
        this.router.get("/assets", listAssets);
        this.router.get("/asset/:did", assetById);

        // middleware
        this.app.use(cors({ origin: '*' }));
        this.app.use(json());
        this.app.use(bodyParser({ jsonLimit: '15mb' }));

        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());

        this.server = this.app.listen(this.port, () => {
            console.log(`synbionet started on port ${this.port}`);
        });
    }

    async stop() {
        this.dbconnection.destroy();
        this.server?.close();
    }

}