import axios from "axios";
import { t } from "ttag";

export const DATE_REABLE_FORMAT = "DD/MM/YYYY";
export const DATE_ISO_FORMAT = "YYYY-MM-DD";

export default class Util {
  /**
   * responseIntercept.
   *
   * @returns {void}
   */
  static responseIntercept() {
    axios.defaults.withCredentials = false;
    axios.defaults.xsrfHeaderName = "X-CSRFToken";
    axios.defaults.xsrfCookieName = "csrftoken";
  }

  /**
   * getValueFromEvent.
   *
   * @param {DOMEvent} e
   * @returns {string}
   */
  static getValueFromEvent(e) {
    const target = e.target;
    return target.value || "";
  }

  /**
   * getCheckedFromEvent.
   *
   * @param {DOMEvent} e
   * @returns {boolean}
   */
  static getCheckedFromEvent(e) {
    const target = e.target;
    return !!target.checked || false;
  }

  /**
   * removeEmptyKey.
   *
   * @param {Object} obj
   * @returns {Object}
   */
  static removeEmptyKey(obj = {}) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (Util.isBlank(value)) result[key] = value;
    }
    return result;
  }

  /**
   * isBlank.
   *
   * @param {number|Object|string} input
   * @returns {boolean}
   */
  static isBlank(input) {
    return typeof input !== "number" && !input;
  }

  /**
   * appendKey.
   *
   * @param {Object[]} list
   * @returns {Object[]}
   */
  static appendKey(list, page = 0, page_size = 0) {
    return list.map((item, index) => {
      if (item.id !== undefined) {
        item.key = item.id;
      } else {
        item.key = index;
      }
      item.index = (page - 1) * page_size + index + 1;
      return item;
    });
  }

  /**
   * isEmpty.
   *
   * @param {Object} obj
   * @returns {boolean}
   */
  static isEmpty(obj) {
    if (!obj) return true;
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  /**
   * appendIdForGroupOptions.
   *
   * @param {Object[]} groups
   * @returns {Object[]}
   */
  static appendIdForGroupOptions(groups) {
    return groups.map((group) => {
      group.options = group.options.map((option) => {
        option.value = [group.value, option.value].join("|");
        return option;
      });
      return group;
    });
  }

  /**
   * getDialogTitle.
   *
   * @param {number} id
   * @param {Object} messages
   * @returns {string}
   */
  static getDialogTitle(id, messages) {
    const action = id ? t`Update` : t`Add new`;
    const subject = messages.heading.toLowerCase();
    return `${action} ${subject}`;
  }

  /**
   * dateFromStr.
   *
   * @param {string} strDate
   * @returns {Date}
   */
  static strToDate(strDate) {
    try {
      return new Date(strDate);
    } catch (_e) {
      return null;
    }
  }

  /**
   * dateFormat.
   *
   * @param {string} strDate
   * @returns {string}
   */
  static dateFormat(strDate) {
    if (!strDate) return strDate;
    if (strDate.includes("T")) {
      strDate = strDate.split("T")[0];
    }
    try {
      return strDate.split("-").reverse().join("/");
    } catch (_err) {
      return strDate;
    }
  }

  /**
   * dateFormat.
   *
   * @param {string} strDate
   * @returns {string}
   */
  static isoToReadableDatetimeStr(strDate) {
    if (!strDate) return strDate;
    if (!strDate.includes("T")) return strDate;
    const dateArr = strDate.split("T");
    let datePart = dateArr[0];
    let timePart = dateArr[1];
    try {
      datePart = datePart.split("-").reverse().join("/");
      timePart = timePart.split(":");
      timePart.pop();
      timePart = timePart.join(":");
      return datePart + " " + timePart;
    } catch (_err) {
      return strDate;
    }
  }

  /**
   * dateStrReadableToIso.
   *
   * @param {string} dateStr
   * @returns {string}
   */
  static dateStrReadableToIso(dateStr) {
    return dateStr.split("/").reverse().join("-");
  }

  /**
   * ensurePk.
   *
   * @param {string | number} rawPk
   * @returns {number}
   */
  static ensurePk(rawPk) {
    rawPk = String(rawPk);
    if (rawPk.includes("_")) {
      return parseInt(rawPk.split("_")[1]);
    }
    return parseInt(rawPk);
  }

  static get event() {
    return {
      /**
       * listen.
       *
       * @param {string} eventName
       * @param {function} callback
       * @returns {void}
       */
      listen: (eventName, callback) => {
        window.document.addEventListener(eventName, callback, false);
      },

      /**
       * remove.
       *
       * @param {string} eventName
       * @param {function} callback
       * @returns {void}
       */
      remove: (eventName, callback) => {
        window.document.removeEventListener(eventName, callback, false);
      },

      /**
       * dispatch.
       *
       * @param {string} eventName
       * @param {Object | boolean | string | number} detail
       * @returns {void}
       */
      dispatch: (eventName, detail) => {
        const event = new CustomEvent(eventName, { detail });
        window.document.dispatchEvent(event);
      },
    };
  }

  /**
   * toggleGlobalLoading.
   *
   * @param {boolean} spinning
   * @returns {void}
   */
  static toggleGlobalLoading(spinning = true) {
    Util.event.dispatch("TOGGLE_SPINNER", spinning);
  }
}
