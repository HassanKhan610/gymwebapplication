
// PaymentComponent.jsx

import React, { useState } from 'react';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51MYmAAKdPPATszKntZgHLgzHUFAEox0XI6BrAPMFdViPBk6DV9U82bE5eOjSE93kQZpi6xjI5owtTWpr9CRoNniD00s3z8vcVU'); // Replace with your actual publishable key

const PaymentComponentInner = ({ subscriptionType, handlePayment, subscriptionId   }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
            setCardError(error.message);
        } else {
            setCardError(null);
            handlePayment({ token, subscriptionType, subscriptionId });
        }
    };

    return (
        <div>
            <h2>Payment Details</h2>
            <p>Subscription Type: {subscriptionType}</p>

            {/* Payment form */}
            <form onSubmit={handleSubmit}>
                <label>
                    Card Details:
                    <CardElement />
                </label>
                {cardError && <div style={{ color: 'red' }}>{cardError}</div>}
                <button type="submit">Proceed to Payment</button>
            </form>
        </div>
    );
};

const PaymentComponent = ({ subscriptionType, handlePayment, subscriptionId   }) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentComponentInner subscriptionType={subscriptionType} handlePayment={handlePayment} subscriptionId={subscriptionId} />
        </Elements>
    );
};

export default PaymentComponent;
