import React from "react";
import { Card } from "antd";
import styles from "/src/css/AirInfo.module.css";
import AirInfoForecast from "./AirInfoForecast";
import AirInfoToday from "./AirInfoToday";

function AirInfo(props) {
  return (
    <>
      <div className={styles.airInfor}>
        <AirInfoToday />
        <AirInfoForecast />
      </div>
    </>
  );
}

export default AirInfo;
