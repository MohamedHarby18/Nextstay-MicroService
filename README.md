# Nextstay Microservices Architecture

## 📋 Project Structure

```
nextstay-microservices/
├── pom.xml (Parent POM - Multi-module)
├── docker-compose.yml
├── README.md
│
├── nextstay-common/
│   ├── pom.xml
│   └── src/main/java/com/nextstay/common/
│       ├── dto/
│       │   ├── LoginRequest.java
│       │   ├── LoginResponse.java
│       │   └── CreateUserRequest.java
│       └── entity/
│
├── eureka-server/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/eureka/
│       │   └── EurekaServerApplication.java
│       └── resources/
│           └── application.properties
│
├── api-gateway/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/gateway/
│       │   └── ApiGatewayApplication.java
│       └── resources/
│           └── application.properties
│
├── auth-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/auth/
│       │   ├── AuthServiceApplication.java
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   └── entity/
│       └── resources/
│           └── application.properties
│
├── user-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/user/
│       │   ├── UserServiceApplication.java
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   └── entity/
│       └── resources/
│           └── application.properties
│
├── agent-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/agent/
│       │   ├── AgentServiceApplication.java
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   └── entity/
│       └── resources/
│           └── application.properties
│
├── review-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/review/
│       │   ├── ReviewServiceApplication.java
│       │   ├── controller/
│       │   ├── service/
│       │   ├── repository/
│       │   └── entity/
│       └── resources/
│           └── application.properties
│
└── support-service/
    ├── pom.xml
    └── src/
        ├── main/java/com/nextstay/support/
        │   ├── SupportServiceApplication.java
        │   ├── controller/
        │   ├── service/
        │   ├── repository/
        │   └── entity/
        └── resources/
            └── application.properties
```

## 🏗️ Architecture Overview

### Service Ports
- **API Gateway**: 8080
- **Auth Service**: 8081
- **User Service**: 8082
- **Agent Service**: 8083
- **Review Service**: 8084
- **Support Service**: 8085
- **Eureka Server**: 8761

### Databases
- **Auth DB**: `NextstayAuthDB` (port 3307)
- **User DB**: `NextstayUserDB` (port 3307)
- **Review DB**: `NextstayReviewDB` (port 3307)
- **Support DB**: `NextstaySupportDB` (port 3307)

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- MySQL 8.0+
- Docker & Docker Compose (optional, for containerized deployment)

### Build & Run

#### Option 1: Local Development

1. **Build all modules**
   ```bash
   cd nextstay-microservices
   mvn clean install -DskipTests
   ```

2. **Start Eureka Server** (in separate terminal)
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

3. **Start API Gateway** (in separate terminal)
   ```bash
   cd ../api-gateway
   mvn spring-boot:run
   ```

4. **Start individual services** (each in separate terminal)
   ```bash
   # Auth Service
   cd ../auth-service
   mvn spring-boot:run
   
   # User Service
   cd ../user-service
   mvn spring-boot:run
   
   # Agent Service
   cd ../agent-service
   mvn spring-boot:run
   
   # Review Service
   cd ../review-service
   mvn spring-boot:run
   
   # Support Service
   cd ../support-service
   mvn spring-boot:run
   ```

#### Option 2: Docker Compose

1. **Build all services**
   ```bash
   mvn clean install
   ```

2. **Start all containers**
   ```bash
   docker-compose up -d
   ```

3. **Stop all containers**
   ```bash
   docker-compose down
   ```

## 📊 Service Communication

### Service-to-Service Communication
- **Feign Client**: For synchronous REST calls
- **Message Queue**: For asynchronous events (RabbitMQ/Kafka - optional)

### API Endpoints (through Gateway)
- **Auth**: `GET/POST /api/auth/**`
- **Users**: `GET/POST/PUT/DELETE /api/users/**`
- **Agents**: `GET/POST/PUT/DELETE /api/agents/**`
- **Reviews**: `GET/POST /api/reviews/**`
- **Support**: `GET/POST /api/support/**`

## 🔐 Security

### JWT Authentication
- Each service validates JWT tokens from the Auth Service
- Token includes user role and permissions
- Gateway validates tokens before routing requests

## 📈 Monitoring

### Eureka Dashboard
Access at: `http://localhost:8761`

Shows:
- Registered services
- Service health status
- Instance information

## 📝 Development Notes

### Adding New Endpoints
1. Add controller in respective service
2. Implement business logic in service layer
3. Update API Gateway routes if needed
4. Test through gateway endpoint

### Inter-Service Communication
```java
@FeignClient(name = "user-service")
public interface UserServiceClient {
    @GetMapping("/api/users/{id}")
    User getUserById(@PathVariable Long id);
}
```

### Database Migration
- Each service has its own database
- Use JPA/Hibernate for migrations
- DDL auto is set to `update` for development

## 🐛 Troubleshooting

### Services not registering with Eureka
- Check Eureka Server is running on port 8761
- Verify `eureka.client.serviceUrl.defaultZone` in each service

### Database connection errors
- Ensure MySQL is running
- Verify database credentials in `application.properties`
- Check database names exist

### Gateway routing issues
- Verify service names in routes match registered service names
- Check service health in Eureka dashboard
- Review gateway application.properties

## 📚 Next Steps

1. **Implement logging** using ELK Stack or Splunk
2. **Add API documentation** using Swagger/OpenAPI
3. **Implement circuit breaker** using Resilience4j
4. **Add message queue** for asynchronous operations
5. **Setup monitoring** with Prometheus and Grafana
6. **Implement distributed tracing** using Sleuth and Zipkin

## 📄 License

MIT License

---

**Author**: Nextstay Development Team  
**Version**: 1.0.0  
**Last Updated**: 2026-05-04
