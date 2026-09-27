/**
 * CareConnect Hospital Appointment System
 * Experiment 1: Java + JDBC CRUD Operations with MySQL
 * 
 * Demonstrates:
 * - Establishing JDBC Connection with DriverManager
 * - CREATE (INSERT Doctor / Appointment)
 * - READ (SELECT Doctors with PreparedStatement)
 * - UPDATE (UPDATE Doctor consultation fee)
 * - DELETE (DELETE Appointment record)
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class HospitalJDBCDemo {

    // Database connection constants
    private static final String DB_URL = "jdbc:mysql://localhost:3306/hospital_appointment?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = ""; // Adjust password as needed

    public static void main(String[] args) {
        System.out.println("===============================================================");
        System.out.println(" CareConnect Hospital - Java JDBC CRUD Demonstration");
        System.out.println("===============================================================");

        Connection conn = null;
        try {
            // 1. Load MySQL JDBC Driver
            System.out.println("\n[1] Registering and loading MySQL JDBC Driver...");
            Class.forName("com.mysql.cj.jdbc.Driver");
            System.out.println("    -> Driver loaded successfully.");

            // 2. Establish Connection
            System.out.println("\n[2] Connecting to MySQL Database: " + DB_URL);
            conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            System.out.println("    -> Connection established successfully!");

            // 3. CREATE (Insert a new sample doctor)
            System.out.println("\n[3] CREATE Operation: Inserting temporary test doctor...");
            String insertSql = "INSERT INTO doctors (department_id, name, email, specialization, qualification, experience, consultation_fee, available_days, available_timings, is_active) " +
                               "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement insertStmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS)) {
                insertStmt.setInt(1, 1);
                insertStmt.setString(2, "Dr. Demo Physician");
                insertStmt.setString(3, "demo.physician@careconnect.com");
                insertStmt.setString(4, "General Medicine");
                insertStmt.setString(5, "MBBS, MD");
                insertStmt.setInt(6, 5);
                insertStmt.setDouble(7, 500.00);
                insertStmt.setString(8, "Monday - Friday");
                insertStmt.setString(9, "09:00 AM - 01:00 PM");
                insertStmt.setBoolean(10, true);

                int rowsInserted = insertStmt.executeUpdate();
                System.out.println("    -> Inserted " + rowsInserted + " doctor row(s).");
            }

            // 4. READ (Select all doctors)
            System.out.println("\n[4] READ Operation: Fetching active doctors...");
            String selectSql = "SELECT id, name, specialization, consultation_fee FROM doctors WHERE is_active = 1 LIMIT 5";
            try (Statement selectStmt = conn.createStatement();
                 ResultSet rs = selectStmt.executeQuery(selectSql)) {
                System.out.println("    ID  | Doctor Name          | Specialization       | Fee (INR)");
                System.out.println("    ----+----------------------+----------------------+-----------");
                while (rs.next()) {
                    int id = rs.getInt("id");
                    String name = rs.getString("name");
                    String spec = rs.getString("specialization");
                    double fee = rs.getDouble("consultation_fee");
                    System.out.printf("    %-3d | %-20s | %-20s | ₹%.2f%n", id, name, spec, fee);
                }
            }

            // 5. UPDATE (Update consultation fee)
            System.out.println("\n[5] UPDATE Operation: Updating test doctor fee...");
            String updateSql = "UPDATE doctors SET consultation_fee = ? WHERE email = ?";
            try (PreparedStatement updateStmt = conn.prepareStatement(updateSql)) {
                updateStmt.setDouble(1, 550.00);
                updateStmt.setString(2, "demo.physician@careconnect.com");
                int rowsUpdated = updateStmt.executeUpdate();
                System.out.println("    -> Updated " + rowsUpdated + " doctor row(s).");
            }

            // 6. DELETE (Clean up test doctor)
            System.out.println("\n[6] DELETE Operation: Cleaning up test doctor...");
            String deleteSql = "DELETE FROM doctors WHERE email = ?";
            try (PreparedStatement deleteStmt = conn.prepareStatement(deleteSql)) {
                deleteStmt.setString(1, "demo.physician@careconnect.com");
                int rowsDeleted = deleteStmt.executeUpdate();
                System.out.println("    -> Deleted " + rowsDeleted + " test doctor row(s).");
            }

            System.out.println("\n===============================================================");
            System.out.println(" ✅ JDBC CRUD DEMONSTRATION EXECUTED SUCCESSFULLY!");
            System.out.println("===============================================================");

        } catch (ClassNotFoundException e) {
            System.err.println("JDBC Driver class not found: " + e.getMessage());
            System.err.println("Ensure mysql-connector-j-8.x.jar is in your classpath.");
        } catch (SQLException e) {
            System.err.println("SQL Exception: " + e.getMessage());
            System.err.println("SQL State: " + e.getSQLState());
            System.err.println("Error Code: " + e.getErrorCode());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                    System.out.println("\nDatabase connection closed.");
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
