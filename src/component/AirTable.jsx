import { Table, ConfigProvider } from "antd";
import { useState, useEffect, useMemo } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";
import {
  inform,
  REGION_KEYS,
  REGION_COLUMNS,
  itemCodeMap,
} from "../component/AirAdd.js";
import ExtentA from "../component/extentAll.jsx";

const labelMap = {
  PM10: { name: "미세먼지", unit: "PM-10" },
  PM25: { name: "초미세먼지", unit: "PM-2.5" },
  O3: { name: "오존", unit: "O3" },
  NO2: { name: "이산화질소", unit: "NO2" },
  CO: { name: "일산화탄소", unit: "CO" },
  SO2: { name: "아황산가스", unit: "SO2" },
};

function getAirQualityGrade(itemCode, value) {
  const num = parseFloat(value);
  if (isNaN(num)) return null;

  switch (itemCode.replace(".", "")) {
    case "PM10":
      if (num <= 30) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 80) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 150) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    case "PM25":
      if (num <= 15) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 35) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 75) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    case "O3":
      if (num <= 0.03) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 0.09) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 0.15) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    case "NO2":
      if (num <= 0.03) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 0.06) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 0.2) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    case "CO":
      if (num <= 2) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 9) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 15) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    case "SO2":
      if (num <= 0.02) return { label: "좋음", bgColor: "#a2d8ff" };
      if (num <= 0.05) return { label: "보통", bgColor: "#d2f29b" };
      if (num <= 0.15) return { label: "나쁨", bgColor: "#f9c97a" };
      return { label: "매우나쁨", bgColor: "#f07c7c" };
    default:
      return null;
  }
}

function AirTable({ setTimeText }) {
  const [Datas, setDatas] = useState([]);

  const getData = async () => {
    try {
      const requests = inform.map((infoCode) =>
        axios.get("https://apis.data.go.kr/B552584/ArpltnStatsSvc/getCtprvnMesureLIst", {
          params: {
            serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
            returnType: "json",
            numOfRows: 100,
            pageNo: 1,
            dataGubun: "HOUR",
            itemCode: infoCode,
          },
        })
      );

      const results = await Promise.all(requests);

      const allItems = results.flatMap((res) => {
        const items = res?.data?.response?.body?.items;
        return items?.map((item) => ({
          ...item,
          itemCode: item.itemCode === "PM25" ? "PM2.5" : item.itemCode,
        })) ?? [];
      });

      setDatas(allItems);
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const dataTime = useMemo(() => {
    const first = Datas[0];
    return first?.dataTime || "발표 시간 없음";
  }, [Datas]);

  // 상위로 발표 시간 전달
  useEffect(() => {
    if (setTimeText && dataTime) {
      setTimeText(dataTime);
    }
  }, [dataTime]);

  const columns = [
    {
      title: <div className={ATable.headerCenter}>구분</div>,
      dataIndex: "item",
      key: "item",
      className: ATable.itemColumn,
    },
    ...REGION_COLUMNS.map((region) =>
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

  const dataSource = inform.map((pollutant, idx) => {
    const displayCode = itemCodeMap[pollutant];
    const label = labelMap[pollutant];

    const row = {
      key: (idx + 1).toString(),
      item: label ? (
        <>
          {label.name}
          <br />({label.unit})
        </>
      ) : (
        displayCode
      ),
    };

    const matching = Datas.find((d) => d.itemCode === displayCode);

    Object.entries(REGION_KEYS).forEach(([regionName, key]) => {
      const value = matching?.[key];
      const grade = value !== undefined ? getAirQualityGrade(displayCode, value) : null;

      row[regionName] = grade ? (
        <div
          style={{
            backgroundColor: grade.bgColor,
            borderRadius: "4px",
            padding: "4px",
            textAlign: "center",
          }}
        >
          {grade.label}
        </div>
      ) : (
        <>
          정보
          <br />
          없음
        </>
      );
    });

    return row;
  });

  return (
    <>
      <ConfigProvider theme={{ components: { Table: { headerPadding: 0 } } }}>
        <Table columns={columns} dataSource={dataSource} pagination={false} scroll={{ x: 1000 }} />
        <div>
          <ExtentA />
        </div>
      </ConfigProvider>
    </>
  );
}

export default AirTable;
