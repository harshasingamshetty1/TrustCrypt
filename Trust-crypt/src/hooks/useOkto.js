import axios from "axios";

// 1. Call `/api/v1/authenticate` endpoint to get an access token
export async function authenticate(api_key, idToken, pin) {
  // console.log("authenticate", api_key, idToken, pin);
  let { data: authData } = await axios.post(
    `https://3p-bff.oktostage.com/api/v1/authenticate`,
    {
      id_token: idToken,
    },
    {
      headers: {
        "x-api-key": api_key,
      },
    }
  );
  const token = authData.data.token;
  // user signup flow
  if (token) {
    console.log("from if");
    const { data } = await axios.post(
      `https://3p-bff.oktostage.com/api/v1/set_pin`,
      {
        id_token: idToken,
        token: token,
        relogin_pin: pin,
        purpose: "set_pin",
      },
      {
        headers: {
          "x-api-key": api_key,
        },
      }
    );
    // console.log("IF", data);
    const { auth_token, refresh_auth_token, device_token } = data.data;
    return { auth_token, refresh_auth_token, device_token };
  }
  // console.log("authData", authData);
  // user login flow
  const { auth_token, refresh_auth_token, device_token } = authData.data;
  return { auth_token, refresh_auth_token, device_token };
}

// 3. Call `/api/v1/wallet` endpoint to create wallet
export async function create_wallet(api_key, auth) {
  const { data } = await axios.post(
    `https://3p-bff.oktostage.com/api/v1/wallet`,
    {},
    {
      headers: {
        "x-api-key": api_key,
        authorization: `Bearer ${auth}`,
      },
    }
  );
  //   console.log(data.data);
  const { wallets } = data.data;
  return wallets;
}

export async function execute_raw_transaction(
  api_key,
  auth,
  network_name,
  from,
  to,
  tx_data,
  value
) {
  const { data } = await axios.post(
    `https://3p-bff.oktostage.com/api/v1/rawtransaction/execute`,
    {
      network_name: network_name,
      transaction: {
        from: from,
        to: to,
        data: tx_data,
        value: value,
      }, // raw transaction
    },
    {
      headers: {
        "x-api-key": api_key,
        authorization: `Bearer ${auth}`,
      },
    }
  );
  return data;
}
