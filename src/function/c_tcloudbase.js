import tcb from "tcb-js-sdk";
let TCB = null;
let isAllowCloudRequest = false;
let tabConfig = {
  env: "",
};

export default {
  init(config) {
    Object.assign(tabConfig, config);
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    TCB = tcb.init(tabConfig);
    TCB.auth().signInAnonymously();
  },
  setConfig(config) {
    Object.assign(tabConfig, config);
  },
  setEnv(envId) {
    tabConfig.env = env;
  },
  openRequest(flag) {
    isAllowCloudRequest = flag;
  },
  async callFunction(name, module, method, data = {}, params = {}) {
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    if (isAllowCloudRequest === false) {
      throw "未允许云开发请求";
    }
    if (!name) {
      throw "调用云函数：缺少云函数名称";
    }
    if (!module) {
      throw "调用云函数：缺少云函数模块名称";
    }
    if (!method) {
      throw "调用云函数：缺少云函数模块被执行方法名称";
    }
    Object.assign(data, {
      module,
      method,
    });
    Object.assign(params, {
      name,
      data,
    });
    let functionResult = await TCB.callFunction(params);
    if (
      functionResult.result &&
      functionResult.result.hasOwnProperty("error")
    ) {
      return Promise.reject(functionResult.result);
    } else {
      return Promise.resolve(functionResult.result);
    }
  },
  async uploadFile(
    file,
    cloudPath = "temp/",
    onUploadProgress = null,
    fileName = null
  ) {
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    if (isAllowCloudRequest === false) {
      throw "未允许云开发请求";
    }
    let fileNameExtension = file.name.substr(file.name.lastIndexOf("."));
    let fullFileName = `${fileName}${fileNameExtension}`;
    if (!fileName) {
      fileName = Math.round(Math.random() * 10000) + String(Date.now());
      fullFileName = `${fileName}${fileNameExtension}`;
    }
    let params = {
      cloudPath: cloudPath + fullFileName,
      filePath: file,
    };
    if (onUploadProgress) {
      params["onUploadProgress"] = onUploadProgress;
    }
    file = await TCB.uploadFile(params);
    let fileId = file.fileID;
    let files = await this.getTempFile(fileId);
    return files[0];
  },
  async getTempFile(fileList, maxAge = 2700) {
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    if (isAllowCloudRequest === false) {
      throw "未允许云开发请求";
    }
    if (typeof fileList === "string") {
      fileList = [
        {
          fileID: fileList,
          maxAge,
        },
      ];
    }
    fileList.forEach((item) => {
      item = {
        fileId: item,
        maxAge,
      };
    });
    let files = await TCB.getTempFileURL({
      fileList,
    });
    return files["fileList"];
  },
  async deleteFile(fileList) {
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    if (isAllowCloudRequest === false) {
      throw "未允许云开发请求";
    }
    if (typeof fileList === "string") {
      fileList = [fileList];
    }
    return await TCB.deleteFile({
      fileList,
    });
  },
  async database(cb) {
    if (!tabConfig.env) {
      throw "云开发环境ID不存在";
    }
    if (isAllowCloudRequest === false) {
      throw "未允许云开发请求";
    }
    const DB = TCB.database();
    cb(DB, tcb);
  },
};
