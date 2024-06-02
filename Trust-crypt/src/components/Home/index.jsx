import Header from "@/components/Header";
import PasswordList from "@/components/PasswordList";
import { useState, useEffect } from "react";
import AddPassword from "@/components/AddPassword";
import EditPassword from "@/components/EditPassword";
import { authenticate, create_wallet } from "../../hooks/useOkto";
import { Button } from "@/components/ui/button";

const VITE_OKTO_API_KEY = import.meta.env.VITE_OKTO_API_KEY;
const VITE_OKTO_OAUTH_ID_TOKEN = import.meta.env.VITE_OKTO_OAUTH_ID_TOKEN;
const VITE_OKTO_PIN = import.meta.env.VITE_OKTO_PIN;

function Index() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [credentials, setCredentials] = useState({});
  const [credentialsArr, setCredentialsArr] = useState([]);
  const [logMessage, setLogMessage] = useState("");
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [editingCredentials, setEditingCredentials] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [authToken, setAuthToken] = useState(null);

  chrome.runtime.onMessage.addListener((data) => {
    console.log("log from opo", data);
  });

  const handleConnectWallet = async () => {
    try {
      const { auth_token, refresh_auth_token, device_token } =
        await authenticate(
          VITE_OKTO_API_KEY,
          VITE_OKTO_OAUTH_ID_TOKEN,
          VITE_OKTO_PIN
        );
      const wallets = await create_wallet(VITE_OKTO_API_KEY, auth_token);
      setWallet(wallets[0]);
      setAuthToken(auth_token);
    } catch (err) {
      console.log("Error connecting wallet", err);
      setLog({
        type: "error",
        message: "Something went wrong while connecting wallet!",
        description: "",
      });
    }
  };
  return (
    <>
      <div className="w-[350px] h-[600px]">
        {!wallet ? (
          <div className="text-center align-middle h-full">
            <Button type="primary" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <Header setIsAddModalOpen={setIsAddModalOpen} />
            <PasswordList setIsEditModalOpen={setIsEditModalOpen} />
            {isAddModalOpen ? (
              <AddPassword
                modalStatus={[isAddModalOpen, setIsAddModalOpen]}
                wallet={wallet}
                authToken={authToken}
              />
            ) : null}
            {isEditModalOpen ? (
              <EditPassword
                modalStatus={[isEditModalOpen, setIsEditModalOpen]}
              />
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
export default Index;
