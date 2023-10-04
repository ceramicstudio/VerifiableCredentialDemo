# Overview of approaches to storing Verifiable Credentials on Ceramic

## Model design

Examples are included here of ComposeDB models that are as close as possible to a Verifiable Credential example.

## Challenges

The specifications for graphql and verifiable credentials have some small incompatibilities:
 - graphql does not allow fields starting with '@'
 - graphql does not allow fields named "id"

Also, some verifiable credential formats include a large amount of boilerplate that it may be desireable not to store in each instance.  Further, the verifiable credential spec may allow highly flexible field choices that may be hard to replicate in fixed models without further logic. (For example, the proof field is not always called 'jws' depending on the verification method) 

For these reasons, a transformation of the raw graphql is necessary, and possibly desireable.  Two types of transformations are possible:

## Client-side transformation

An npm library may be provided for transforming the query results back into a valid signed verifiable credential.


## Server-side transformation

The server may provide a custom non-graphql endpoint before returning them to the client.  This will require changes on the js-ceramic side, and may be implemented in the future.

Resolvers can replace fields using graphql, but we would still run into the problem of the incompatible fields
See https://www.apollographql.com/docs/apollo-server/data/resolvers/

Examples of both approachers are contained in this repo.

## Schema choices

Because ComposeDB supports indexing on the primary fields of a model rather than the subtypes, we have chosen relational models with one for the core fields about the attestation, and one for the fields required to reassemble into a valid Verifiable Credential.  Note that we may implement this same pattern for Ethereum Attestation Service objects.

We have further choices to follow tightly the exact verifiable credential fields, or assume that some logic may transform them and leave out any static ones to be added by the transformer.

The two approaches can be seen under [./schemas](./schemas)

## Validation

Some of the example code uses the Digital Bazaar libraries for validation.  Note that these may not perform strict checking. (see https://github.com/digitalbazaar/vc)

independent validation may be performed at https://univerifier.io/


