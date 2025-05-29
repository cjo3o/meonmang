import React from "react";
import Exstyle from "../css/extent.module.css";

function Extent() {
  return (
    <div className={Exstyle.legendTable}>
      <h1>예보등급</h1>
      <table className={Exstyle.extable}>
        <colgroup>
          <col style={{ width: "8%" }} />
          <col style={{ width: "8%" }} />
          <col style={{ width: "16.25%" }} />
          <col style={{ width: "16.25%" }} />
          <col style={{ width: "16.25%" }} />
          <col style={{ width: "16.25%" }} />
        </colgroup>
        <thead>
          <tr>
            <th rowSpan={2} colSpan={2}>
              예보구간
            </th>
            <th colSpan={4}>등급</th>
          </tr>
          <tr>
            <th className={Exstyle.gradeGood}>좋음</th>
            <th className={Exstyle.gradeNormal}>보통</th>
            <th className={Exstyle.gradeBad}>나쁨</th>
            <th className={Exstyle.gradeVeryBad}>매우나쁨</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2} className={Exstyle.bgLight}>
              예측농도
              <br />
              (㎍/m³,1일)
            </td>
            <td>PM-10</td>
            <td>0~30</td>
            <td>31~80</td>
            <td>81~150</td>
            <td>150 초과</td>
          </tr>
          <tr>
            <td>PM-2.5</td>
            <td>0~15</td>
            <td>16~35</td>
            <td>36~75</td>
            <td>75 초과</td>
          </tr>
          <tr>
            <td className={Exstyle.bgLight}>
              예측농도
              <br />
              (ppm, 1시간)
            </td>
            <td>O₃</td>
            <td>0~0.0300</td>
            <td>0.0301~0.0900</td>
            <td>0.0901~0.1500</td>
            <td>0.1500 초과</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Extent;
