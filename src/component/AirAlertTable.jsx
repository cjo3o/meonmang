import React, { useEffect, useState } from "react";
import { Table, Spin, Button } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import ExcelIcon from "../images/excelicon.svg";

const formatDateTime = (date, time, isOzone = false) => {
    if (!date || !time) return "-";
    return isOzone
        ? `${date} ${String(time).padStart(2, "0")}:00`
        : `${date} ${time}`;
};

const mapOzoneLevel = (level) => {
    switch (String(level)) {
        case "1": return "주의보";
        case "2": return "경보";
        case "3": return "중대경보";
        default: return "정보없음";
    }
};

const AirAlertTable = ({ region, itemCode, dateRange, searchTrigger, setAvailableRegions }) => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pmRes = await axios.get("https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo", {
                    params: {
                        serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                        returnType: "json",
                        numOfRows: 1000,
                        pageNo: 1,
                        year: 2025,
                    },
                });

                const pmItems = (pmRes.data.response.body.items ?? []).map((item, index) => ({
                    key: `pm-${index}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: item.itemCode,
                    경보단계: item.issueGbn,
                    발령시간: formatDateTime(item.issueDate, item.issueTime),
                    해제시간: formatDateTime(item.clearDate, item.clearTime),
                }));

                const ozoneRes = await axios.get("https://apis.data.go.kr/B552584/OzYlwsndOccrrncInforInqireSvc/getOzAdvsryOccrrncInfo", {
                    params: {
                        serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                        returnType: "json",
                        numOfRows: 1000,
                        pageNo: 1,
                    },
                });

                const ozoneItems = (ozoneRes.data.response.body.items ?? []).map((item, index) => ({
                    key: `ozone-${index}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: "O3",
                    경보단계: mapOzoneLevel(item.issueLvl),
                    발령시간: formatDateTime(item.dataDate || item.issueDate, item.issueTime, true),
                    해제시간: formatDateTime(item.dataDate || item.clearDate, item.clearTime, true),
                }));

                const combined = [...pmItems, ...ozoneItems]
                    .filter(item => item.발령시간.startsWith("2025"))
                    .sort((a, b) => new Date(b.발령시간) - new Date(a.발령시간))
                    .map((item, index) => ({ ...item, 번호: index + 1 }));

                // 지역 목록 추출 후 상위로 전달
                if (setAvailableRegions) {
                    const uniqueRegions = Array.from(new Set(combined.map(item => item.지역))).sort();
                    setAvailableRegions(["전체", ...uniqueRegions]);
                }

                // 필터 적용
                const result = combined.filter(item => {
                    const matchRegion = region === "전체" || item.지역 === region;
                    const matchItem = itemCode === "전체" || item.항목 === itemCode;

                    const 발령 = dayjs(item.발령시간, "YYYY-MM-DD HH:mm"); // formatDateTime()으로 이미 포맷 통일됨
                    const 시작 = dateRange[0] ? dayjs(dateRange[0]).startOf("day") : null;
                    const 끝 = dateRange[1] ? dayjs(dateRange[1]).endOf("day") : null;

                    const matchDate =
                        !시작 || !끝
                            ? true
                            : 발령.isValid() &&
                            발령.isSameOrAfter(시작) &&
                            발령.isSameOrBefore(끝);

                    return matchRegion && matchItem && matchDate;
                });

                setData(combined);
                setFilteredData(result);
                setCurrentPage(1);
            } catch (err) {
                console.error("API 오류", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTrigger, dateRange]);

    const handleExcelDownload = () => {
        if (filteredData.length === 0) {
            return alert("다운로드할 데이터가 없습니다.");
        }
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "대기오염발령내역");
        XLSX.writeFile(wb, "air_alert.xlsx");
    };

    const columns = [
        { title: "번호", dataIndex: "번호", key: "번호", align: "center" },
        { title: "지역", dataIndex: "지역", key: "지역", align: "center" },
        { title: "권역", dataIndex: "권역", key: "권역", align: "center" },
        { title: "항목", dataIndex: "항목", key: "항목", align: "center" },
        { title: "경보단계", dataIndex: "경보단계", key: "경보단계", align: "center" },
        { title: "발령시간", dataIndex: "발령시간", key: "발령시간", align: "center" },
        { title: "해제시간", dataIndex: "해제시간", key: "해제시간", align: "center" },
    ];

    return loading ? (
        <Spin />
    ) : (
        <>
            <div style={{ textAlign: "right", marginBottom: 8 }}>
                <Button
                    icon={<img src={ExcelIcon} alt="excel" style={{ width: 25, height: 25 }} />}
                    onClick={handleExcelDownload}>엑셀 다운로드</Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
                pagination={{
                    position: ["bottomCenter"],
                    current: currentPage,
                    pageSize,
                    total: filteredData.length,
                    onChange: setCurrentPage,
                    showSizeChanger: false,
                }}
            />
        </>
    );
};

export default AirAlertTable;