export default {
  send(url, method = "GET", headers = null, body = null) {
    return new Promise((resolve, reject) => {
      let status = 0;
      method = method.toUpperCase();
      let requestInit = { method };
      if (headers) {
        for (let key in headers) {
          requestInit["headers"][key] = headers[key];
        }
      }
      if (body instanceof FormData || (body && Object.keys(body).length > 0)) {
        requestInit["body"] = body;
      }

      fetch(url, requestInit)
        .then((res) => {
          status = res.status;
          if (status === 204) {
            return {
              _status: 204,
            };
          }
          return res.json();
        })
        .then((res) => {
          if (status > 199 && status < 300) {
            return resolve({
              _status: status,
              ...res,
            });
          }
          return reject({
            _status: status,
            errors: res.errors,
          });
        })
        .catch((err) => {
          return reject(err);
        });
    });
  },
  get(url, headers = {}) {
    return this.send(url, "GET", headers);
  },
  post(url, body = {}, headers = {}) {
    return this.send(url, "POST", headers, body);
  },
  delete(url, headers = {}) {
    return this.send(url, "DELETE", headers);
  },
  put(url, body = {}, headers = {}) {
    return this.send(url, "PUT", headers, body);
  },
  patch(url, body = {}, headers = {}) {
    return this.send(url, "PATCH", headers, body);
  },
};
