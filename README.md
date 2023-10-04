# Overview of approaches to storing Verifiable Credentials on Ceramic

## Model design

Examples are included here of ComposeDB models that are as close as possible to a Verifiable Credential example.

## Incompatibilities

The specifications for graphql and verifiable credentials have some small incompatibilities:
 - graphql does not allow fields starting with '@'
 - graphql does not allow fields named "id"

Also, some verifiable credential formats include a large amount of boilerplate that it may be desireable not to store in each instance.

For these reasons, a transformation of the raw graphql is necessary, and possibly desireable.  Two types of transformations are possible:

## Client-side transformation

An npm library may be provided for transforming the query results back into a valid signed verifiable credential.

## Server-side transformation

The server may provide resolvers to transform the query results before returning them to the client.  This will require changes on the js-ceramic side, and may be implemented as Interfaces.

See https://www.apollographql.com/docs/apollo-server/data/resolvers/

Examples of both approachers are contained in this repo.

## Validation

Some of the example code uses the Digital Bazaar libraries for validation.  Note that these may not perform strict checking. (see https://github.com/digitalbazaar/vc)

independent validation may be performed at https://univerifier.io/


