import React from 'react';
import {Map, useKakaoLoader} from 'react-kakao-maps-sdk';
import styles from '/src/css/Map.module.css';
import DivideRegion from "./DivideRegion.jsx";


const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

function RealTimeMap() {
    const [loading, error] = useKakaoLoader({appkey: KAKAO_API_KEY});
    console.log(KAKAO_API_KEY);
    console.log(loading);
    if (error) return <div>지도 로딩 실패 😢</div>;
    if (loading) return <div>지도를 불러오는 중...</div>;

    return (
        <>
            <Map className={styles.mapContainer}
                 center={{lat: 35.9, lng: 127.5}}
                 level={13}
                 zoomable={false}
                 draggable={false}
                 disableDoubleClick={true}
            >
                <DivideRegion/>
            </Map>
        </>
    );
}

export default RealTimeMap;
