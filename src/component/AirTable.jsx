import { Table, ConfigProvider } from "antd";
import React from "react";
import ATable from "../css/AirTable.module.css";

function AirTable() {
  const dataSource = [
    {
      key: "1",
      item: (
        <>
          미세먼지
          <br />
          (PM-2.5)
        </>
      ),
      value: "좋음",
    },
    {
      key: "2",
      item: (
        <>
          초미세먼지
          <br />
          (PM-10)
        </>
      ),
      value: "좋음",
    },
    {
      key: "3",
      item: (
        <>
          오존
          <br />
          (O3)
        </>
      ),
      value: "매우좋음",
    },
    {
      key: "4",
      item: (
        <>
          이산화질소
          <br />
          (NO3)
        </>
      ),
      value: "매우좋음",
    },
    {
      key: "5",
      item: (
        <>
          일산화탄소
          <br />
          (CO)
        </>
      ),
      value: "매우좋음",
    },
    {
      key: "6",
      item: (
        <>
          아산화가스
          <br />
          (SO2)
        </>
      ),
      value: "매우좋음",
    },
  ];

  const columns = [
    {
      title: <div className={ATable.headerCenter}>구분</div>,
      dataIndex: "item",
      key: "item",
      className: ATable.itemColumn,
    },
    {
      title: <div className={ATable.headerCenter}>서울</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>인천</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>경기</div>,
      children: [
        {
          title: <div className={ATable.headerCenter}>북부</div>,
          dataIndex: "value",
          key: "value",
          className: ATable.centerAlign,
        },
        {
          title: <div className={ATable.headerCenter}>남부</div>,
          dataIndex: "value",
          key: "value",
          className: ATable.centerAlign,
        },
      ],
    },
    {
      title: <div className={ATable.headerCenter}>강원</div>,
      children: [
        {
          title: <div className={ATable.headerCenter}>영서</div>,
          dataIndex: "value",
          key: "value",
          className: ATable.centerAlign,
        },
        {
          title: <div className={ATable.headerCenter}>영동</div>,
          dataIndex: "value",
          key: "value",
          className: ATable.centerAlign,
        },
      ],
    },
    {
      title: <div className={ATable.headerCenter}>대전</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>세종</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>충북</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>충남</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>광주</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>전북</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>전남</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>전남</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>대구</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>울산</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>경북</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>경남</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
    {
      title: <div className={ATable.headerCenter}>제주</div>,
      dataIndex: "value",
      key: "value",
      className: ATable.centerAlign,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerPadding: 0, // ✅ 헤더 padding 제거
          },
        },
      }}
    >
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </ConfigProvider>
  );
}

export default AirTable;
