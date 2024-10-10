export const generateRandomBytes = (numBytes: number) =>
    Buffer.from(crypto.getRandomValues(new Uint8Array(numBytes))).toString('hex');
