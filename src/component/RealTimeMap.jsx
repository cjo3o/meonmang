import React, {useEffect, useState} from 'react';
import {CustomOverlayMap, MapMarker, Map, useKakaoLoader, useMap} from 'react-kakao-maps-sdk';
import regionData from '/RegionData.json';
import regionCenters from './regionCenters.js';
import styles from '/src/css/Map.module.css';
import axios from 'axios';
import regionModal from "./regionModal.jsx";


const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const AVR_URL = import.meta.env.VITE_AVR_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function RealTimeMap({selectOption}) {
    const [map, setMap] = useState(null);
    const [openOverlay, setOpenOverlay] = useState(null);
    const [sidoAvr, setSidoAvr] = useState([]);
    useKakaoLoader({appkey: KAKAO_API_KEY});

    const handleMarkerClick = (name) => {
        setOpenOverlay((prev) => (prev === name ? null : name));
    };



    // 지도 클릭 시 오버레이 닫기
    useEffect(() => {
        console.log(selectOption);
        if (!map) return;

        var fetchAvrData = async () => {
            try {
                const {data} = await axios.get(`${AVR_URL}?returnType=json&numOfRows=25&pageNo=1&itemCode=${selectOption}&dataGubun=HOUR&serviceKey=${AVR_KEY}`);
                console.log(data.response.body.items);
                setSidoAvr(data.response.body.items);
            } catch (err) {
                console.log("API 호출 오류", err);
            }
        };
        fetchAvrData();

        const handleMapClick = () => {
            setOpenOverlay(null);
        };

        kakao.maps.event.addListener(map, 'click', handleMapClick);

        return () => {
            kakao.maps.event.removeListener(map, 'click', handleMapClick);
        };
    }, [map, selectOption]);


    // 폴리곤 렌더링
    useEffect(() => {
        if (!map || !regionData) return;

        regionData.features.forEach((feature) => {
            const {coordinates, type} = feature.geometry;
            const name = feature.properties.CTP_KOR_NM;

            const paths = [];

            if (type === 'Polygon') {
                coordinates.forEach((ring) => {
                    const path = ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
                    paths.push(path);
                });
            } else if (type === 'MultiPolygon') {
                coordinates.forEach((polygon) => {
                    polygon.forEach((ring) => {
                        const path = ring.map(([lng, lat]) => new kakao.maps.LatLng(lat, lng));
                        paths.push(path);
                    });
                });
            }

            const polygon = new kakao.maps.Polygon({
                path: paths,
                strokeWeight: 2,
                strokeColor: '#004c80',
                strokeOpacity: 0.8,
                fillColor: '#00a0e9',
                fillOpacity: 0.5,
            });

            polygon.setMap(map);

            kakao.maps.event.addListener(polygon, 'click', () => {
                regionModal(name);
            });

            // 마우스 오버 효과
            kakao.maps.event.addListener(polygon, 'mouseover', () => {
                polygon.setOptions({
                    fillOpacity: 0.8,
                    strokeWeight: 3,
                });
                map.getNode().style.cursor = 'pointer';
            });

            kakao.maps.event.addListener(polygon, 'mouseout', () => {
                polygon.setOptions({
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                });
                map.getNode().style.cursor = 'default';
            });
        });
    }, [map]);

    return (
        <>
            <Map className={styles.mapContainer}
                 onCreate={setMap}
                 center={{lat: 35.9, lng: 127.5}}
                 level={13}
                 zoomable={false}
                 draggable={false}
                 disableDoubleClick={true}
            >
                {regionCenters.map((marker) => (
                    <div key={marker.name}>
                        <MapMarker
                            position={{lat: marker.center[0], lng: marker.center[1]}}
                            onClick={() => handleMarkerClick(marker.name)}
                        />
                        {openOverlay === marker.name && (
                            <CustomOverlayMap position={{lat: marker.center[0], lng: marker.center[1]}}>
                                <div className={styles.customOverlay}>
                                    {marker.name} : {
                                    (() => {
                                        if (sidoAvr.length === 0) return "로딩중..";

                                        const avrData = sidoAvr[0];

                                        const regionKeyMap = {
                                            서울: 'seoul',
                                            부산: 'busan',
                                            대구: 'daegu',
                                            인천: 'incheon',
                                            광주: 'gwangju',
                                            대전: 'daejeon',
                                            울산: 'ulsan',
                                            세종: 'sejong',
                                            경기: 'gyeonggi',
                                            강원: 'gangwon',
                                            충북: 'chungbuk',
                                            충남: 'chungnam',
                                            전북: 'jeonbuk',
                                            전남: 'jeonnam',
                                            경북: 'gyeongbuk',
                                            경남: 'gyeongnam',
                                            제주: 'jeju',
                                        };

                                        const key = regionKeyMap[marker.name];
                                        return key && avrData[key] ? `${avrData[key]}` : "데이터 없음";
                                    })()
                                }
                                </div>
                            </CustomOverlayMap>
                        )}
                    </div>
                ))}
            </Map>
        </>
    );
}

export default RealTimeMap;
