# Unified Fleet Management & E-commerce System

A comprehensive full-stack application combining fleet management and e-commerce functionality, built with modern web technologies and clean architecture principles.

## 🚀 Features

- **User Management**: Unified users serving as both employees and customers
- **Device Management**: Fleet equipment assignment and tracking
- **E-commerce Platform**: Product catalog, orders, and sales management
- **Sales Prediction**: Advanced AI-powered sales forecasting
- **Real-time Analytics**: Business intelligence dashboards
- **Responsive Design**: Full mobile and desktop compatibility
- **Clean Architecture**: Domain-driven design with separation of concerns
- **Type Safety**: Full TypeScript implementation with Zod validation

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4.1
- **Database**: SQLite with Prisma ORM (unified schema)
- **Validation**: Zod for schema validation
- **Testing**: Jest with component and API testing
- **Analytics**: Custom sales prediction algorithms
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📐 Architecture

This application follows Clean Architecture principles with clear separation of concerns:

```mermaid
graph TB
    subgraph "Presentation Layer"
        UI[React Components]
        Pages[Next.js Pages]
        API[API Routes]
    end
    
    subgraph "Application Layer"
        Services[Services]
        DTOs[DTOs & Validation]
    end
    
    subgraph "Domain Layer"
        Entities[Domain Entities]
        Interfaces[Repository Interfaces]
    end
    
    subgraph "Infrastructure Layer"
        Repositories[Repository Implementations]
        Database[(SQLite Database)]
        Prisma[Prisma ORM]
    end
    
    UI --> Pages
    Pages --> API
    API --> Services
    Services --> DTOs
    Services --> Interfaces
    DTOs --> Entities
    Interfaces --> Repositories
    Repositories --> Prisma
    Prisma --> Database
    
    classDef presentation fill:#e1f5fe
    classDef application fill:#f3e5f5
    classDef domain fill:#e8f5e8
    classDef infrastructure fill:#fff3e0
    
    class UI,Pages,API presentation
    class Services,DTOs application
    class Entities,Interfaces domain
    class Repositories,Database,Prisma infrastructure
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── ecommerce/     # E-commerce endpoints
│   │   └── fleet/         # Fleet management endpoints
│   ├── employees/         # Employee management page
│   ├── devices/           # Device management page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── domain/               # Domain layer
│   └── entities/         # Domain entities (User, Product, Order, etc.)
├── dtos/                 # Data Transfer Objects
└── lib/                  # Utility libraries

prisma/                   # Database layer
├── schema.prisma         # Unified database schema
└── seed.ts              # Database seeding

sql/                      # SQL-first approach
├── structure.sql         # Database structure & sample data
├── query.sql            # Analysis queries
├── sales-prediction.ts   # AI prediction algorithms
└── README.md            # SQL documentation

tests/                    # Testing suite
├── api/                 # API endpoint tests
└── components/          # Component tests
```

## 🔄 Data Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant API
    participant Service
    participant Repository
    participant Database
    
    User->>UI: Interact with form
    UI->>API: HTTP Request
    API->>Service: Call business logic
    Service->>Repository: Data operation
    Repository->>Database: SQL query
    Database-->>Repository: Result
    Repository-->>Service: Processed data
    Service-->>API: Response data
    API-->>UI: JSON response
    UI-->>User: Updated interface
```

## 📊 Unified Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string first_name
        string last_name
        string phone
        text address
        datetime created_at
        datetime updated_at
    }
    
    DEVICES {
        string id PK
        string name
        string type
        string employeeId FK
        datetime createdAt
        datetime updatedAt
    }
    
    PRODUCTS {
        int id PK
        string name
        text description
        decimal price
        int stock_quantity
        string category
        string sku UK
        boolean is_active
        datetime created_at
        datetime updated_at
    }
    
    ORDERS {
        int id PK
        int user_id FK
        string order_number UK
        string status
        decimal total_amount
        text shipping_address
        datetime order_date
        datetime shipped_date
        datetime delivered_date
        datetime created_at
        datetime updated_at
    }
    
    ORDER_ITEMS {
        int id PK
        int order_id FK
        int product_id FK
        int quantity
        decimal unit_price
        decimal total_price
        datetime created_at
    }
    
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ DEVICES : "assigned_to"
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    PRODUCTS ||--o{ ORDER_ITEMS : "included_in"
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleet-case
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up the database**
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 API Endpoints

### Fleet Management

- `GET /api/fleet/employees` - Get all employees with device assignments
- `POST /api/fleet/employees` - Create a new employee
- `GET /api/fleet/devices` - Get all devices (with optional filters)
- `POST /api/fleet/devices` - Create and assign a new device
- `PUT /api/fleet/devices/[id]` - Update device assignment

### E-commerce

- `GET /api/ecommerce/query` - Execute custom SQL queries for analysis
- `GET /api/ecommerce/status` - Get system and database status
- `POST /api/ecommerce/init` - Initialize database from SQL files
- `GET /api/ecommerce/predictions` - Get AI-powered sales predictions

### Database Management

- `POST /api/ecommerce/init` - SQL-first database initialization
- `GET /api/ecommerce/status` - Health check and schema validation

## 🔍 Features in Detail

### Unified User Management
- Users serve dual purpose: customers and employees
- Full CRUD operations with validation
- Device assignment tracking for employees
- Order history for customers
- Comprehensive contact information

### Fleet Management
- Device inventory with real-time assignment status
- Equipment categorization (Laptop, Desktop, Phone, Tablet, etc.)
- Employee assignment tracking
- Filter by type, owner, or unassigned devices
- Asset management and audit trails

### E-commerce Platform
- Product catalog with inventory management
- Order processing and status tracking
- Customer relationship management
- Sales analytics and reporting

### Sales Prediction Engine
- AI-powered sales forecasting algorithms
- Linear regression and moving averages
- Trend analysis with confidence scoring
- Seasonal pattern detection
- Business intelligence recommendations

### Data Validation
- Schema validation using Zod
- Type-safe API endpoints
- Client and server-side validation
- Consistent error handling

## 🏛 Clean Architecture Benefits

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Easy to unit test business logic
3. **Maintainability**: Changes in one layer don't affect others
4. **Scalability**: Easy to add new features or modify existing ones
5. **Type Safety**: TypeScript ensures compile-time error checking

## 🛡 Security & Validation

- Input validation with Zod schemas
- SQL injection prevention through Prisma
- Type-safe database operations
- Error boundary handling

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:studio` - Open Prisma Studio

## 🧪 Testing

The project includes testing setup for:
- Unit tests for services and repositories
- Component testing for React components
- API endpoint testing

## 🚀 Deployment

The application can be deployed on any platform that supports Next.js:
- Vercel (recommended)
- Netlify
- AWS
- Docker containers

## 📈 Future Enhancements

### Fleet Management
- Advanced asset tracking (location, maintenance)
- Automated assignment workflows
- Integration with HR systems
- Mobile device management (MDM)

### E-commerce
- Payment processing integration
- Inventory management automation
- Customer loyalty programs
- Multi-channel sales support

### Analytics & AI
- Machine learning model improvements
- Real-time analytics dashboards
- Predictive maintenance for devices
- Advanced business intelligence
- Custom reporting tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.