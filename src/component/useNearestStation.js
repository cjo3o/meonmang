import axios from "axios";

const sidoList = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산",
  "세종", "경기", "강원", "충북", "충남", "전북", "전남",
  "경북", "경남", "제주",
];

const serviceKey =
  "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7/kDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ==";

const haversineDistance = (coords1, coords2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(coords2.lat - coords1.lat);
  const dLon = toRad(coords2.lng - coords1.lng);
  const lat1 = toRad(coords1.lat);
  const lat2 = toRad(coords2.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const fetchAllStations = async () => {
  const allStations = [];
  for (const sido of sidoList) {
    try {
      const res = await axios.get(
        "https://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getMsrstnList",
        {
          params: {
            serviceKey:
              "2PSpYwMICbNeYwm1V8u6Ubg48EhrKtBDi6x12jsPDh5tuABhb7/kDs34IsiMbqgJXFtziM2MFzdWoAK60jgSzQ==",
            returnType: "json",
            addr: sido,
            numOfRows: 100,
            pageNo: 1,
          },
        }
      );
      const items = res?.data?.response?.body?.items;
      if (items) allStations.push(...items);
    } catch (e) {
      console.error(`${sido} 측정소 정보 실패`, e);
    }
  }
  return allStations;
};

const findNearestStation = (myCoords, stations) => {
  let nearest = null;
  let minDist = Infinity;

  for (const station of stations) {
    const lat = parseFloat(station.dmX);
    const lng = parseFloat(station.dmY);
    if (!isNaN(lat) && !isNaN(lng)) {
      const dist = haversineDistance(myCoords, { lat, lng });
      if (dist < minDist) {
        minDist = dist;
        nearest = station;
      }
    }
  }

  return nearest;
};

export default async function useNearestStation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const myCoords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        try {
          const stations = await fetchAllStations();
          const nearest = findNearestStation(myCoords, stations);
          resolve(nearest);
        } catch (err) {
          reject(err);
        }
      },
      (err) => {
        reject(err);
      },
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
