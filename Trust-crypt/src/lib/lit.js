// import LitJsSdk from "@lit-protocol/sdk-browser";
import lighthouse from "@lighthouse-web3/sdk";
import * as LitJsSdk from "@lit-protocol/lit-node-client";

const client = new LitJsSdk.LitNodeClient({ debug: false });

class Lit {
  litNodeClient;
  constructor({ autoConnect = false }) {
    if (autoConnect) {
      this.connect();
    }
  }
  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async encryptString(stringToEncrypt, accessControlConditions) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    console.log("before authsig");
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    let authSig = {
      sig: "0xb9947846a09b1c393250ccd77329fbe02b64e9b9de79cbc4…3e20e5b835c3ba0b14d1532e59ab3ea798a8904f8b7b2a41b",
      derivedVia: "web3.eth.personal.sign",
      signedMessage:
        "localhost:3000 wants you to sign in with your Ethe…wJFfLSGt4ukDm\nIssued At: 2023-12-02T19:37:25.585Z",
      address: "0x66f877f485c296b2170868734e10585420e4e887",
    };
    console.log(
      "🚀 ~ file: lit.js:23 ~ Lit ~ encryptString ~ authSig:",
      authSig
    );

    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringToEncrypt
    );
    ``;
    // save encryption key to nodes
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions,
      symmetricKey,
      authSig,
      chain: "mumbai",
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        "base16"
      ),
    };
  }

  async encryptStringLightHouse(stringToEncrypt, publicKey) {
    /**
     * Use this function to upload an encrypted text string to IPFS.
     *
     * @param {string} apiKey - Your unique Lighthouse API key.
     * @param {string} publicKey - Your wallet's public key.
     * @param {string} signedMessage - A message you've signed using your private key.
     *
     * @return {object} - Details of the uploaded file on IPFS.
     */

    const apiKey = process.env.LIGHTHOUSE_API_KEY;
    const signedMessage = await LitJsSdk.checkAndSignAuthMessage({
      chain: "mumbai",
    });
    // const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });

    const response = await lighthouse.textUploadEncrypted(
      stringToEncrypt,
      apiKey,
      publicKey,
      signedMessage
    );

    console.log(response);
  }

  async decryptString(
    encryptedSymmetricKey,
    encryptedString,
    accessControlConditions
  ) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain: "mumbai",
      authSig,
    });

    const decryptedString = await LitJsSdk.decryptString(
      encryptedString,
      symmetricKey
    );
    return { decryptedString };
  }
}

export default Lit;
