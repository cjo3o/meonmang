import React, { useEffect, useRef, useState } from "react";
import {
  CustomOverlayMap,
  MapMarker,
  Map,
  useKakaoLoader,
} from "react-kakao-maps-sdk";
import regionData from "/RegionData.json";
import regionCenters from "./regionCenters.js";
import styles from "/src/css/Map.module.css";
import markerIcon from "/src/images/markerIcon.png";
import axios from "axios";

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const AVR_URL = import.meta.env.VITE_AVR_URL;
const AVR_KEY = import.meta.env.VITE_AVR_KEY;

function RealTimeMap({ selectOption, onOpenModal, setDataTime }) {
  const [map, setMap] = useState(null);
  const [openOverlay, setOpenOverlay] = useState(null);
  const [sidoAvr, setSidoAvr] = useState([]);
  const [hoveredMarker, setHoveredMarker] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const regionKeyMap = {
    서울: "seoul",
    부산: "busan",
    대구: "daegu",
    인천: "incheon",
    광주: "gwangju",
    대전: "daejeon",
    울산: "ulsan",
    세종: "sejong",
    경기: "gyeonggi",
    강원: "gangwon",
    충북: "chungbuk",
    충남: "chungnam",
    전북: "jeonbuk",
    전남: "jeonnam",
    경북: "gyeongbuk",
    경남: "gyeongnam",
    제주: "jeju",
  };

  useKakaoLoader({ appkey: KAKAO_API_KEY });

  const handleMarkerClick = (name) => {
    setOpenOverlay((prev) => (prev === name ? null : name));
  };

  // 데이터 fetch는 map 없이도 실행 가능
  useEffect(() => {
    const fetchAvrData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${AVR_URL}?returnType=json&numOfRows=25&pageNo=1&itemCode=${selectOption}&dataGubun=HOUR&serviceKey=${AVR_KEY}`
        );
        setDataTime(data.response.body.items[0].dataTime);
        setSidoAvr(data.response.body.items[0]);
      } catch (err) {
        console.log("API 호출 오류", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvrData();
  }, [selectOption]);

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

  // 폴리곤 그리기
  useEffect(() => {
    if (!map || !regionData) return;

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
        onOpenModal(name);
      });

      kakao.maps.event.addListener(polygon, "mouseover", () => {
        polygon.setOptions({
          fillOpacity: 0.8,
          strokeWeight: 3,
        });
        map.getNode().style.cursor = "pointer";
      });

      kakao.maps.event.addListener(polygon, "mouseout", () => {
        polygon.setOptions({
          fillOpacity: 0.5,
          strokeWeight: 2,
        });
        map.getNode().style.cursor = "default";
      });
    });
  }, [map]);

  const changeColor = (value) => {
    if (selectOption === "PM25") {
      if (value <= 15) return styles.good;
      if (value <= 35) return styles.normal;
      if (value <= 75) return styles.bad;
      return styles.worst;
    } else if (selectOption === "PM10") {
      if (value <= 30) return styles.good;
      if (value <= 80) return styles.normal;
      if (value <= 150) return styles.bad;
      return styles.worst;
    } else if (selectOption === "O3") {
      if (value <= 0.03) return styles.good;
      if (value <= 0.09) return styles.normal;
      if (value <= 0.15) return styles.bad;
      return styles.worst;
    } else if (selectOption === "NO2") {
      if (value <= 0.03) return styles.good;
      if (value <= 0.06) return styles.normal;
      if (value <= 0.2) return styles.bad;
      return styles.worst;
    } else if (selectOption === "CO") {
      if (value <= 2) return styles.good;
      if (value <= 9) return styles.normal;
      if (value <= 15) return styles.bad;
      return styles.worst;
    } else {
      if (value <= 0.02) return styles.good;
      if (value <= 0.05) return styles.normal;
      if (value <= 0.15) return styles.bad;
      return styles.worst;
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
      center={{ lat: 35.9, lng: 127.5 }}
      level={mapLevel}
      zoomable={true}
      disableDoubleClick={true}
      onCreate={(mapInstance) => {
        const level = mapInstance.getLevel();
        mapInstance.setDraggable(level <= 13); // 확대 상태일 때만 드래그 가능
        setMap(mapInstance);
      }}
    >
      {regionCenters.map((marker) => (
        <div
          key={marker.name}
          className={styles.mapMarker}
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
            onMouseOut={() => {
              setHoveredMarker(null);
              if (map) {
                const level = map.getLevel();
                if (level <= 13) {
                  // 확대 상태일 때만 draggable 리셋 적용
                  map.setDraggable(false);
                  setTimeout(() => {
                    map.setDraggable(true);
                  }, 30);
                } else {
                  map.setDraggable(false); // 축소 상태에서는 항상 false 유지
                }
              }
            }}
          />
          {(openOverlay === marker.name || hoveredMarker === marker.name) && (
            <CustomOverlayMap
              position={{ lat: marker.center[0], lng: marker.center[1] }}
            >
              <div
                className={`${styles.customOverlay} ${changeColor(
                  sidoAvr[regionKeyMap[marker.name]]
                )}`}
              >
                <div>{marker.name}</div>
                <div>{sidoAvr[regionKeyMap[marker.name]] ?? "데이터 없음"}</div>
              </div>
            </CustomOverlayMap>
          )}
        </div>
      ))}
    </Map>
  );
}

export default RealTimeMap;
