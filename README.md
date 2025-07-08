# Enterprise Form & Workflow Management System

An internal web application for designing and managing digital forms and multi-step workflows. It enables non-technical staff to build forms (with rich field types and conditional logic) and define workflow processes for form approvals and task routing.

## 🚀 Features

### Form Builder
- **Drag & Drop Interface**: Visual form builder with rich field types
- **Conditional Logic**: Show/hide fields based on user input
- **Field Validation**: Comprehensive validation rules and formula calculations
- **Custom Components**: Signature capture, photo upload, barcode scanning, geolocation
- **Form Templates**: Save and reuse form designs

### Workflow Engine
- **Visual Designer**: Drag-and-drop workflow builder
- **Multi-step Processes**: Sequential and parallel workflow execution
- **Task Assignment**: Route tasks to specific users, roles, or groups
- **Audit Trail**: Complete tracking of all workflow actions
- **Notifications**: Email alerts for task assignments

### Security
- **Role-Based Access Control**: User, Admin, and SuperAdmin roles
- **Authentication**: Local authentication with ASP.NET Identity
- **Data Security**: HTTPS, server-side validation, audit logs

## 🛠 Tech Stack

- **Frontend**: React.js with TypeScript
- **Backend**: .NET Core Web API (C#)
- **Database**: Microsoft SQL Server
- **Containerization**: Docker & Docker Compose
- **Authentication**: ASP.NET Identity with JWT tokens

## 📋 Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm
- Docker and Docker Compose
- SQL Server (or use Docker container)

## 🚀 Quick Start

### Using Docker (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database: localhost:1433

### Manual Setup

1. **Backend Setup**:
   ```bash
   cd backend
   dotnet restore
   dotnet ef database update
   dotnet run
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 👥 User Roles

- **User**: Submit forms, view submissions, complete assigned tasks
- **Admin**: Create/edit forms, manage form submissions
- **SuperAdmin**: All admin privileges plus workflow design and user management

## 📁 Project Structure

```
AscendumApp/
├── backend/                 # .NET Core Web API
│   ├── src/
│   │   ├── AscendumApp.API/        # Main API project
│   │   ├── AscendumApp.Core/       # Business logic
│   │   ├── AscendumApp.Data/       # Data access layer
│   │   └── AscendumApp.Shared/     # Shared models
│   └── tests/              # Unit and integration tests
├── frontend/               # React TypeScript application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service calls
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── docker-compose.yml      # Multi-container setup
└── README.md              # This file
```

## 🔧 Development

### Backend Development
- Uses Entity Framework Core for data access
- JWT-based authentication
- RESTful API design
- Comprehensive logging and error handling

### Frontend Development
- React with TypeScript for type safety
- Modern UI with responsive design
- State management with React Context
- Form builder with drag-and-drop functionality

## 🧪 Testing

```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test
```

## 📊 Database Schema

The system uses the following main entities:
- **Users**: User accounts and roles
- **Forms**: Form definitions and templates
- **FormSubmissions**: Submitted form data
- **Workflows**: Workflow definitions
- **WorkflowInstances**: Running workflow instances
- **Tasks**: User task assignments
- **AuditLogs**: System audit trail

## 🔐 Security Features

- HTTPS encryption for all communications
- Password hashing with salt
- Role-based access control
- Input validation and sanitization
- Comprehensive audit logging

## 📈 Future Enhancements

- Mobile app support
- Azure AD integration
- Advanced workflow features
- Real-time notifications
- Multi-tenant architecture
- Advanced analytics and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions, please contact the development team or create an issue in the repository. 