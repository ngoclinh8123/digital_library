import StorageUtil from "service/helper/storage_util";

export default class PemUtil {
    static hasPermit(pem_group, pem = "view") {
        try {
            const permissions = StorageUtil.getPermissions();
            return permissions[pem_group].includes(pem);
        } catch (_e) {
            return false;
        }
    }

    static canView(pem_groups) {
        try {
            if (typeof pem_groups === "string") {
                pem_groups = [pem_groups];
            }
            const permissions = StorageUtil.getPermissions();
            for (const pem_group of pem_groups) {
                if (permissions[pem_group].includes("view")) {
                    return true;
                }
            }
            return false;
        } catch (_e) {
            return false;
        }
    }
}
