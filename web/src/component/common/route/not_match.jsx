import * as React from "react";
import { Result, Button } from "antd";
import { HomeFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

export default function NotMatch() {
    return (
        <Result
            status="404"
            title="404"
            subTitle="Xin lỗi bạn, trang này không tồn tại"
            extra={
                <Link to="/">
                    {" "}
                    <Button type="primary" icon={<HomeFilled />}>
                        Quay lại trang chủ
                    </Button>
                </Link>
            }
        />
    );
}

NotMatch.displayName = "NotMatch";
