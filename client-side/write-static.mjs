// Import ComposeDB client

import { ComposeClient }from '@composedb/client'

// Import your compiled composite

import { definition }from './definition.mjs'

// Create an instance of ComposeClient
// Pass the URL of your Ceramic server
// Pass reference to your compiled composite

const CERAMIC_URL = process.env.CERAMIC_URL;

const compose = new ComposeClient({ ceramic: CERAMIC_URL, definition })

import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { readFileSync } from "fs";
import { fromString } from "uint8arrays/from-string";
import { CeramicClient } from "@ceramicnetwork/http-client";
const ceramic = new CeramicClient(CERAMIC_URL);
const authenticate = async () => {
  const seed = readFileSync("./admin_seed.txt", 'utf8').trim();
  const key = fromString(seed, "base16");
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  });
  await did.authenticate();
  ceramic.did = did;
  return did
};
const did = await authenticate()
compose.setDID(did)

console.log("Authenticated and set did in compose client")

const m = `mutation {
            createGitcoinPassport(input: {
              content: {
                _id: "did:pkh:eip155:1:0x52905A5E83A83F6a9d0e64Ad24e79a37512D35B9"
               provider: "Brightid"
               hash: "v0.0.0:s0jEKaXBJdfkziP2DDGVFPYcy+nIe6hS9yo3n1pIhRw="
              }
            })
            {
              document {
                id
                _id
                provider
                hash
             }
           }
          }
           `

console.log("Executing query now")
const data = await compose.executeQuery(m)
const stream_id = data.data.createGitcoinPassport.document.id
console.log("First data: " + JSON.stringify(data))
const vm = `mutation{
        createVerifiableCredentialForGitcoinPassport(input:{
            content: {
            issuer: "did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC"
            issuanceDate: "2022-07-23T05:17:53.746Z"
            expirationDate: "2022-10-21T05:17:53.746Z"
            proofType: "Ed25519Signature2018"
            proofPurpose: "assertionMethod"
            proofCreated: "2022-07-23T05:17:53.747Z"
            proofValue: "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..s3xWlz2WnX3Ih0eMVHFpXB7SEFx5SPouGXAbfcUSPMegFrmGaS58S4CdNzztzSB20j3MkPbcUVRagvlGNIJSBQ"
            verificationMethod: "did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC#z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC"
            gitcoinPassportId: "${stream_id}"
            }
        })
        {
            document{
            id
            issuer
            issuanceDate
            expirationDate
            proofType
            proofPurpose
            proofCreated
            proofValue
            verificationMethod
            gitcoinPassportId
            }
        }
        }
    `
const vm_data = await compose.executeQuery(vm)
const vm_stream = vm_data.data.createVerifiableCredentialForGitcoinPassport.document.id

console.log("streams are " + vm_stream + " which points to " + stream_id)
