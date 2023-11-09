import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Avatar, Dropdown, Space } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useRecoilState } from "recoil";
import RequestUtil from "service/helper/request_util";
import NavUtil from "service/helper/nav_util";
import { urls } from "src/component/staff/config";
import ModalProfile from "./modal_profile";
import styles from "./styles.module.css";
import { profileDataSt } from "./state";

export default function DropDownProfile() {
  const [profileData, setProfileData] = useRecoilState(profileDataSt);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const logout = NavUtil.logout(navigate);

  const handleOpenModal = () => {
    setIsDropdownOpen(false);
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    RequestUtil.apiCall(urls.profile).then((resp) => {
      setProfileData(resp.data);
    });
  }, []);

  return (
    <Dropdown
      open={isDropdownOpen}
      onOpenChange={setIsDropdownOpen}
      overlay={
        <div className={styles.profile_menu_wrap}>
          <Space className={styles.profile_menu_row_head}>
            <div>
              <Avatar size={48} icon={<UserOutlined />} src={profileData.avatar} />
            </div>
            <div>
              <strong>{profileData.full_name}</strong>
              <h4>{profileData.email}</h4>
            </div>
          </Space>
          <Row className={styles.profile_menu_action}>
            <div onClick={handleOpenModal}>
              <UserOutlined />
              &nbsp;&nbsp;
              <span>Quản lý tài khoản</span>
            </div>
          </Row>
          <ModalProfile handleOpen={handleOpenModal} isOpen={isModalOpen} />
          <Row className={styles.profile_menu_action}>
            <div onClick={logout}>
              <LogoutOutlined />
              &nbsp;&nbsp;
              <span>Đăng xuất </span>
            </div>
          </Row>
        </div>
      }
      trigger={["click"]}
    >
      <Avatar
        size={28}
        icon={<UserOutlined />}
        src={profileData.avatar}
        style={{
          cursor: "pointer",
          marginRight: 20,
        }}
      />
    </Dropdown>
  );
}
