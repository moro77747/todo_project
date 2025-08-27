# Stage 1: The Build Stage
FROM maven:3-openjdk-18-slim AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml and download dependencies
# This is a key optimization: Docker can cache this step
# if the pom.xml doesn't change.
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the rest of the source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Stage 2: The Run Stage (creates a smaller final image)
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the compiled JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]



