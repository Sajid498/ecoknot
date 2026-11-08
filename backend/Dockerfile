
# Stage 1: Build Spring Boot application
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

# Copy Maven configuration
COPY pom.xml .

# Copy application source
COPY src ./src

# Build executable JAR
RUN mvn -B clean package -DskipTests

# Stage 2: Run application
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
