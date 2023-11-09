import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button, Drawer, Row, Col, Avatar, Form, InputNumber } from "antd";
import { BookOutlined } from "@ant-design/icons";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import { Author } from "../dialog/book_view";
import { urls } from "../config";
import BookItemForm from "./form";
import styles from "./book_item.module.css";

const BookItem = forwardRef(({}, ref) => {
  const [book, setBook] = useState({});
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };

  const loadData = (id) => {
    Util.toggleGlobalLoading();
    RequestUtil.apiCall(`${urls.crud}${id}`)
      .then((resp) => {
        setBook(resp.data);
        setOpen(true);
      })
      .finally(() => Util.toggleGlobalLoading(false));
  };

  useImperativeHandle(ref, () => ({ loadData }));

  return (
    <>
      <Drawer
        title=""
        placement="right"
        onClose={onClose}
        open={open}
        width={800}
      >
        <div className={styles.book_view_block}>
          <Row className={styles.book_info_wrap}>
            <Col span={2}>
              {book.thumbnail ? (
                <img src={book.thumbnail} className={styles.book_info_img} />
              ) : (
                <Avatar shape="square" size={64} icon={<BookOutlined />} />
              )}
            </Col>
            <Col span={22}>
              <div className={styles.book_info_content}>
                <div className={styles.book_info_title}>{book.title}</div>
                <div className={styles.book_info_author}>
                  <Author book={book} />
                </div>
              </div>
            </Col>
          </Row>
          <Row className={styles.book_item_wrap}>
            <BookItemForm book={book} />
          </Row>
        </div>
      </Drawer>
    </>
  );
});

export default BookItem;
