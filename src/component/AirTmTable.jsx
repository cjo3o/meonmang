import { Table } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import ATmtable from "../css/AirTmTable.module.css";
import axios from "axios";
import {
  POLLUTANTS2,
  REGION_KEYS2,
  REGION_COLUMNS2,
  Grade2,
} from "../component/AirTmAdd.js";
import Extent from "../component/extent.jsx";

const inform = ["PM10", "PM25", "O3"];

function AirTmTable({ setTimeText }) {
  const [Datas, setDatas] = useState([]);

  const getData = async () => {
    try {
      const Dday = dayjs().format("YYYY-MM-DD");

      const requests = inform.map((infoCode) =>
        axios.get(
          "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth",
          {
            params: {
              serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
              returnType: "json",
              numOfRows: 100,
              pageNo: 1,
              searchDate: Dday,
              informCode: infoCode,
            },
          }
        )
      );

      const results = await Promise.all(requests);

      const allItems = results.flatMap((res) => {
        const response = res.data?.response;
        if (!response || response.header?.resultCode !== "00") {
          return [];
        }
        return response.body?.items ?? [];
      });

      setDatas(allItems);
    } catch (err) {
      console.error("예보 데이터 가져오기 실패:", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const today = dayjs().format("YYYY-MM-DD");

  const futureDatas = useMemo(() => {
    return Datas.filter((d) => dayjs(d.informData).isAfter(today));
  }, [Datas]);

  const forecastDate = useMemo(() => {
    return futureDatas[0]?.informData || "예보 날짜 없음";
  }, [futureDatas]);

  const dataTime = useMemo(() => {
    return futureDatas[0]?.dataTime || "발표 시간 없음";
  }, [futureDatas]);

  const regionGradeMap = useMemo(() => {
    const mapByPollutant = {};

    inform.forEach((code) => {
      const item = futureDatas.find((i) => i.informCode === code);
      const gradeMap = new Map();

      if (item?.informGrade) {
        item.informGrade.split(",").forEach((entry) => {
          const [region, grade] = entry.split(" : ").map((s) => s.trim());
          if (region && grade) {
            gradeMap.set(region, grade);
          }
        });
      }

      mapByPollutant[code] = gradeMap;
    });

    return mapByPollutant;
  }, [futureDatas]);

  useEffect(() => {
    if (setTimeText && forecastDate && dataTime) {
      setTimeText(
        <>
        <div>
        <span className={ATmtable.forecastInfo}>{forecastDate}</span>
          </div>
          <div>
          <span className={ATmtable.forecastInfoSub}>({dataTime})</span>
          </div>
        </>
      );
    }
  }, [forecastDate, dataTime]);

  const columns = [
    {
      title: <div className={ATmtable.headerCenter}>구분</div>,
      dataIndex: "item",
      key: "item",
      className: ATmtable.itemColumn,
    },
    ...REGION_COLUMNS2.map((region) =>
      region.children
        ? {
            title: <div className={ATmtable.headerCenter}>{region.label}</div>,
            children: region.children.map((child) => ({
              title: <div className={ATmtable.headerCenter}>{child.label}</div>,
              dataIndex: child.key,
              key: child.key,
              className: ATmtable.centerAlign,
            })),
          }
        : {
            title: <div className={ATmtable.headerCenter}>{region.label}</div>,
            dataIndex: region.key,
            key: region.key,
            className: ATmtable.centerAlign,
          }
    ),
  ];

  const dataSource = POLLUTANTS2.map((pollutant, idx) => {
    const row = {
      key: (idx + 1).toString(),
      item: (
        <>
          {pollutant.label}
          <br />({pollutant.sub})
        </>
      ),
    };

    Object.entries(REGION_KEYS2).forEach(([regionKey, regionName]) => {
      const gradeStr = regionGradeMap[pollutant.code]?.get(regionName);
      const gradeInfo = Grade2[gradeStr];

      row[regionKey] =
        gradeStr === undefined ? (
          <>
            정보
            <br />
            없음
          </>
        ) : gradeInfo ? (
          <div
            className={ATmtable.gradeBox}
            style={{ backgroundColor: gradeInfo.bgColor }}
          >
            {gradeInfo.label}
          </div>
        ) : (
          <div>{gradeStr}</div>
        );
    });

    return row;
  });

  return (
    <>
      <div className={ATmtable.tableWrapper}>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          scroll={{ x: 1000 }} // ← 최소한의 넓이만 지정
        />
        </div>
        <div>
          <Extent />
        </div>
    </>
  );
}

export default AirTmTable;
