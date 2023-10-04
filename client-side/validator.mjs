// validator.mjs 
import * as vc from '@digitalbazaar/vc';

// Required to set up a suite instance with private key
import {Ed25519VerificationKey2020} from
  '@digitalbazaar/ed25519-verification-key-2020';
import {Ed25519Signature2020} from '@digitalbazaar/ed25519-signature-2020';
import { documentLoader } from './documentLoader.mjs';

const keyPair = await Ed25519VerificationKey2020.generate();

const suite = new Ed25519Signature2020({key: keyPair});

async function validate(input) {
   try {
        const verificationResult = await vc.verify({
            credential: input,
            suite,
            documentLoader
        });
        console.log("IS VALID");
        return verificationResult.verified;  // This will be true or false
    } catch (error) {
        console.error('Verification failed:', error);
        return false;  // or throw the error if you want
    }
}

function createPresentation(credential) {
    // Construct the Verifiable Presentation
    const presentation = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "type": ["VerifiablePresentation"],
        "verifiableCredential": [credential]
    };
    return presentation;
}

async function signPresentation(presentation) {
    const signedPresentation = await vc.signPresentation({
        presentation,
        challenge: "our verifier doesn't require a challenge",
        suite,            // the signature suite you initialized earlier
        documentLoader    // the document loader you're using
    });
    return signedPresentation;
}


// Export the reassemble function
export { validate, createPresentation, signPresentation };


