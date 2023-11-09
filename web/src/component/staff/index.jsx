import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useSetRecoilState } from "recoil";
import { Card, Typography, Space, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import SearchInput from "component/common/table/search_input";
import CommonTable from "component/common/table";
import { AddNewBtn, EditBtn, RemoveBtn } from "component/common/table/buttons";
import PemCheck from "component/common/pem_check";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import Dialog from "./dialog";
import { staffOptionsSt } from "./states";
import { urls, labels, messages } from "./config";
const PEM_GROUP = "staff";
const { Title } = Typography;

export default function Staff() {
  const table = useRef();
  const dialog = useRef();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ page: 1 });
  const [paging, setPaging] = useState({
    page: filter.page,
    total: 0,
    page_size: 15,
  });
  const [list, setList] = useState([]);
  const setStaffOptions = useSetRecoilState(staffOptionsSt);
  const getList = () => {
    setLoading(true);
    RequestUtil.apiCall(urls.crud, filter)
      .then((res) => {
        setPaging((p) => {
          return {
            page: filter.page,
            total: res.data.count,
            page_size: res.data.page_size,
          };
        });
        setList(res.data.items);
        setStaffOptions(res.data.extra.options);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const searchList = (keyword) => {
    handleFilter({ search: keyword, page: 1 });
  };
  const handleFilter = (model = {}) => {
    setFilter((n) => {
      return { ...n, ...model };
    });
  };

  useEffect(() => {
    getList();
  }, [filter]);

  const onDelete = (id) => {
    const r = window.confirm(messages.deleteOne);
    if (!r) return;
    Util.toggleGlobalLoading(true);
    RequestUtil.apiCall(`${urls.crud}${id}`, {}, "delete")
      .then(() => {
        setList([...list.filter((item) => item.id !== id)]);
      })
      .finally(() => Util.toggleGlobalLoading(false));
  };

  const onBulkDelete = (ids) => {
    const r = window.confirm(messages.deleteMultiple);
    if (!r) return;

    Util.toggleGlobalLoading(true);
    RequestUtil.apiCall(`${urls.crud}?ids=${ids.join(",")}`, {}, "delete")
      .then(() => {
        setList([...list.filter((item) => !ids.includes(item.id))]);
      })
      .finally(() => Util.toggleGlobalLoading(false));
  };

  const onChange = (data, id) => {
    if (!id) {
      setList([{ ...data, key: data.id }, ...list]);
    } else {
      const index = list.findIndex((item) => item.id === id);
      data.key = data.id;
      list[index] = data;
      setList([...list]);
    }
  };

  const columns = [
    {
      key: "index",
      title: "STT",
      dataIndex: "index",
      width: 64,
    },
    {
      key: "title",
      width: 80,
      title: "",
      dataIndex: "title",
      sorter: true,
      render: (_text, record) => (
        <div>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
        </div>
      ),
    },
    {
      key: "full_name",
      width: 160,
      title: labels.full_name,
      dataIndex: "full_name",
      sorter: true,
    },
    {
      key: "email",
      width: 240,
      title: labels.email,
      dataIndex: "email",
      sorter: true,
    },
    {
      key: "phone_number",
      width: 200,
      title: labels.phone_number,
      dataIndex: "phone_number",
      sorter: true,
    },
    {
      key: "address",
      width: 320,
      title: labels.address,
      dataIndex: "address",
      sorter: true,
    },
    {
      key: "action",
      title: "",
      fixed: "right",
      width: 72,
      render: (_text, record) => (
        <div className="flex">
          <PemCheck pem_group={PEM_GROUP} pem="change">
            <EditBtn onClick={() => openDialog(record.id)} />
          </PemCheck>
          <PemCheck pem_group={PEM_GROUP} pem="delete">
            <RemoveBtn onClick={() => onDelete(record.id)} />
          </PemCheck>
        </div>
      ),
    },
  ];
  const openDialog = (id = null) => {
    dialog.current.loadData(id);
  };
  const Header = () => {
    return (
      <Space size={12}>
        {/* <Title level={5} style={{ marginBottom: 0 }}>
          {messages.heading}
        </Title> */}
        <PemCheck pem_group={PEM_GROUP} pem="add">
          <AddNewBtn onClick={() => openDialog()} />
        </PemCheck>
      </Space>
    );
  };
  return (
    <>
      <Card
        title={
          <SearchInput
            onChange={searchList}
            placeholder="Tìm kiếm theo tên người dùng"
          />
        }
        extra={<Header />}
      >
        <CommonTable
          columns={columns}
          list={list}
          loading={loading}
          scroll={{ x: 1000 }}
          ref={table}
          pem={PEM_GROUP}
          paging={paging}
          selection={false}
          onChange={handleFilter}
        />
        <Dialog onChange={onChange} ref={dialog} />
      </Card>
    </>
  );
}

Staff.displayName = "Staff";
