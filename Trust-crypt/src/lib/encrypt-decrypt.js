// Replace 'your_secret_key' with your own key
const secretKey = "your_secret_key";

// Function to encrypt text using AES-GCM algorithm
export function encryptText(text) {
  const encoder = new TextEncoder();

  return window.crypto.subtle
    .generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt"])
    .then((key) => {
      return window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: window.crypto.getRandomValues(new Uint8Array(12)),
        },
        key,
        data
      );
    })
    .then((encrypted) => {
      return {
        ciphertext: new Uint8Array(encrypted).toString(),
      };
    });
}

// Function to decrypt text
export function decryptText(encrypted, key) {
  const decoder = new TextDecoder();
  return window.crypto.subtle
    .importKey("raw", new TextEncoder().encode(key), "AES-GCM", true, [
      "decrypt",
    ])
    .then((importedKey) => {
      return window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: new Uint8Array(12) },
        importedKey,
        new Uint8Array(encrypted)
      );
    })
    .then((decrypted) => {
      return decoder.decode(decrypted);
    });
}

// Example usage
