import React, {useState} from "react";
import {Card} from "antd";
import AlertStyle from "../../css/AirAlert.module.css";
import AirAlertFilter from "../../component/AirAlertFilter.jsx";
import AirAlertTable from "../../component/AirAlertTable.jsx";

const AirAlert = () => {
    const [region, setRegion] = useState("전체");
    const [itemCode, setItemCode] = useState("전체");
    const [dateRange, setDateRange] = useState([null, null]);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [regionOptions, setRegionOptions] = useState([{value: "전체", label: "전체"}]);

    const handleSearch = () => setSearchTrigger(prev => prev + 1);

    return (
        <div className={AlertStyle.content}>
            <div className={AlertStyle.center}>
                <Card>
                    <div className={AlertStyle.header}>
                        <h1>대기오염 발령 내역</h1>
                    </div>
                    <div>
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
                    </div>
                    <AirAlertTable
                        region={region}
                        itemCode={itemCode}
                        dateRange={dateRange}
                        searchTrigger={searchTrigger}
                        setAvailableRegions={setRegionOptions}
                    />

                    <div className={AlertStyle.header}>
                        <h1>대기오염 발령 기준</h1>
                    </div>
                    <div className="AlertStyle.pollution-cards">
                        <div className="AlertStyle.pollution-card">
                            <h3>미세먼지</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>주의보</th>
                                    <th>경보</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>2시간 150㎍/㎥ 이상 지속</td>
                                    <td>2시간 300㎍/㎥ 이상 지속</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="AlertStyle.pollution-card">
                            <h3>초미세먼지</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>주의보</th>
                                    <th>경보</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>2시간 75㎍/㎥ 이상 지속</td>
                                    <td>2시간 150㎍/㎥ 이상 지속</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="AlertStyle.pollution-card">
                            <h3>오존</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>주의보</th>
                                    <th>경보</th>
                                    <th>중대경보</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>1시간 평균 0.12ppm 이상</td>
                                    <td>1시간 평균 0.30ppm 이상</td>
                                    <td>1시간 평균 0.50ppm 이상</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AirAlert;
