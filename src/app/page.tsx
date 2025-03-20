"use client";
import { useState } from "react";
import CheckoutPopup from "../app/components/CheckoutForm";

export default function CheckoutPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("1-Month Plan");
  const [amount, setAmount] = useState(39.99); // Default price

  // Handle plan selection
  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    if (plan === "1-Month Plan") {
      setAmount(0.05); // Discounted first-month price
    } else if (plan === "3-Month Plan") {
      setAmount(69.99); // Regular price
    } else {
      setAmount(14.99); // 1-Week Plan
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-6">
      <h1 className="text-3xl font-extrabold text-black-800 mb-6 text-center">
        Your Personal <span className="text-green-600">Intermittent Fasting</span> Plan is Ready!
      </h1>

      {/* Subscription Options */}
      <div className="w-full max-w-md space-y-4">
        {[
          { name: "1-Week Plan", price: "14.99 EUR", perDay: "2.14 EUR per day" },
          { name: "1-Month Plan", price: selectedPlan === "1-Month Plan" ? "0.05 EUR (First Month)" : "39.99 EUR", perDay: "1.34 EUR per day" },
          { name: "3-Month Plan", price: "69.99 EUR", perDay: "0.76 EUR per day" },
        ].map((plan) => (
          <div
            key={plan.name}
            className={`border p-6 rounded-xl shadow-md cursor-pointer transition-all duration-300 
                ${selectedPlan === plan.name ? "border-green-500 bg-black-100 scale-105" : "border-gray-300 bg-black"}
            `}
            onClick={() => handlePlanChange(plan.name)}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{plan.name}</h2>
              {selectedPlan === plan.name && (
                <span className="text-sm bg-green-500 text-white px-2 py-1 rounded-full">Selected</span>
              )}
            </div>
            <p className="text-xl font-bold mt-2">{plan.price}</p>
            <p className="text-black-600 text-sm">{plan.perDay}</p>
          </div>
        ))}
      </div>

      {/* Checkout Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 bg-green-600 text-black px-8 py-4 rounded-lg shadow-lg text-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
      >
        Get My Plan
      </button>

      {/* Payment Popup */}
      <CheckoutPopup isOpen={isOpen} onClose={() => setIsOpen(false)} amount={amount} />
    </div>
  );
}
