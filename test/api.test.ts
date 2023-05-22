import request from 'supertest';
import { describe, expect, test } from '@jest/globals';

import ArLocal from 'arlocal';
import SynbioNet from "../src/app";
import { client, ExchangeTerms, ServiceMetadata } from "../src/permaweb";
import { Service, Exchange, Contact } from "../src/db";

let app: SynbioNet;
let arlocal: ArLocal;
const URL = 'http://127.0.0.1:8081';

describe('API', () => {
    beforeAll(async () => {
        arlocal = new ArLocal(1984, false);
        await arlocal.start();

        const wallet = await client().wallets.generate();

        app = new SynbioNet()
        await app.start(wallet);
    });

    afterAll(async () => {
        await app.stop();
        await arlocal.stop();
    });

    test('post / get exchange metadata', async () => {
        const terms: ExchangeTerms = { description: "example info." };
        let resp1 = await post('/metadata/exchange', terms);
        let txid = resp1.body.txid;
        expect(resp1.status).toBe(200);
        expect(txid).toBeDefined();

        let resp2 = await get(`/metadata/exchange/${txid}`);
        expect(resp2.status).toBe(200);
        let back: ExchangeTerms = resp2.body as ExchangeTerms;
        expect(back.description).toBe("example info.");
    });

    test('post / get service metadata', async () => {
        const meta: ServiceMetadata = {
            name: "service1",
            ownerAddress: "0x1234",
            description: "hello",
            terms: "copyright",
        };
        let resp1 = await post('/metadata/service', meta);
        let txid = resp1.body.txid;
        expect(resp1.status).toBe(200);
        expect(txid).toBeDefined();

        let resp2 = await get(`/metadata/service/${txid}`);
        expect(resp2.status).toBe(200);
        let back: ServiceMetadata = resp2.body as ServiceMetadata;
        expect(back.name).toBe(meta.name);
        expect(back.ownerAddress).toBe(meta.ownerAddress);
        expect(back.description).toBe(meta.description);
        expect(back.terms).toBe(meta.terms);
    });

    test('post / get service info', async () => {
        const srv: Service = {
            id: 1,
            name: "service1",
            uri: "ar://0x124",
            ownerAddress: "0xdeadbeef",
            active: true,
            created: 1,
            updated: 2
        };

        let resp1 = await post('/service/create', srv);
        expect(resp1.status).toBe(200);

        let resp2 = await get(`/service/1`);
        expect(resp2.status).toBe(200);
        let back: Service = resp2.body as Service;
        expect(back.id).toBe(srv.id);
        expect(back.name).toBe(srv.name);

        let resp3 = await get(`/services`);
        expect(resp3.status).toBe(200);
        let back1 = resp3.body;
        expect(back1.length).toBe(1);
    });

    test('post / get exchange info', async () => {
        const exchange: Exchange = {
            id: 1,
            serviceId: 1,
            buyerAddress: "bob",
            sellerAddress: "alice",
            moderatorAddress: "tony",
            price: 10,
            uri: "ar://123",
            state: 0,
            refundType: 0,
            created: 1,
            updated: 2
        };

        let resp1 = await post('/exchange/create', exchange);
        expect(resp1.status).toBe(200);

        let resp2 = await get(`/exchange/1`);
        expect(resp2.status).toBe(200);
        let back: Exchange = resp2.body as Exchange;
        expect(back.id).toBe(exchange.id);
        expect(back.buyerAddress).toBe(exchange.buyerAddress);

        let resp3 = await get(`/exchange/buyer/bob`);
        expect(resp3.status).toBe(200);
        let back1 = resp3.body;
        expect(back1.length).toBe(1);

        let resp4 = await get(`/exchange/seller/alice`);
        expect(resp4.status).toBe(200);
        let back2 = resp4.body;
        expect(back2.length).toBe(1);

        let resp5 = await get(`/exchange/seller/nope`);
        expect(resp5.status).toBe(404);
    });

    test('post / get exchange info', async () => {
        let contract: Contact = {
            walletAddress: "bob",
            email: "bob@here.com",
            phone: "111-222-3333",
            created: 1,
            updated: 2
        };

        let resp1 = await post('/contact/create', contract);
        expect(resp1.status).toBe(200);

        let resp2 = await get(`/contact/bob`);
        expect(resp2.status).toBe(200);
        let back: Contact = resp2.body as Contact;
        expect(back.walletAddress).toBe(contract.walletAddress);
    });
});

// ** helpers ** //

async function post(path: string, data: any): Promise<request.Response> {
    const resp = await request(URL)
        .post(path)
        .set('Accept', 'application/json')
        .send(data);
    return resp;
}

async function get(path: string): Promise<request.Response> {
    const resp = await request(URL)
        .get(path)
        .set('Accept', 'application/json');
    return resp;
}