import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { Card, Typography, Space, Avatar } from "antd";
import {
  BookOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import SearchInput from "component/common/table/search_input";
import CommonTable from "component/common/table";
import PemCheck from "component/common/pem_check";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import Dialog from "./dialog";
import BookItem from "./book_item";
import { Author, CategoryTag } from "./dialog/book_view";
import {
  AddNewBtn,
  EditBtn,
  RemoveBtn,
  ViewBtn,
} from "component/common/table/buttons";
import { urls, labels, messages, languages } from "./config";
import styles from "./book.module.css";
const PEM_GROUP = "book";
const { Title } = Typography;

const formatLanguage = (item) => {
  let result = "Tiếng Việt";
  for (let i = 0; i < languages.length; i++) {
    if (item == languages[i].value) {
      result = languages[i].label;
    }
  }
  return result;
};

export default function Book() {
  const table = useRef();
  const dialog = useRef();
  const book_item = useRef();
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

  useEffect(() => {
    getList();
    // setList(Data);
    // setLoading(false);
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
      width: 45,
      title: "STT",
      dataIndex: "index",
    },
    {
      key: "title",
      width: 240,
      title: labels.title,
      dataIndex: "title",
      sorter: true,
      render: (_text, record) => (
        <div className={styles.item_title_wrap}>
          {record.thumbnail ? (
            <img src={record.thumbnail} style={{ width: "64px" }} />
          ) : (
            <Avatar
              shape="square"
              size={64}
              icon={<BookOutlined />}
              src={record.thumbnail}
            />
          )}

          <div className={styles.item_title}>{record.title}</div>
        </div>
      ),
    },
    {
      key: "author",
      width: 200,
      title: labels.author,
      dataIndex: "author",
      sorter: true,
      render: (_text, record) => <Author book={record} />,
    },
    {
      key: "publisher",
      width: 200,
      title: labels.publisher,
      dataIndex: "publisher",
      sorter: true,
    },
    {
      key: "language",
      width: 120,
      title: labels.language,
      dataIndex: "language",
      sorter: true,
      render: (_text, record) => <span>{formatLanguage(record.language)}</span>,
    },
    {
      key: "categories",
      width: 160,
      title: labels.category,
      dataIndex: "categories",
      sorter: true,
      render: (_text, record) => <CategoryTag book={record} />,
    },
    {
      key: "total_available_book_items",
      title: labels.total_available_book_items,
      dataIndex: "total_available_book_items",
      render: (_text, record) => (
        <span>{`${record.total_available_book_items} / ${record.total_book_items}`}</span>
      ),
      width: 90,
    },
    {
      key: "is_available",
      width: 100,
      title: labels.is_available,
      dataIndex: "is_available",
      render: (_text, record) => (
        <span>
          {record.is_available ? (
            <CheckCircleOutlined style={{ color: "green" }} />
          ) : (
            <CloseCircleOutlined style={{ color: "red" }} />
          )}
        </span>
      ),
    },
    {
      key: "action",
      width: 90,
      title: "",
      fixed: "right",
      render: (_text, record) => (
        <div className="">
          <PemCheck pem_group={PEM_GROUP} pem="view">
            <ViewBtn onClick={() => openDialog(record.id, "view")} />
          </PemCheck>
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
  const openDialog = (id = null, action = "view") => {
    dialog.current.loadData(id, action);
  };

  const openDrawer = (id) => {
    book_item.current.loadData(id);
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
          paging={paging}
          selection={false}
          onChange={handleFilter}
        />
        <Dialog onChange={onChange} ref={dialog} />
        <BookItem ref={book_item} />
      </Card>
    </>
  );
}

Book.displayName = "Book";
