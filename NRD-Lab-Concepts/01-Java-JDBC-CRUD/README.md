# Experiment 1: Java + JDBC CRUD Operations

## 1. Overview
This experiment demonstrates how to connect a Java application to a MySQL relational database (`hospital_appointment`) using the Java Database Connectivity (JDBC) API. It demonstrates complete Create, Read, Update, and Delete (CRUD) operations on doctor and appointment records.

## 2. Dependencies
- Java Development Kit (JDK 8 / 11 / 17 / 21)
- MySQL Server (running on `localhost:3306`)
- MySQL Connector/J JDBC Driver (`mysql-connector-j-8.0.x.jar`)

## 3. Setup & Compilation
1. Download `mysql-connector-j-8.3.0.jar` (or place it in this directory).
2. Ensure MySQL is running with database `hospital_appointment` created.

### Compile:
```bash
javac -cp ".;mysql-connector-j-8.3.0.jar" HospitalJDBCDemo.java
```

### Run:
```bash
java -cp ".;mysql-connector-j-8.3.0.jar" HospitalJDBCDemo
```

## 4. Expected Output
```text
===============================================================
 CareConnect Hospital - Java JDBC CRUD Demonstration
===============================================================

[1] Registering and loading MySQL JDBC Driver...
    -> Driver loaded successfully.

[2] Connecting to MySQL Database: jdbc:mysql://localhost:3306/hospital_appointment
    -> Connection established successfully!

[3] CREATE Operation: Inserting temporary test doctor...
    -> Inserted 1 doctor row(s).

[4] READ Operation: Fetching active doctors...
    ID  | Doctor Name          | Specialization       | Fee (INR)
    ----+----------------------+----------------------+-----------
    1   | Dr. Rajesh Sharma    | General Medicine     | ₹600.00
    2   | Dr. Priya Venkatesh  | Cardiology           | ₹1000.00
    3   | Dr. Ananya Iyer      | Dermatology          | ₹750.00

[5] UPDATE Operation: Updating test doctor fee...
    -> Updated 1 doctor row(s).

[6] DELETE Operation: Cleaning up test doctor...
    -> Deleted 1 test doctor row(s).

===============================================================
 ✅ JDBC CRUD DEMONSTRATION EXECUTED SUCCESSFULLY!
===============================================================
```

## 5. Faculty Demonstration Instructions
- Explain the role of `Class.forName("com.mysql.cj.jdbc.Driver")`.
- Demonstrate the security benefits of `PreparedStatement` to prevent SQL Injection over `Statement`.
- Explain `executeUpdate()` for DML (INSERT/UPDATE/DELETE) vs `executeQuery()` for DQL (SELECT).
