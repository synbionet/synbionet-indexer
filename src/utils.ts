import { readFileSync } from 'fs';
import { JWKInterface } from 'arweave/node/lib/wallet';

/**
 * Load a wallet from a given file (json format)
 * @param fn 
 * @returns the Wallet
 */
export function loadWalletFromFile(fn: string): JWKInterface {
    const buf = readFileSync(fn);
    const wallet: JWKInterface = JSON.parse(buf.toString());
    return wallet;
}

/**
 * Prefix a hex with '0x
 * @param value the hex value
 * @returns hex
 */
export function prefixHex0x(value: string): string {
    return value.startsWith('0x') ? value : `0x${value}`;
}

/**
 * Remove an '0x' prefix from a hex value
 * @param value the hex
 * @returns hex
 */
export function stripHex0x(value: string): string {
    return value.startsWith('0x') ? value.slice(2) : value;
}

