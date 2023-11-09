import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Row, Col, Button, message, Popconfirm } from "antd";
import { BookOutlined } from "@ant-design/icons";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import { urls } from "../manage/config";
import { STATUS_CHOICES, STATUS_COLOR, STATUS_ACTION } from "../manage/const";
import styles from "./manage_detail.module.css";

export default function ManageDetail() {
  let { id } = useParams();
  const [item, setItem] = useState({});

  const getItem = () => {
    if (id) {
      Util.toggleGlobalLoading();
      RequestUtil.apiCall(`${urls.crud}${id}`)
        .then((res) => {
          setItem(res.data);
        })
        .catch(() => {})
        .finally(() => {
          Util.toggleGlobalLoading(false);
        });
    }
  };

  useEffect(() => {
    getItem();
  }, []);

  const handleUpdate = (next_action) => {
    Util.toggleGlobalLoading();
    RequestUtil.apiCall(`${urls.crud}${id}/`, { status: next_action }, "put")
      .then((res) => {
        setItem(res.data);
      })
      .catch(() => {})
      .finally(() => {
        Util.toggleGlobalLoading(false);
      });
  };

  const confirm = (e) => {
    handleUpdate("CANCELED");
  };

  // const confirmChange = () => {};

  const Book = ({ book }) => {
    return book ? (
      <Row className={styles.book_container}>
        <Col>
          {book.book.thumbnail ? (
            <img
              src={book.book.thumbnail}
              alt=""
              className={styles.book_image}
            />
          ) : (
            <Avatar shape="square" size={100} icon={<BookOutlined />} />
          )}
        </Col>
        <Col>
          <div className={styles.book_title}>{book.book.title}</div>
          <div className={styles.book_barcode}>Mã sách: {book.barcode}</div>
          {book.rack ? (
            <div className={styles.book_rack}>
              Vị trí:{" "}
              {`Tầng ${book.rack.number} / Khu vực ${book.rack.location}`}
            </div>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    ) : (
      <></>
    );
  };

  const Reader = ({ reader }) => {
    return reader ? (
      <div className={styles.reader_container}>
        <div className={styles.reader_row}>
          <div className={styles.reader_title}>Họ tên:</div>
          <span>{reader.full_name}</span>
        </div>
        <div className={styles.reader_row}>
          <div className={styles.reader_title}>Email:</div>
          <span>{reader.email}</span>
        </div>
        <div className={styles.reader_row}>
          <div className={styles.reader_title}>Sđt:</div>
          <span>{reader.phone_number}</span>
        </div>
        <div className={styles.reader_row}>
          <div className={styles.reader_title}>Địa chỉ:</div>
          <span>{reader.address}</span>
        </div>
      </div>
    ) : (
      <></>
    );
  };

  const Status = ({ status }) => {
    const choice = STATUS_CHOICES.find((x) => x[0] == status)[1];
    const color = STATUS_COLOR[status];
    return (
      <div style={{ backgroundColor: color }} className={styles.status_wrap}>
        {choice}
      </div>
    );
  };

  const ButtonStatus = ({ status }) => {
    const next_action_title = STATUS_ACTION[status];
    let next_action = "CANCELED";
    if (next_action_title) {
      let cr_action_index = 0;
      STATUS_CHOICES.forEach((cr, index) => {
        if (cr[0] == status) {
          cr_action_index = index;
        }
      });
      next_action = STATUS_CHOICES[cr_action_index + 1][0];
    }

    // <Popconfirm
    //         title="Hủy yêu cầu này?"
    //         description="Hủy yêu cầu này?"
    //         onConfirm={confirm}
    //         okText="Yes"
    //         cancelText="No"
    //       >
    //         <Button danger>Hủy yêu cầu</Button>
    //       </Popconfirm>

    return (
      next_action_title && (
        <Popconfirm
          title="Xác nhận?"
          description="Duyệt yêu cầu này?"
          onConfirm={() => handleUpdate(next_action)}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button
            // onClick={() => handleUpdate(next_action)}
            className={styles.btn_update}
          >
            {next_action_title}
          </Button>
        </Popconfirm>
      )
    );
  };

  return (
    <div className={styles.container}>
      {item.status ? <Status status={item.status} /> : <></>}
      <Reader reader={item.user} />
      <Book book={item.book_item} />
      <div className={styles.action_wrap}>
        {item.status && <ButtonStatus status={item.status} />}
        {item.status == "REQUESTED" && (
          <Popconfirm
            title="Hủy yêu cầu này?"
            description="Hủy yêu cầu này?"
            onConfirm={confirm}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger>Hủy yêu cầu</Button>
          </Popconfirm>
        )}
      </div>
    </div>
  );
}
