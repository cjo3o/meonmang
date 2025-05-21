import React from 'react';
import { Map, useKakaoLoader } from 'react-kakao-maps-sdk';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

function RealTimeMap() {
    const [loading, error] = useKakaoLoader({ appkey: KAKAO_API_KEY });

    if (error) return <div>지도 로딩 실패 😢</div>;
    if (!loading) return <div>지도를 불러오는 중...</div>;

    return (
        <Map
            center={{ lat: 35.8714354, lng: 128.601445 }}
            style={{ width: '100%', height: '100%' }}
        />
    );
}

export default RealTimeMap;
