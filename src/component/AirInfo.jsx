import React, { useState } from "react";
import styles from "/src/css/AirInfo.module.css";
import AirInfoForecast from "./AirInfoForecast";
import AirInfoToday from "./AirInfoToday";

function AirInfo(props) {
  const [stationInfo, setStationInfo] = useState(null);
  return (
    <>
      <div className={styles.airInfor}>
        <div className={styles.airInfoToday}>
          <AirInfoToday setStationInfo={setStationInfo} />
        </div>
        <AirInfoForecast stationInfo={stationInfo} />
      </div>
    </>
  );
}

export default AirInfo;
