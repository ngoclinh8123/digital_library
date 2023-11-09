import { atom } from "recoil";

export const authFlowUsernameSt = atom({
    key: "authFlowUsername",
    default: ""
});

export const authFlowVerifIdSt = atom({
    key: "authFlowVerifId",
    default: ""
});

export const authFlowOtpCodeSt = atom({
    key: "authFlowOtpCode",
    default: ""
});
