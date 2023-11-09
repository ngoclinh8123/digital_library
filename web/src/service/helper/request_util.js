import axios from "axios";
import Util from "service/helper/util";
import NavUtil from "service/helper/nav_util";
import StorageUtil from "service/helper/storage_util";
import { PROTOCOL, DOMAIN, API_PREFIX } from "src/consts";

export default class RequestUtil {
  /**
   * Prepare JSON payload for HTTP request
   * @param {Object} data
   * @returns {Object}
   */
  static getJsonPayload(data) {
    return {
      data: data,
      "Content-Type": "application/json",
    };
  }

  /**
   * Prepare FormData payload for HTTP request
   * @param {Object} data
   * @returns {Object}
   */
  static getFormDataPayload(data) {
    const formData = new FormData();
    for (const key in data) {
      const value = data[key];
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
      } else {
        formData.set(key, value);
      }
    }
    return {
      data: formData,
      "Content-Type": "",
    };
  }

  /**
   * Check if any key of a map contains file
   * @param {Object} data
   * @returns {boolean}
   */
  static fileInObject(data) {
    return !!Object.values(data).filter((item) => item instanceof Blob).length;
  }

  /**
   * Prepare payload for axios, if method is not POST or PUT
   *  Append it to a map with params key
   * @param {string} method
   * @param {Object} data
   * @returns {Object}
   */
  static convertParams(method, data) {
    if (["post", "put"].includes(method.toLowerCase())) return data;
    return { params: data };
  }

  /**
   * Make a HTTP request using Axios, do not check for refreshing token
   * @param {string} url
   * @param {Object} params
   * @param {string} method - method: get, post, put, delete
   * @returns {Promise} Axios response promise
   */
  static async request(
    url,
    params = {},
    method = "get",
    blobResponseType = false
  ) {
    const { data, "Content-Type": contentType } = RequestUtil.fileInObject(
      params
    )
      ? RequestUtil.getFormDataPayload(params)
      : RequestUtil.getJsonPayload(params);

    const token = StorageUtil.getToken();
    const config = {
      method,
      baseURL: RequestUtil.getApiBaseUrl(),
      url,
      headers: {
        Authorization: token ? `JWT ${token}` : undefined,
        "Content-Type": contentType,
        "Accept-Language": StorageUtil.getStorageStr("locale"),
      },
    };
    if (blobResponseType) {
      config.responseType = "blob";
    }
    if (!Util.isEmpty(params) && method === "get") {
      const query = new URLSearchParams(params).toString();
      config.url = [config.url, query].join("?");
    } else {
      config.data = RequestUtil.convertParams(method, data);
    }
    return await axios(config);
  }

  /**
   * Make a HTTP request using Axios, checking for refreshing token also
   * @param {string} url
   * @param {Object} params
   * @param {string} method - method: get, post, put, delete
   * @returns {Promise} Axios response promise
   */
  static async apiCall(
    url,
    params = {},
    method = "get",
    blobResponseType = false
  ) {
    const emptyError = {
      response: {
        data: {},
      },
    };
    try {
      return await RequestUtil.request(url, params, method, blobResponseType);
    } catch (err) {
      if (err.response.status === 401) {
        const refreshUrl = "account/user/refresh-token/";
        const checkUrl = "account/user/refresh-check/";
        try {
          const refreshTokenResponse = await RequestUtil.request(
            refreshUrl,
            { refresh_token: StorageUtil.getRefreshToken() },
            "POST"
          );
          const token = refreshTokenResponse.data.token;
          StorageUtil.setToken(token);

          try {
            return await RequestUtil.request(url, params, method);
          } catch (err) {
            if (err.response.status === 401) {
              // Logout
              NavUtil.cleanAndMoveToLoginPage();
              return Promise.reject(emptyError);
            }
            // Return error
            return Promise.reject(err);
          }
        } catch (err) {
          console.log(err);
          RequestUtil.request(checkUrl).catch(() => {
            // Logout
            NavUtil.cleanAndMoveToLoginPage();
            return Promise.reject(emptyError);
          });
        }
      }
      // Return error
      return Promise.reject(err);
    }
  }

  /**
   * setFormErrors.
   *
   * @param {Dict} errors
   * @returns {FormikErrorDict}
   */
  static setFormErrors(errors) {
    return Object.entries(errors)
      .map(([key, value]) => [key, Util.errorFormat(value)])
      .filter((item) => !!item[1].length)
      .reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {});
  }

  /**
   * errorFormat.
   *
   * @param {string | number | Dict | string[]} input
   * @returns {string[]}
   */
  static errorFormat(input) {
    if (!input) return [];
    if (typeof input === "string") return [input];
    if (Array.isArray(input))
      return input.filter((item) => item).map((item) => item.toString());
    return [];
  }

  /**
   * getApiBaseUrl.
   *
   * @returns {string}
   */
  static getApiBaseUrl() {
    return PROTOCOL + DOMAIN + API_PREFIX;
  }

  /**
   * prefixMapValues.
   *
   * @param {Object} input
   * @param {string} input.prefix
   * @param {Object} input.endpoints
   * @returns {Object}
   */
  static prefixMapValues({ prefix, endpoints }) {
    const result = {};
    for (const key in endpoints) {
      const value = endpoints[key];
      result[key] = [prefix, value].join("/");
      if (result[key][result[key].length - 1] !== "/") {
        result[key] += "/";
      }
    }
    return result;
  }

  /**
   * handleDownload.
   *
   * @param {Object} data
   * @param {string} filename
   * @returns {Object}
   */
  static handleDownload(data, filename) {
    const url = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
  }
}
