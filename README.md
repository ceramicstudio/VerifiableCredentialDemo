# VerifiableCredentialDemo

The intention is to build libraries to natively store Verifiable Credentials on ComposeDB, by saving the extra signature as a model field and reassembling the valid verifiable credential on the fly.

The tool should

 - accept a Verifiable Credential schema
 - build a compatible ComposeDB model
 - reassemble the VC out of the composedb document and validate it

OR

 - from a ComposeDB model, add a sig field and generate a Verifiable Credential Schema that would be compatible

The second might be easier since composedb models are a bit simpler
