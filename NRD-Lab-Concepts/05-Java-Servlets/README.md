# Experiment 5: Java Servlets

## 1. Overview
Java Servlets are server-side Java programs that handle HTTP requests and generate dynamic responses (HTML or JSON). This module illustrates handling `doGet()` and `doPost()` lifecycle methods for appointment management and user authentication.

## 2. Files
- `AppointmentServlet.java`: Handles appointment listing via `doGet()` and booking via `doPost()`.
- `LoginServlet.java`: Handles session creation and authentication via `doPost()`.
- `web.xml`: Deployment descriptor registering Servlets and session timeout configurations.

## 3. How to Deploy / Run
1. Install Apache Tomcat (v9 or v10).
2. Compile classes with `javax.servlet-api.jar` in the classpath:
   ```bash
   javac -cp ".;servlet-api.jar;mysql-connector-j.jar" -d WEB-INF/classes *.java
   ```
3. Place in Tomcat `webapps/CareConnectHospital/` and start Tomcat.
4. Access `http://localhost:8080/CareConnectHospital/api/servlets/appointments`.
