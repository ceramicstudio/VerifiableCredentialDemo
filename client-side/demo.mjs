// Import ComposeDB client

import { ComposeClient }from '@composedb/client'

// Import your compiled composite

import { definition }from './definition.mjs'
import { reassemble } from './reassembler.mjs';
import { validate, createPresentation, signPresentation } from './validator.mjs';
import { waitForInput } from './waitforinput.mjs';
// Create an instance of ComposeClient
// Pass the URL of your Ceramic server
// Pass reference to your compiled composite

const CERAMIC_URL = 'https://ceramic-temp.hirenodes.io'

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


const qqq = `
    query {
        verifiableCredentialForGitcoinPassportIndex(first: 10) {
          edges {
            node {
            id
            issuer
            issuanceDate
            expirationDate
            proofType
            proofPurpose
            proofCreated
            proofValue
            verificationMethod
            credentialSubject{
                id
                _id
                provider
                hash
            }
            }
            }
          }
        }
    `

console.log(qqq)
await waitForInput("Next: RETRIEVE FROM COMPOSEDB ")

const data = await compose.executeQuery(qqq)

/*

{
  "id": "kjzl6kcym7w8ya7uwuxim2wsldznaik4htdxqzwtps609946u8y64qb714la24g",
  "issuer": "did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC",
  "issuanceDate": "2022-07-23T05:17:53.746Z",
  "expirationDate": "2022-10-21T05:17:53.746Z",
  "proofType": "Ed25519Signature2018",
  "proofPurpose": "assertionMethod",
  "proofCreated": "2022-07-23T05:17:53.747Z",
  "proofValue": "eyJhbGciOiJFZERTQSIsImNyaXQiOlsiYjY0Il0sImI2NCI6ZmFsc2V9..s3xWlz2WnX3Ih0eMVHFpXB7SEFx5SPouGXAbfcUSPMegFrmGaS58S4CdNzztzSB20j3MkPbcUVRagvlGNIJSBQ",
  "verificationMethod": "did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC#z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC",
  "credentialSubject": {
    "id": "kjzl6kcym7w8y8zdp0b3c7bs0oxorih0rt8b5tsku2vo1o9q192lgc4jps3spu5",
    "_id": "did:pkh:eip155:1:0x52905A5E83A83F6a9d0e64Ad24e79a37512D35B9",
    "provider": "BrightId",
    "hash": "v0.0.0:s0jEKaXBJdfkziP2DDGVFPYcy+nIe6hS9yo3n1pIhRw="
  }
}
*/

const sample = data.data.verifiableCredentialForGitcoinPassportIndex.edges[7].node

console.log(JSON.stringify(sample, null, 2))
await waitForInput("RESULT FROM COMPOSEDB. Next: Assemble to a Verifiable Credential")
const cred = reassemble(sample)

console.log(JSON.stringify(cred, null, 2))
await waitForInput("REASSEMBLED AS A VERIFIABLE CREDENTIAL.  Next: Validate and Present")

console.log("VALIDATING WITH DIGITAL BAZAAR")
const result = await validate(cred)

console.log(`Result of validation: {$result}`)

console.log("SIGNING A VERIFIABLE PRESENTATION")
const presentation = createPresentation(cred);
const signedVP = await signPresentation(presentation);

console.log(JSON.stringify(signedVP, null, 2))
