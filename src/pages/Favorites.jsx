import React, {useEffect, useState} from 'react';
import styles from '/src/css/Favorites.module.css';
import {Button, Card, message, Select, TreeSelect} from "antd";
import '@ant-design/v5-patch-for-react-19';
import axios from "axios";
import {CloseOutlined, MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import treeData from "/korea_region_tree.json";
import good from "../images/Good.svg";
import normal from "../images/normal.svg";
import bad from "../images/bad.svg";
import worst from "../images/worst.svg";

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
                const regionData = data?.response?.body?.items;
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
            return message.error("지역을 선택해주세요");
        }
        const list = JSON.parse(localStorage.getItem("favorites") || "[]");
        const matched = list.find((item) => {
            return item.key === value?.split("-")[0] && item.cityName === value?.split("-")[1]
        });

        if (matched) {
           message.error("이미 등록된 지역입니다.");
        } else {
            const newlist = [...list, {key: value?.split("-")[0], cityName: value?.split("-")[1]}]
            localStorage.setItem("favorites", JSON.stringify(newlist));
            message.success("즐겨찾기에 등록되었습니다.");
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
        message.success("즐겨찾기에서 해제되었습니다.");
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
                                                <div className={styles.modalBody}>
                                                    {
                                                        data ? (
                                                            <>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>초미세먼지</p>
                                                                        <p>(PM-2.5)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.pm25Value === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.pm25Value === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.pm25Value)) {
                                                                                            if (data.pm25Value <= 15) {
                                                                                                return good;
                                                                                            } else if (data.pm25Value <= 35) {
                                                                                                return normal;
                                                                                            } else if (data.pm25Value <= 75) {
                                                                                                return bad;
                                                                                            } else if (76 <= data.pm25Value) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.pm25Value)) {
                                                                                                if (data.pm25Value <= 15) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.pm25Value}</div>;
                                                                                                } else if (data.pm25Value <= 35) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.pm25Value}</div>;
                                                                                                } else if (data.pm25Value <= 75) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.pm25Value}</div>;
                                                                                                } else if (76 <= data.pm25Value) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.pm25Value}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>㎍/㎥</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.pm25Value === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.pm25Value)) {
                                                                                            if (data.pm25Value <= 15) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.pm25Value <= 35) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.pm25Value <= 75) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (76 <= data.pm25Value) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>미세먼지</p>
                                                                        <p>(PM-10)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.pm10Value === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.pm10Value === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.pm10Value)) {
                                                                                            if (data.pm10Value <= 30) {
                                                                                                return good;
                                                                                            } else if (data.pm10Value <= 80) {
                                                                                                return normal;
                                                                                            } else if (data.pm10Value <= 150) {
                                                                                                return bad;
                                                                                            } else if (151 <= data.pm10Value) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.pm10Value)) {
                                                                                                if (data.pm10Value <= 30) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.pm10Value}</div>;
                                                                                                } else if (data.pm10Value <= 80) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.pm10Value}</div>;
                                                                                                } else if (data.pm10Value <= 150) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.pm10Value}</div>;
                                                                                                } else if (151 <= data.pm10Value) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.pm10Value}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>㎍/㎥</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.pm10Value === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.pm10Value)) {
                                                                                            if (data.pm10Value <= 30) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.pm10Value <= 80) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.pm10Value <= 150) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (151 <= data.pm10Value) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>오존</p>
                                                                        <p>(O₃)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.o3Value === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.o3Value === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.o3Value)) {
                                                                                            if (data.o3Value <= 0.03) {
                                                                                                return good;
                                                                                            } else if (data.o3Value <= 0.09) {
                                                                                                return normal;
                                                                                            } else if (data.o3Value <= 0.15) {
                                                                                                return bad;
                                                                                            } else if (0.151 <= data.o3Value) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.o3Value)) {
                                                                                                if (data.o3Value <= 0.03) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.o3Value}</div>;
                                                                                                } else if (data.o3Value <= 0.09) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.o3Value}</div>;
                                                                                                } else if (data.o3Value <= 0.15) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.o3Value}</div>;
                                                                                                } else if (0.151 <= data.o3Value) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.o3Value}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>ppm</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.o3Value === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.o3Value)) {
                                                                                            if (data.o3Value <= 0.03) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.o3Value <= 0.09) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.o3Value <= 0.15) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (0.151 <= data.o3Value) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>이산화질소</p>
                                                                        <p>(NO₂)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.no2Value === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.no2Value === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.no2Value)) {
                                                                                            if (data.no2Value <= 0.03) {
                                                                                                return good;
                                                                                            } else if (data.no2Value <= 0.06) {
                                                                                                return normal;
                                                                                            } else if (data.no2Value <= 0.2) {
                                                                                                return bad;
                                                                                            } else if (0.201 <= data.no2Value) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.no2Value)) {
                                                                                                if (data.no2Value <= 0.03) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.no2Value}</div>;
                                                                                                } else if (data.no2Value <= 0.06) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.no2Value}</div>;
                                                                                                } else if (data.no2Value <= 0.2) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.no2Value}</div>;
                                                                                                } else if (0.201 <= data.no2Value) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.no2Value}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>ppm</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.no2Value === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.no2Value)) {
                                                                                            if (data.no2Value <= 0.03) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.no2Value <= 0.06) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.no2Value <= 0.2) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (0.201 <= data.no2Value) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>일산화탄소</p>
                                                                        <p>(CO)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.coValue === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.coValue === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.coValue)) {
                                                                                            if (data.coValue <= 2) {
                                                                                                return good;
                                                                                            } else if (data.coValue <= 9) {
                                                                                                return normal;
                                                                                            } else if (data.coValue <= 15) {
                                                                                                return bad;
                                                                                            } else if (15.1 <= data.coValue) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.coValue)) {
                                                                                                if (data.coValue <= 2) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.coValue}</div>;
                                                                                                } else if (data.coValue <= 9) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.coValue}</div>;
                                                                                                } else if (data.coValue <= 15) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.coValue}</div>;
                                                                                                } else if (15.1 <= data.coValue) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.coValue}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>ppm</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.coValue === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.coValue)) {
                                                                                            if (data.coValue <= 2) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.coValue <= 9) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.coValue <= 15) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (15.1 <= data.coValue) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div className={styles.modalBodybox}>
                                                                    <div className={styles.boxTitle}>
                                                                        <p>아황산가스</p>
                                                                        <p>(SO₂)</p>
                                                                    </div>
                                                                    <div className={styles.boxBody}>
                                                                        {
                                                                            data.so2Value === "" ? "데이터 없음" : (
                                                                                <>
                                                                                    <img src={(() => {
                                                                                        if (data.so2Value === "") {
                                                                                            return null;
                                                                                        }
                                                                                        if (!isNaN(data.so2Value)) {
                                                                                            if (data.so2Value <= 0.02) {
                                                                                                return good;
                                                                                            } else if (data.so2Value <= 0.05) {
                                                                                                return normal;
                                                                                            } else if (data.so2Value <= 0.15) {
                                                                                                return bad;
                                                                                            } else if (0.151 <= data.so2Value) {
                                                                                                return worst;
                                                                                            }
                                                                                        }
                                                                                    })()} alt=""/>
                                                                                    {
                                                                                        (() => {
                                                                                            if (!isNaN(data.so2Value)) {
                                                                                                if (data.so2Value <= 0.02) {
                                                                                                    return <div
                                                                                                        style={{color: "#0086FF"}}>{data.so2Value}</div>;
                                                                                                } else if (data.so2Value <= 0.05) {
                                                                                                    return <div
                                                                                                        style={{color: "#00DE86"}}>{data.so2Value}</div>;
                                                                                                } else if (data.so2Value <= 0.15) {
                                                                                                    return <div
                                                                                                        style={{color: "#FFC957"}}>{data.so2Value}</div>;
                                                                                                } else if (0.151 <= data.so2Value) {
                                                                                                    return <div
                                                                                                        style={{color: "#DE4F4F"}}>{data.so2Value}</div>;
                                                                                                }
                                                                                            }
                                                                                        })()
                                                                                    }
                                                                                    <p>ppm</p>
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                    <div className={styles.boxFooter}>
                                                                        {
                                                                            data.so2Value === "" ? null : (
                                                                                <>
                                                                                    {(() => {
                                                                                        if (!isNaN(data.so2Value)) {
                                                                                            if (data.so2Value <= 0.02) {
                                                                                                return <p
                                                                                                    style={{color: "#0086FF"}}>좋음</p>;
                                                                                            } else if (data.so2Value <= 0.05) {
                                                                                                return <p
                                                                                                    style={{color: "#00DE86"}}>보통</p>;
                                                                                            } else if (data.so2Value <= 0.15) {
                                                                                                return <p
                                                                                                    style={{color: "#FFC957"}}>나쁨</p>;
                                                                                            } else if (0.151 <= data.so2Value) {
                                                                                                return <p
                                                                                                    style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                                                            }
                                                                                        }
                                                                                    })()}
                                                                                </>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <p>데이터 로딩중...</p>
                                                        )
                                                    }
                                                </div>
                                            </Card>
                                        </div>
                                    )
                                })
                        }
                        <div className={styles.plusBox} onClick={() => {
                            const list = JSON.parse(localStorage.getItem("favorites") || "[]");
                            if (list.length >= 5) {
                                message.error("즐겨찾기는 최대 5개까지 등록가능합니다.");
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