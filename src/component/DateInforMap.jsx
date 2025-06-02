import React, { useEffect, useState, useCallback } from "react";
import {
  CustomOverlayMap,
  MapMarker,
  Map,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import regionData from "/RegionData.json";
import regionCenters2 from "./regionCenters2.js";
import styles from "/src/css/Map.module.css";
import markerIcon from "/src/images/markerIcon.png";
import axios from "axios";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const DATE_URL = import.meta.env.VITE_DATE_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function DateInforMap({ dateOption, selectDate }) {
  const [map, setMap] = useState(null);
  const [openOverlay, setOpenOverlay] = useState(null);
  const [dayInfor, setDayInfor] = useState([]);
  const [regionMarkers, setRegionMarkers] = useState(regionCenters2);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [mapLevel, setMapLevel] = useState(() => {
    return window.innerWidth <= 1780 ? 14 : 13;
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newLevel = width <= 1700 ? 14 : 13;

      setMapLevel(newLevel);

      if (map) {
        const fixedCenter = new kakao.maps.LatLng(35.9, 127.7); // 초기 중심
        map.relayout();
        map.setLevel(newLevel);
        map.setCenter(fixedCenter); // 항상 동일한 중심으로 고정
      }
    };

    window.addEventListener("resize", handleResize);

    // 초기 실행
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  useKakaoLoader({ appkey: KAKAO_API_KEY });

  const handleMarkerClick = (name) => {
    setOpenOverlay((prev) => (prev === name ? null : name));
  };

  const handleMapClick = useCallback(() => {
    setOpenOverlay(null);
  }, []);

  useEffect(() => {
    if (!map) return;

    // 지도 클릭 시 오버레이 닫기
    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map, handleMapClick]);

  useEffect(() => {
    const fetchAvrData = async () => {
      try {
        const { data } = await axios.get(
          `${DATE_URL}?serviceKey=${AVR_KEY}&returnType=json&numOfRows=100&pageNo=1&searchDate=2025-05-28&informCode=${dateOption}`
        );
        const items = data.response.body.items;

        const selectedData = selectDate === "today" ? items[0] : items[1];
        const parsed = selectedData.informGrade
          .split(",")
          .map((item) => item.split(":"));
        setDayInfor(parsed);
      } catch (err) {
        console.error("API 호출 오류", err);
      }
    };

    fetchAvrData();
  }, [dateOption, selectDate]);

  useEffect(() => {
    const updatedMarkers = regionCenters2.map((item) => {
      const match = dayInfor.find(([name]) => name.trim() === item.name);
      return {
        ...item,
        state: match ? match[1].trim() : "",
      };
    });
    setRegionMarkers(updatedMarkers);
  }, [dayInfor]);

  useEffect(() => {
    if (!map) return;

    const allowedBounds = new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(33.0, 124.0),
      new kakao.maps.LatLng(39.5, 132.0)
    );

    const handleZoomChanged = () => {
      const level = map.getLevel();

      const isZoomedIn = level <= 13;
      map.setDraggable(isZoomedIn);

      if (level >= 13) {
        // 📍 초기화 위치로 이동
        map.setCenter(new kakao.maps.LatLng(35.9, 127.7));
      }
    };

    const handleCenterChanged = () => {
      const level = map.getLevel();
      if (level > 13) return;

      const center = map.getCenter();
      if (!allowedBounds.contain(center)) {
        const clampedLat = Math.min(Math.max(center.getLat(), 33.0), 39.5);
        const clampedLng = Math.min(Math.max(center.getLng(), 124.0), 132.0);
        const corrected = new kakao.maps.LatLng(clampedLat, clampedLng);
        map.panTo(corrected);
      }
    };

    kakao.maps.event.addListener(map, "zoom_changed", handleZoomChanged);
    kakao.maps.event.addListener(map, "center_changed", handleCenterChanged);
    handleZoomChanged();

    return () => {
      kakao.maps.event.removeListener(map, "zoom_changed", handleZoomChanged);
      kakao.maps.event.removeListener(
        map,
        "center_changed",
        handleCenterChanged
      );
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    const handleMapClick = () => {
      setOpenOverlay(null);
    };

    kakao.maps.event.addListener(map, "click", handleMapClick);

    return () => {
      kakao.maps.event.removeListener(map, "click", handleMapClick);
    };
  }, [map]);

  // 지도 폴리곤 그리기
  useEffect(() => {
    if (!map) return;

    regionData.features.forEach((feature) => {
      const { coordinates, type } = feature.geometry;
      const name = feature.properties.CTP_KOR_NM;

      const paths = [];

      if (type === "Polygon") {
        coordinates.forEach((ring) => {
          const path = ring.map(
            ([lng, lat]) => new kakao.maps.LatLng(lat, lng)
          );
          paths.push(path);
        });
      } else if (type === "MultiPolygon") {
        coordinates.forEach((polygon) => {
          polygon.forEach((ring) => {
            const path = ring.map(
              ([lng, lat]) => new kakao.maps.LatLng(lat, lng)
            );
            paths.push(path);
          });
        });
      }

      const polygon = new kakao.maps.Polygon({
        path: paths,
        strokeWeight: 2,
        strokeColor: "#004c80",
        strokeOpacity: 0.8,
        fillColor: "#ff9b9b",
        fillOpacity: 0.5,
      });

      polygon.setMap(map);

      kakao.maps.event.addListener(polygon, "click", () => {
        setOpenOverlay(name);
      });
    });
  }, [map]);

  // 상태별 색상 클래스
  const getStateColorClass = (state) => {
    switch (state) {
      case "좋음":
        return styles.good;
      case "보통":
        return styles.normal;
      case "나쁨":
        return styles.bad;
      case "매우나쁨":
        return styles.worst;
      default:
        return styles.unknown;
    }
  };

  return (
    <Map
      className={styles.mapContainer}
      center={{ lat: 35.9, lng: 127.5 }}
      level={mapLevel}
      zoomable={true}
      draggable={false}
      disableDoubleClick={true}
      onCreate={(mapInstance) => {
        const level = mapInstance.getLevel();
        mapInstance.setDraggable(level <= 13); // 확대 상태일 때만 드래그 가능
        setMap(mapInstance);
      }}
    >
      {regionMarkers.map((marker) => (
        <div
          key={marker.name}
          onMouseOver={() => setHoveredMarker(marker.name)}
          onMouseOut={() => setHoveredMarker(null)}
        >
          <MapMarker
            image={{
              src: markerIcon,
              size: {
                width:
                  openOverlay === marker.name || hoveredMarker === marker.name
                    ? 35
                    : 25,
                height:
                  openOverlay === marker.name || hoveredMarker === marker.name
                    ? 35
                    : 25,
              },
            }}
            position={{ lat: marker.center[0], lng: marker.center[1] }}
            onClick={() => handleMarkerClick(marker.name)}
            onMouseOver={() => setHoveredMarker(marker.name)}
            onMouseOut={() => setHoveredMarker(null)}
          />
          {(openOverlay === marker.name || hoveredMarker === marker.name) && (
            <CustomOverlayMap
              position={{ lat: marker.center[0], lng: marker.center[1] }}
            >
              <div
                className={`${styles.customOverlay} ${getStateColorClass(
                  marker.state
                )}`}
              >
                <div>{marker.name}</div>
                <div>{marker.state || "정보 없음"}</div>
              </div>
            </CustomOverlayMap>
          )}
        </div>
      ))}
    </Map>
  );
}

export default DateInforMap;
