import React, { useState } from "react";
import { Card } from "antd";
import AirButton from "../component/AirButton.jsx";
import AirTable from "../component/AirTable.jsx";
import AirTmTable from "../component/AirTmTable.jsx";

import ADataStyle from "../css/AirData.module.css";

import { REGION_KEYS, REGION_COLUMNS } from "../component/AirAdd.js";


function AirData() {
  const [selectedDay, setSelectedDay] = useState("오늘");  // 기본값 '오늘'

  return (
    <div className={ADataStyle.content}>
      <div className={ADataStyle.header}>
        <h1>대기 정보</h1>
      </div>
      <div className={ADataStyle.center}>
        <Card
          title={
            <div className={ADataStyle.cen_up}>
              <AirButton selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
            </div>
          }
        >
          <div className={ADataStyle.cen_center}>
            {selectedDay === "내일" ? (
              <AirTmTable
                regionKeys={REGION_KEYS}
                regionColumns={REGION_COLUMNS}
              />
            ) : (
              <AirTable selectedDay={selectedDay} />
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}

export default AirData;
