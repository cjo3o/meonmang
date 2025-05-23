import { Table, ConfigProvider } from "antd";
import React, { useEffect, useState } from "react";
import ATable from "../css/AirTable.module.css";
import axios from "axios";
import { Citys } from "../component/AirAdd.js";

function AirTmTable({ pollutants, regionKeys, regionColumns }) {
  const [datas, setDatas] = useState([]);

  const getData = async () => {
    try {
      const requests = Citys.map((city) =>
        axios.get(
          `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth?serviceKey=2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7%2FkDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ%3D%3D&returnType=json&numOfRows=100&pageNo=1&searchDate=2025-05-23&informCode=PM10`
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

    for (const regionName in regionKeys) {
      // 예: 지역 이름을 키로 사용하여 datas에서 매칭된 값 찾기
      const matchedData = datas.find((d) => d.informCode === pollutant.code && d.informRegion === regionName);
      row[regionName] = matchedData ? matchedData.informGrade : "-";
    }

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
