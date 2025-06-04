import React, {useEffect, useState} from "react";
import {Button, Card, Form, Select, message, Radio} from "antd";
import axios from "axios";
import ClackStyle from "../../css/AirClack.module.css";
import {REGION_KEYS, itemkr} from "../../component/AirAdd.js";

const {Option} = Select;
const API_URL = import.meta.env.VITE_BACK_API_URL;
const hours = Array.from({length: 12}, (_, i) => i + 1);

const AirClack = ({setOpenSidebar}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setOpenSidebar(false);
    }, []);

    const onFinish = async (values) => {
        setLoading(true);

        if (!("serviceWorker" in navigator && "PushManager" in window)) {
            message.error("브라우저가 푸시 알림을 지원하지 않습니다.");
            setLoading(false);
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: "BLbnwaj6jGwQgm7uH4Vu_5c_IW2lT0VXruGAwx4BTiiJ1rgvTv7bCjo1DL0q8ukDxv9TFLWa5eV__c7BvaTcqM0"
            });

            const payload = {
                sub: subscription,
                clientId: getClientId(),
                region: values.region,
                item: values.item,
                ampm: values.ampm,
                hour: values.hour,
                createdAt: new Date().toISOString(),
            };
            console.log(payload);

            const res = await axios.post(`${API_URL}/subscribe`, payload);
            if (res.status === 200) {
                message.success("알림 신청 완료!");
            } else {
                message.error("신청 실패 😥");
            }
        } catch (err) {
            console.error("에러 발생:", err);
            message.error("구독 또는 신청 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const getClientId = () => {
        const idKey = "air-client-id";
        let id = localStorage.getItem(idKey);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(idKey, id);
        }
        return id;
    };

    return (
        <div className={ClackStyle.content}>
            <div className={ClackStyle.center}>
                <Card>
                    <div className={ClackStyle.header}>
                        <h1>대기 알림 신청</h1>
                    </div>
                    <Form
                        className={ClackStyle.form}
                        layout="vertical"
                        onFinish={onFinish}>
                        <Form.Item
                            name="region"
                            label="지역"
                            rules={[{required: true}]}>
                            <Select placeholder="지역을 선택하세요">
                                {Object.entries(REGION_KEYS).map(([label, value]) => (
                                    <Option key={value} value={value}>
                                        {label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="item"
                            label="항목"
                            rules={[{required: true}]}>
                            <Select placeholder="항목을 선택하세요">
                                {Object.entries(itemkr).map(([code, label]) => (
                                    <Option key={code} value={code}>{label}</Option>
                                ))}
                            </Select>
                        </Form.Item>


                        <div className={ClackStyle.formtime}>
                        <Form.Item
                            name="ampm"
                            label="오전/오후"
                            rules={[{required: true}]}
                        >
                            <Radio.Group placeholder="오전/오후 선택">
                                <Radio value="AM">오전</Radio>
                                <Radio value="PM">오후</Radio>
                            </Radio.Group>
                        </Form.Item>

                            <Form.Item
                                name="hour"
                                label="시"
                                rules={[{required: true}]}
                            >
                                <Select placeholder="시 선택">
                                    {hours.map((h) => (
                                        <Option key={h} value={h}>
                                            {h}시
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                        </div>

                        <Form.Item style={{textAlign: "center"}}>
                            <Button className={ClackStyle.button} type="primary" htmlType="submit" loading={loading}>
                                알림 신청
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default AirClack;