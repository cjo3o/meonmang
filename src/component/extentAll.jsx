import React from "react";
import ExstyleA from "../css/extentAll.module.css";

function ExtentAll() {
  return (
    <div className={ExstyleA.legendTable}>
      <h1>예보등급</h1>
      <table className={ExstyleA.extable}>
        <thead>
          <tr>
            <th rowSpan={2} colSpan={2}>
              예보구간
            </th>
            <th colSpan={4}>등급</th>
          </tr>
          <tr>
            <th className={ExstyleA.gradeGood}>좋음</th>
            <th className={ExstyleA.gradeNormal}>보통</th>
            <th className={ExstyleA.gradeBad}>나쁨</th>
            <th className={ExstyleA.gradeVeryBad}>매우나쁨</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan={2} className={ExstyleA.bgLight}>
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
            <td rowSpan={4} className={ExstyleA.bgLight}>
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
          <tr>
            <td>NO₂</td>
            <td>0~0.030</td>
            <td>0.031~0.060</td>
            <td>0.061~0.200</td>
            <td>0.200 초과</td>
          </tr>
          <tr>
            <td>CO</td>
            <td>0~2.00</td>
            <td>2.01~9.00</td>
            <td>9.01~15</td>
            <td>15 초과</td>
          </tr>
          <tr>
            <td>SO₂</td>
            <td>0~0.020</td>
            <td>0.021~0.050</td>
            <td>0.051~0.150</td>
            <td>0.150 초과</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ExtentAll;
