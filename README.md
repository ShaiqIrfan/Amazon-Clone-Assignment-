# NexCart

NexCart is a premium futuristic e-commerce marketplace built with Next.js and Supabase. The project combines a custom premium storefront experience with a real backend and live database to deliver a complete shopping flow for browsing products, reviewing details, adding items to cart, and placing orders.

This project keeps the original e-commerce marketplace concept while using a distinct NexCart design direction rather than reproducing Amazon’s visual identity. The result is a polished storefront with original branding, responsive layouts, and a full-stack product and order workflow.

## Live Demo

- Vercel deployment: https://amazon-clone-assignment.vercel.app/

## Features

- Premium responsive storefront UI
- Product discovery and curated landing-page sections
- Search across the product catalog
- Category browsing by collection
- Product detail pages with pricing and metadata
- Shopping cart with quantity updates and item removal
- Checkout flow for placing orders
- Real Supabase-backed product catalog
- Real API routes for product and order operations
- Real order creation with `orders` and `order_items` records
- Server-side validation for product existence, pricing, and stock availability
- Mobile, tablet, and desktop responsive layouts
- Accessibility-conscious navigation and content structure
- Premium marketplace styling with subtle motion and hover interactions

## Tech Stack

- Next.js
- React
- TypeScript
- CSS
- Supabase
- PostgreSQL
- Next.js API routes
- Vercel

## Architecture / How It Works

### Frontend
The frontend is built with Next.js App Router pages and React components. It renders the homepage, category pages, search results, product detail views, cart, checkout, and order flows using live data from the application API.

### Next.js API routes
The app uses Next.js server routes to expose the storefront data and order creation endpoints. These routes are responsible for reading products, returning category information, and validating order payloads before writing to the database.

### Supabase / PostgreSQL
Product and order data is stored in a Supabase PostgreSQL database. The app uses Supabase client creation for public-safe reads and a server-side admin client for protected write operations such as creating orders and updating stock.

### Product data flow
The frontend fetches product data through API endpoints like `/api/products` and `/api/products/[id]`. These routes query the Supabase database and normalize the returned rows into the product structure expected by the UI.

### Order creation flow
Checkout submissions are sent to `/api/orders`, where the server validates the payload, checks each product’s availability and price data, creates an order record, inserts associated order items, and updates stock values before returning the created order response.

## Database

The project uses Supabase PostgreSQL tables for the store’s core data model.

### `products`
Stores product metadata such as the product name, description, price, category, stock, rating, and image reference.

### `orders`
Stores order-level information including customer details, shipping address, totals, and status.

### `order_items`
Stores the itemized contents of each purchase, including the associated order ID, product ID, quantity, and unit price.

Product image references are stored as part of the product metadata, while the underlying assets live in the project’s public asset locations where applicable.

## API Endpoints

### `GET /api/products`
Returns the current product catalog. Supports optional filtering by category and search terms.

### `GET /api/products/[id]`
Returns a single product by ID, including its details for the product page.

### `GET /api/categories`
Returns the available categories from the product catalog.

### `POST /api/orders`
Creates a new order after validating customer input, checking stock, total calculation, and writing both the `orders` and `order_items` records.

## Project Structure

```text
.
├── app/
│   ├── api/
│   │   ├── categories/
│   │   ├── orders/
│   │   └── products/
│   ├── cart/
│   ├── category/
│   ├── checkout/
│   ├── deals/
│   ├── product/
│   ├── search/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Logo.tsx
│   ├── ProductCard.tsx
│   └── QuantitySelector.tsx
├── lib/
│   ├── auth.tsx
│   ├── cart.tsx
│   ├── products.ts
│   ├── supabase.ts
│   └── types.ts
├── public/
│   └── images/
│       └── products/
├── scripts/
│   └── seed-products.ts
├── styles/
│   └── globals.css
├── supabase/
│   ├── README.md
│   └── schema.sql
├── .env.local.example
├── .gitignore
├── next-env.d.ts
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Environment Variables

Required variable names:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

These values should be stored in a local `.env.local` file during development. The file is ignored by Git and should never be committed. The `SUPABASE_SERVICE_ROLE_KEY` must remain server-only and must never be exposed to the frontend or placed under a `NEXT_PUBLIC_*` variable.

## Local Development

```bash
npm install
npm run dev
```

Production build check:

```bash
npm run build
```

## Deployment

The application is deployed through Vercel and uses Supabase for the database and backend API layer. The public frontend communicates with Next.js API routes, which in turn interact with the Supabase PostgreSQL database. This keeps the storefront deployment simple while preserving live product and order data.

## Design

The visual direction for NexCart is an original premium marketplace aesthetic. It uses a deep charcoal/slate foundation, indigo and cyan accent tones, layered glassmorphism panels, strong typography, responsive spacing, and subtle motion for a more elevated technology-brand feel.

The design emphasizes clarity, confidence, and modern shopping interactions without reproducing a direct Amazon clone aesthetic.

## Assignment Note

This project follows an original NexCart design direction while keeping the core e-commerce marketplace concept and implementing a real database-backed storefront flow. The frontend is intentionally not a direct reproduction of Amazon’s branding and interface, but it retains the expected user journey for discovery, selection, carting, and checkout in a premium product experience.

## Future Improvements

The following are realistic future improvements and are not currently implemented:

- Full user authentication and account management
- Persistent user-specific carts and saved sessions
- Payment integration and order fulfillment flows
- Expanded order history and customer account backend
- Admin product management and dashboard tools

## License

This project is intended for educational and portfolio use as part of the assignment workflow. Please check the repository status and local project requirements before production reuse.
