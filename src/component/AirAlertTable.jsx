import React, {useEffect, useState} from "react";
import {Table, Spin} from "antd";
import axios from "axios";

// 날짜와 시간을 조합하여 "YYYY-MM-DD HH:00" 형식으로 반환
const formatDateTime = (date, time) => {
    const hour = time.padStart(2, "0");
    return `${date} ${hour}`;
};

// 오존 경보 단계 숫자 → 문자열 매핑
const mapOzoneLevel = (level) => {
    switch (String(level)) {
        case "1":
            return "주의보";
        case "2":
            return "경보";
        case "3":
            return "중대경보";
        default:
            return "정보없음";
    }
};

const AirAlertTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        const  fetchAllAlerts = async () => {
            setLoading(true);
            try {
                // 초/미세먼지 API
                const pmRes = await axios.get(
                    "http://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo",
                    {
                        params: {
                            serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                            returnType: "json",
                            numOfRows: pageSize,
                            pageNo: currentPage,
                        },
                    }
                );
                const pmItems = pmRes.data.response.body.items.map((item, index) => ({
                    key: `pm-${index}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: item.itemCode,
                    경보단계: item.issueGbn,
                    발령시간: formatDateTime(item.issueDate, item.issueTime),
                    해제시간: formatDateTime(item.clearDate, item.clearTime),
                }));

                // 오존 API
                const ozoneRes = await axios.get(
                    "http://apis.data.go.kr/B552584/OzYlwsndOccrrncInforInqireSvc/getOzAdvsryOccrrncInfo",
                    {
                        params: {
                            serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                            returnType: "json",
                            numOfRows: pageSize,
                            pageNo: currentPage,
                        },
                    }
                );
                const ozoneItems = ozoneRes.data.response.body.items.map((item, index) => ({
                    key: `ozone-${index}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: "O3",
                    경보단계: mapOzoneLevel(item.issueLvl),
                    발령시간: formatDateTime(item.dataDate, item.issueTime),
                    해제시간: formatDateTime(item.dataDate, item.clearTime),
                }));

                // 병합 → 발령시간 내림차순 정렬 → 번호 부여
                const combined = [...pmItems, ...ozoneItems];
                combined.sort((a, b) => new Date(b.발령시간) - new Date(a.발령시간));
                const numbered = combined.map((item, index) => ({ ...item, 번호: index + 1 }));

                setData(numbered);
            } catch (error) {
                console.error("API 오류:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllAlerts();
    }, []);

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
        <Spin/>
    ) : (
        <Table
            columns={columns}
            dataSource={data.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
            pagination={{
                position: ["bottomCenter"],
                current: currentPage,
                pageSize,
                total: data.length,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
                showLessItems: false,
                responsive: true,
            }}
        />
    );
};

export default AirAlertTable;