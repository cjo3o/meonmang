import React, { useEffect, useState } from "react";
import { Card } from "antd";
import VectorIcon from "../images/Vector.svg";
import status1 from "../images/status1.svg";
import status2 from "../images/status2.svg";
import status3 from "../images/status3.svg";
import status4 from "../images/status4.svg";
import AirToday from "../css/AirInfoToday.module.css";
import proj4 from "proj4";
import axios from "axios";

proj4.defs(
  "WCONGNAMUL",
  "+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=200000 +y_0=500000 +ellps=GRS80 +units=m +no_defs"
);

function AirInfoToday({ setStationInfo }) {
  const [station, setStation] = useState(null);
  const [stationInfo, setLocalStationInfo] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);

  const airItems = [
    {
      label: "초미세먼지",
      sub: "PM-2.5",
      className: AirToday.body1,
      valueKey: "pm25Value",
      code: "pm25",
      unit: "㎍/m³",
    },
    {
      label: "미세먼지",
      sub: "PM-10",
      className: AirToday.body2,
      valueKey: "pm10Value",
      code: "pm10",
      unit: "㎍/m³",
    },
    {
      label: "오존",
      sub: "O3",
      className: AirToday.body3,
      valueKey: "o3Value",
      code: "o3",
      unit: "ppm",
    },
    {
      label: "이산화질소",
      sub: "NO2",
      className: AirToday.body4,
      valueKey: "no2Value",
      code: "no2",
      unit: "ppm",
    },
    {
      label: "일삼화탄소",
      sub: "CO",
      className: AirToday.body5,
      valueKey: "coValue",
      code: "co",
      unit: "ppm",
    },
    {
      label: "아산화가스",
      sub: "SO2",
      className: AirToday.body6,
      valueKey: "so2Value",
      code: "so2",
      unit: "ppm",
    },
  ];

  const sidoList = [
    "서울",
    "부산",
    "대구",
    "인천",
    "광주",
    "대전",
    "울산",
    "세종",
    "경기",
    "강원",
    "충북",
    "충남",
    "전북",
    "전남",
    "경북",
    "경남",
    "제주",
  ];

  const haversineDistance = (coords1, coords2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);
    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchAllStations = async () => {
    const allStations = [];
    for (const sido of sidoList) {
      try {
        const response = await axios.get(
          "https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList",
          {
            params: {
              serviceKey: "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7/kDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ==",
              returnType: "json",
              addr: sido,
              numOfRows: 2000,
              pageNo: 1,
            },
          }
        );
        const items = response?.data?.response?.body?.items;
        if (items) allStations.push(...items);
      } catch (e) {
        console.error(`${sido} 측정소 정보 실패`, e);
      }
    }
    return allStations;
  };

  const findNearestStation = (myCoords, stations) => {
    let nearest = null;
    let minDist = Infinity;

    for (const station of stations) {
      const lat = parseFloat(station.dmX);
      const lng = parseFloat(station.dmY);

      if (!isNaN(lat) && !isNaN(lng)) {
        const dist = haversineDistance(myCoords, { lat, lng });
        if (!isNaN(dist) && dist < minDist) {
          minDist = dist;
          nearest = station;
        }
      }
    }

    return nearest;
  };

  const simplifyRegionName = (name) => {
    return name
      .replace("광역시", "")
      .replace("특별시", "")
      .replace("특별자치시", "")
      .replace("특별자치도", "")
      .replace("도", "도");
  };

  const buildDisplayStation = (station) => {
    const addr = station.addr || "";
    const parts = addr.split(" ");
    const cityRaw = parts[0] || "";
    const district = parts[1] || "";
    const dong = station.stationName || "";
    const city = simplifyRegionName(cityRaw);
    return `${city} ${district} ${dong}`;
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const myCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        const stations = await fetchAllStations();
        const nearest = findNearestStation(myCoords, stations);
        setLocalStationInfo(nearest || null); // 내부 렌더링용
        setStationInfo(nearest || null); // 부모로 전달
        setStation(nearest || null); // ✅ 이거 빠져있어서 station은 항상 null
      },
      (err) => {
        console.error("위치 실패", err);
        setStationInfo(null); // ✅ 실패 시도 처리
      }
    );
  }, []);

  useEffect(() => {}, [stationInfo]);

  useEffect(() => {
    if (!stationInfo || !stationInfo.stationName) return;

    const fetchRealtimeData = async () => {
      try {
        const res = await axios.get(
          "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty",
          {
            params: {
              serviceKey: "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7/kDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ==",
              returnType: "json",
              numOfRows: 1,
              pageNo: 1,
              stationName: stationInfo.stationName,
              dataTerm: "DAILY",
              ver: "1.4",
            },
          }
        );
        const data = res.data.response.body.items?.[0];
        setRealtimeData(data);
      } catch (err) {
        console.error("실시간 데이터 불러오기 실패", err);
      }
    };

    fetchRealtimeData();
  }, [stationInfo]);

  const getGrade = (code, value) => {
    if (value === undefined || value === "-" || value === null) return "-";
    const v = parseFloat(value);

    switch (code) {
      case "pm10":
        if (v <= 30) return "좋음";
        if (v <= 80) return "보통";
        if (v <= 150) return "나쁨";
        return "매우나쁨";
      case "pm25":
        if (v <= 15) return "좋음";
        if (v <= 35) return "보통";
        if (v <= 75) return "나쁨";
        return "매우나쁨";
      case "o3":
        if (v <= 0.03) return "좋음";
        if (v <= 0.09) return "보통";
        if (v <= 0.15) return "나쁨";
        return "매우나쁨";
      case "no2":
        if (v <= 0.03) return "좋음";
        if (v <= 0.06) return "보통";
        if (v <= 0.2) return "나쁨";
        return "매우나쁨";
      case "co":
        if (v <= 2.0) return "좋음";
        if (v <= 9.0) return "보통";
        if (v <= 15.0) return "나쁨";
        return "매우나쁨";
      case "so2":
        if (v <= 0.02) return "좋음";
        if (v <= 0.05) return "보통";
        if (v <= 0.15) return "나쁨";
        return "매우나쁨";
      default:
        return "-";
    }
  };

  const getStatusIcon = (grade) => {
    switch (grade) {
      case "좋음":
        return status1;
      case "보통":
        return status2;
      case "나쁨":
        return status3;
      case "매우나쁨":
        return status4;
      default:
        return status1; // 기본값
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "좋음":
        return "#0086FF";
      case "보통":
        return "#00DE86";
      case "나쁨":
        return "#FFC957";
      case "매우나쁨":
        return "#DE4F4F";
      default:
        return "#0086FF";
    }
  };

  return (
    <Card
      className={`${AirToday.Card} air-info-today`}
      title={<span className={AirToday.cardTitle}>오늘의 대기질</span>}
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
          <div className={AirToday.header2}>
            <div className={AirToday.TextTop}>
              <img
                src={VectorIcon}
                alt="vector"
                className={AirToday.location}
              />
              <span className={AirToday.TextTop1}>위치 중심으로 측정</span>
            </div>
            <div>
              <span className={AirToday.TextTop2}>
                {station
                  ? `(${buildDisplayStation(station)} 측정소 기준)`
                  : "(측정소 없음)"}
              </span>
            </div>
          </div>
          <div className={AirToday.TextTop3Wrapper}>
            <span className={AirToday.TextTop3}>{realtimeData?.dataTime || "측정시간 없음"}기준</span>
          </div>
        </div>
        <div className={AirToday.body}>
          <div className={AirToday.subGroup}>
            {airItems.map((item, idx) => {
              const value = realtimeData ? realtimeData[item.valueKey] : "-";
              const grade = getGrade(item.code, value);
              const icon = getStatusIcon(grade);

              return (
                <div key={idx} className={item.className}>
                  <p>{item.label}</p>
                  <p>({item.sub})</p>
                  <img src={icon} alt="status" className={AirToday.status} />
                  <p className={AirToday.values}>{value}</p>
                  <p>{item.unit}</p>
                  <p style={{ color: getGradeColor(grade) }}>{grade}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default AirInfoToday;
