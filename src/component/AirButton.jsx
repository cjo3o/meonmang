import React from "react";
import AButton from "../css/AirButton.module.css";

function AirButton({ selectedDay, setSelectedDay }) {
  return (
    <div className={AButton.Btn}>
      <button
        className={`${AButton.button} ${selectedDay === "오늘" ? AButton.active : ""}`}
        onClick={() => setSelectedDay("오늘")}
      >
        오늘
      </button>
      <button
        className={`${AButton.button} ${selectedDay === "내일" ? AButton.active : ""}`}
        onClick={() => setSelectedDay("내일")}
      >
        내일
      </button>
    </div>
  );
}

export default AirButton;
