import request from 'supertest';
import { faker } from "@faker-js/faker";
import { describe, expect, test } from '@jest/globals';


import Services from '../src/services';
import { client } from "../src/permaweb";
import { AssetMetaData, generateDid } from "../src/metadata";

let services: Services;
const URL = 'http://127.0.0.1:8081';

describe('API', () => {
    beforeAll(async () => {
        // create a test wallet
        const arweave = client();
        const wallet = await arweave.wallets.generate();

        // setup service
        services = new Services(wallet);
        await services.start();
    });

    afterAll(async () => {
        services.stop();
    });

    test('post incorrect asset', async () => {
        let resp = await post('/asset', {});
        expect(resp.status).toBe(400);
        expect(resp.body).toStrictEqual({
            reason: "missing or bad asset information"
        });

        resp = await get('/assets');
        expect(resp.status).toBe(200);
        expect(resp.body.length).toBe(0);
    });

    test('not found', async () => {
        let resp = await get('/bad');
        expect(resp.status).toBe(404);

        resp = await get('/asset/1234');
        expect(resp.status).toBe(404);
    });

    test('create and fetch assets', async () => {
        const a1 = randomAsset();

        let resp = await post('/asset', a1);
        let txid = resp.body.txid;
        expect(resp.status).toBe(200);
        expect(txid).toBeDefined();

        resp = await get(`/asset/${a1.did}`);
        expect(resp.status).toBe(200);
        expect(resp.body.did).toBe(a1.did);
        expect(resp.body.name).toBe(a1.name);

        resp = await get('/assets');
        expect(resp.status).toBe(200);
        expect(resp.body.length).toBe(1);
    });
});


// *** helpers *** //

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


function randomAsset(): AssetMetaData {
    const nft = faker.finance.ethereumAddress();
    const did = generateDid(nft, 31333);
    return {
        did: did,
        nftAddress: nft,
        tokenAddress: faker.finance.ethereumAddress(),
        name: faker.internet.userName(),
        description: faker.lorem.paragraph(),
        license: "https//a",
        serviceEndpoint: "https//b"
    };
}