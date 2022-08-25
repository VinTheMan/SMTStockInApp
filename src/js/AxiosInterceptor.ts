import { App } from "vue";
import { ipcRenderer } from "electron";
import axios from "axios";
import { networkInterfaces } from "os";
const nets: any = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

async function refreshAccessToken() {
  let nrName = "";
  for (const name of Object.keys(nets)) {
    // get the ipv4 address of this computer
    for (const nr of nets[name]) {
      // find self ipv4 address
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof nr.family === "string" ? "IPv4" : 4;
      if (nr.family === familyV4Value && !nr.internal) {
        if (!results[name]) {
          results[name] = [];
        } // if
        results[name].push(nr.address);

        if (nrName === "") {
          nrName = name;
        } // if
      } // if
    } // for
  } // for

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  axios
    .post(
      sessionStorage.getItem("apiURL") + "/registerUserByIP",
      {
        name: results[nrName][0],
        password: results[nrName][0],
      },
      { headers: headers }
    )
    .then(async function (response) {
      sessionStorage.setItem(
        "apiKey",
        await ipcRenderer.invoke("EncryptApiToken", response.data.token)
      );

      return response.data.token;
    })
    .catch((error) => console.log(error));
} // refreshAccessToken

// Request interceptor for API calls
const axiosApiInstance = axios.create();
axiosApiInstance.interceptors.request.use(
  async (config) => {
    const encryptedToken = sessionStorage.getItem("apiKey");
    const decryptString = await ipcRenderer.invoke(
      "DecryptApiToken",
      encryptedToken
    );
    config.headers = {
      Authorization: `Bearer ${decryptString}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    console.log(error); // test
    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const access_token = await refreshAccessToken();
      axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;
      return axiosApiInstance(originalRequest);
    } // if
    return Promise.reject(error);
  }
);

export default {
  install: (app: App): void => {
    app.config.globalProperties.axios = axiosApiInstance;
  },
};
