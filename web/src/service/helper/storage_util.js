import { LOCAL_STORAGE_PREFIX } from "src/consts";

export default class StorageUtil {
    /**
     * setStorage.
     *
     * @param {string} key
     * @param {string | Dict} value
     * @returns {void}
     */
    static setStorage(key, value) {
        try {
            localStorage.setItem(
                LOCAL_STORAGE_PREFIX + "_" + key,
                JSON.stringify(value)
            );
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * setStorageObj.
     *
     * @param {Object} input
     * @returns {void}
     */
    static setStorageObj(input) {
        for (const key in input) {
            const value = input[key];
            StorageUtil.setStorage(key, value);
        }
    }

    /**
     * getStorageObj.
     *
     * @param {string} key
     * @returns {Object}
     */
    static getStorageObj(key) {
        try {
            const value = StorageUtil.parseJson(
                localStorage.getItem(LOCAL_STORAGE_PREFIX + "_" + key)
            );
            if (value && typeof value === "object") {
                return value;
            }
            return {};
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    /**
     * getStorageStr.
     *
     * @param {string} key
     * @returns {string}
     */
    static getStorageStr(key) {
        try {
            const value = StorageUtil.parseJson(
                localStorage.getItem(LOCAL_STORAGE_PREFIX + "_" + key)
            );
            if (!value || typeof value === "object") {
                return "";
            }
            return String(value);
        } catch (error) {
            return "";
        }
    }

    /**
     * getToken.
     *
     * @returns {string}
     */
    static getToken() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.token || "";
    }

    /**
     * setToken.
     *
     * @param {string} token
     * @returns {void}
     */
    static setToken(token) {
        const authData = StorageUtil.getStorageObj("auth");
        authData["token"] = token;
        StorageUtil.setStorage("auth", authData);
    }

    /**
     * getRefreshToken.
     *
     * @returns {string}
     */
    static getRefreshToken() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.refresh_token || "";
    }

    /**
     * getUserType.
     *
     * @returns {string}
     */
    static getUserType() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.user_type || "";
    }

    /**
     * getAuthId.
     *
     * @returns {number}
     */
    static getAuthId() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.id;
    }

    /**
     * removeStorage.
     *
     * @param {string} key
     * @returns {void}
     */
    static removeStorage(key) {
        localStorage.removeItem(LOCAL_STORAGE_PREFIX + "_" + key);
    }

    /**
     * parseJson.
     *
     * @param {string} input
     * @returns {string}
     */
    static parseJson(input) {
        try {
            return JSON.parse(input);
        } catch (error) {
            return String(input);
        }
    }

    /**
     * getVisibleMenus.
     *
     * @returns {string[]}
     */
    static getVisibleMenus() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.visible_menus || [];
    }

    /**
     * getPermissions.
     *
     * @returns {string[]}
     */
    static getPermissions() {
        const authObj = StorageUtil.getStorageObj("auth");
        return authObj.permissions || {};
    }
}
