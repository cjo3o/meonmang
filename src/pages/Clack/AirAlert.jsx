import React, {useEffect, useState} from "react";
import {Card} from "antd";
import AlertStyle from "../../css/AirAlert.module.css";
import AirAlertFilter from "../../component/AirAlertFilter.jsx";
import Alertexcel from "../../component/Alertexcel.jsx";
import AirAlertTable from "../../component/AirAlertTable.jsx";
import Alertitems from "../../component/Alertitems.jsx";
import dayjs from "dayjs";

const AirAlert = ({setOpenSidebar}) => {
  const [region, setRegion] = useState("전체");
  const [itemCode, setItemCode] = useState("전체");
  const [pendingDateRange, setPendingDateRange] = useState([
    dayjs().startOf('year'), dayjs().endOf('day')
  ]);

  const [dateRange, setDateRange] = useState([null, null]);
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [regionOptions, setRegionOptions] = useState(["전체"]);

  const [filteredData, setFilteredData] = useState([]);

  const handleSearch = () => {
    setDateRange(pendingDateRange);         // 날짜 적용
    setSearchTrigger(prev => prev + 1);     // 테이블 갱신
  };

  useEffect(() => {
    setOpenSidebar(false);
  }, []);

  // 지역/항목은 즉시 반영
  useEffect(() => {
    setSearchTrigger(prev => prev + 1);
  }, [region, itemCode]);

  return (
    <div className={AlertStyle.content}>
      <div className={AlertStyle.center}>
        <Card>
          <div className={AlertStyle.header}>
            <h1>대기오염 발령 내역</h1>
          </div>
          <div className={AlertStyle.flexBetween}>
          <AirAlertFilter
            region={region}
            setRegion={setRegion}
            itemCode={itemCode}
            setItemCode={setItemCode}
            pendingDateRange={pendingDateRange}
            setPendingDateRange={setPendingDateRange}
            regionOptions={regionOptions}
            onSearch={handleSearch}
          />
            <Alertexcel data={filteredData} />
          </div>
          <AirAlertTable
            region={region}
            itemCode={itemCode}
            dateRange={pendingDateRange}
            searchTrigger={searchTrigger}
            setAvailableRegions={setRegionOptions}
            setFilteredData={setFilteredData}
            onDataUpdate={setFilteredData}
          />

          <div className={AlertStyle.bottom}>
            <h1>대기오염 발령 기준</h1>
          </div>
          <div>
            <Alertitems/>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AirAlert;
