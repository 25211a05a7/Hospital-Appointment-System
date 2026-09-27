# Experiment 9: Oracle Database Connectivity

## 1. Overview
Enterprise healthcare information systems frequently integrate with Oracle Database (11g/19c/21c) for high-availability transaction processing and audit logging. This experiment demonstrates connecting to Oracle Database via JDBC thin driver (`jdbc:oracle:thin:@host:1521:SID`) and via Node.js (`oracledb`).

## 2. Files
- `OracleDatabaseDemo.java`: Java JDBC implementation for Oracle SQL dialect.
- `oracle_node_demo.js`: Node.js driver configuration and connection pool architecture.

## 3. Setup & Execution Instructions
1. Ensure Oracle Database (XE/EE) is active on port 1521.
2. Obtain `ojdbc8.jar` or run `npm install oracledb`.
3. Run Node demo:
   ```bash
   node oracle_node_demo.js
   ```
4. Compile & run Java demo:
   ```bash
   javac -cp ".;ojdbc8.jar" OracleDatabaseDemo.java
   java -cp ".;ojdbc8.jar" OracleDatabaseDemo
   ```
