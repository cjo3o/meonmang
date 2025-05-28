import React from "react";
import { Card } from "antd";
import Airfore from "../css/AirFore.module.css";
import dayjs from "dayjs";
import axios from "axios";

function AirInfoForecast() {
  const Dday = dayjs().format("YYYY-MM-DD");
  const inform = ["PM10", "PM25", "O3"];

  const airItems = [
    {
      label: "초미세먼지",
      sub: "PM-2.5",
      className: Airfore.body1,
      valueKey: "pm25Value",
      code: "pm25",
      unit: "㎍/m³",
    },
    {
      label: "미세먼지",
      sub: "PM-10",
      className: Airfore.body2,
      valueKey: "pm10Value",
      code: "pm10",
      unit: "㎍/m³",
    },
    {
      label: "오존",
      sub: "O3",
      className: Airfore.body3,
      valueKey: "o3Value",
      code: "o3",
      unit: "ppm",
    },
  ];

  const requests = inform.map((infoCode) =>
    axios.get(
      "http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth",
      {
        params: {
          // serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
          returnType: "json",
          numOfRows: 100,
          pageNo: 1,
          searchDate: Dday,
          informCode: infoCode,
        },
      }
    )
  );

  return (
    <Card
      title="대기정보 예보"
      variant="borderless"
      styles={{
        header: {
          backgroundColor: "#67D8F3",
          color: "#fff",
          textAlign: "center",
          fontSize: "1.5rem",
          fontWeight: "normal",
        },
      }}
    >
      <div className={Airfore.body}>
          {[0, 1].map((groupIdx) => (
            <div key={groupIdx} className={Airfore.subGroup}>
              {airItems.map((item, idx) => {
                  return (
                    <div className={item.className}>
                      <p>{item.label}</p>
                      <p>({item.sub})</p>
                      <img
                        src={icon}
                        alt="status"
                        className={Airfore.status}
                      />
                      <p className={Airfore.values}>{value}</p>
                      <p>{item.unit}</p>
                      <p>{grade}</p>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
    </Card>
  );
}

export default AirInfoForecast;
