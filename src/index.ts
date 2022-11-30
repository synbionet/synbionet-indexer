import Services from './services';
import { loadWalletFromFile } from './utils';

const DEV_WALLET = './wallet/dev.json';

let services: Services;

async function stop() {
    await services.stop();
}

(async () => {
    const wallet = loadWalletFromFile(DEV_WALLET);
    services = new Services(wallet);
    await services.start();

    process.on('SIGINT', stop);
    process.on('SIGTERM', stop);
})();


