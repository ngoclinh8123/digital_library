import { Modal, Divider, Button, Row, Col, Image, Avatar } from "antd";
import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import { t } from "ttag";
import ProfileSummary from "component/staff/profile/summary";
import UpdateProfile from "component/staff/profile/update_profile";
import ChangePwd from "component/auth/change_pwd";
import { profileDataSt } from "./state";

export default function ModalProfile({ handleOpen, isOpen }) {
  const [profileData, setProfileData] = useRecoilState(profileDataSt);

  return (
    <>
      <Modal open={isOpen} onCancel={handleOpen} footer={null}>
        <Row>
          <Col span={6}>
            {profileData.avatar ? (
              <Image
                width={100}
                height={100}
                src={profileData.avatar}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <Avatar size={100} icon={<UserOutlined />} />
            )}
          </Col>
          <Col span={18}>
            <ProfileSummary {...profileData} />
          </Col>
        </Row>
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
      </Modal>
    </>
  );
}
