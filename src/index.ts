import SynbioNet from './app';
import ArLocal from 'arlocal';
import { loadWalletFromFile } from './utils';

const DEV_WALLET = './wallet/dev.json';

let app: SynbioNet;
let arlocal: ArLocal;

async function stop() {
    await app.stop();
    await arlocal.stop();
}

(async () => {
    arlocal = new ArLocal();
    await arlocal.start();

    const wallet = loadWalletFromFile(DEV_WALLET);

    // start app here...
    app = new SynbioNet();
    await app.start(wallet);

    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
})();


