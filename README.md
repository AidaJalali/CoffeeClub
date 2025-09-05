# Coffee Club Scheduler

An application for managing coffee club schedules and duties, built with Spring Boot (Kotlin) backend and React (TypeScript) frontend.


### Backend Setup
```bash
cd backend
./gradlew bootRun
```
The backend will start on `http://localhost:8080`

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`

##  Architecture

### Backend (Spring Boot + Kotlin)
- **Framework**: Spring Boot 3.5.3
- **Language**: Kotlin
- **Database**: H2 (in-memory for development)
- **Port**: 8080

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + Tailwind CSS
- **Port**: 5173

## Integration Fixes Applied

### 1. Port Configuration
- ✅ Fixed frontend port from 8080 to 5173
- ✅ Updated CORS configuration to match
- ✅ Backend runs on 8080, frontend on 5173

### 2. Data Structure Alignment
- ✅ Created shared TypeScript interfaces
- ✅ Added DTOs for API responses
- ✅ Fixed field name mismatches (`coffeeMakers` vs `coffeeMakerIds`)
- ✅ Converted UUIDs to strings for frontend compatibility

### 3. API Integration
- ✅ Centralized API service with axios
- ✅ Real authentication integration
- ✅ Proper error handling
- ✅ Type-safe API calls

### 4. Authentication
- ✅ Real login/register API calls
- ✅ Proper user data handling
- ✅ Session management

## Project Structure

```
CoffeeClub/
├── backend/
│   ├── src/main/kotlin/com/coffeeclub/coffeeclub/
│   │   ├── application/          # Business logic
│   │   ├── domain/              # Domain models
│   │   └── infrastructure/      # Web controllers, persistence
│   └── build.gradle.kts
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── services/            # API service
│   │   ├── types/               # TypeScript interfaces
│   │   └── pages/               # Page components
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Plans
- `GET /api/plans/today` - Get today's plan
- `GET /api/plans/weekly/current` - Get current weekly plan
- `POST /api/plans/weekly` - Generate new weekly plan

### Users
- `PUT /api/users/{id}/status` - Update user status

### Duty
- `GET /api/duty/buyer` - Get next coffee buyer

## Development

### Backend Development
```bash
cd backend
./gradlew bootRun
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Database Access
- H2 Console: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Testing

### Backend Tests
```bash
cd backend
./gradlew test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## Notes

- The application uses H2 in-memory database for development
- All UUIDs are converted to strings for frontend compatibility
- CORS is configured for localhost development
- Authentication is email-based (no password required for demo)
