import React, {useState} from "react";
import {Button, Card, Form, Select, message} from "antd";
import axios from "axios";
import ClackStyle from "../../css/AirClack.module.css";
import { REGION_KEYS, itemCodeMap } from "../../component/AirAdd.js";

const { Option } = Select;
const API_URL = import.meta.env.VITE_BACK_API_URL;
const intervals = Array.from({ length: 12 }, (_, i) => i + 1);

const AirClack = () => {
    const [loading, setLoading] = useState(false);

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
                applicationServerKey: "6MS6d4/7oderkazWnyA2+5XBYjmhv86nH/3S27RgytjKuDazJrdwa6EjRztXPJJd3IUs5Za7mFPyorRlwh6g6A=="
            });

            const payload = {
                sub: subscription,
                region: values.region,
                item: values.item,
                interval: values.interval,
                clientId: getClientId(),
                createdAt: new Date().toISOString()
            };

            const res = await axios.post(`${API_URL}/subscribe`, payload);

            if (res.status === 200) {
                message.success("알림 신청 완료! 알림은 정각마다 울립니다.");
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
                        <Form className={ClackStyle.form} layout="vertical" onFinish={onFinish}>
                            <Form.Item name="region" label="지역" rules={[{ required: true }]}>
                                <Select placeholder="지역을 선택하세요">
                                    {Object.entries(REGION_KEYS).map(([label, value]) => (
                                        <Option key={value} value={value}>
                                            {label}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item className={ClackStyle.form} name="item" label="항목" rules={[{ required: true }]}>
                                <Select placeholder="항목을 선택하세요">
                                    {Object.entries(itemCodeMap).map(([code, label]) => (
                                        <Option key={code} value={code}>{label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                                <Form.Item className={ClackStyle.form} name="interval" label="시간 간격 (단위: 시간)" rules={[{ required: true }]}>
                                    <Select placeholder="간격을 선택하세요">
                                        {intervals.map((n) => (
                                            <Option key={n} value={n}>{`${n}시간`}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item className={ClackStyle.form} style={{ textAlign: "center" }}>
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