import React, { useState } from "react";
import { Card } from "antd";
import AlertStyle from "../../css/AirAlert.module.css";
import AirAlertFilter from "../../component/AirAlertFilter.jsx";
import AirAlertTable from "../../component/AirAlertTable.jsx";

const AirAlert = () => {
    const [region, setRegion] = useState("전체");
    const [itemCode, setItemCode] = useState("전체");
    const [dateRange, setDateRange] = useState([null, null]);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [regionOptions, setRegionOptions] = useState([{ value: "전체", label: "전체" }]);

    const handleSearch = () => setSearchTrigger(prev => prev + 1);

    return (
        <div className={AlertStyle.content}>
            <div className={AlertStyle.header}>
                <h1>대기오염 발령 내역</h1>
            </div>

            <div className={AlertStyle.center}>
                <Card
                    title={
                        <AirAlertFilter
                            region={region}
                            setRegion={setRegion}
                            itemCode={itemCode}
                            setItemCode={setItemCode}
                            dateRange={dateRange}
                            setDateRange={setDateRange}
                            regionOptions={regionOptions}
                            onSearch={handleSearch}
                        />
                    }
                >
                    <AirAlertTable
                        region={region}
                        itemCode={itemCode}
                        dateRange={dateRange}
                        searchTrigger={searchTrigger}
                        setAvailableRegions={setRegionOptions}
                    />
                </Card>
            </div>
        </div>
    );
};

export default AirAlert;
