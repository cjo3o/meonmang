import React, {use, useEffect, useState} from 'react';
import {Button, Card, Select} from "antd";
import axios from "axios";
import styles from "/src/css/RegionModal.module.css";
import good from "/src/images/Good.svg";
import normal from "/src/images/normal.svg";
import bad from "/src/images/bad.svg";
import worst from "/src/images/worst.svg";

const SIDO_AVR_URL = import.meta.env.VITE_SIDO_AVR_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function RegionModal({region, onClose}) {
    const [sido, setSido] = useState(null);
    const [dataTime, setDataTime] = useState(null);
    const [district, setDistrict] = useState(null);
    const [img, setImg] = useState(good);

    const regionKeyMap = {
        서울특별시: "서울",
        대구광역시: "대구",
        부산광역시: "부산",
        대전광역시: "대전",
        인천광역시: "인천",
        광주광역시: "광주",
        세종특별자치시: "세종",
        경기도: "경기",
        강원도: "강원",
        충청북도: "충북",
        충청남도: "충남",
        전라북도: "전북",
        전라남도: "전남",
        경상북도: "경북",
        경상남도: "경남",
        울산광역시: "울산",
        제주특별자치도: "제주"
    }
    const key = regionKeyMap[region];
    useEffect(() => {
        const fetchRegionData = async () => {
            try {
                const {
                    data,
                    error
                } = await axios.get(`${SIDO_AVR_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&sidoName=${key}&searchCondition=HOUR`)
                console.log(data);
                setSido(data.response.body.items);
                setDataTime(data.response.body.items[0].dataTime);
            } catch (error) {
                console.error(error);
            }
        }
        fetchRegionData();
    }, [key]);

    useEffect(() => {
        if (sido && sido.length > 0) {
            setDistrict(sido[0].cityName);
        }
    }, [sido]);

    useEffect(() => {
        if (!sido || !district) return;

        const selected = sido.find(item => item.cityName === district);
        if (!selected) return;

        const pm25 = Number(selected.pm25Value);
        if (!isNaN(pm25)) {
            if (pm25 <= 15) {
                setImg(good);
            } else if (pm25 <= 35) {
                setImg(normal);
            } else {
                // 필요 시 보통/나쁨/매우나쁨 등 다른 이미지도 설정 가능
            }
        }
    }, [district]);

    const findItem = sido?.find(item => {
        return item.cityName === district
    });
    console.log(findItem);

    // const changeImg = () => {
    //     if (findItem !== undefined) {
    //         if (Number(findItem.pm25Value) <= 15) {
    //             setImg(good);
    //             console.log("좋음");
    //             console.log(findItem.pm25Value);
    //         } else if (Number(findItem.pm25Value) <= 35) {
    //             setImg(normal);
    //             console.log("보통");
    //             console.log(findItem.pm25Value);
    //         }
    //     }
    // }

    if (!sido || !district) {
        return <div className={styles.loading}>데이터 불러오는중...</div>;
    }

    return (
        <>
            <Card className={styles.modalContent}
                  title={
                      <>
                          <div className={styles.modalTitle}>
                              <div>
                                  {region} 대기정보
                              </div>
                              <Button onClick={onClose}>X</Button>
                          </div>
                          <div className={styles.modalsubTitle}>
                              <Select
                                  defaultValue={`${district}`}
                                  className={styles.roundSelect}
                                  style={{width: "40%", textAlign: "center"}}
                                  options={
                                      sido
                                          ? sido.map((item) => ({
                                              label: item.cityName,
                                              value: item.cityName
                                          })) : []
                                  }
                                  onChange={value => {
                                      setDistrict(value);
                                      // changeImg();
                                  }}
                              />
                              <div className={styles.modalDatatime}>
                                  {
                                      (
                                          <div>
                                              {
                                                  dataTime.split(" ")[0] + " " + dataTime.split(" ")[1].split(":")[0] + "시"
                                              }
                                          </div>
                                      )
                                  }
                              </div>
                          </div>
                      </>
                  }
                  hoverable={true}
                  variant="borderless"
                  styles={{
                      header: {
                          padding: 0,
                          border: "none",
                          minHeight: 0
                      },
                      body: {
                          padding: 0,
                          border: "none",
                          minHeight: 0
                      }
                  }}>
                <div className={styles.modalBody}>
                    {
                        findItem === undefined ? "데이터 없음" : (
                            <>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>초미세먼지</p>
                                        <p>(PM-2.5)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        {
                                            findItem.pm25Value === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.pm25Value === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.pm25Value)) {
                                                            if (findItem.pm25Value <= 15) {
                                                                return good;
                                                            } else if (findItem.pm25Value <= 35) {
                                                                return normal;
                                                            } else if (findItem.pm25Value <= 75) {
                                                                return bad;
                                                            } else if (76 <= findItem.pm25Value) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.pm25Value)) {
                                                                if (findItem.pm25Value <= 15) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.pm25Value}</div>;
                                                                } else if (findItem.pm25Value <= 35) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.pm25Value}</div>;
                                                                } else if (findItem.pm25Value <= 75) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.pm25Value}</div>;
                                                                } else if (76 <= findItem.pm25Value) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.pm25Value}</div>;
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
                                            findItem.pm25Value === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.pm25Value)) {
                                                            if (findItem.pm25Value <= 15) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.pm25Value <= 35) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.pm25Value <= 75) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (76 <= findItem.pm25Value) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
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
                                            findItem.pm10Value === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.pm10Value === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.pm10Value)) {
                                                            if (findItem.pm10Value <= 30) {
                                                                return good;
                                                            } else if (findItem.pm10Value <= 80) {
                                                                return normal;
                                                            } else if (findItem.pm10Value <= 150) {
                                                                return bad;
                                                            } else if (151 <= findItem.pm10Value) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.pm10Value)) {
                                                                if (findItem.pm10Value <= 30) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.pm10Value}</div>;
                                                                } else if (findItem.pm10Value <= 80) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.pm10Value}</div>;
                                                                } else if (findItem.pm10Value <= 150) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.pm10Value}</div>;
                                                                } else if (151 <= findItem.pm10Value) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.pm10Value}</div>;
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
                                            findItem.pm10Value === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.pm10Value)) {
                                                            if (findItem.pm10Value <= 30) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.pm10Value <= 80) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.pm10Value <= 150) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (151 <= findItem.pm10Value) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
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
                                            findItem.o3Value === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.o3Value === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.o3Value)) {
                                                            if (findItem.o3Value <= 0.03) {
                                                                return good;
                                                            } else if (findItem.o3Value <= 0.09) {
                                                                return normal;
                                                            } else if (findItem.o3Value <= 0.15) {
                                                                return bad;
                                                            } else if (0.151 <= findItem.o3Value) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.o3Value)) {
                                                                if (findItem.o3Value <= 0.03) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.o3Value}</div>;
                                                                } else if (findItem.o3Value <= 0.09) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.o3Value}</div>;
                                                                } else if (findItem.o3Value <= 0.15) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.o3Value}</div>;
                                                                } else if (0.151 <= findItem.o3Value) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.o3Value}</div>;
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
                                            findItem.o3Value === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.o3Value)) {
                                                            if (findItem.o3Value <= 0.03) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.o3Value <= 0.09) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.o3Value <= 0.15) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (0.151 <= findItem.o3Value) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
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
                                            findItem.no2Value === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.no2Value === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.no2Value)) {
                                                            if (findItem.no2Value <= 0.03) {
                                                                return good;
                                                            } else if (findItem.no2Value <= 0.06) {
                                                                return normal;
                                                            } else if (findItem.no2Value <= 0.2) {
                                                                return bad;
                                                            } else if (0.201 <= findItem.no2Value) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.no2Value)) {
                                                                if (findItem.no2Value <= 0.03) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.no2Value}</div>;
                                                                } else if (findItem.no2Value <= 0.06) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.no2Value}</div>;
                                                                } else if (findItem.no2Value <= 0.2) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.no2Value}</div>;
                                                                } else if (0.201 <= findItem.no2Value) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.no2Value}</div>;
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
                                            findItem.no2Value === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.no2Value)) {
                                                            if (findItem.no2Value <= 0.03) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.no2Value <= 0.06) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.no2Value <= 0.2) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (0.201 <= findItem.no2Value) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
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
                                            findItem.coValue === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.coValue === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.coValue)) {
                                                            if (findItem.coValue <= 2) {
                                                                return good;
                                                            } else if (findItem.coValue <= 9) {
                                                                return normal;
                                                            } else if (findItem.coValue <= 15) {
                                                                return bad;
                                                            } else if (15.1 <= findItem.coValue) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.coValue)) {
                                                                if (findItem.coValue <= 2) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.coValue}</div>;
                                                                } else if (findItem.coValue <= 9) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.coValue}</div>;
                                                                } else if (findItem.coValue <= 15) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.coValue}</div>;
                                                                } else if (15.1 <= findItem.coValue) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.coValue}</div>;
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
                                            findItem.coValue === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.coValue)) {
                                                            if (findItem.coValue <= 2) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.coValue <= 9) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.coValue <= 15) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (15.1 <= findItem.coValue) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
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
                                            findItem.so2Value === "" ? "데이터 없음" : (
                                                <>
                                                    <img src={(() => {
                                                        if (findItem.so2Value === "") {
                                                            return null;
                                                        }
                                                        if (!isNaN(findItem.so2Value)) {
                                                            if (findItem.so2Value <= 0.02) {
                                                                return good;
                                                            } else if (findItem.so2Value <= 0.05) {
                                                                return normal;
                                                            } else if (findItem.so2Value <= 0.15) {
                                                                return bad;
                                                            } else if (0.151 <= findItem.so2Value) {
                                                                return worst;
                                                            }
                                                        }
                                                    })()} alt=""/>
                                                    {
                                                        (() => {
                                                            if (!isNaN(findItem.so2Value)) {
                                                                if (findItem.so2Value <= 0.02) {
                                                                    return <div style={{color: "#0086FF"}}>{findItem.so2Value}</div>;
                                                                } else if (findItem.so2Value <= 0.05) {
                                                                    return <div style={{color: "#00DE86"}}>{findItem.so2Value}</div>;
                                                                } else if (findItem.so2Value <= 0.15) {
                                                                    return <div style={{color: "#FFC957"}}>{findItem.so2Value}</div>;
                                                                } else if (0.151 <= findItem.so2Value) {
                                                                    return <div style={{color: "#DE4F4F"}}>{findItem.so2Value}</div>;
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
                                            findItem.so2Value === "" ? null : (
                                                <>
                                                    {(() => {
                                                        if (!isNaN(findItem.so2Value)) {
                                                            if (findItem.so2Value <= 0.02) {
                                                                return <p style={{color: "#0086FF"}}>좋음</p>;
                                                            } else if (findItem.so2Value <= 0.05) {
                                                                return <p style={{color: "#00DE86"}}>보통</p>;
                                                            } else if (findItem.so2Value <= 0.15) {
                                                                return <p style={{color: "#FFC957"}}>나쁨</p>;
                                                            } else if (0.151 <= findItem.so2Value) {
                                                                return <p style={{color: "#DE4F4F"}}>매우나쁨</p>;
                                                            }
                                                        }
                                                    })()}
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </>
                        )

                    }
                </div>
            </Card>
        </>
    )
        ;
}


export default RegionModal;