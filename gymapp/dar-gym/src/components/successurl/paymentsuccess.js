// Success.js

import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Success = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="success"
            title="Subscription Successful!"
            subTitle="Thank you for subscribing. Enjoy your membership!"
            extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                    Go Home
                </Button>,
            ]}
        />
    );
};

export default Success;
