import axios from "axios";
import config from "./config";
import Session from "./Utils/Session";

const session = new Session();

export default function request(path, method, payloads = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = `${config.api.base}${path}`;
    axios({
      url: url,
      method,
      data: payloads,
      headers: {
        ...headers,
        "X-Token": session.getCurrentSessionHash(),
      },
    })
      .then(({ data }) => {
        if (data.error) {
          reject(data.msg);
        } else {
          resolve(data);
        }
      })
      .catch((err) => reject(err.message || err));
  });
}
