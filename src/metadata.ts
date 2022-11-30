/**
 * TODO: move to 'api' package in the future
 */
import { ethers } from 'ethers';

const DID_PREFIX = "did:synbio";

/**
 * Interim format for Asset Metadata. This format is used for the indexer
 * cache and for storage in Arweave
 */
export interface AssetMetaData {
    // decentralized identifier based on keccak256(nftAddress+chainid)
    did: string,
    // name of asset
    name: string,
    // short description
    description: string,
    // license URL
    license: string,
    // ethereum address of the nft
    nftAddress: string,
    // optional, erc-20 address
    tokenAddress?: string,
    // url to the endpoint providing the service
    serviceEndpoint: string
}

/**
 * Best effort to check the given object is an Asset
 * @param obj
 * @returns {boolean} true if valid
 */
export function isValidAsset(obj: any): boolean {
    if (
        !obj ||
        !obj.did ||
        !obj.description ||
        !obj.name ||
        !obj.license ||
        !obj.nftAddress ||
        !obj.serviceEndpoint
    ) return false;
    return true;
}

/**
 * Create an Asset
 * @param name 
 * @param desc 
 * @param license 
 * @param nftAddress 
 * @param chainid 
 * @returns {AssetMetaData}
 */
export function createMetaData(
    name: string,
    desc: string,
    license: string,
    nftAddress: string,
    chainid: number): AssetMetaData {
    return {
        did: generateDid(nftAddress, chainid),
        name: name,
        description: desc,
        license: license,
        nftAddress: nftAddress,
        tokenAddress: '',
        serviceEndpoint: ''
    };
}

/**
 * Generate a decentralized identifier from the contract 
 * address and chain id.
 * 
 * @param {String} address the address of the contract
 * @param {Number} chainId the chain id for the ethereum network
 * @returns {String} the DID
 */
export function generateDid(nftAddress: string, chainId: number): string {
    const did_value = ethers.utils.id(nftAddress + chainId);
    return `${DID_PREFIX}:${did_value}`;
}
