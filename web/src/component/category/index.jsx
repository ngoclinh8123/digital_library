import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Card, Typography, Space } from "antd";
import SearchInput from "component/common/table/search_input";
import CommonTable from "component/common/table";
import { AddNewBtn, EditBtn, RemoveBtn, ViewBtn } from "component/common/table/buttons";
import PemCheck from "component/common/pem_check";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import Dialog from "./dialog";
import { urls, messages, labels } from "./config";

const PEM_GROUP = "category";
const { Title } = Typography;

export default function Category() {
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

  const getList = () => {
    setLoading(true);
    RequestUtil.apiCall(urls.crud, filter)
      .then((res) => {
        // setPaging((p) => {
        //   return {
        //     page: filter.page,
        //     total: res.data.count,
        //     page_size: res.data.page_size,
        //   };
        // });
        setList(res.data);
      })
      .catch(() => {})
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

  useEffect(() => {
    getList();
  }, [filter]);

  const openDialog = (id = null, action = "view") => {
    dialog.current.loadData(id, action);
  };

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

  const Header = () => {
    return (
      <Space size={12}>
        {/* <Title level={5} style={{ marginBottom: 0 }}>
          {messages.heading}
        </Title> */}
        <PemCheck pem_group={PEM_GROUP} pem="add">
          <AddNewBtn onClick={() => openDialog(null, "add")} />
        </PemCheck>
      </Space>
    );
  };

  const columns = [
    {
      key: "index",
      width: 80,
      title: "STT",
      dataIndex: "index",
    },
    {
      key: "title",
      title: labels.category,
      dataIndex: "title",
      sorter: true,
    },
    {
      key: "action",
      title: "",
      fixed: "right",
      width: 72,
      render: (_text, record) => (
        <div className="flex-space">
          {/* <PemCheck pem_group={PEM_GROUP} pem="view">
            <ViewBtn onClick={() => openDialog(record.id, "view")} />
          </PemCheck> */}
          <PemCheck pem_group={PEM_GROUP} pem="change">
            <EditBtn onClick={() => openDialog(record.id, "change")} />
          </PemCheck>
          <PemCheck pem_group={PEM_GROUP} pem="delete">
            <RemoveBtn onClick={() => onDelete(record.id)} />
          </PemCheck>
        </div>
      ),
    },
  ];
  return (
    <>
      <Card title={<SearchInput onChange={searchList} />} extra={<Header />}>
        <CommonTable
          columns={columns}
          list={list}
          loading={loading}
          scroll={{ x: 1000 }}
          ref={table}
          pem={PEM_GROUP}
          // paging={paging}
          selection={false}
          onChange={handleFilter}
        />
        <Dialog onChange={onChange} ref={dialog} />
      </Card>
    </>
  );
}
