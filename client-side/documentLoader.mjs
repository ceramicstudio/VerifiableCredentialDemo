import fs from 'fs/promises';
import fetch from 'node-fetch';

async function documentLoader(url) {
    // Check if URL starts with 'file://' to determine if it's a local file
    if (url.startsWith('file://')) {
        try {
            const filePath = url.replace('file://', ''); // Strip off 'file://' prefix
            const data = await fs.readFile(filePath, 'utf8');
            const json = JSON.parse(data);
            return {
                contextUrl: null,  // this is for a context via a link header
                document: json,    // this is the actual document that was loaded
                documentUrl: url   // this is the actual context URL after redirects
            };
        } catch (error) {
            console.error(`Error reading local file: ${error.message}`);
            throw error;
        }
    } else {
        // Handle remote URLs
        try {
            const response = await fetch(url);
            if (response.ok) {
                const body = await response.json();
                return {
                    contextUrl: null,
                    document: body,
                    documentUrl: url
                };
            } else {
                throw new Error(`Loading document failed: ${url}`);
            }
        } catch (error) {
            console.error(`Error fetching remote document: ${error.message}`);
            throw error;
        }
    }
}

export { documentLoader };

