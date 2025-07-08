# Multi-stage build for .NET Core API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["AscendumApp.sln", "./"]
COPY ["src/AscendumApp.API/AscendumApp.API.csproj", "src/AscendumApp.API/"]
COPY ["src/AscendumApp.Core/AscendumApp.Core.csproj", "src/AscendumApp.Core/"]
COPY ["src/AscendumApp.Data/AscendumApp.Data.csproj", "src/AscendumApp.Data/"]
COPY ["src/AscendumApp.Shared/AscendumApp.Shared.csproj", "src/AscendumApp.Shared/"]

# Restore dependencies
RUN dotnet restore "AscendumApp.sln"

# Copy source code
COPY . .

# Build the application
RUN dotnet build "AscendumApp.sln" -c Release -o /app/build

# Publish the application
FROM build AS publish
RUN dotnet publish "src/AscendumApp.API/AscendumApp.API.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install SQL Server tools for health checks
RUN apt-get update && apt-get install -y curl gnupg2 && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy published application
COPY --from=publish /app/publish .

# Expose ports
EXPOSE 5000
EXPOSE 5001

# Set entry point
ENTRYPOINT ["dotnet", "AscendumApp.API.dll"] 