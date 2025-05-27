import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import regionData from '/RegionData.json';

function LeafletMap() {
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
        });
    };

    return (
        <MapContainer
            center={[36.5, 127.5]}
            zoom={7}
            style={{ height: '600px', width: '100%' }}
            attributionControl={false} // ⛔ 로고 제거
        >
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" />

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
    );
}

export default LeafletMap;
