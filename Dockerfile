# We use a single-stage build for simplicity to avoid folder path errors
FROM maven:3.8.5-openjdk-17
WORKDIR /app
COPY . .
# Build the project
RUN mvn clean package -DskipTests
# Port for Spring Boot
EXPOSE 8080
# Run the generated jar from the target folder
CMD ["java", "-jar", "target/Resume_Analyzer-0.0.1-SNAPSHOT.jar"]