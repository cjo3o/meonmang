import React from "react";
import { Row, Col, Select, Radio, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const AirAlertFilter = ({
                            region,
                            setRegion,
                            itemCode,
                            setItemCode,
                            pendingDateRange,
                            setPendingDateRange,
                            regionOptions,
                            // onSearch
                        }) => (
    <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
            <h4>지역</h4>
            <Select
                placeholder="지역"
                value={region}
                onChange={setRegion}
                style={{ width: 120 }}
                options={regionOptions.map(r => ({ value: r, label: r }))}
            />
        </Col>
        <Col>
            <h4>항목</h4>
            <Radio.Group value={itemCode} onChange={e => setItemCode(e.target.value)}>
                <Radio value="전체">전체</Radio>
                <Radio value="PM10">PM10</Radio>
                <Radio value="PM25">PM2.5</Radio>
                <Radio value="O3">O3</Radio>
            </Radio.Group>
        </Col>
        <Col>
            <h4>날짜</h4>
            <RangePicker value={pendingDateRange} onChange={setPendingDateRange} />
        </Col>
        {/*<Col>*/}
        {/*    <Space>*/}
        {/*        <Button type="primary" onClick={onSearch}>검색</Button>*/}
        {/*    </Space>*/}
        {/*</Col>*/}
    </Row>
);

export default AirAlertFilter;
