import * as React from "react";
import { useEffect, useState } from "react";
import { Divider, Button } from "antd";
import { t } from "ttag";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import PageHeading from "component/common/page_heading";
import RequestUtil from "service/helper/request_util";
import ChangePwd from "component/auth/change_pwd";
import { urls, messages } from "../config";
import ProfileSummary from "./summary";
import UpdateProfile from "./update_profile";

export const emptyProfile = {
    id: 0,
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    title_label: "",
    list_parent: []
};

export default function Profile() {
    const [profileData, setProfileData] = useState(emptyProfile);
    useEffect(() => {
        RequestUtil.apiCall(urls.profile).then((resp) => {
            setProfileData(resp.data);
        });
    }, []);
    return (
        <>
            <PageHeading>
                <>{messages.heading}</>
            </PageHeading>
            <div className="content">
                <ProfileSummary {...profileData} />
                <Divider />
                <Button
                    htmlType="button"
                    type="primary"
                    icon={<UserOutlined />}
                    onClick={() => UpdateProfile.toggle(true, profileData)}
                >
                    {t`Update profile`}
                </Button>
                &nbsp;&nbsp;
                <Button
                    htmlType="button"
                    icon={<KeyOutlined />}
                    onClick={() => ChangePwd.toggle()}
                >
                    {t`Change password`}
                </Button>
                <UpdateProfile onChange={(data) => setProfileData(data)} />
                <ChangePwd />
            </div>
        </>
    );
}

Profile.displayName = "Profile";
