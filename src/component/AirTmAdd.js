// 예시 구조 (AirAdd.js에 정의되어 있어야 함)
export const POLLUTANTS2 = [
  { key: "pm10", label: "미세먼지", sub: "PM-10", code: "PM10" },
  { key: "pm25", label: "초미세먼지", sub: "PM-2.5", code: "PM25" },
  { key: "o3", label: "오존", sub: "O3", code: "O3" },
];

export const Grade2 = {
  좋음: { label: "좋음", bgColor: "#a2d8ff" },
  보통: { label: "보통", bgColor: "#d2f29b" },
  나쁨: { label: "나쁨", bgColor: "#f9c97a" },
  매우나쁨: { label: "매우나쁨", bgColor: "#f07c7c" },
};

export const Citys2 = [
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
  "대구",
  "울산",
  "경북",
  "경남",
  "제주",
];

export const REGION_KEYS2 = {
  서울: "서울",
  인천: "인천",
  경기북부: "경기북부",
  경기남부: "경기남부",
  강원영서: "영서",
  강원영동: "영동",
  대전: "대전",
  세종: "세종",
  충북: "충북",
  충남: "충남",
  광주: "광주",
  전북: "전북",
  전남: "전남",
  대구: "대구",
  울산: "울산",
  경북: "경북",
  경남: "경남",
  제주: "제주",
};

export const REGION_COLUMNS2 = [
  { label: "서울", key: "서울" },
  { label: "인천", key: "인천" },
  {
    label: "경기",
    children: [
      { label: "북부", key: "경기북부" },
      { label: "남부", key: "경기남부" },
    ],
  },
  {
    label: "강원",
    children: [
      { label: "영서", key: "강원영서" },
      { label: "영동", key: "강원영동" },
    ],
  },
  { label: "대전", key: "대전" },
  { label: "세종", key: "세종" },
  { label: "충북", key: "충북" },
  { label: "충남", key: "충남" },
  { label: "광주", key: "광주" },
  { label: "전북", key: "전북" },
  { label: "전남", key: "전남" },
  { label: "대구", key: "대구" },
  { label: "울산", key: "울산" },
  { label: "경북", key: "경북" },
  { label: "경남", key: "경남" },
  { label: "제주", key: "제주" },
];
