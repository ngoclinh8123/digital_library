import * as React from "react";
import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import Util from "service/helper/util";
import { RemoveSelectedBtn } from "component/common/table/buttons";
import PemCheck from "component/common/pem_check";
import { Table, Pagination, Row, Col } from "antd";
import PropTypes from "prop-types";
const CommonTable = forwardRef(({ paging, onBulkDelete, list, selection, onChange, pem, ...rest }, ref) => {
  const [ids, setIds] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const rowSelection = {
    onChange: (ids) => {
      setIds(ids);
    },
  };
  useEffect(() => {
    if (paging) {
      setDataSource(Util.appendKey(list, paging?.page, paging?.page_size));
    } else {
      setDataSource(Util.appendKey(list));
    }
  }, [list]);
  useImperativeHandle(ref, () => ({
    ids,
    setIds,
  }));

  const handleTable = (pagination, filters, sorter, extra) => {
    let ordering = sorter.columnKey;
    if (sorter.order == "descend") {
      ordering = "-" + ordering;
    }
    onChange({ ordering, page: 1 });
  };
  const handlePaging = (e) => {
    onChange({ page: e });
  };
  return (
    <>
      <Table
        rowSelection={
          selection
            ? {
                type: "checkbox",
                ...rowSelection,
              }
            : null
        }
        dataSource={dataSource}
        onChange={handleTable}
        pagination={false}
        showSorterTooltip={false}
        {...rest}
      />
      <Row>
        <Col span={12}>
          {onBulkDelete ? (
            <PemCheck pem_group={pem} pem="delete">
              <RemoveSelectedBtn ids={ids} onClick={onBulkDelete} />
            </PemCheck>
          ) : null}
        </Col>
        <Col span={12} className="right">
          {paging ? <Pagination current={paging.page} onChange={handlePaging} total={paging.total} pageSize={paging.page_size} /> : null}
          {/* {paging ? <Pagination defaultCurrent={1} total={50} /> : null} */}
        </Col>
      </Row>
    </>
  );
});
CommonTable.propTypes = {
  datas: PropTypes.object,
  loading: PropTypes.bool,
};
export default CommonTable;
