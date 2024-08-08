
// Subscription.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, notification } from 'antd';
import { useCreateSubscriptionMutation, useGetSubscriptionDetailsQuery, useGetLoggedUserQuery, useInitiateStripePaymentMutation } from '../../services/userAuthApi';
import { getToken } from '../../services/LocalStorageService';
import PaymentComponent from './subspayment';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import './subscription.css';

function Subscription() {
    const { access_token } = getToken();
    const { data: userData, isSuccess } = useGetLoggedUserQuery(access_token);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userId = userData?.id;
    const [createSubscription] = useCreateSubscriptionMutation();
    const [initiateStripePayment] = useInitiateStripePaymentMutation();
    const { data: subscriptionDetails, refetch: refetchSubscriptionDetails } = useGetSubscriptionDetailsQuery(access_token);

    const [subscriptionType, setSubscriptionType] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    console.log('Subscription Details:', subscriptionDetails);
    const handleSubscribe = (type) => {
        setSubscriptionType(type);
        setShowPayment(true);
    };

    const handlePayment = async (paymentData) => {
        try {
            const response = await createSubscription({
                subscription_type: subscriptionType,
                user: userId,
                payment_details: paymentData,
            });
            // console.log('Subscription ID:', subscriptionData.user);

            // Use the mutation to create a subscription
            // const response = await createSubscription(subscriptionData);

            // const response = await createSubscription(subscriptionData);

            // if (response) {
            //     // alert('Subscription created successfully!');
            //     refetchSubscriptionDetails();
            // }
            if (response.payload) {
                // Initiate JazzCash payment after creating the subscription
                // const paymentResponse = await initiateStripePayment(response.payload.subscription_id);
                const paymentResponse = await initiateStripePayment({
                    subscriptionId: response.payload.subscription_id,
                });

                // if (paymentResponse.payload) {
                //     alert('Subscription created successfully!');
                // } else {
                //     console.error('Error initiating JazzCash payment:', paymentResponse.error);
                //     // Handle error, show message to the user, or redirect to an error page
                // }
                if (paymentResponse.payload) {
                    notification.success({
                        message: 'Subscription created successfully!',
                        description: 'Thank you for subscribing.',
                    });
                    navigate('/success');
                } else {
                    console.error('Error initiating Stripe payment:', paymentResponse.error);
                    // Handle error, show message to the user, or redirect to an error page
                    navigate('/failure')
                }
            } else {
                console.error('Error creating subscription:', response.error);
                // Handle error, show message to the user, or redirect to an error page
                navigate('/failure')
            }

            // Refetch subscription details after both creating the subscription and initiating JazzCash payment
            refetchSubscriptionDetails();
        } catch (error) {
            console.error('Error creating subscription:', error);
        } finally {
            // Reset state after handling payment
            setSubscriptionType('');
            setShowPayment(false);
        }
    };

    useEffect(() => {
        const checkExpiration = () => {
            if (subscriptionDetails && subscriptionDetails.expiration_date) {
                const expirationDate = new Date(subscriptionDetails.expiration_date);
                const today = new Date();
                const timeDifference = expirationDate.getTime() - today.getTime();
                const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

                if (daysDifference === 1) {
                    notification.warning({
                        message: 'Subscription Expiring Soon',
                        description: 'Your subscription will expire in 1 day.',
                    });
                } else if (daysDifference === 0) {
                    notification.error({
                        message: 'Subscription Expired',
                        description: 'Your subscription has expired.',
                    });
                }
            }
            console.log('Checking subscription expiration');
        };

        checkExpiration();
    }, [subscriptionDetails]);

    return (
        <div className="membership-container">
            <h2 className="membership-title">Membership Plans</h2>
            <Row gutter={[16, 16]}>
                {/* Daily Subscription Card */}
                {subscriptionDetails && subscriptionDetails.subscription_type === 'daily' ? (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card" style={{ border: '2px solid #1890ff' }}>
                            <h3>Your Daily Subscription</h3>
                            <p>Expiration Date: {subscriptionDetails.expiration_date}</p>
                            <Button type="primary" disabled>
                                Subscribed
                            </Button>
                        </Card>
                    </Col>
                ) : (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card">
                            <h3>Daily Subscription</h3>
                            <p>Access the gym for a single day.</p>
                            <p className="membership-price">Price: $10</p>
                            <div className="membership-details">
                                <p>Includes:</p>
                                <ul>
                                    <li>Full access to all gym facilities.</li>
                                    <li>Access to group fitness classes.</li>
                                </ul>
                            </div>
                            <Button
                                type="primary"
                                onClick={() => handleSubscribe('daily')}
                                disabled={subscriptionDetails && subscriptionDetails.subscription_type}
                            >
                                Subscribe
                            </Button>
                        </Card>
                    </Col>
                )}

                {/* Repeat the pattern for other subscription cards (Monthly and Yearly) */}
                {/* Monthly Subscription Card */}
                {subscriptionDetails && subscriptionDetails.subscription_type === 'monthly' ? (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card" style={{ border: '2px solid #1890ff' }}>
                            <h3>Your Monthly Subscription</h3>
                            <p>Expiration Date: {subscriptionDetails.expiration_date}</p>
                            <Button type="primary" disabled>
                                Subscribed
                            </Button>
                        </Card>
                    </Col>
                ) : (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card">
                            <h3>Monthly Subscription</h3>
                            <p>Access the gym for a full month.</p>
                            <p className="membership-price">Price: $50</p>
                            <div className="membership-details">
                                <p>Includes:</p>
                                <ul>
                                    <li>Unlimited gym access for 30 days.</li>
                                    <li>Free personal trainer consultation.</li>
                                </ul>
                            </div>
                            <Button
                                type="primary"
                                onClick={() => handleSubscribe('monthly')}
                                disabled={subscriptionDetails && subscriptionDetails.subscription_type}
                            >
                                Subscribe
                            </Button>
                        </Card>
                    </Col>
                )}

                {/* Yearly Subscription Card */}
                {subscriptionDetails && subscriptionDetails.subscription_type === 'yearly' ? (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card" style={{ border: '2px solid #1890ff' }}>
                            <h3>Your Yearly Subscription</h3>
                            <p>Expiration Date: {subscriptionDetails.expiration_date}</p>
                            <Button type="primary" disabled>
                                Subscribed
                            </Button>
                        </Card>
                    </Col>
                ) : (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Card className="membership-card">
                            <h3>Yearly Subscription</h3>
                            <p>Access the gym for a whole year.</p>
                            <p className="membership-price">Price: $500</p>
                            <div className="membership-details">
                                <p>Includes:</p>
                                <ul>
                                    <li>365 days of unlimited gym access.</li>
                                    <li>Discounts on additional services.</li>
                                </ul>
                            </div>
                            <Button
                                type="primary"
                                onClick={() => handleSubscribe('yearly')}
                                disabled={subscriptionDetails && subscriptionDetails.subscription_type}
                            >
                                Subscribe
                            </Button>
                        </Card>
                    </Col>
                )}
            </Row>

            {/* {showPayment && (
                <PaymentComponent
                    subscriptionType={subscriptionType}
                    handlePayment={handlePayment}
                />
            )} */}
            {showPayment && (
                <PaymentComponent
                    subscriptionType={subscriptionType}
                    handlePayment={handlePayment}
                />
            )}
        </div>
    );
}

export default Subscription;
