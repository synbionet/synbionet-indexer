# Asset MetaData Service
Store and access information about assets

**This is an interim version used primarily for testing and demonstrations**

# Run
This will run the indexer RPC server and an Arweave testnet node

`node dist/src/index.js`

OR

`make run`

You can assess the service on port `8081`

## Ethereum
For simplicty it also provides an instance of Ganache to run for testing

Run `make eth` in a separate terminal to start ganache


## API

### Create a new asset
*POST* `/asset` with an object in the format of an AssetMetaData as the body of the message:

```
curl --header "Content-Type: application/json" 
     --request POST --data {"did":"1234""name": "example", ...}
     localhost:8081/asset
```

The body of the response will contain an object with the Arweave transaction id: 

```
{
    txid: '1Lv13UEyuX9pw710TqSDBJ1gLU5zVdndwgFyItTFRFY'
}
```


### Get asset details
*GET* `/asset/{did}` given the `did` return the asset's details from storage

```
curl --header "Content-Type: application/json" --request GET localhost:8081/asset/1234
```

On success, the body of the response will contain and object in the format of AssetMetaData. 
If not found, a status code of 404 will be returned.


### Get a list of assets
*GET* `/assets` returns a list of information on assets. See `db/assets.ts AssetInfo` for the 
format.

```
curl --header "Content-Type: application/json" --request GET localhost:8081/assets
```
This will always return a `200` status code.  If no assets are found, it will return an empty list `[]`

## TODO

- Authentication via Ethereum signatures





