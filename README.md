# Nextstay Microservices Architecture

## 📋 Project Structure

```
nextstay-microservices/
├── pom.xml (Parent POM - Multi-module)
├── docker-compose.yml
├── README.md
├── start-services.sh
│
├── nextstay-common/
│   ├── pom.xml
│   └── src/main/java/com/nextstay/common/
│       ├── dto/
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
├── identity-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/identity/
│       └── resources/
│           └── application.properties
│
├── listing-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/listing/
│       └── resources/
│           └── application.properties
│
├── booking-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/booking/
│       └── resources/
│           └── application.properties
│
├── review-service/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/nextstay/review/
│       └── resources/
│           └── application.properties
│
└── support-service/
    ├── pom.xml
    └── src/
        ├── main/java/com/nextstay/support/
        └── resources/
            └── application.properties
```

## 🏗️ Architecture Overview

### Service Ports
- **API Gateway**: 8080
- **Eureka Server**: 8761
- **Identity Service**: 8081
- **Listing Service**: 8082
- **Booking Service**: 8083
- **Review Service**: 8084
- **Support Service**: 8085

### Databases
- **Identity DB**: `NextstayIdentityDB` (port 3307)
- **Listing DB**: `NextstayListingDB` (port 3308)
- **Booking DB**: `NextstayBookingDB` (port 3311)
- **Review DB**: `NextstayReviewDB` (port 3309)
- **Support DB**: `NextstaySupportDB` (port 3310)

## 🚀 Getting Started

### Prerequisites
- JDK 17 or higher
- Maven 3.8+
- MySQL 8.0+
- Docker & Docker Compose (optional)

### Build & Run

#### Option 1: Local Development

1. **Build all modules**
   ```bash
   cd nextstay-microservices
   mvn clean install -DskipTests
   ```

2. **Start Eureka Server** (in a separate terminal)
   ```bash
   cd eureka-server
   mvn spring-boot:run
   ```

3. **Start API Gateway** (in a separate terminal)
   ```bash
   cd ../api-gateway
   mvn spring-boot:run
   ```

4. **Start individual services** (each in a separate terminal)
   ```bash
   cd ../identity-service
   mvn spring-boot:run
   
   cd ../listing-service
   mvn spring-boot:run
   
   cd ../booking-service
   mvn spring-boot:run
   
   cd ../review-service
   mvn spring-boot:run
   
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
- **Identity**: `GET/POST /api/identity/**`
- **Listing**: `GET/POST/PUT/DELETE /api/listings/**`
- **Booking**: `GET/POST/PUT/DELETE /api/bookings/**`
- **Reviews**: `GET/POST /api/reviews/**`
- **Support**: `GET/POST /api/support/**`

## 🔐 Security

### JWT Authentication
- Each service validates JWT tokens from the identity/auth flow
- Tokens include roles and permissions
- The gateway validates authorization before routing requests

## 📈 Monitoring

### Eureka Dashboard
Access at: `http://localhost:8761`

Shows:
- Registered services
- Service health status
- Instance information

## 📝 Development Notes

### Adding New Endpoints
1. Add a controller in the appropriate service
2. Implement business logic in the service layer
3. Update API Gateway routes if needed
4. Test through the gateway endpoint

### Inter-Service Communication Example
```java
@FeignClient(name = "listing-service")
public interface ListingServiceClient {
    @GetMapping("/api/listings/{id}")
    ListingDto getListingById(@PathVariable Long id);
}
```

### Database Migration
- Each service owns its own database
- Use JPA/Hibernate for schema generation
- `spring.jpa.hibernate.ddl-auto=update` is intended for development

## 🐛 Troubleshooting

### Services not registering with Eureka
- Confirm Eureka Server is running on port 8761
- Verify `eureka.client.serviceUrl.defaultZone` in each service

### Database connection errors
- Ensure MySQL is running
- Verify the correct DB name and credentials in application properties
- Match datasource URLs with Docker Compose database service names

### Gateway routing issues
- Confirm service IDs and routes in the gateway configuration
- Check service health in the Eureka dashboard
- Review the gateway `application.properties`

## 📚 Next Steps

1. Implement centralized logging (ELK, Splunk, etc.)
2. Add API documentation via Swagger/OpenAPI
3. Add resilience patterns with Resilience4j
4. Introduce async messaging (RabbitMQ/Kafka)
5. Add monitoring with Prometheus/Grafana
6. Implement distributed tracing with Sleuth/Zipkin

## 📄 License

MIT License

---

**Author**: Nextstay Development Team
**Version**: 1.0.0
**Last Updated**: 2026-05-05
