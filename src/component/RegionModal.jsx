import React, {useEffect, useState} from 'react';
import {Button, Card, Select} from "antd";
import axios from "axios";
import styles from "/src/css/RegionModal.module.css";

const SIDO_AVR_URL = import.meta.env.VITE_SIDO_AVR_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function RegionModal({region, onClose}) {
    const [sido, setSido] = useState(null);

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
            } catch (error) {
                console.error(error);
            }
        }
        fetchRegionData();
    }, [key]);
    console.log(sido);
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
                                  defaultValue="지역을 선택해주세요"
                                  className={styles.roundSelect}
                                  options={
                                      sido
                                          ? sido.map((item) => ({
                                              label: item.cityName,
                                              value: item.cityName
                                          })) : []
                                  }
                              />
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
                      }
                  }}>
                dd
            </Card>
        </>
    )
        ;
}


export default RegionModal;