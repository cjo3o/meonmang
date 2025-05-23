import React, { useEffect, useState } from 'react';
import { CustomOverlayMap, MapMarker, useMap } from 'react-kakao-maps-sdk';
import regionData from '/RegionData.json';
import regionCenters from './regionCenters.js';
import styles from '/src/css/Map.module.css';

function DivideRegion() {
    const map = useMap();
    const [openOverlay, setOpenOverlay] = useState(null);

    // 마커 클릭 핸들러
    const handleMarkerClick = (name) => {
        setOpenOverlay((prev) => (prev === name ? null : name));
    };

    // 지도 클릭 시 오버레이 닫기
    useEffect(() => {
        if (!map) return;

        const handleMapClick = () => {
            setOpenOverlay(null);
        };

        kakao.maps.event.addListener(map, 'click', handleMapClick);

        return () => {
            kakao.maps.event.removeListener(map, 'click', handleMapClick);
        };
    }, [map]);

    // 폴리곤 렌더링
    useEffect(() => {
        if (!map || !regionData) return;

        regionData.features.forEach((feature) => {
            const { coordinates, type } = feature.geometry;
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
                alert(name);
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
            {regionCenters.map((marker) => (
                <div key={marker.name}>
                    <MapMarker
                        position={{ lat: marker.center[0], lng: marker.center[1] }}
                        onClick={() => handleMarkerClick(marker.name)}
                    />
                    {openOverlay === marker.name && (
                        <CustomOverlayMap position={{ lat: marker.center[0], lng: marker.center[1] }}>
                            <div className={styles.customOverlay}>
                                {marker.name} : 12
                            </div>
                        </CustomOverlayMap>
                    )}
                </div>
            ))}
        </>
    );
}

export default DivideRegion;
