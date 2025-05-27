import React, {useEffect, useState} from 'react';
import {Button, Card, Select} from "antd";
import axios from "axios";
import styles from "/src/css/RegionModal.module.css";
import good from "/src/images/Good.svg";
import normal from "/src/images/normal.svg";

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
        인천특별시: "인천",
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

    console.log(sido);
    console.log(district);

    const findItem = sido?.find(item => {
        return item.cityName === district
    });
    console.log(findItem);

    const changeImg = () => {
        if (findItem !== undefined) {
            if (0 <= findItem.pm25Value && findItem.pm25Value <= 15) {
                setImg(good);
                console.log(img);
            } else if (findItem.pm25Value <= 35) {
                setImg(normal);
                console.log(img);
            }
        }
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
                                  defaultValue="지역선택"
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
                                      changeImg();
                                  }}
                              />
                              <div className={styles.modalDatatime}>
                                  {
                                      sido !== null && (
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
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.pm25Value === "" ? "데이터 없음" : findItem.pm25Value}
                                        <p>㎍/㎥</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
                                    </div>
                                </div>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>미세먼지</p>
                                        <p>(PM-10)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.pm10Value === "" ? "데이터 없음" : findItem.pm10Value}
                                        <p>㎍/㎥</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
                                    </div>
                                </div>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>오존</p>
                                        <p>(O₃)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.o3Value === "" ? "데이터 없음" : findItem.o3Value}
                                        <p>ppm</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
                                    </div>
                                </div>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>이산화질소</p>
                                        <p>(NO₂)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.no2Value === "" ? "데이터 없음" : findItem.no2Value}
                                        <p>ppm</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
                                    </div>
                                </div>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>일산화탄소</p>
                                        <p>(CO)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.coValue === "" ? "데이터 없음" : findItem.coValue}
                                        <p>ppm</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
                                    </div>
                                </div>
                                <div className={styles.modalBodybox}>
                                    <div className={styles.boxTitle}>
                                        <p>아황산가스</p>
                                        <p>(SO₂)</p>
                                    </div>
                                    <div className={styles.boxBody}>
                                        <img src={img} alt="매우좋음"/>
                                        {findItem.so2Value === "" ? "데이터 없음" : findItem.so2Value}
                                        <p>ppm</p>
                                    </div>
                                    <div className={styles.boxFooter}>
                                        매우좋음
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