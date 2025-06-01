import React, {useEffect, useState} from 'react';
import styles from '/src/css/Favorites.module.css';
import {Card, Select} from "antd";
import axios from "axios";
import {PlusOutlined} from "@ant-design/icons";

const SIDO_AVR_URL = import.meta.env.VITE_SIDO_AVR_URL;

// const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function Favorites({setOpenSidebar}) {
    const [favorites, setFavorites] = useState(null);
    const [selectData, setSelectData] = useState({});
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        setOpenSidebar(false);
        const res = JSON.parse(localStorage.getItem("favorites") || "[]");
        console.log(res);
        setFavorites(res);

        res.forEach(async (item) => {
            setLoading(true);
            try {
                const {data} = await axios.get(`${SIDO_AVR_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&sidoName=${item.key}&searchCondition=HOUR`);
                const regionData = data.response.body.items;
                const matched = regionData.find((rd) => rd.cityName === item.cityName);
                console.log(regionData);
                console.log(matched);
                setSelectData(prev => ({...prev, [`${item.key}-${item.cityName}`]: matched}));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })
    }, []);

    const plusFav = () => {
        setOpenModal(true);
    }

    if (loading) {
        return <div className={styles.loading}>데이터 불러오는중...</div>;
    }

    console.log(favorites);
    console.log(selectData);

    return (
        <>
            <div className={styles.content}>
                <div className={styles.contentBox}>
                    <div className={styles.contentTitle}>
                        즐겨찾기 목록
                    </div>
                    {
                        favorites?.map((item) => {
                            const data = selectData[`${item.key}-${item.cityName}`];

                            return (
                                <div key={item.cityName}>
                                    <Card
                                        title={item.key + "-" + item.cityName}
                                        style={{"box-shadow": "0 2px 4px 0 rgba(0, 0, 0, 0.1)"}}
                                    >
                                        {
                                            data ? (
                                                <>
                                                    <p>초미세먼지 {data.pm25Value}</p>
                                                    <p>미세먼지 {data.pm10Value}</p>
                                                    <p>오존 {data.pmo3Value}</p>
                                                    <p>이산화질소 {data.no2Value}</p>
                                                    <p>일산화탄소 {data.coValue}</p>
                                                    <p>아황산가스 {data.so2Value}</p>
                                                </>
                                            ) : (
                                                <p>데이터 로딩중...</p>
                                            )
                                        }
                                    </Card>
                                </div>
                            )
                        })
                    }
                    <div className={styles.plusBox} onClick={plusFav}>
                        <div className={styles.plusBtn}>
                            <PlusOutlined/>
                        </div>
                    </div>
                </div>
            </div>
            {
                openModal && (
                    <div className={styles.modal}>
                        <Card
                            className={styles.modalCard}
                            title="즐겨찾기 추가">
                            <Select
                                options={[]}
                            />
                        </Card>
                    </div>
                )
            }
        </>
    );
}

export default Favorites;