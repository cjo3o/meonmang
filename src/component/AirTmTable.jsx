import { Table, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";
import { Citys, POLLUTANTS2 } from "../component/AirAdd.js";

function AirTmTable({ pollutants = POLLUTANTS2, regionKeys = REGION_KEYS, regionColumns = REGION_COLUMNS }) {
  const [gradeMap, setGradeMap] = useState({});

  const POLLUTANTS2 = [
    { key: "PM10", label: "미세먼지", sub: "PM10", code: "PM10" },
    { key: "PM25", label: "초미세먼지", sub: "PM2.5", code: "PM25" },
    { key: "O3", label: "오존", sub: "O3", code: "O3" },
  ];

  const Grade2 = {
    "좋음": "#a2d8ff",
    "보통": "#d2f29b",
    "나쁨": "#f9c97a",
    "매우나쁨": "#f07c7c",
  };

  const inform = ["PM10", "PM25", "O3"];

  const Citys = [
    "서울",
    "인천",
    "경기",
    "강원",
    "대전",
    "세종",
    "충북",
    "충남",
    "광주",
    "전북",
    "전남",
    "대구",
    "울산",
    "경북",
    "경남",
    "제주",
  ];

  const REGION_KEYS = {
    서울: "서울",
    인천: "인천",
    경기북부: "경기북부",
    경기남부: "경기남부",
    강원영서: "영서",
    강원영동: "영동",
    대전: "대전",
    세종: "세종",
    충북: "충북",
    충남: "충남",
    광주: "광주",
    전북: "전북",
    전남: "전남",
    대구: "대구",
    울산: "울산",
    경북: "경북",
    경남: "경남",
    제주: "제주",
  };
  

  const REGION_COLUMNS = [
    { label: "서울", key: "서울" },
    { label: "인천", key: "인천" },
    {
      label: "경기",
      children: [
        { label: "북부", key: "경기북부" },
        { label: "남부", key: "경기남부" },
      ],
    },
    {
      label: "강원",
      children: [
        { label: "영서", key: "강원영서" },
        { label: "영동", key: "강원영동" },
      ],
    },
    { label: "대전", key: "대전" },
    { label: "세종", key: "세종" },
    { label: "충북", key: "충북" },
    { label: "충남", key: "충남" },
    { label: "광주", key: "광주" },
    { label: "전북", key: "전북" },
    { label: "전남", key: "전남" },
    { label: "대구", key: "대구" },
    { label: "울산", key: "울산" },
    { label: "경북", key: "경북" },
    { label: "경남", key: "경남" },
    { label: "제주", key: "제주" },
  ];

  const parseRegionData = (items) => {
    const parsed = {};
  
    items.forEach((item) => {
      const { informCode, informGrade } = item;
      if (!informCode || !informGrade) return;
  
      const pairs = informGrade.split(","); // 쉼표로 나누기
  
      pairs.forEach((pair) => {
        const [region, grade] = pair.split(":").map((s) => s.trim());
        if (!region || !grade) return;
  
        if (!parsed[informCode]) parsed[informCode] = {};
        parsed[informCode][region] = grade;
      });
    });
  
    return parsed;
  };

  const getData = async () => {
    try {
      const requests = inform.map((inform) => {
        const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?serviceKey=6MS6d4%2F7oderkazWnyA2%2B5XBYjmhv86nH%2F3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A%3D%3D&returnType=json&numOfRows=100&pageNo=1&searchDate=2025-05-23&informCode=${inform}`;
        return axios.get(url);
      });
      const results = await Promise.all(requests);
      const allItems = results.flatMap((res) => res.data?.response?.body?.items || []);
      const parsed = parseRegionData(allItems);
      console.log(allItems);
      setGradeMap(parsed);
    } catch (err) {
      console.error("데이터 가져오기 실패:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const dataSource = pollutants.map((pollutant, idx) => {
    const row = {
      key: (idx + 1).toString(),
      item: (
        <>
          {pollutant.label}
          <br />({pollutant.sub})
        </>
      ),
    };

    Object.entries(regionKeys).forEach(([regionName, regionDetailName]) => {
      const grade = gradeMap?.[pollutant.code]?.[regionDetailName];

      row[regionName] = grade ? (
        <div
          style={{
            backgroundColor: Grade2[grade] || "#ddd",
            borderRadius: "4px",
            padding: "4px",
            textAlign: "center",
          }}
        >
          {grade}
        </div>
      ) : (
        "정보 없음"
      );
    });

    return row;
  });
  

  const columns = [
    {
      title: <div className={ATable.headerCenter}>구분</div>,
      dataIndex: "item",
      key: "item",
      className: ATable.itemColumn,
    },
    ...regionColumns.map((region) =>
      region.children
        ? {
            title: <div className={ATable.headerCenter}>{region.label}</div>,
            children: region.children.map((child) => ({
              title: <div className={ATable.headerCenter}>{child.label}</div>,
              dataIndex: child.key,
              key: child.key,
              className: ATable.centerAlign,
            })),
          }
        : {
            title: <div className={ATable.headerCenter}>{region.label}</div>,
            dataIndex: region.key,
            key: region.key,
            className: ATable.centerAlign,
          }
    ),
  ];

  return (
    <ConfigProvider theme={{ components: { Table: { headerPadding: 0 } } }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </ConfigProvider>
  );
}


export default AirTmTable;
