
export const Grade = {
  1: { label: "좋음", bgColor: "#a2d8ff" },
  2: { label: "보통", bgColor: "#d2f29b" },
  3: { label: "나쁨", bgColor: "#f9c97a" },
  4: { label: "매우나쁨", bgColor: "#f07c7c" },
};

export const inform = [
  "PM10",
  "PM25",
  "O3",
  "NO2",
  "CO",
  "SO2"
]

export const itemCodeMap = {
  PM10: "PM10",
  PM25: "PM2.5", // ← 여기서 변환
  O3: "O3",
  NO2: "NO2",
  CO: "CO",
  SO2: "SO2",
};

export const itemkr = {
  PM10: "미세먼지 (PM10)",
  PM25: "초미세먼지 (PM2.5)",
  O3: "오존 (O3)",
  NO2: "이산화질소 (NO2)",
  CO: "일산화탄소 (CO)",
  SO2: "아황산가스 (SO2)",
};

export const REGION_KEYS = {
  서울: "seoul",
  인천: "incheon",
  경기: "gyeonggi",
  강원: "gangwon",
  대전: "daejeon",
  세종: "sejong",
  충북: "chungbuk",
  충남: "chungnam",
  광주: "gwangju",
  전북: "jeonbuk",
  전남: "jeonnam",
  부산: "busan",
  대구: "daegu",
  울산: "ulsan",
  경북: "gyeongbuk",
  경남: "gyeongnam",
  제주: "jeju",
};

export const REGION_COLUMNS = [
  { label: "서울", key: "서울" },
  { label: "인천", key: "인천" },
  { label: "경기", key: "경기" },
  { label: "강원", key: "강원" },
  { label: "대전", key: "대전" },
  { label: "세종", key: "세종" },
  { label: "충북", key: "충북" },
  { label: "충남", key: "충남" },
  { label: "광주", key: "광주" },
  { label: "전북", key: "전북" },
  { label: "전남", key: "전남" },
  { label: "부산", key: "부산" },
  { label: "대구", key: "대구" },
  { label: "울산", key: "울산" },
  { label: "경북", key: "경북" },
  { label: "경남", key: "경남" },
  { label: "제주", key: "제주" },
];

export const Citys = [
  "서울",
  "인천",
  "경기",
  "강원",
  "대전",
  "세종",
  "충북",
  "충남",
  "광주",
  "전북",
  "전남",
  "부산",
  "대구",
  "울산",
  "경북",
  "경남",
  "제주",
];