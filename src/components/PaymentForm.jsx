import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button, Card, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_stripe_publishable_key');

const PaymentForm = ({ invoice, onSuccess, onError, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          amount: invoice.totalAmount,
          currency: 'usd'
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to create payment intent');
      }

      // Confirm payment with Stripe
      const stripe = await stripePromise;
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        result.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: invoice.client.displayName || invoice.client.email,
              email: invoice.client.email,
            },
          },
        }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent.status === 'succeeded') {
        // Confirm payment on server
        const confirmResponse = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            paymentMethodId: paymentIntent.payment_method
          }),
        });

        const confirmResult = await confirmResponse.json();

        if (!confirmResult.success) {
          throw new Error(confirmResult.error || 'Failed to confirm payment');
        }

        setSuccess(true);
        onSuccess && onSuccess(confirmResult.data);
      } else {
        throw new Error('Payment failed');
      }
    } catch (err) {
      setError(err.message);
      onError && onError(err);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (success) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Payment Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your payment of ${invoice.totalAmount} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500">
            Invoice #{invoice.invoiceNumber} is now marked as paid.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Payment Details
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Invoice:</span>
            <span className="font-medium">#{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">${invoice.totalAmount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Due Date:</span>
            <span className="font-medium">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Information
          </label>
          <div className="border border-gray-300 rounded-lg p-3">
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay $${invoice.totalAmount}`
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">
        <p>Your payment is secured by Stripe. We never store your card information.</p>
      </div>
    </Card>
  );
};

const PaymentFormWrapper = ({ invoice, onSuccess, onError, onCancel }) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        invoice={invoice}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default PaymentFormWrapper;
