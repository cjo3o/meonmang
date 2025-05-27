import React, { useEffect, useState } from "react";
import { Card } from "antd";
import VectorIcon from "../images/Vector.svg"; // ✅ import
import status1 from "../images/status1.svg"
import status2 from "../images/status2.svg"
import status3 from "../images/status3.svg"
import status4 from "../images/status4.svg"
import AirToday from "../css/AirInfoToday.module.css";

function AirInfoToday() {
  const [stationName, setStationName] = useState("...");

  const airItems = [
    { label: "초미세먼지", sub: "PM-2.5", className: AirToday.body1 },
    { label: "미세먼지", sub: "PM-2.5", className: AirToday.body2 },
    { label: "오존", sub: "PM-2.5", className: AirToday.body2 },
    { label: "이산화질소", sub: "PM-2.5", className: AirToday.body2 },
    { label: "일산화탄소", sub: "PM-2.5", className: AirToday.body2 },
    { label: "아산화가스", sub: "PM-2.5", className: AirToday.body3 },
  ];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
  
      // 위경도를 TM 좌표로 변환
      const { tmX, tmY } = await convertToTM(latitude, longitude); // 직접 변환 또는 API 사용
  
      // 근접 측정소 요청
      const result = await axios.get(
        "https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList",
        {
          params: {
            serviceKey: "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7%2FkDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ%3D%3D",
            returnType: "json",
            tmX,
            tmY,
          },
        }
      );
  
      const nearestStation = result.data.response.body.items[0].stationName;
      setStationName(nearestStation);
    });
  }, []);
  
  
  return (
    <Card
      title="오늘의 대기질"
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
      <div>
        <div className={AirToday.header}>
          <img src={VectorIcon} alt="vector" className={AirToday.location} />
          <span className={AirToday.TextTop}>위치 중심으로 측정</span>
          <span className={AirToday.TextTop2}>({stationName} 기준으로 측정)</span>
        </div>
        <div className={AirToday.body}>
          {airItems.map((item, idx) => (
            <div key={idx} className={item.className}>
              <p>{item.label}</p>
              <p>({item.sub})</p>
              <img src={status1} alt="status" className={AirToday.status} />
              <p className={AirToday.values}>25</p>
              <p>㎍/m³</p>
              <p>매우좋음</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default AirInfoToday;
