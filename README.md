# X-ray_app
web application for analysing X-ray photos, written for engineering thesis

## Build and Run  

### Run the following command to build the application:
```bash
./gradlew build
```
### Execute the following to run the Spring Boot application:
```bash
./gradlew bootRun
```

By default, the application will run on http://localhost:8080

### Directory structure
```bash
.
├── backend/
│   ├── src/main/
│   │   ├── java/com/backend/ (Java source files)
│   │   └── resources/application.propertis (Spring Boot configuration)
│   ├── uploads/images (Stores uploaded images)
│   ├── build.gradle (Gradle build file)
│   └── settings.gradle (Gradle project settings)
└── README.md (This file)

```
