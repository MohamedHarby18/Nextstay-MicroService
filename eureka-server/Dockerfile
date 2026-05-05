FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY . .
RUN mvn clean package -pl eureka-server -am -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /build/eureka-server/target/eureka-server-1.0.0.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]
