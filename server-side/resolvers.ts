const resolvers = {
  Query: {
    getVerifiableCredentialForStamp: async (_, { id }) => {
      const data = await yourDataSource.fetchCredentialById(id);
      
      return transformToVerifiableCredential(data);
    },
  },
  VerifiableCredentialForStamp: {
    context: (parent) => {
      return parent.context; // Or whatever the field is named in your data source
    },
    credentialSubject: (parent) => {
      return transformCredentialSubject(parent.credentialSubject);
    },
  },
  GitcoinPassportStamp: {
    id: (parent) => {
      return parent._id; // Convert _id to id for output
    },
  }
};

function transformToVerifiableCredential(data) {
  // Rename fields and do other transformations as needed
  return {
    ...data,
    "@context": data.context,
  };
}

function transformCredentialSubject(credentialSubject) {
  return {
    ...credentialSubject,
    id: credentialSubject.subjectId, // Convert subjectId to id
    "@context": credentialSubject.context,
  };
}

