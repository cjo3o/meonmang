import React from 'react';
import {Card} from "antd";

function Map(props) {
    return (
        <>
            <Card
                style={{
                    width: '50%',
                }}
                title={
                <div style={{display:"flex", gap:"2rem", justifyContent:"space-around"}}>
                    <div>실시간 대기정보</div>
                    <div>오늘/내일/모레 대기정보</div>
                    <div>실시간 공간분포</div>
                </div>
                }
                bordered={false}
            >
                dd
            </Card>
        </>
    );
}

export default Map;