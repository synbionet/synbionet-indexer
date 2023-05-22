// Core logic for the Express/Koa server etc...
import Koa from 'koa';
import json from 'koa-json';
import cors from '@koa/cors';
import { Server } from 'http';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

// arweave stuff
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { client, fundWallet } from "./permaweb";

// db stuff
import { Knex } from 'knex';
import { connect, createDbTables } from './db';

// handlers
import {
    storeServiceMetadata,
    storeExchangeTerms,
    fetchServiceMetadata,
    fetchExchangeMetadata
} from "./handlers/metadata";
import {
    createOrUpdateContact,
    readContact
} from "./handlers/contacts";
import {
    createOrUpdateService,
    readService,
    listServices,
    listServicesByOwner
} from "./handlers/service";
import {
    createOrUpdateExchange,
    readExchange,
    exchangesByBuyer,
    exchangesBySeller,
    exchangesByService
} from "./handlers/exchange";



//import { createAsset, assetById, listAssets } from './routes';

declare module 'koa' {
    interface BaseContext {
        address: string;
        arweave: Arweave;
        wallet: JWKInterface;
        dbconnection: Knex;
    }
}

export default class SynBioNet {
    private port: number;
    private app = new Koa();
    private router = new Router();
    private server: Server | undefined;
    private dbconn: Knex;

    constructor(port: number = 8081) {
        this.port = port;
        this.dbconn = connect();
    }

    async start(wallet: JWKInterface) {
        // setup context
        this.app.context.wallet = wallet;
        this.app.context.arweave = client();
        this.app.context.dbconnection = this.dbconn;
        this.app.context.address = await this.app.context.arweave.wallets.getAddress(wallet);

        // create db
        await createDbTables(this.app.context.dbconnection);
        // fund arweave wallet
        await fundWallet(this.app.context.arweave, this.app.context.wallet, 100000000000000);

        // ** Routes ** //
        // arweave metadata 
        this.router.post("/metadata/service", storeServiceMetadata);
        this.router.get("/metadata/service/:txid", fetchServiceMetadata);
        this.router.post("/metadata/exchange", storeExchangeTerms);
        this.router.get("/metadata/exchange/:txid", fetchExchangeMetadata);

        // contacts 
        this.router.post("/contact/create", createOrUpdateContact);
        this.router.get("/contact/:address", readContact);

        // service
        this.router.post("/service/create", createOrUpdateService);
        this.router.get("/services", listServices);
        this.router.get("/service/:id", readService);
        this.router.get("/services/owner/:address", listServicesByOwner);

        // exchange
        this.router.post("/exchange/create", createOrUpdateExchange);
        this.router.get("/exchange/:id", readExchange);
        this.router.get("/exchange/buyer/:address", exchangesByBuyer);
        this.router.get("/exchange/seller/:address", exchangesBySeller);
        this.router.get("/exchange/service/:id", exchangesByService);

        // middleware
        this.app.use(cors({ origin: '*' }));
        this.app.use(json());
        this.app.use(bodyParser({ jsonLimit: '15mb' }));

        this.app
            .use(this.router.routes())
            .use(this.router.allowedMethods());

        this.server = this.app.listen(this.port, () => {
            console.log(`synbionet indexer started on port ${this.port}`);
        });
    }

    async stop() {
        this.dbconn.destroy();
        this.server?.close();
    }
}