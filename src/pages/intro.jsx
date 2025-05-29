import React from "react";
import {Card} from "antd";
import AlertStyle from "../../src/css/AirAlert.module.css";

function Intro() {
    return (
        <div className={AlertStyle.content}>
            <div className={AlertStyle.center}>
                <Card>
                    <div className={AlertStyle.header}>
                        <h1>Intro</h1>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Intro;