import React from "react";
import itemstyle from "../css/Alertitems.module.css";

function Alertitems() {
    return (
        <>
            <div className={itemstyle.legendTable}>
                <h3>- 미세먼지</h3>
                <table className={itemstyle.extable}>
                    <thead>
                    <tr>
                        <th>주의보</th>
                        <th>경보</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>2시간 150㎍/㎥ 이상 지속</td>
                        <td>2시간 300㎍/㎥ 이상 지속</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={itemstyle.legendTable}>
                <h3>- 초미세먼지</h3>
                <table className={itemstyle.extable}>
                    <thead>
                    <tr>
                        <th>주의보</th>
                        <th>경보</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>2시간 75㎍/㎥ 이상 지속</td>
                        <td>2시간 150㎍/㎥ 이상 지속</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className={itemstyle.legendTable}>
                <h3>- 오존</h3>
                <table className={itemstyle.extable}>
                    <thead>
                    <tr>
                        <th>주의보</th>
                        <th>경보</th>
                        <th>중대경보</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>1시간 평균 0.12ppm 이상</td>
                        <td>1시간 평균 0.30ppm 이상</td>
                        <td>1시간 평균 0.50ppm 이상</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Alertitems;