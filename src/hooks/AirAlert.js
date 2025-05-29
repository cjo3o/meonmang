import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const formatDateTime = (date, time, isOzone = false) => {
    if (!date || !time) return "-";
    return isOzone ? `${date} ${String(time).padStart(2, "0")}:00` : `${date} ${time}`;
};

const mapOzoneLevel = (level) => {
    switch (String(level)) {
        case "1": return "주의보";
        case "2": return "경보";
        case "3": return "중대경보";
        default: return "정보없음";
    }
};

export const AirAlert = ({ region, itemCode, dateRange, searchTrigger, setAvailableRegions }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [pmRes, ozoneRes] = await Promise.all([
                    axios.get("https://apis.data.go.kr/B552584/UlfptcaAlarmInqireSvc/getUlfptcaAlarmInfo", {
                        params: {
                            serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                            returnType: "json",
                            numOfRows: 1000,
                            pageNo: 1,
                            year: 2025,
                        },
                    }),
                    axios.get("https://apis.data.go.kr/B552584/OzYlwsndOccrrncInforInqireSvc/getOzAdvsryOccrrncInfo", {
                        params: {
                            serviceKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A==",
                            returnType: "json",
                            numOfRows: 1000,
                            pageNo: 1,
                        },
                    }),
                ]);

                const pmItems = (pmRes.data.response.body.items ?? []).map((item, idx) => ({
                    key: `pm-${idx}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: item.itemCode,
                    경보단계: item.issueGbn,
                    발령시간: formatDateTime(item.issueDate, item.issueTime),
                    해제시간: formatDateTime(item.clearDate, item.clearTime),
                }));

                const ozoneItems = (ozoneRes.data.response.body.items ?? []).map((item, idx) => ({
                    key: `ozone-${idx}`,
                    지역: item.districtName,
                    권역: item.moveName,
                    항목: "O3",
                    경보단계: mapOzoneLevel(item.issueLvl),
                    발령시간: formatDateTime(item.dataDate || item.issueDate, item.issueTime, true),
                    해제시간: formatDateTime(item.dataDate || item.clearDate, item.clearTime, true),
                }));

                const start = dateRange[0] ? dayjs(dateRange[0]).startOf("day") : null;
                const end = dateRange[1] ? dayjs(dateRange[1]).endOf("day") : null;

                const filterByDate = item => {
                    const 발령 = dayjs(item.발령시간, "YYYY-MM-DD HH:mm");
                    return start && end ? 발령.isSameOrAfter(start) && 발령.isSameOrBefore(end) : true;
                };

                const allItems = [...pmItems, ...ozoneItems].filter(filterByDate);

                const result = allItems
                    .filter(item =>
                        (region === "전체" || item.지역 === region) &&
                        (itemCode === "전체" || item.항목 === itemCode)
                    )
                    .sort((a, b) => new Date(b.발령시간) - new Date(a.발령시간))
                    .map((item, idx) => ({ ...item, 번호: idx + 1 }));

                if (setAvailableRegions) {
                    const uniqueRegions = Array.from(new Set(allItems.map(i => i.지역))).sort();
                    setAvailableRegions(["전체", ...uniqueRegions]);
                }

                setData(result);
            } catch (err) {
                console.error("데이터 요청 오류", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [region, itemCode, dateRange, searchTrigger]);

    return { data, loading };
};

export default AirAlert;
