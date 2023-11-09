import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Typography,
  Space,
  Avatar,
  Tag,
  Dropdown,
  Checkbox,
  Select,
} from "antd";
import {
  BookOutlined,
  SelectOutlined,
  FilterOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { t } from "ttag";
import SearchInput from "component/common/table/search_input";
import CommonTable from "component/common/table";
import { AddNewBtn } from "component/common/table/buttons";
import PemCheck from "component/common/pem_check";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import Dialog from "./dialog";
import { urls, messages, labels } from "./config";
import { STATUS_CHOICES, STATUS_COLOR } from "./const";
import styles from "./manage.module.css";

const PEM_GROUP = "";

const getTag = (status) => {
  const choice = STATUS_CHOICES.find((choice) => choice[0] == status) || [];
  const title = choice[1];
  const color = STATUS_COLOR[choice[0]];
  return choice && <Tag color={color}>{title}</Tag>;
};

export default function Manage() {
  const table = useRef();
  const dialog = useRef();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ page: 1, status: [] });
  const [selectValue, setSelectValue] = useState("ALL");
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
        setPaging((p) => {
          return {
            page: filter.page,
            total: res.data.count,
            page_size: res.data.page_size,
          };
        });
        setList(res.data.items);
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

  const openDialog = (id = null) => {
    dialog.current.loadData(id);
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

  const onChangeFilter = (value) => {
    if (value === "ALL") {
      if ("status" in filter) {
        const { status, ...newFilter } = filter;
        setFilter(newFilter);
      }
    } else {
      handleFilter({ status: value });
    }
    setSelectValue(value);
  };

  const onChangeSelect = (value) => {
    console.log(value);
  };

  useEffect(() => {
    getList();
  }, [filter]);

  const Header = () => {
    return (
      <Space size={12}>
        <PemCheck pem_group={PEM_GROUP} pem="add">
          <AddNewBtn onClick={() => openDialog(null)} />
        </PemCheck>
      </Space>
    );
  };

  const Filter = () => {
    return (
      <div className={styles.filter_wrap}>
        <Select
          defaultValue={selectValue}
          style={{
            width: 140,
          }}
          onChange={onChangeFilter}
          options={[
            {
              value: "ALL",
              label: "Tất cả",
            },
            {
              value: "REQUESTED",
              label: t`Requested`,
            },
            {
              value: "APPROVED",
              label: t`Approved`,
            },
            {
              value: "BORROWED",
              label: t`Borrowed`,
            },
            {
              value: "RETURNED",
              label: t`Returned`,
            },
            {
              value: "OVER_DUE",
              label: t`Over_due`,
            },
          ]}
        />
      </div>
    );
  };

  const columns = [
    {
      key: "index",
      width: 45,
      title: "STT",
      dataIndex: "index",
    },
    {
      key: "user",
      title: labels.reader,
      width: 200,
      dataIndex: "user",
      sorter: true,
      render: (_text, record) => (
        <div>
          <div className="">Tên: {record.user.full_name}</div>
          <div className="">Sđt: {record.user.phone_number}</div>
          <div className="">Địa chỉ: {record.user.address}</div>
        </div>
      ),
    },
    {
      key: "location",
      width: 280,
      title: labels.book_consumer,
      dataIndex: "location",
      sorter: true,
      render: (_text, record) => (
        <div style={{ display: "flex" }}>
          <div>
            {record.book_item.book.thumbnail ? (
              <img
                src={record.book_item.book.thumbnail}
                style={{ width: "60px" }}
              />
            ) : (
              <Avatar shape="square" size={60} icon={<BookOutlined />} />
            )}
          </div>
          <div style={{ marginLeft: "12px" }}>
            <div className="">Tên sách: {record.book_item.book.title}</div>
            <div className="">Mã sách: {record.book_item.barcode}</div>
            <div className="">{`Tầng: ${record.book_item.rack.number} / Tủ số: ${record.book_item.rack.location}`}</div>
          </div>
        </div>
      ),
    },
    {
      key: "request_at",
      title: "Ngày yêu cầu",
      dataIndex: "request_at",
      sorter: true,
      render: (_text, record) => (
        <span>{Util.isoToReadableDatetimeStr(record.request_at)}</span>
      ),
      width: 120,
    },
    {
      key: "approve_at",
      title: "Ngày chấp thuận",
      dataIndex: "approve_at",
      sorter: true,
      render: (_text, record) => (
        <span>{Util.isoToReadableDatetimeStr(record.approve_at)}</span>
      ),
      width: 120,
    },
    {
      key: "borrow_at",
      title: "Ngày mượn",
      dataIndex: "borrow_at",
      sorter: true,
      render: (_text, record) => (
        <span>{Util.isoToReadableDatetimeStr(record.borrow_at)}</span>
      ),
      width: 120,
    },
    {
      key: "due_date",
      title: "Dự kiến trả",
      dataIndex: "due_date",
      sorter: true,
      render: (_text, record) => (
        <span>{Util.isoToReadableDatetimeStr(record.due_date)}</span>
      ),
      width: 120,
    },
    {
      key: "status",
      width: 160,
      title: "Trạng thái",
      dataIndex: "status",
      sorter: true,
      render: (_text, record) => <span>{getTag(record.status)}</span>,
      // render: (_text, record) => <SelectStatus status={record.status} />,
    },
    {
      key: "action",
      title: "",
      fixed: "right",
      width: 36,
      render: (_text, record) => (
        <div className="flex">
          {/* <Link title="Xem chi tiết" to={`/manages/${record.id}`}>
            <SelectOutlined />
          </Link> */}

          <Dropdown
            overlay={
              <div className={styles.action_container}>
                <Link
                  title="Xem chi tiết"
                  to={`/manages/${record.id}`}
                  style={{ color: "black", display: "block" }}
                  className={styles.action_row}
                >
                  Xem chi tiết
                </Link>
                <div
                  className={styles.action_row}
                  onClick={() => openDialog(record.id)}
                >
                  <span>Đổi trạng thái</span>
                </div>
              </div>
            }
          >
            <SettingOutlined style={{ cursor: "pointer" }} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div style={{ display: "flex" }}>
            <SearchInput onChange={searchList} />
            <Filter />
          </div>
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
