"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { X } from "lucide-react"; // Import close icon

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: "https://strip-omega.vercel.app/success" },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}

export default function CheckoutPopup({ isOpen, onClose, amount }: { isOpen: boolean; onClose: () => void; amount: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showMotivational, setShowMotivational] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setShowMotivational(true); // Show motivational popup instead of closing immediately
  };

  const handleFinalClose = () => {
    setShowMotivational(false);
    onClose();
  };

  const handleTryRiskFree = () => {
    setShowMotivational(false); // Hide motivational popup
  };

  useEffect(() => {
    if (!email) return;
    
    setIsLoading(true);
    setError('');

    fetch("/api/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || 'Payment setup failed');
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [email]);

  if (!isOpen) return null;

  if (showMotivational) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-[#1a1a1a] p-8 rounded-3xl shadow-lg w-[400px] relative border border-gradient">
          <button
            onClick={handleFinalClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          >
            <X size={24} />
          </button>

          <div className="text-center space-y-6">
            <div className="bg-[#2a2a2a] rounded-2xl p-4 inline-block">
              <h2 className="text-[#a8c7fa] text-2xl font-semibold mb-1">Not convinced?</h2>
              <p className="text-[#a8c7fa] text-xl">We get it.</p>
            </div>

            <h1 className="text-white text-3xl font-bold">
              Try Aligned for $9.99!
            </h1>

            <p className="text-gray-300 text-lg">
              1-week trial for $9.99, renews for a 4-week plan.<br/>
              Cancel anytime
            </p>

            <div className="relative h-32">
              {/* Add your graph visualization here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1 rounded-full">with Aligned</div>
                <div className="text-sm text-gray-400 bg-[#2a2a2a] px-3 py-1 rounded-full ml-4">without Aligned</div>
              </div>
            </div>

            <button
              onClick={handleTryRiskFree}
              className="w-full bg-white text-black py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
            >
              Try it risk-free
            </button>

            <div className="flex items-center justify-center text-gray-400 text-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5 mr-2" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
              </svg>
              14-Day Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-center text-black">Securely pay</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>

        {isLoading ? (
          <div className="text-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2">Setting up payment...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">
            <p>{error}</p>
            <button 
              onClick={() => setError('')}
              className="mt-2 text-sm text-gray-600 underline"
            >
              Try again
            </button>
          </div>
        ) : clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm />
          </Elements>
        ) : (
          <p className="text-center text-black">Loading payment details...</p>
        )}
      </div>
    </div>
  );
}
