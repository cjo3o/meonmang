import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "antd";
import status1 from "../images/status1.svg";
import status2 from "../images/status2.svg";
import status3 from "../images/status3.svg";
import status4 from "../images/status4.svg";
import Airfore from "../css/AirFore.module.css";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

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
      return status1;
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

const getGyeonggiRegion = (city) => {
  const north = [
    "의정부시",
    "동두천시",
    "양주시",
    "포천시",
    "연천군",
    "가평군",
  ];
  return north.includes(city) ? "경기북부" : "경기남부";
};

const getGangwonRegion = (city) => {
  const yeongdong = [
    "속초시",
    "동해시",
    "삼척시",
    "고성군",
    "양양군",
    "정선군",
    "태백시",
  ];
  return yeongdong.includes(city) ? "영동" : "영서";
};

function AirInfoForecast({ stationInfo }) {
  const [forecastData, setForecastData] = useState({
    PM10: { 오늘: "-", 내일: "-" },
    PM25: { 오늘: "-", 내일: "-" },
    O3: { 오늘: "-", 내일: "-" },
  });

  useEffect(() => {
    if (!stationInfo?.addr) return;

    const parts = stationInfo.addr.split(" ");
    const region = parts[0];
    const city = parts[1];

    let regionName = region.replace(
      /(광역시|특별시|특별자치시|특별자치도|도)$/g,
      ""
    );

    if (region === "경기도") regionName = getGyeonggiRegion(city);
    else if (region === "강원도") regionName = getGangwonRegion(city);
    else {
      const map = {
        서울: "서울",
        인천: "인천",
        대전: "대전",
        세종: "세종",
        충남: "충남",
        충북: "충북",
        광주: "광주",
        전남: "전남",
        전북: "전북",
        대구: "대구",
        경북: "경북",
        울산: "울산",
        부산: "부산",
        경남: "경남",
        제주: "제주",
      };
      regionName = map[regionName] || regionName;
    }

    const today = dayjs().format("YYYY-MM-DD");
    const tomorrow = dayjs().add(1, "day").format("YYYY-MM-DD");

    const fetchForecast = async () => {
      const informCodes = ["PM10", "PM25", "O3"];
      const temp = { PM10: {}, PM25: {}, O3: {} };

      for (const code of informCodes) {
        try {
          const res = await axios.get(
            "https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMinuDustFrcstDspth",
            {
              params: {
                serviceKey:
                  "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7/kDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ==",
                returnType: "json",
                numOfRows: 100,
                pageNo: 1,
                searchDate: today,
                informCode: code,
              },
            }
          );
          const items = res.data.response.body.items || [];
          for (const item of items) {
            const date = item.informData;
            const informGrade = item.informGrade || "";
            const match = informGrade
              .split(",")
              .map((s) => s.trim())
              .find((s) => s.startsWith(regionName + " :"));
            const grade = match?.split(" : ")[1]?.trim() || "-";

            if (date === today) temp[code]["오늘"] = grade;
            if (date === tomorrow) temp[code]["내일"] = grade;
          }
        } catch (e) {
          console.error(`예보 ${code} 실패`, e);
        }
      }

      setForecastData(temp);
    };

    fetchForecast();
  }, [stationInfo]);

  const pollutants = [
    { label: "초미세먼지", sub: "PM-2.5", code: "PM25" },
    { label: "미세먼지", sub: "PM-10", code: "PM10" },
    { label: "오존", sub: "O3", code: "O3" },
  ];

  return (
    <div className="air-info-forecast-wrapper">
      <Card
        className={`${Airfore.Card} air-info-forecast`}
        title={
          <div className={Airfore.cardHeader}>
            <div className={Airfore.left}></div>
            <div className={Airfore.center}>
              <span className={Airfore.cardTitle}>대기정보 예보</span>
            </div>
            <div className={Airfore.right}>
              <Link to="/airdata" className={Airfore.detailLink}>
                자세히보기
              </Link>
            </div>
          </div>
        }
        variant="borderless"
        styles={{
          header: {
            backgroundColor: "#67D8F3",
            color: "#fff",
          },
        }}
      >
        <div className={Airfore.content}>
          <div className={Airfore.body}>
            <div className={Airfore.body1}>
              <div className={Airfore.header}>
                <br />
                <br />
              </div>
              <div className={Airfore.cen1}>오늘</div>
              <div className={Airfore.cen2}>내일</div>
            </div>
            {pollutants.map(({ label, sub, code }, i) => {
              const todayGrade = forecastData[code]["오늘"] || "-";
              const tomorrowGrade = forecastData[code]["내일"] || "-";
              const bodyClass =
                label === "오존" ? Airfore.body3 : Airfore.body2; // 조건에 따라 class 분기

              return (
                <div key={i} className={bodyClass}>
                  <div className={Airfore.header}>
                    <p>{label}</p>
                    <p>({sub})</p>
                  </div>
                  <div className={Airfore.cen1}>
                    <img
                      src={getStatusIcon(todayGrade)}
                      alt="status"
                      className={Airfore.status1}
                    />
                    <p style={{ color: getGradeColor(todayGrade) }}>
                      {todayGrade}
                    </p>
                  </div>
                  <div className={Airfore.cen2}>
                    <img
                      src={getStatusIcon(tomorrowGrade)}
                      alt="status"
                      className={Airfore.status2}
                    />
                    <p style={{ color: getGradeColor(tomorrowGrade) }}>
                      {tomorrowGrade}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AirInfoForecast;
