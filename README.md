# X-ray_app
Web application for analysing X-ray photos, written for an engineering thesis

## Build and Run  

### Backend

#### Run the following command to build the application:
```bash
./gradlew build
```
#### Execute the following to run the Spring Boot application:
```bash
java -jar build/libs/backend-0.0.1-SNAPSHOT.jar
```

By default, the application will run on http://localhost:8080

### Frontend

#### Install the dependencies using this command:
```bash
npm install
```

#### Start the development server:
```bash
npm start
```

By default, the React app will run on http://localhost:3000

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
├── frontend/
│   ├── package.json (Contains frontend project dependencies)
│   ├── package-lock.json (Ensures consistent dependency versions)
│   └── src
│       ├── App.js (Contains the main application logic)
│       ├── components/ (React components for each dashboard)
│       └── styles/ (CSS styles for each respective dashboard)
└── README.md (This file)

```
