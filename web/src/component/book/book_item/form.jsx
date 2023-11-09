import { useState, useEffect } from "react";
import { Row, Col, Input, Cascader } from "antd";
import Util from "service/helper/util";
import RequestUtil from "service/helper/request_util";
import { urls as urlRack } from "component/rack/config";
import { urls } from "./config";
import styles from "./book_item.module.css";

export default function BookItemForm({ book }) {
  const [isEdit, setIsEdit] = useState(false);
  const [racks, setRacks] = useState([]);
  const [bookItems, setBookItems] = useState([]);

  const getBookItems = () => {
    if (book.id) {
      Util.toggleGlobalLoading();
      RequestUtil.apiCall(`${urls.crud}${book.id}`)
        .then((resp) => {
          setBookItems(resp.data);
        })
        .finally(() => Util.toggleGlobalLoading(false));
    }
  };

  const getRacks = () => {
    Util.toggleGlobalLoading();
    RequestUtil.apiCall(`${urlRack.crud}`)
      .then((resp) => {
        setRacks(resp.data);
      })
      .finally(() => Util.toggleGlobalLoading(false));
  };

  useEffect(() => {
    getRacks();
    getBookItems();
  }, [isEdit, book]);

  const getRackOption = () => {
    let options = [];

    racks.forEach((rack) => {
      const { number, location } = rack;
      const existOption = options.find((option) => option.value == number);

      if (existOption) {
        existOption.children.push({
          value: location,
          label: `Tủ số: ${location}`,
        });
      } else {
        options.push({
          value: number,
          label: `Tầng: ${number}`,
          children: [{ value: location, label: `Tủ số: ${location}` }],
        });
      }
    });

    return options;
  };

  const getDefaultRack = (rack_id) => {
    const currentRack = racks.find((rack) => rack.id == rack_id);
    if (currentRack) {
      let result = [];
      result.push(currentRack.number);
      result.push(currentRack.location);
      return result;
    }
  };

  const getRackValue = (rack_id) => {
    const currentRack = racks.find((rack) => rack.id == rack_id);
    if (currentRack) {
      return `Tầng: ${currentRack.number} / Tủ số: ${currentRack.location}`;
    }
    return "";
  };

  const BookItems = () => {
    return bookItems.map((item, index) => (
      <Row key={index} className={styles.form_row}>
        <Col span={4}>{index + 1}</Col>
        <Col span={!isEdit ? 10 : 8}>
          {!isEdit ? (
            item.barcode
          ) : (
            <Input
              name="barcode"
              defaultValue={item.barcode}
              style={{ width: "80%" }}
              value={item.barcode}
              onChange={onChangeBarcode(index)}
            />
          )}
        </Col>
        <Col span={!isEdit ? 10 : 8}>
          {!isEdit ? (
            <span>{getRackValue(item.rack)}</span>
          ) : (
            <Cascader
              defaultValue={getDefaultRack(item.rack)}
              options={getRackOption()}
              onChange={onChangeRack(index)}
              style={{ width: "100%" }}
            />
          )}
        </Col>
        {!isEdit ? (
          <></>
        ) : (
          <Col span={4} className={styles.form_item_btn_delete}>
            <span onClick={() => onDelete(index)}>xóa</span>
          </Col>
        )}
      </Row>
    ));
  };

  const onEdit = () => {
    changeMode();
  };

  const onCancel = () => {
    changeMode();
  };

  const onAdd = () => {
    setBookItems((pre) => {
      const newItems = [...pre];
      newItems.push({ book: book.id, barcode: "0", rack: racks[0] });
      return newItems;
    });
  };

  const onDelete = (index) => {
    setBookItems((pre) => {
      const newItems = [...pre];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const changeMode = () => {
    setIsEdit(!isEdit);
  };

  const onChangeBarcode = (index) => (e) => {
    setBookItems((pre) => {
      const newItems = [...pre];
      newItems[index] = {
        ...newItems[index],
        barcode: e.target.value,
      };
      return newItems;
    });
  };

  const onChangeRack = (index) => (value) => {
    const currentRackChange = racks.find(
      (rack) => rack.number == value[0] && rack.location == value[1]
    );
    setBookItems((pre) => {
      const newItems = [...pre];
      newItems[index] = {
        ...newItems[index],
        rack: currentRackChange.id,
      };
      return newItems;
    });
  };

  const submitForm = () => {
    // const params = { data: bookItems };

    Util.toggleGlobalLoading();
    RequestUtil.apiCall(`${urls.crud}${book.id}`, bookItems, "post")
      .then((resp) => {
        changeMode();
      })
      .finally(() => Util.toggleGlobalLoading(false));
  };

  return (
    <div className={styles.book_form_wrap}>
      <div className={styles.book_item_heading}>
        <span className={styles.book_item_title}>Quản lý vị trí</span>
        {!isEdit ? (
          <span onClick={onEdit} className={styles.book_item_btn_edit}>
            Sửa
          </span>
        ) : (
          <span onClick={onAdd} className={styles.book_item_btn_edit}>
            Thêm
          </span>
        )}
      </div>

      <div className={styles.form_wrap}>
        <Row className={styles.form_row_head}>
          <Col span={4}>STT</Col>
          <Col span={!isEdit ? 10 : 8}>Mã sách</Col>
          <Col span={!isEdit ? 10 : 8}>Tủ sách</Col>
          {!isEdit ? <></> : <Col span={4}></Col>}
        </Row>
        <BookItems />
      </div>
      <div className={styles.book_item_foot}>
        {!isEdit ? (
          <span className={styles.book_item_quantity}>
            Số lượng: {bookItems.length}
          </span>
        ) : (
          <div className={styles.book_item_foot_wrap}>
            <span className={styles.book_item_quantity}>
              Số lượng: {bookItems.length}
            </span>
            <span className={styles.book_item_foot_action}>
              <span onClick={onCancel} className={styles.book_item_btn_cancel}>
                Thoát
              </span>
              <span onClick={submitForm} className={styles.book_item_btn_ok}>
                Lưu
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
