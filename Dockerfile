# Step 1: Build using the most standard Maven image
FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY . .
# This creates the JAR file
RUN mvn clean package -DskipTests

# Step 2: Run using the most standard OpenJDK image
FROM openjdk:17-alpine
WORKDIR /app
# Copy the built JAR from the first step
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]