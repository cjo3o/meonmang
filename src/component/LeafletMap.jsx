import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import regionData from '/RegionData.json';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

function ModalMap({ features, getCenter }) {
    function InvalidateMapSize() {
        const map = useMap();
        useEffect(() => {
            setTimeout(() => {
                map.invalidateSize();
            }, 100);
        }, [map]);
        return null;
    }
    // 중심은 첫 번째 feature 기준
    const center = getCenter(features[0]);

    return (
        <MapContainer
            attributionControl={false}
            center={center}
            zoom={8}
            style={{ height: '400px', width: '100%' }}
        >
            <InvalidateMapSize />
            <TileLayer
                url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgMBAp6Q2VwAAAAASUVORK5CYII="
                attribution=""
            />
            <GeoJSON
                data={{ type: "FeatureCollection", features }}
                style={{
                    fillColor: '#b3d8ff',
                    color: '#3388ff',
                    fillOpacity: 0.6,
                    weight: 2
                }}
            />
        </MapContainer>
    );
}

function LeafletMap() {
    const [selectedFeatures, setSelectedFeatures] = useState(null);

    const getCenter = (feature) => {
        const coords = feature.geometry.coordinates.flat(Infinity);
        const lngs = coords.filter((_, i) => i % 2 === 0);
        const lats = coords.filter((_, i) => i % 2 === 1);
        const avgLng = lngs.reduce((a, b) => a + b) / lngs.length;
        const avgLat = lats.reduce((a, b) => a + b) / lats.length;
        return [avgLat, avgLng]; // Leaflet은 [lat, lng] 순서
    };

    const onEachFeature = (feature, layer) => {
        layer.setStyle({ fillOpacity: 0.4, color: '#3388ff' });

        layer.on({
            mouseover: () => {
                layer.setStyle({ fillOpacity: 0.7 });
            },
            mouseout: () => {
                layer.setStyle({ fillOpacity: 0.4 });
            },
            click: () => {
                // 시/도 클릭 시 하위 구/군 추출
                const ctpName = feature.properties.CTP_KOR_NM;
                const subFeatures = regionData.features.filter(
                    f => f.properties.CTP_KOR_NM === ctpName
                );
                setSelectedFeatures(subFeatures);
            }
        });
    };

    return (
        <>
            <MapContainer
                center={[35.8684, 128.0294]}
                zoom={7}
                style={{ height: '600px', width: '100%' }}
                attributionControl={false}
            >
                <TileLayer
                    url="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAgMBAp6Q2VwAAAAASUVORK5CYII="
                    attribution=""
                />

                <GeoJSON data={regionData} onEachFeature={onEachFeature} />

                {regionData.features.map((feature, idx) => {
                    const [lat, lng] = getCenter(feature);
                    const name = feature.properties.CTP_KOR_NM;

                    return (
                        <CircleMarker
                            key={idx}
                            center={[lat, lng]}
                            radius={10}
                            fillColor="blue"
                            color="white"
                            weight={1}
                            fillOpacity={0.8}
                        >
                            <Tooltip direction="top" offset={[0, -10]} permanent>
                                {name}
                            </Tooltip>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {selectedFeatures && (
                <Modal
                    open={!!selectedFeatures}
                    onCancel={() => setSelectedFeatures(null)}
                    footer={null}
                    title={selectedFeatures[0]?.properties?.CTP_KOR_NM || "지역 상세"}
                    width={450}
                    centered
                    destroyOnClose
                >
                    <ModalMap features={selectedFeatures} getCenter={getCenter} />
                </Modal>
            )}
        </>
    );
}

export default LeafletMap;
