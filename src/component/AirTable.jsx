import { Table, ConfigProvider } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";

function AirTable({ selectedDay }) {
  const [Datas, setDatas] = useState([]);

  const CITIES = [
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

  const getData = async () => {
    if (selectedDay === "내일") {
      return;
    }

    try {
      const requests = CITIES.map((city) =>
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

  const Grade = {
    1: { label: "좋음", bgColor: "#a2d8ff" },
    2: { label: "보통", bgColor: "#d2f29b" },
    3: { label: "나쁨", bgColor: "#f9c97a" },
    4: { label: "매우나쁨", bgColor: "#f07c7c" },
  };

  useEffect(() => {
    getData();
  }, [selectedDay]);

  const POLLUTANTS = [
    { key: "pm25", label: "미세먼지", sub: "PM-2.5", value: "pm25Grade1h" },
    { key: "pm10", label: "초미세먼지", sub: "PM-10", value: "pm10Grade1h" },
    { key: "o3", label: "오존", sub: "O3", value: "o3Grade" },
    { key: "no2", label: "이산화질소", sub: "NO2", value: "no2Grade" },
    { key: "co", label: "일산화탄소", sub: "CO", value: "coGrade" },
    { key: "so2", label: "아산화가스", sub: "SO2", value: "so2Grade" },
    // field: "so2Grade"
  ];

  const REGION_KEYS = {
    서울: "종로구",
    인천: "구월동",
    경기북부: "의정부1동",
    경기남부: "경수대로(동수원)",
    강원영서: "반곡동(명륜동)",
    강원영동: "옥천동",
    대전: "성남동1",
    세종: "아름동",
    충북: "칠금동",
    충남: "예산군",
    광주: "유촌동",
    전북: "구이면",
    전남: "화순읍",
    대구: "남산1동",
    울산: "무거동",
    경북: "의성읍",
    경남: "가야읍",
    제주: "강정동",
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
    if (selectedDay !== "내일") {
      Datas.forEach((item) => {
        map.set(item.stationName, item);
      });
    }
    return map;
  }, [Datas, selectedDay]);

  const dataSource =
  selectedDay === "내일"
    ? POLLUTANTS.map((pollutant, idx) => ({
        key: (idx + 1).toString(),
        item: (
          <>
            {pollutant.label}
            <br />({pollutant.sub})
          </>
        ),
        // 나머지 컬럼은 빈 값 또는 "-" 처리
        ...Object.keys(REGION_KEYS).reduce((acc, regionName) => {
          acc[regionName] = "-";
          return acc;
        }, {}),
      }))
    : POLLUTANTS.map((pollutant, idx) => {
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
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerPadding: 0,
          },
        },
      }}
    >
      {selectedDay === "내일" && (
        <div style={{ textAlign: "center", padding: "10px 0", color: "#888" }}>
          내일 데이터는 준비되어 있지 않습니다.
        </div>
      )}
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </ConfigProvider>
  );
}

export default AirTable;
