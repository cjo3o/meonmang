import React, {useEffect, useState} from 'react';
import styles from '/src/css/Favorites.module.css';
import {Button, Card, Select, TreeSelect} from "antd";
import axios from "axios";
import {CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import treeData from "/korea_region_tree.json";

const SIDO_AVR_URL = import.meta.env.VITE_SIDO_AVR_URL;

const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function Favorites({setOpenSidebar}) {
    const [favorites, setFavorites] = useState(null);
    const [selectData, setSelectData] = useState({});
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [value, setValue] = useState();

    useEffect(() => {
        setOpenSidebar(false);
        fetchFavorites();

    }, []);

    const fetchFavorites = async () => {
        const res = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(res);

        for (const item of res) {
            setLoading(true);
            try {
                const {data} = await axios.get(`${SIDO_AVR_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&sidoName=${item.key}&searchCondition=HOUR`);
                const regionData = data.response.body.items;
                const matched = regionData.find((rd) => rd.cityName === item.cityName);
                setSelectData(prev => ({...prev, [`${item.key}-${item.cityName}`]: matched}));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    const closeModal = () => {
        setOpenModal(false);
        setValue(null);
    }

    const plusFav = () => {
        if (!value) {
            return alert("지역을 선택해주세요");
        }
        const list = JSON.parse(localStorage.getItem("favorites") || "[]");
        const matched = list.find((item) => {
            return item.key === value?.split("-")[0] && item.cityName === value?.split("-")[1]
        });

        if (matched) {
            alert("이미 등록된 지역입니다.");
        } else {
            const newlist = [...list, {key: value?.split("-")[0], cityName: value?.split("-")[1]}]
            localStorage.setItem("favorites", JSON.stringify(newlist));
            alert("즐겨찾기에 등록되었습니다.");
            setOpenModal(false);
            setValue(null);
            fetchFavorites();
        }
    }

    const minusFav = ({mdKey, mdCityName}) => {
        const list = JSON.parse(localStorage.getItem("favorites") || "[]");
        const newList = list.filter((item) => {
            return item.key !== mdKey || item.cityName !== mdCityName;
        });
        localStorage.setItem("favorites", JSON.stringify(newList));
        alert("즐겨찾기에서 해제되었습니다.");
        fetchFavorites();
        setLoading(true);
    }

    const onchange = (newValue) => {
        setValue(newValue);
    }

    return (
        <>
            <div className={styles.content}>
                <div className={styles.contentBox}>
                    <div className={styles.contentTitle}>
                        즐겨찾기 목록
                    </div>
                    <div className={styles.contentBody}>
                        {
                            loading ?
                                <div className={styles.loading}>
                                    <p>등록된 즐겨찾기가 없습니다.</p>
                                    <p>즐겨찾기를 등록해주세요.</p>
                                </div> :
                                favorites?.map((item) => {
                                    const data = selectData[`${item.key}-${item.cityName}`];

                                    return (
                                        <div key={`${item.key}-${item.cityName}`}>
                                            <Card
                                                title={
                                                    <div className={styles.cardTitle}>
                                                        {item.key + "-" + item.cityName}
                                                        <div className={styles.minus} onClick={() => minusFav({
                                                            mdKey: item.key,
                                                            mdCityName: item.cityName
                                                        })}>
                                                            <MinusCircleOutlined/>
                                                        </div>
                                                    </div>
                                                }
                                                style={{"boxShadow": "0 0 4px rgba(0, 0, 0, 0.1)"}}
                                            >
                                                {
                                                    data ? (
                                                        <>
                                                            <p>초미세먼지 {data.pm25Value}</p>
                                                            <p>미세먼지 {data.pm10Value}</p>
                                                            <p>오존 {data.o3Value}</p>
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
                        <div className={styles.plusBox} onClick={() => {
                            const list = JSON.parse(localStorage.getItem("favorites") || "[]");
                            if (list.length >= 5) {
                                alert("즐겨찾기는 최대 5개까지 등록가능합니다.");
                            } else {
                                setOpenModal(true);
                            }
                        }}>
                            <div className={styles.plusBtn}>
                                <PlusOutlined/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {
                openModal && (
                    <div className={styles.modal}>
                        <Card
                            className={styles.modalCard}
                            title={
                                <div className={styles.modalTitle}>
                                    <p>즐겨찾기 추가</p>
                                    <Button onClick={closeModal}>
                                        <CloseOutlined/>
                                    </Button>
                                </div>
                            }
                            variant="borderless"
                            styles={{
                                header: {
                                    padding: 0,
                                    border: "none",
                                    minHeight: 0
                                },
                                body: {
                                    padding: "1rem",
                                    border: "none",
                                    minHeight: 0
                                }
                            }}
                        >
                            <TreeSelect
                                className={styles.selectBox}
                                value={value}
                                treeData={treeData}
                                placeholder="지역을 선택해주세요"
                                styles={{
                                    popup: {root: {maxHeight: 400, overflow: 'auto'}},
                                }}
                                onChange={onchange}
                            />
                            <div className={styles.submit}>
                                <Button onClick={plusFav}>등록</Button>
                            </div>
                        </Card>
                    </div>
                )
            }
        </>
    );
}

export default Favorites;