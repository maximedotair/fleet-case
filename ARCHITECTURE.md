# Architecture Système - Fleet Management & E-commerce

Ce document décrit l'architecture technique de l'application unifiée de gestion de flotte et e-commerce.

## 🏗️ Vue d'ensemble de l'Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[Next.js Frontend]
        COMP[React Components]
        PAGES[Pages & Layouts]
    end
    
    subgraph "API Layer"
        API[Next.js API Routes]
        ECOM[E-commerce APIs]
        FLEET[Fleet Management APIs]
        PRED[Prediction APIs]
    end
    
    subgraph "Business Logic Layer"
        DOM[Domain Entities]
        DTO[Data Transfer Objects]
        SERV[Prediction Services]
    end
    
    subgraph "Data Layer"
        PRISMA[Prisma ORM]
        DB[(SQLite Database)]
        SQL[SQL Files]
    end
    
    subgraph "Testing & Quality"
        JEST[Jest Tests]
        API_TEST[API Tests]
        COMP_TEST[Component Tests]
    end
    
    UI --> API
    COMP --> API
    PAGES --> API
    
    API --> DOM
    ECOM --> DOM
    FLEET --> DOM
    PRED --> SERV
    
    DOM --> DTO
    SERV --> DTO
    DTO --> PRISMA
    
    PRISMA --> DB
    SQL --> DB
    
    JEST --> API_TEST
    JEST --> COMP_TEST
    API_TEST --> API
    COMP_TEST --> COMP
```

## 🚀 Architecture Technique

### Frontend (Next.js 15)
- **Framework**: Next.js avec App Router
- **Styling**: Tailwind CSS 4.1
- **Language**: TypeScript
- **Components**: React fonctionnels avec hooks

### Backend (API Routes)
- **Framework**: Next.js API Routes
- **Language**: TypeScript
- **Architecture**: Clean Architecture
- **Patterns**: Repository, Service, DTO

### Base de Données
- **ORM**: Prisma
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Migrations**: SQL-first approach
- **Seeding**: Prisma seed scripts

## 📊 Structure des Données

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

## 🔄 Flux de Données

```mermaid
sequenceDiagram
    participant UI as Frontend UI
    participant API as API Routes
    participant BL as Business Logic
    participant DB as Database
    
    UI->>API: HTTP Request
    API->>BL: Call Service/Entity
    BL->>DB: Prisma Query
    DB-->>BL: Raw Data
    BL-->>API: Processed DTO
    API-->>UI: JSON Response
    UI->>UI: Update State/UI
```

## 📁 Structure du Projet

```
fleet-case/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── ecommerce/    # E-commerce endpoints
│   │   │   ├── fleet/        # Fleet management endpoints
│   │   │   └── predictions/  # Sales prediction APIs
│   │   ├── globals.css       # Styles globaux
│   │   ├── layout.tsx        # Layout racine
│   │   └── page.tsx          # Page d'accueil
│   ├── domain/
│   │   └── entities/         # Entités métier
│   └── dtos/                 # Data Transfer Objects
├── prisma/
│   ├── schema.prisma         # Schéma Prisma
│   └── seed.ts              # Script de seeding
├── sql/                      # Fichiers SQL source
│   ├── structure.sql         # Structure et données
│   ├── query.sql            # Requêtes d'analyse
│   └── sales-prediction.ts  # Algorithme de prédiction
├── tests/                    # Tests unitaires et d'intégration
└── docs/                     # Documentation
```

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 15**: Framework React avec SSR/SSG
- **TypeScript**: Typage statique
- **Tailwind CSS 4.1**: Framework CSS utilitaire
- **React**: Bibliothèque UI

### Backend
- **Next.js API Routes**: Endpoints RESTful
- **Prisma ORM**: Mapping objet-relationnel
- **SQLite**: Base de données (développement)
- **TypeScript**: Typage backend

### DevOps & Testing
- **Jest**: Framework de tests
- **pnpm**: Gestionnaire de paquets
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Formatage du code

## 🔐 Sécurité

### Authentification
- Session-based auth (future)
- JWT tokens (future)
- Role-based access control

### Validation
- Input validation avec Zod
- SQL injection prevention (Prisma)
- XSS protection (Next.js)

## 📈 Performance

### Frontend
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Code splitting automatique
- Image optimization

### Backend
- Database indexing
- Query optimization (Prisma)
- Caching strategies
- Connection pooling

## 🚀 Déploiement

### Développement
```bash
pnpm install
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

### Variables d'Environnement
- `DATABASE_URL`: URL de connexion à la base
- `NODE_ENV`: Environnement (dev/prod)
- `NEXTAUTH_SECRET`: Secret pour l'auth (future)

## 🔄 Workflow de Développement

1. **SQL First**: Écriture des structures SQL
2. **Prisma Sync**: `prisma db pull` pour synchroniser
3. **Code Generation**: `prisma generate` pour les clients
4. **Development**: Développement des features
5. **Testing**: Tests unitaires et d'intégration
6. **Deployment**: Déploiement continu

## 📊 Monitoring & Analytics

### Métriques Business
- Ventes par jour/mois
- Produits les plus vendus
- Prédictions de ventes
- Performance des employés

### Métriques Techniques
- Temps de réponse API
- Erreurs système
- Utilisation de la base de données
- Performance frontend

## 🔮 Évolutions Futures

### Fonctionnalités
- Authentification utilisateur
- Dashboard analytics avancé
- API GraphQL
- Notifications en temps réel

### Architecture
- Microservices
- Event-driven architecture
- Containerisation (Docker)
- CI/CD pipeline

### Scaling
- Database sharding
- Load balancing
- CDN integration
- Caching layers (Redis)