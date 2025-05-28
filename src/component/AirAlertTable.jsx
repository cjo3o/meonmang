import React, {useEffect, useState} from "react";
import { Table, Spin } from "antd";
import { AirAlert } from "../hooks/AirAlert.js";

const AirAlertTable = ({ region, itemCode, dateRange, searchTrigger, setAvailableRegions, onDataUpdate }) => {
  const { data, loading } = AirAlert({ region, itemCode, dateRange, searchTrigger, setAvailableRegions });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {

    if (setFilteredData){
      setFilteredData(data);
    }

    // [수정 위치 ②]: 부모로 전달
    if (onDataUpdate) {
      onDataUpdate(data);
    }

    setCurrentPage(1);
  }, [data, onDataUpdate]);

  const columns = [
    { title: "번호", dataIndex: "번호", key: "번호", align: "center" },
    { title: "지역", dataIndex: "지역", key: "지역", align: "center" },
    { title: "권역", dataIndex: "권역", key: "권역", align: "center" },
    { title: "항목", dataIndex: "항목", key: "항목", align: "center" },
    { title: "경보단계", dataIndex: "경보단계", key: "경보단계", align: "center" },
    { title: "발령시간", dataIndex: "발령시간", key: "발령시간", align: "center" },
    { title: "해제시간", dataIndex: "해제시간", key: "해제시간", align: "center" },
  ];

  return loading ? (
      <Spin />
  ) : (
      <Table
          columns={columns}
          dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
          pagination={{
            position: ["bottomCenter"],
            current: currentPage,
            pageSize,
            total: data.length,
            onChange: setCurrentPage,
            showSizeChanger: false,
          }}
      />
  );
};

export default AirAlertTable;
