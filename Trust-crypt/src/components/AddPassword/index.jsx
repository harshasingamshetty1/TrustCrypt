import ModalComponent from "../Modal";
import { ethers } from "ethers";
import { execute_raw_transaction } from "../../hooks/useOkto";
import { useState } from "react";
import { encryptText, decryptText } from "../../lib/encrypt-decrypt";

const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "KeyUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "addKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyKeys",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "bool",
            name: "isDeleted",
            type: "bool",
          },
        ],
        internalType: "struct KeyManager.Key[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
    ],
    name: "softDeleteKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_id",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ipfsHash",
        type: "string",
      },
    ],
    name: "updateKey",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
const Index = ({ modalStatus, wallet, authToken }) => {
  const [isModalOpen, setModalOpen] = modalStatus;
  const [siteURL, setSiteURL] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // console.log("wallet ===", wallet);
  const generateTxnData = (ipfsHash) => {
    // Encode the function call
    const iface = new ethers.utils.Interface(contractABI);

    const generatedTxData = iface.encodeFunctionData("addKey", [ipfsHash]);

    const transactionData = {
      api_key: import.meta.env.VITE_OKTO_API_KEY,
      auth: authToken,
      network_name: wallet.network_name,
      from: wallet.address,
      to: import.meta.env.VITE_CONTRACT_ADDRESS,
      tx_data: generatedTxData,
      value: "0x",
    };
    return transactionData;
  };
  const pinDataToIPFS = async (data) => {
    const response = await fetch(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: import.meta.env.VITE_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env
            .VITE_PUBLIC_PINATA_API_SECRET_KEY,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  };
  const handleAddPassword = async () => {
    // const textToEncrypt = "This is a secret message.";
    // encryptText(textToEncrypt)
    //   .then((encrypted) => {
    //     console.log("Encrypted:", encrypted.ciphertext);
    //     return decryptText(encrypted.ciphertext, "secretKey");
    //   })
    //   .then((decrypted) => {
    //     console.log("Decrypted:", decrypted);
    //   })
    //   .catch((err) => {
    //     console.error("Encryption/decryption error:", err);
    //   });

    const ipfsHash = await pinDataToIPFS({
      siteURL, password, username
    });

    const { api_key, network_name, from, to, tx_data, value, auth } =
      generateTxnData(ipfsHash.IpfsHash);
    console.log("IPFS hashshh", ipfsHash.IpfsHash);

    const res = await execute_raw_transaction(
      api_key,
      auth,
      network_name,
      from,
      to,
      tx_data,
      value
    );

    console.log("🚀 ~ file: index.jsx:61 ~ handleAddPassword ~ res:", res);
  };
  return (
    <ModalComponent modalStatus={[isModalOpen, setModalOpen]}>
      <div className="w-60 h-30">
        <h1 className="text-2xl">Add Password</h1>
        <div className="py-5">
          {" "}
          Site:
          <input
            className=" px-3 border-black"
            type="text"
            placeholder="Site Name"
            onChange={(e) =>
              setSiteURL(e.target.value)
            }
          />
        </div>
        <div className="py-5">
          {" "}
          Username :
          <input
            onChange={(e) =>
              setUsername(e.target.value)
            }
            className=" px-3"
            type="text"
            placeholder="username"
          />
        </div>
        <div className="py-5">
          {" "}
          Password :
          <input
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className=" px-3"
            type="text"
            placeholder="Password"
          />
        </div>
      </div>
      <div className="w-full">
        <button
          onClick={() => setModalOpen(false)}
          className="p-2 rounded-xl text-left float-left bg-red-500"
        >
          cancel
        </button>
        <button
          onClick={handleAddPassword}
          className=" float-right text-right bg-green-500 p-2 rounded-xl"
        >
          Add
        </button>
      </div>
    </ModalComponent>
  );
};

export default Index;
