import { Card } from "antd";
import AirButton from "../component/AirButton.jsx";
import AirTable from "../component/AirTable.jsx";
import ADataStyle from "../css/AirData.module.css";
import React from "react";

function AirData() {
  return (
    <>
      <div className={ADataStyle.content}>
        <div className={ADataStyle.header}>
          <h1>대기 정보</h1>
        </div>
        <div className={ADataStyle.center}>
          <Card
            title={
              <div className={ADataStyle.cen_up}>
                <AirButton />
              </div>
            }
          >
            <div className={ADataStyle.cen_center}>
              <AirTable />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AirData;
