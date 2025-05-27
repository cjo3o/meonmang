import { useState } from "react";
import { Card } from "antd";
import AirButton from "../component/AirButton.jsx";
import AirTable from "../component/AirTable.jsx";
import AirTmTable from "../component/AirTmTable.jsx";

import ADataStyle from "../css/AirData.module.css";

import { REGION_KEYS, REGION_COLUMNS } from "../component/AirAdd.js";

function AirData() {
  const [selectedDay, setSelectedDay] = useState("오늘"); // 기본값 '오늘'
  const [timeText, setTimeText] = useState(""); // 발표시간 상태

  return (
    <div className={ADataStyle.content}>

      <div className={ADataStyle.center}>
        <Card
          title={
            <div className={ADataStyle.cen_up}>
              <div className={ADataStyle.header}>
                <h1>대기정보</h1>
              </div>
              <div className={ADataStyle.headerRow}>
                <AirButton
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                />
                {selectedDay === "오늘" && (
                  <div className={ADataStyle.timeText}>발표 시간: {timeText}</div>
                )}
                {selectedDay === "내일" && (
                  <div className={ADataStyle.timeText}>{timeText}</div>
                )}
              </div>
            </div>
          }
        >
          <div className={ADataStyle.cen_center}>
            {selectedDay === "내일" ? (
              <AirTmTable
                regionKeys={REGION_KEYS}
                regionColumns={REGION_COLUMNS}
                setTimeText={setTimeText}
              />
            ) : (
              <AirTable selectedDay={selectedDay} setTimeText={setTimeText} />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AirData;
