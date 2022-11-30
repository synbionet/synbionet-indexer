import SynBioNet from './app';
import ArLocal from 'arlocal';
import { fundWallet, client } from './permaweb';
import { JWKInterface } from 'arweave/node/lib/wallet';


/**
 * Helper to start two services:
 * - the synbio api server (indexer)
 * - an arweave test node
 */
export default class Services {
    private synbio: SynBioNet;
    private arlocal: ArLocal;
    private wallet: JWKInterface;

    constructor(wallet: JWKInterface) {
        this.wallet = wallet;
        this.arlocal = new ArLocal();
        this.synbio = new SynBioNet();
    }

    async start() {
        // setup arweave
        await this.arlocal.start();
        const arweave = client();
        await fundWallet(arweave, this.wallet, 100000000000000);

        // setup synbio
        await this.synbio.start(this.wallet, arweave);
    }

    async stop() {
        await this.arlocal.stop();
        await this.synbio.stop();
    }

}