import React from "react";
import { Button } from "antd";
import * as XLSX from "xlsx";
import ExcelIcon from "../images/excelicon.svg";

const Alertexcel = ({ data }) => {
    const handleExcelDownload = () => {
        if (!data || data.length === 0) {
            alert("다운로드할 데이터가 없습니다.");
            return;
        }

        const orderedData = data.map(item => ({
            번호: item.번호,
            지역: item.지역,
            권역: item.권역,
            항목: item.항목,
            경보단계: item.경보단계,
            발령시간: item.발령시간,
            해제시간: item.해제시간,
        }));

        const ws = XLSX.utils.json_to_sheet(orderedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "대기오염발령내역");
        XLSX.writeFile(wb, "air_alert.xlsx");
    };

    return (
        <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Button
                icon={<img src={ExcelIcon} alt="excel" style={{ width: 25, height: 25 }} />}
                onClick={handleExcelDownload}
            >
                엑셀 다운로드
            </Button>
        </div>
    );
};

export default Alertexcel;