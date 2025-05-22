
# Legal CRM SaaS Frontend

This is the frontend repository for the Legal CRM SaaS platform, built with React, TypeScript, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/legal-crm-frontend.git
cd legal-crm-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Backend Setup (Node.js + Express + MySQL)

Clone the backend repository or initialize a new one.

```bash
mkdir backend && cd backend
npm init -y
npm install express cors dotenv jsonwebtoken mysql2 bcryptjs multer nodemailer
```

### Folder Structure

```
backend/
├── controllers/
├── middleware/
├── models/
├── routes/
├── uploads/
├── .env
└── server.js
```

### .env Setup

```
PORT=5000
DB_HOST=localhost
DB_USER=john
DB_PASSWORD=secure_##John27paul
DB_NAME=legal_crm
JWT_SECRET=your_jwt_secret
```

### Basic Server Setup (server.js)

```javascript
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Define routes here
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
```

### Next Steps:

1. Create routes for /auth, /subscriptions, /documents, /users
2. Protect routes using JWT middleware
3. Integrate PayPal webhook verification for subscription status updates
4. Add file upload route using multer
5. Link AI document analyzer service endpoint (coming in future phase)

## Features

- User authentication and authorization
- Role-based dashboards (Attorney, Admin)
- Client management
- Document management with AI analysis
- Contract tracking and monitoring
- Intake forms management
- Subscription and billing management
- Admin controls and system monitoring

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- React Router
- Shadcn UI
- React Query
- Lucide React Icons

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── ui/           # UI components from shadcn/ui
│   └── layouts/      # Layout components
├── context/          # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── pages/            # Page components
│   ├── dashboard/    # User dashboard pages
│   └── admin/        # Admin dashboard pages
└── main.tsx          # Entry point
```
