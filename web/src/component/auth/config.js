import RequestUtil from "service/helper/request_util";

const urlMap = {
    base: {
        prefix: "account/user",
        endpoints: {
            login: "login",
            signupConfirm: "signup-confirm",
            resetPassword: "reset-password",
            changePassword: "change-password"
        }
    },
    staff: {
        prefix: "account/staff",
        endpoints: {
            profile: "profile"
        }
    },
    verif: {
        prefix: "noti/verif",
        endpoints: {
            check: "check",
            resend: "resend"
        }
    }
};

export const urls = RequestUtil.prefixMapValues(urlMap.base);
export const verifUrls = RequestUtil.prefixMapValues(urlMap.verif);

const headingTxt = "Hồ sơ";
export const messages = {
    heading: headingTxt
};
