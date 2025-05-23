// 예시 구조 (AirAdd.js에 정의되어 있어야 함)
export const POLLUTANTS2 = [
    { key: "pm10", label: "미세먼지", sub: "PM10", code: "PM10" },
    { key: "pm25", label: "초미세먼지", sub: "PM2.5", code: "PM25" },
    { key: "o3", label: "오존", sub: "O3", code: "O3" },
  ];
  
  export const Grade2 = {
    1: { label: "좋음", bgColor: "#a2d8ff" },
    2: { label: "보통", bgColor: "#d2f29b" },
    3: { label: "나쁨", bgColor: "#f9c97a" },
    4: { label: "매우나쁨", bgColor: "#f07c7c" },
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
    서울: "종로구",
    인천: "구월동",
    경기북부: "의정부1동",
    경기남부: "경수대로(동수원)",
    강원영서: "반곡동(명륜동)",
    강원영동: "옥천동",
    대전: "성남동1",
    세종: "아름동",
    충북: "칠금동",
    충남: "예산군",
    광주: "유촌동",
    전북: "구이면",
    전남: "화순읍",
    대구: "남산1동",
    울산: "무거동",
    경북: "의성읍",
    경남: "가야읍",
    제주: "강정동",
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
  
  