import { Table, ConfigProvider } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";
import { Citys, POLLUTANTS, REGION_KEYS, REGION_COLUMNS, Grade } from "../component/AirAdd.js";

function AirTable() {
  const [Datas, setDatas] = useState([]);

  const getData = async () => {
    try {
      const requests = Citys.map((city) =>
        axios.get(
          `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=6j4MG9vFqOJ24QdvW%2BQ1R5lChK83ym4k0UFBww6Kv%2FGKEmRsYrtwq%2FTnVYqpWX640SMT%2BQXrEdOTn2zFEzdC0g%3D%3D&returnType=json&numOfRows=100&pageNo=1&sidoName=${city}&ver=1.4`
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
          "정보 없음"
        );
    });

    return row;
  });

  return (
    <ConfigProvider theme={{ components: { Table: { headerPadding: 0 } } }}>
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </ConfigProvider>
  );
}


export default AirTable;
