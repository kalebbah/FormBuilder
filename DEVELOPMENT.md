# Development Guide

This guide provides detailed information for developers working on the Ascendum Form & Workflow Management System.

## 🏗️ Architecture Overview

The system follows a modern multi-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  .NET Core API  │    │  SQL Server DB  │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: .NET 8 + Entity Framework Core + ASP.NET Identity
- **Database**: Microsoft SQL Server
- **Containerization**: Docker + Docker Compose
- **Authentication**: JWT Tokens
- **State Management**: React Query + Zustand
- **Form Builder**: Custom drag-and-drop implementation
- **Workflow Engine**: Custom implementation with JSON-based definitions

## 🚀 Getting Started

### Prerequisites

1. **Docker Desktop** - For containerized development
2. **.NET 8 SDK** - For backend development
3. **Node.js 18+** - For frontend development
4. **Visual Studio 2022** or **VS Code** - IDE
5. **Git** - Version control

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AscendumApp
   ```

2. **Run the setup script**
   ```powershell
   .\setup.ps1
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000 (Swagger UI)

## 📁 Project Structure

```
AscendumApp/
├── backend/                          # .NET Core Backend
│   ├── src/
│   │   ├── AscendumApp.API/         # Main API project
│   │   ├── AscendumApp.Core/        # Business logic & services
│   │   ├── AscendumApp.Data/        # Data access layer
│   │   └── AscendumApp.Shared/      # Shared models & DTOs
│   ├── tests/                       # Unit & integration tests
│   └── Dockerfile                   # Backend container
├── frontend/                        # React Frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API service calls
│   │   ├── stores/                  # State management
│   │   ├── types/                   # TypeScript type definitions
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   └── Dockerfile                   # Frontend container
├── docker-compose.yml               # Multi-container setup
├── README.md                        # Project overview
├── DEVELOPMENT.md                   # This file
└── setup.ps1                        # Setup script
```

## 🔧 Development Workflow

### Backend Development

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Restore dependencies**
   ```bash
   dotnet restore
   ```

3. **Run the API**
   ```bash
   dotnet run --project src/AscendumApp.API
   ```

4. **Run tests**
   ```bash
   dotnet test
   ```

5. **Create database migration**
   ```bash
   dotnet ef migrations add MigrationName --project src/AscendumApp.Data --startup-project src/AscendumApp.API
   ```

6. **Update database**
   ```bash
   dotnet ef database update --project src/AscendumApp.Data --startup-project src/AscendumApp.API
   ```

### Frontend Development

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Run tests**
   ```bash
   npm test
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Database Schema

### Core Entities

1. **Users** - User accounts and authentication
2. **Forms** - Form definitions and templates
3. **FormSubmissions** - Submitted form data
4. **Workflows** - Workflow definitions
5. **WorkflowInstances** - Running workflow instances
6. **Tasks** - User task assignments
7. **AuditLogs** - System audit trail

### Key Relationships

- Forms can be associated with Workflows
- FormSubmissions can trigger WorkflowInstances
- WorkflowInstances contain multiple Tasks
- Tasks are assigned to Users
- All actions are logged in AuditLogs

## 🔐 Authentication & Authorization

### User Roles

1. **User** - Can submit forms and complete assigned tasks
2. **Admin** - Can create/edit forms and manage submissions
3. **SuperAdmin** - Can manage workflows and user accounts

### JWT Token Structure

```json
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "Admin",
  "exp": 1640995200,
  "iat": 1640908800
}
```

## 📝 Form Builder

### Form Definition Structure

Forms are stored as JSON with the following structure:

```json
{
  "fields": [
    {
      "id": "field1",
      "type": "text",
      "label": "Full Name",
      "isRequired": true,
      "validation": {
        "minLength": 2,
        "maxLength": 100
      }
    }
  ],
  "sections": [
    {
      "id": "section1",
      "title": "Personal Information",
      "fields": ["field1", "field2"]
    }
  ],
  "conditionalRules": [
    {
      "id": "rule1",
      "targetFieldId": "field2",
      "condition": "field1.value.length > 0",
      "action": "show"
    }
  ]
}
```

### Supported Field Types

- Text (single line, multi-line)
- Number
- Date/DateTime
- Dropdown/Select
- Checkbox/Radio
- File Upload
- Signature
- Geolocation
- Barcode/QR Code

## 🔄 Workflow Engine

### Workflow Definition Structure

```json
{
  "steps": [
    {
      "id": "step1",
      "type": "form",
      "name": "Submit Request",
      "assignment": {
        "type": "user",
        "userId": "user123"
      }
    },
    {
      "id": "step2",
      "type": "approval",
      "name": "Manager Approval",
      "assignment": {
        "type": "role",
        "role": "Manager"
      }
    }
  ],
  "connections": [
    {
      "fromStepId": "step1",
      "toStepId": "step2",
      "condition": null
    }
  ]
}
```

### Supported Step Types

- **Start** - Workflow entry point
- **Form** - Assign a form to complete
- **Approval** - User approval/rejection
- **Notification** - Send email/notification
- **Decision** - Conditional branching
- **Parallel** - Execute multiple steps simultaneously
- **Join** - Wait for parallel steps to complete
- **End** - Workflow completion

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
dotnet test

# Run specific test project
dotnet test tests/AscendumApp.Tests

# Run with coverage
dotnet test --collect:"XPlat Code Coverage"
```

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Development Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml build
   ```

2. **Deploy to production**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Configure environment variables**
   - Database connection string
   - JWT secret key
   - Email server settings
   - CORS origins

## 🔍 Debugging

### Backend Debugging

1. **Attach debugger in Visual Studio**
2. **Use logging**
   ```csharp
   _logger.LogInformation("Debug message");
   ```

3. **Check database**
   ```bash
   docker exec -it ascendum-db sqlcmd -S localhost -U sa -P Ascendum123!
   ```

### Frontend Debugging

1. **Browser Developer Tools**
2. **React Developer Tools extension**
3. **Console logging**
   ```typescript
   console.log('Debug message');
   ```

## 📊 Monitoring & Logging

### Logging

- **Backend**: Serilog with file and console sinks
- **Frontend**: Console logging with error boundaries
- **Database**: SQL Server logs

### Health Checks

- **API Health**: `GET /health`
- **Database Health**: Automatic EF Core health checks
- **Frontend Health**: `GET /health` (nginx)

## 🔧 Configuration

### Environment Variables

```bash
# Database
ConnectionStrings__DefaultConnection=Server=localhost;Database=AscendumDB;...

# JWT
JWT__SecretKey=your-secret-key
JWT__Issuer=AscendumApp
JWT__Audience=AscendumApp

# Email
Email__SmtpServer=smtp.gmail.com
Email__SmtpPort=587
Email__Username=your-email@gmail.com
Email__Password=your-app-password
```

### App Settings

Key configuration sections in `appsettings.json`:

- **ConnectionStrings** - Database connection
- **JWT** - Authentication settings
- **Email** - SMTP configuration
- **Logging** - Log levels and sinks
- **Cors** - Allowed origins

## 🤝 Contributing

### Code Style

- **Backend**: Follow C# coding conventions
- **Frontend**: Use Prettier and ESLint
- **Database**: Use PascalCase for table/column names

### Git Workflow

1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Write/update tests
4. Create pull request
5. Code review and merge

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 📚 Additional Resources

- [.NET 8 Documentation](https://docs.microsoft.com/en-us/dotnet/)
- [React Documentation](https://reactjs.org/docs/)
- [Entity Framework Core](https://docs.microsoft.com/en-us/ef/core/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check if SQL Server container is running
   - Verify connection string in appsettings.json

2. **Frontend can't connect to API**
   - Check if backend container is running
   - Verify CORS configuration
   - Check proxy settings in package.json

3. **JWT token issues**
   - Verify JWT secret key configuration
   - Check token expiration settings

4. **Form builder not working**
   - Check browser console for JavaScript errors
   - Verify all required dependencies are installed

### Getting Help

1. Check the logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub issues
4. Contact the development team 