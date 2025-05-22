import {Card, Pagination} from "antd";
import AlertStyle from "../../css/AirAlert.module.css";
import React from "react";
import AlertButton from "../../component/AlertButton.jsx";
import AirAlertTable from "../../component/AirAlertTable.jsx";

function AirAlert() {
    return (
        <>
            <div className={AlertStyle.content}>
                <div className={AlertStyle.header}>
                    <h1>대기오염 발령 내역</h1>
                </div>
                <div className={AlertStyle.center}>
                    <Card
                        title={
                            <div className={AlertStyle}>
                                <AlertButton/>
                            </div>
                        }
                    >
                        <div className={AlertStyle}>
                            <AirAlertTable/>
                        </div>
                        <Pagination align="center" defaultCurrent={1} total={50}/>
                    </Card>
                </div>

            </div>
        </>
    );
}

export default AirAlert;