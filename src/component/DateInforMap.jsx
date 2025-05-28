import React, {useEffect, useRef, useState} from 'react';
import {CustomOverlayMap, MapMarker, Map, useKakaoLoader, useMap} from 'react-kakao-maps-sdk';
import regionData from '/RegionData.json';
import regionCenters2 from './regionCenters2.js';
import styles from '/src/css/Map.module.css';
import axios from 'axios';


const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const DATE_URL = import.meta.env.VITE_DATE_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function DateInforMap({dateOption, selectDate}) {
    const [map, setMap] = useState(null);
    const [openOverlay, setOpenOverlay] = useState(null);
    const [dayInfor, setDayInfor] = useState([]);

    useKakaoLoader({appkey: KAKAO_API_KEY});

    const handleMarkerClick = (name) => {
        setOpenOverlay((prev) => (prev === name ? null : name));
    };


    // 지도 클릭 시 오버레이 닫기
    useEffect(() => {
        if (!map) return;

        const fetchAvrData = async () => {
            try {
                const {data} = await axios.get(`${DATE_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&searchDate=2025-05-28&informCode=${dateOption}`);

                if (selectDate === "today") {
                    console.log(data.response.body.items[0]);
                    setDayInfor(data.response.body.items[0].informGrade.split(","));
                    console.log(data.response.body.items[0].informData);
                } else if (selectDate === "tomorrow") {
                    console.log(data.response.body.items[1]);
                    setDayInfor(data.response.body.items[1].informGrade.split(","));
                    console.log(data.response.body.items[1].informData);
                }
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
    }, [map, dateOption, selectDate]);

    const result = dayInfor.map(item=>{
        return item.split(':')
    })
    console.log(result);

    regionCenters2.forEach((item) => {
        console.log(item.name);
        result.forEach((item2) => {
            if(item.name === item2[0].trim()){
                item.state = item2[1].trim();
            }
        })

    })



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
                onOpenModal(name);
            });

            // 마우스 오버 효과
            // kakao.maps.event.addListener(polygon, 'mouseover', () => {
            //     polygon.setOptions({
            //         fillOpacity: 0.8,
            //         strokeWeight: 3,
            //     });
            //     map.getNode().style.cursor = 'pointer';
            // });

            // kakao.maps.event.addListener(polygon, 'mouseout', () => {
            //     polygon.setOptions({
            //         fillOpacity: 0.5,
            //         strokeWeight: 2,
            //     });
            //     map.getNode().style.cursor = 'default';
            // });
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
                {regionCenters2.map((marker) => (
                    <div key={marker.name}>
                        <MapMarker
                            position={{lat: marker.center[0], lng: marker.center[1]}}
                            onClick={() => handleMarkerClick(marker.name)}
                        />
                        {openOverlay === marker.name && (
                            <CustomOverlayMap position={{lat: marker.center[0], lng: marker.center[1]}}>
                                <div className={styles.customOverlay}>
                                    {marker.state}
                                </div>
                            </CustomOverlayMap>
                        )}
                    </div>
                ))}
            </Map>
        </>
    );
}

export default DateInforMap;
