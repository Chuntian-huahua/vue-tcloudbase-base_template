/**
 * 模块化API请求
 * 每次请求需要传递module名称 和 method方法名称
 * 后端接收到后会执行module里面method方法
 */

import CWebHttp from "./c_web_http";
let APIVersion = 1;
let NoAPIVersion = false; //API无分版本
let APIURL = "";
let header = {};

export default {
  /**
   * 设置每次发送请求的请求头
   * @param {object}} headerConfig 请求头
   */
  setHeader(headerConfig) {
    Object.assign(header, headerConfig);
  },
  /**
   * 设置请求的URL
   * @param {string} url 请求的URL
   */
  setRequestUrl(url) {
    APIURL = url;
  },
  /**
   * 取消请求参数带API版本
   * @param {boolean} flag 布尔值
   */
  cancelVersion(flag) {
    NoAPIVersion = flag;
  },
  /**
   * 设置API版本号
   * @param {number} version 请求版本号
   */
  setVersion(version) {
    APIVersion = version;
  },
  /**
   *
   * @param {object} params 请求的参数
   * @param {string} method 请求方法
   * @param {object} cusHeader 请求头
   * @param {number} version API版本号
   */
  async send(params, method, cusHeader = {}, version = null) {
    if (NoAPIVersion === false) {
      if (version == null) {
        version = APIVersion;
      }
      params["version"] = version;
    } else {
      delete params["version"];
    }

    let token = localStorage.getItem("token");
    if (token) {
      params["token"] = token;
    }

    Object.assign(header, cusHeader);
    let requestHeader = new Headers();
    for (let key in header) {
      requestHeader.append(key, header[key]);
    }
    let url = APIURL;
    let body = null;
    if (method === "GET") {
      let paramsStr = [];
      for (let key in params) {
        paramsStr.push(`${key}=${params[key]}`);
      }
      paramsStr = paramsStr.join("&");
      url += "?" + paramsStr;
    } else {
      body = JSON.stringify(params);
    }

    return CWebHttp.send(url, method, requestHeader, body)
      .then((res) => {
        if (res.token) {
          if (
            !localStorage.token ||
            (localStorage.token && localStorage.token !== res.token)
          ) {
            localStorage.token = res.token;
          }
          localStorage.user = JSON.stringify(res.user);
        }
        return res.data;
      });
  },

  /**
   * @param module API模块
   * @param method 模块执行方法
   * @param params 请求带的参数
   * @param header 请求头
   * @param version API版本
   */
  get(module, method, params = {}, header = null, version = 1) {
    params["module"] = module;
    params["method"] = method;
    return this.send(params, "GET", header, version);
  },

  post(module, method, params = {}, header = null, version = 1) {
    params["module"] = module;
    params["method"] = method;
    return this.send(params, "POST", header, version);
  },
};
