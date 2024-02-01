import config from "../config";
import axios from "axios";
import { Cookie } from "storage-manager-js";

export default class Session {
  constructor() {
    this.sessionName = "session";
  }

  getCurrentSessionHash() {
    return Cookie.has(this.sessionName) ? Cookie.get(this.sessionName) : null;
  }

  saveSession(hash, days = 30) {
    // Set the expires
    let expires = new Date();
    expires.setDate(expires.getDate() + days);

    Cookie.set(this.sessionName, hash, {
      useSecure: false,
      expires: expires,
    });
  }

  validateSession(hash, onState) {
    if (typeof hash !== "string") {
      return false;
    }

    const url = `${config.api.base}/auth/validateSession`;
    const body = { hash };
    axios
      .post(url, body)
      .then(({ data }) => {
        if (data.error) {
          onState(false);
          console.error("SESSION_VALIDATE_ERR: " + data.msg);
        } else {
          onState(true);
        }
      })
      .catch((err) => {
        console.error("SESSION_VALIDATE_ERR: " + err.message || err);
      });
  }
}
