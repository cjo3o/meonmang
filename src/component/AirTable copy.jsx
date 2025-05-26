import { Table, ConfigProvider } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";
import {
  Citys,
  POLLUTANTS,
  REGION_KEYS,
  REGION_COLUMNS,
  Grade,
} from "../component/AirAdd.js";
import ExtentA from "../component/extentAll.jsx";

function AirTable() {
  const [Datas, setDatas] = useState([]);

  const getData = async () => {
    try {
      const requests = Citys.map((city) =>
        axios
          .get(
          // `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7%2FkDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ%3D%3D&returnType=json&numOfRows=100&pageNo=1&sidoName=${city}&ver=1.4`
          )
      );

      const results = await Promise.all(requests);
      const allItems = results.flatMap((res) => res.data.response.body.items);
      setDatas(allItems);
    } catch (err) {
      console.error("데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const dataTime = useMemo(() => {
    const seoulData = Datas.find(
      (item) => item.stationName === REGION_KEYS.서울
    );
    return seoulData?.dataTime || "발표 시각 없음";
  }, [Datas]);

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

  const stationMap = useMemo(() => {
    const map = new Map();
    Datas.forEach((item) => {
      map.set(item.stationName, item);
    });
    return map;
  }, [Datas]);

  const dataSource = POLLUTANTS.map((pollutant, idx) => {
    const row = {
      key: (idx + 1).toString(),
      item: (
        <>
          {pollutant.label}
          <br />({pollutant.sub})
        </>
      ),
    };

    Object.entries(REGION_KEYS).forEach(([regionName, stationName]) => {
      const data = stationMap.get(stationName);
      const gradeValue = data?.[pollutant.field];
      const gradeInfo = Grade[gradeValue];

      row[regionName] =
        gradeValue === null ? (
          "미측정"
        ) : gradeInfo ? (
          <div
            style={{
              backgroundColor: gradeInfo.bgColor,
              borderRadius: "4px",
              padding: "4px",
              textAlign: "center",
            }}
          >
            {gradeInfo.label}
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
      <div className={ATable.forecastInfoWrapper}>
        <span className={ATable.forecastInfoText}>발표 시간 : {dataTime}</span>
      </div>

      <ConfigProvider theme={{ components: { Table: { headerPadding: 0 } } }}>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
        <div>
          <ExtentA />
        </div>
      </ConfigProvider>
    </>
  );
}

export default AirTable;
