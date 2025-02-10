# X-ray_app
Web application for analysing X-ray photos, written for an engineering thesis

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
├── detection/
│   ├── main_app.py (Detection service application)
│   ├── model.txt (Model placeholder)
│   └── requirements.txt (Python dependencies)
├── doc/
│   ├── Xray_thesis.pdf (engineering thesis on this app)
│   └── System_presentation.pdf (PP presentation on the system)
├── frontend/
│   ├── package.json (Contains frontend project dependencies)
│   ├── package-lock.json (Ensures consistent dependency versions)
│   └── src
│       ├── App.js (Contains the main application logic)
│       ├── components/ (React components for each dashboard)
│       └── styles/ (CSS styles for each respective dashboard)
└── README.md (This file)

```
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

### Detection Model

Download the model [here](https://drive.google.com/file/d/1vjrQL2f61aI1Ea2kBO1MXnEuGT03BAI7/view?usp=drivesdk) or copy the link from detection/model.txt and place the file in /detection directory 

#### Install Python requirements:
```bash
pip install -r requirements.txt
```

#### Run the detection service:
```bash
python main_app.py
```

By default, the detection service will run on http://localhost:8000

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

