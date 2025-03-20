# Aligned - Subscription Web Application

A Next.js application for managing subscriptions using Stripe's payment system.

## Application Flow

### 1. Landing Page
- Users arrive at the homepage displaying subscription plans
- Three subscription options are presented:
  - 1-Week Plan ($14.99)
  - 1-Month Plan ($39.99, first month $0.05)
  - 3-Month Plan ($69.99)
- Each plan shows the price per day and features

### 2. Plan Selection
- User clicks "Get My Plan" button
- Opens the payment popup with selected plan details
- If user attempts to close:
  - Shows "Not Convinced?" retention popup
  - Offers special trial: "Try Aligned for $9.99"
  - Displays benefits comparison graph
  - Includes 14-day money-back guarantee

### 3. Payment Process
1. User enters email address
2. Stripe payment form loads
3. User enters payment details
4. System creates:
   - Customer record in Stripe
   - Subscription with selected plan
   - Payment intent for processing
5. Payment is processed securely through Stripe

### 4. Post-Payment
- Success: Redirects to success page
- Error: Shows error message in payment form
- User can manage subscription through account settings

## Technical Implementation

### Key Components
- `page.tsx`: Main landing page with plan selection
- `CheckoutForm.tsx`: Handles payment form and Stripe integration
- `payment-intent/route.tsx`: Backend API for Stripe integration

### Environment Variables Required
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_HOST=http://localhost:3000
NEXT_PUBLIC_STRIPE_PRICE_ID=price_...
STRIPE_RECURRING_PRICE_ID=price_...
STRIPE_PRODUCT_ID=prod_...
```

### Features
- Secure payment processing
- Responsive design
- User retention popup
- Special trial offers
- Money-back guarantee
- Email integration
- Subscription management

### Security
- PCI compliant through Stripe
- Secure environment variables
- Protected API routes
- Data encryption

## Development Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env.local`
- Fill in your Stripe API keys

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy to your preferred hosting platform (e.g., Vercel)
3. Set up production environment variables
4. Configure Stripe webhooks for production

## Support

For issues and feature requests, please create an issue in the repository.

## Stripe Documentation References

### Essential Guides
- [Stripe Elements & Checkout](https://stripe.com/docs/payments/elements)
- [Stripe Subscription Guide](https://stripe.com/docs/billing/subscriptions/overview)
- [Payment Intents API](https://stripe.com/docs/api/payment_intents)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)

### Integration Resources
- [React Stripe.js Reference](https://stripe.com/docs/stripe-js/react)
- [Stripe Webhooks Setup](https://stripe.com/docs/webhooks)
- [Testing Stripe Payments](https://stripe.com/docs/testing)
- [Stripe CLI Tools](https://stripe.com/docs/stripe-cli)

### Security & Compliance
- [Security Best Practices](https://stripe.com/docs/security/guide)
- [Strong Customer Authentication (SCA)](https://stripe.com/docs/strong-customer-authentication)
- [PCI Compliance Guide](https://stripe.com/docs/security/pci-dss-guidelines)

### Additional Resources
- [API Keys & Authentication](https://stripe.com/docs/keys)
- [Error Handling](https://stripe.com/docs/error-handling)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Events Reference](https://stripe.com/docs/api/events/types)
