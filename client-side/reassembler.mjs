// Reassemble the results from a composedb query into a verifiable credential object to validate

function reassemble(input) {
  return {
      type: ["VerifiableCredential"],
      proof: {
        jws: input.proofValue,
        type: input.proofType,
        created: input.proofCreated,
        proofPurpose: input.proofPurpose,
        verificationMethod: input.verificationMethod,
      },
      issuer: input.issuer,
      '@context': ["https://www.w3.org/2018/credentials/v1"],
      issuanceDate: input.issuanceDate,
      expirationDate: input.expirationDate,
      credentialSubject: {
        id: input.credentialSubject._id,

        // these should be generated from the model definition also
        hash: input.credentialSubject.hash,

        // TODO: these should be generated from the model definition
        '@context': [
          {
            hash: "https://schema.org/Text",
            provider: "https://schema.org/Text",
          },
        ],
        provider: input.credentialSubject.provider,
      },
  };
}

export { reassemble };

