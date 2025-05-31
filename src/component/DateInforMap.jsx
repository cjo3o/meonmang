import React, {useEffect, useState, useCallback} from 'react';
import {
    CustomOverlayMap,
    MapMarker,
    Map,
    useKakaoLoader,
} from 'react-kakao-maps-sdk';
import regionData from '/RegionData.json';
import regionCenters2 from './regionCenters2.js';
import styles from '/src/css/Map.module.css';
import markerIcon from '/src/images/markerIcon.png';
import axios from 'axios';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const DATE_URL = import.meta.env.VITE_DATE_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function DateInforMap({dateOption, selectDate}) {
    const [map, setMap] = useState(null);
    const [openOverlay, setOpenOverlay] = useState(null);
    const [dayInfor, setDayInfor] = useState([]);
    const [regionMarkers, setRegionMarkers] = useState(regionCenters2);
    const [hoveredMarker, setHoveredMarker] = useState(null);
    const [loading, setLoading] = useState(true);


    useKakaoLoader({appkey: KAKAO_API_KEY});

    const handleMarkerClick = (name) => {
        setOpenOverlay((prev) => (prev === name ? null : name));
    };

    const handleMapClick = useCallback(() => {
        setOpenOverlay(null);
    }, []);

    useEffect(() => {
        if (!map) return;

        // 지도 클릭 시 오버레이 닫기
        kakao.maps.event.addListener(map, 'click', handleMapClick);

        return () => {
            kakao.maps.event.removeListener(map, 'click', handleMapClick);
        };
    }, [map, handleMapClick]);

    useEffect(() => {
        const fetchAvrData = async () => {
            setLoading(true);
            try {
                const {data} = await axios.get(`${DATE_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&searchDate=2025-05-28&informCode=${dateOption}`);
                const items = data.response.body.items;

                const selectedData = selectDate === "today" ? items[0] : items[1];
                const parsed = selectedData.informGrade.split(",").map(item => item.split(":"));
                setDayInfor(parsed);
            } catch (err) {
                console.error("API 호출 오류", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAvrData();
    }, [dateOption, selectDate]);

    useEffect(() => {
        const updatedMarkers = regionCenters2.map((item) => {
            const match = dayInfor.find(([name]) => name.trim() === item.name);
            return {
                ...item,
                state: match ? match[1].trim() : ''
            };
        });
        setRegionMarkers(updatedMarkers);
    }, [dayInfor]);

    // 지도 폴리곤 그리기
    useEffect(() => {
        if (!map) return;

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
                fillColor: '#ff9b9b',
                fillOpacity: 0.5,
            });

            polygon.setMap(map);

            kakao.maps.event.addListener(polygon, 'click', () => {
                setOpenOverlay(name);
            });
        });
    }, [map]);

    // 상태별 색상 클래스
    const getStateColorClass = (state) => {
        switch (state) {
            case '좋음':
                return styles.good;
            case '보통':
                return styles.normal;
            case '나쁨':
                return styles.bad;
            case '매우나쁨':
                return styles.worst;
            default:
                return styles.unknown;
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingText}>데이터 로딩중...</div>
            </div>
        );
    }

    return (
        <Map
            className={styles.mapContainer}
            onCreate={setMap}
            center={{lat: 35.9, lng: 127.5}}
            level={13}
            zoomable={false}
            draggable={false}
            disableDoubleClick={true}
        >
            {regionMarkers.map((marker) => (
                <div key={marker.name}>
                    <MapMarker
                        image={{
                            src: markerIcon,
                            size: {
                                width: openOverlay === marker.name || hoveredMarker === marker.name ? 35 : 25,
                                height: openOverlay === marker.name || hoveredMarker === marker.name ? 35 : 25,
                            },
                        }}
                        position={{lat: marker.center[0], lng: marker.center[1]}}
                        onClick={() => handleMarkerClick(marker.name)}
                        onMouseOver={() => setHoveredMarker(marker.name)}
                        onMouseOut={() => setHoveredMarker(null)}
                    />
                    {openOverlay === marker.name && (
                        <CustomOverlayMap position={{lat: marker.center[0], lng: marker.center[1]}}>
                            <div className={`${styles.customOverlay} ${getStateColorClass(marker.state)}`}>
                                <div>{marker.name}</div>
                                <div>{marker.state || '정보 없음'}</div>
                            </div>
                        </CustomOverlayMap>
                    )}
                </div>
            ))}
        </Map>
    );
}

export default DateInforMap;
