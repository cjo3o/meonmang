import { Table, ConfigProvider } from "antd";
import React, { useState, useEffect } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";

function AirTable() {
  const [Datas, setDatas] = useState();
  const getData = async () => {
    const result = await axios.get(
      "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=6MS6d4%2F7oderkazWnyA2%2B5XBYjmhv86nH%2F3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A%3D%3D&returnType=json&numOfRows=10000&pageNo=1&sidoName=전국&ver=1.4"
    );
    const { data, status } = result;

    setDatas(data.response.body.items);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (Datas) {
      console.log(Datas.map(item => item.stationName));
    }
  }, [Datas]);

  const getGradeByCity = (stationName) => {
    const cityData = Datas?.find((item) => item.stationName === stationName);
    return cityData?.pm25Grade1h ?? "로딩 중";
  };

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
      서울: getGradeByCity("종로구"),
      인천: getGradeByCity("인천"),
      경기북부: getGradeByCity("경기북부"),
      경기남부: getGradeByCity("경기남부"),
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
      dataIndex: "서울",
      key: "서울",
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
