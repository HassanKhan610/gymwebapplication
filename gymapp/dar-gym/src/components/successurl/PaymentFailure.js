// Failure.js

import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const Failure = () => {
    const navigate = useNavigate();

    return (
        <Result
            status="error"
            title="Subscription Failed"
            subTitle="There was an error processing your subscription. Please try again later."
            extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                    Go Home
                </Button>,
            ]}
        />
    );
};

export default Failure;
