import React, {useEffect} from 'react';
import {useMap} from 'react-kakao-maps-sdk';
import regionData from '/RegionData.json';

function DivideRegion() {
    const map = useMap();

    useEffect(() => {
        if (!map || !regionData) return;

        regionData.features.forEach((feature) => {
            const {coordinates, type} = feature.geometry;
            const name = feature.properties.CTP_KOR_NM;

            const paths = [];

            if (type === 'Polygon') {
                // 외곽선 + 내부 링 모두 처리
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

            // 선택적으로 클릭 이벤트
            kakao.maps.event.addListener(polygon, 'click', () => {
                alert(name);
            });
            kakao.maps.event.addListener(polygon, 'mouseover', () => {
                polygon.setOptions({
                    fillOpacity: 0.8,
                    strokeWeight: 3,
                })
                map.getNode().style.cursor = 'pointer';
            });
            kakao.maps.event.addListener(polygon, 'mouseout', () => {
                polygon.setOptions({
                    fillOpacity: 0.5,
                    strokeWeight: 2,
                })
                map.getNode().style.cursor = 'default';

            });
        });
    }, [map]);

    return null;
}

export default DivideRegion;
