import React from "react";
import { Card } from "antd";

function AirInfoForecast() {
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
      여기에 예보 내용 작성
    </Card>
  );
}

export default AirInfoForecast;
