/* eslint-disable no-undef */
let tried = false;
let new_msg = false;
const abi = [
  "function addKey(string _ipfsHash)",
  "function getMyKeys() view returns (tuple(uint256 id, string ipfsHash, bool isDeleted)[])",
  "function softDeleteKey(uint256 _id)",
  "function updateKey(uint256 _id, string _ipfsHash)",
];
const on_load = () => {
  const username_element =
    document.querySelector("input#email") ||
    document.querySelector("input#loginUsername") ||
    document.querySelector('input[name="email"]') ||
    document.querySelector('input[type="email"]') ||
    document.querySelector('input[name="username"]') ||
    document.querySelector('input[name="userid"]') ||
    document.querySelector('input[name="login"]') ||
    document.querySelector("input#username") ||
    document.querySelector("input#userid") ||
    document.querySelector('input[autocomplete="username"]');
  // console.log(username_element);

  const password_element =
    document.querySelector("input#password") ||
    document.querySelector("input#loginPassword") ||
    document.querySelector('input[type="password"]') ||
    document.querySelector('input[name="password"]') ||
    document.querySelector('input[autocomplete="password"]');

  const button_element =
    document.querySelector('button[type="submit"]') ||
    document.querySelector("#submit") ||
    document.querySelector(".submit");

  let username_value = "";
  let password_value = "";

  const update_inputs = async () => {
    username_value = username_element?.value ?? "";
    password_value = password_element?.value ?? "";
    new_msg = {
      key: "form_update",
      name: "form_update",
      data: {
        body: {
          username: username_value,
          password: password_value,
          website: location.href,
        },
      },
    };
    await chrome.runtime.sendMessage(new_msg);
  };

  const handleSubmit = async () => {
    if (new_msg) {
      const submitData = {
        key: "form_submit",
        name: "form_submit",
        data: new_msg.data,
      };
      const response = await chrome.runtime.sendMessage(submitData);
      console.log("Handeleed Submit", response);
      SaveToPasswordsPopUp();
      // if (response === "Submitted") {
      //     SaveToPasswordsPopUp()
      // }
    }
  };

  password_element?.addEventListener("change", update_inputs);
  password_element?.addEventListener("focus", update_inputs);
  password_element?.addEventListener("keypress", update_inputs);
  username_element?.addEventListener("change", update_inputs);
  username_element?.addEventListener("focus", update_inputs);
  username_element?.addEventListener("keypress", update_inputs);
  button_element?.addEventListener("click", () => handleSubmit());

  if (!username_element) {
    if (!tried) {
      tried = true;
      setTimeout(on_load, 2000);
    }
  }
};

function SaveToPasswordsPopUp() {
  const savePassword = document.createElement("div");
  savePassword.innerHTML = `
    <div style="position:relative;"  id="saveToPass">
    <div style="float: left;">
    <div style="background-color: dodgerblue;">
      <h1>Save To Passwords</h1>
      <div>
        <button style="background-color: red;" id="no-btn">No</button>
        <button style="background-color: green;" id="yes-btn">Yes</button>
        </div>
      </div>
    </div>
`;
  document.body.appendChild(savePassword);
  handleUserChoice();
}
const handleConnectWallet = async () => {
  try {
    if (window?.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Using account: ", accounts[0]);
      const provider = new Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 80001) {
        setLog({
          type: "info",
          message: "Switching to Polygon Mumbai Testnet",
          description: "Please connect to Mumbai Testnet",
        });
        // switch to the polygon testnet
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      }
      console.log("chainId:", chainId);
      setProvider(provider);
      setAccount(accounts[0]);
      const signer = provider.getSigner();
      const contract = new Contract(contractAddress, abi, signer);
      setContract(contract);
      setLog({
        type: "info",
        message: "Wallet connected successfully",
        description: "",
      });
    } else {
      console.log("Please use Web3 enabled browser");
      setLog({
        type: "error",
        message: "Please use Web3 enabled browser",
        description: "",
      });
    }
  } catch (err) {
    console.log("Error connecting wallet", err);
    setLog({
      type: "error",
      message: "Something went wrong while connecting wallet!",
      description: "",
    });
  }
};

function handleUserChoice() {
  const no_btn = document.getElementById("no-btn");
  const yes_btn = document.getElementById("yes-btn");

  async function handleNoBtn() {
    const response = await chrome.runtime.sendMessage({
      key: "NO",
    });
    console.log(response);
    if (response === "NotSaved") {
      document.getElementById("saveToPass").remove();
    }
  }
  async function handleYesBtn() {
    const response = await chrome.runtime.sendMessage({
      key: "YES",
    });
    console.log(response);
    if (response === "Saved") {
      document.getElementById("saveToPass").remove();
    }
  }

  no_btn.addEventListener("click", handleNoBtn);
  yes_btn.addEventListener("click", handleYesBtn);
}

window.onload = () => {
  setTimeout(on_load, 100);
  console.log("window.etgh", window.ethereum);
};
