package com.careconnect.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * CareConnect Hospital Appointment System
 * Experiment 5: Java Servlets - Processing HTTP GET and POST for Appointments
 */
@WebServlet("/AppointmentServlet")
public class AppointmentServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private static final String DB_URL = "jdbc:mysql://localhost:3306/hospital_appointment?useSSL=false";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        out.println("<!DOCTYPE html><html><head><title>CareConnect - Doctor Appointments</title>");
        out.println("<link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'>");
        out.println("</head><body class='container py-4'>");
        out.println("<h2 class='text-primary mb-3'>CareConnect Hospital - Active Appointments (Servlet GET)</h2>");

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 PreparedStatement stmt = conn.prepareStatement(
                     "SELECT a.id, a.appointment_date, a.appointment_time, a.status, d.name AS doctor_name, u.name AS patient_name " +
                     "FROM appointments a JOIN doctors d ON a.doctor_id = d.id " +
                     "JOIN patients p ON a.patient_id = p.id JOIN users u ON p.user_id = u.id LIMIT 10");
                 ResultSet rs = stmt.executeQuery()) {

                out.println("<table class='table table-striped table-bordered'>");
                out.println("<thead class='table-dark'><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>");

                while (rs.next()) {
                    out.printf("<tr><td>%d</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td><td><span class='badge bg-success'>%s</span></td></tr>%n",
                        rs.getInt("id"), rs.getString("patient_name"), rs.getString("doctor_name"),
                        rs.getString("appointment_date"), rs.getString("appointment_time"), rs.getString("status"));
                }
                out.println("</tbody></table>");
            }
        } catch (Exception e) {
            out.println("<div class='alert alert-danger'>Error fetching appointments: " + e.getMessage() + "</div>");
        }

        out.println("<a href='index.html' class='btn btn-outline-primary'>Back to Home</a>");
        out.println("</body></html>");
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String patientId = request.getParameter("patientId");
        String doctorId = request.getParameter("doctorId");
        String date = request.getParameter("appointmentDate");
        String time = request.getParameter("appointmentTime");
        String reason = request.getParameter("reason");

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();

        if (patientId == null || doctorId == null || date == null || time == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            out.print("{\"success\": false, \"message\": \"Missing required booking parameters.\"}");
            return;
        }

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
                 PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?, ?, ?, ?, ?, 'Confirmed')")) {
                stmt.setInt(1, Integer.parseInt(patientId));
                stmt.setInt(2, Integer.parseInt(doctorId));
                stmt.setString(3, date);
                stmt.setString(4, time);
                stmt.setString(5, reason);
                stmt.executeUpdate();
            }

            response.setStatus(HttpServletResponse.SC_CREATED);
            out.print("{\"success\": true, \"message\": \"Appointment booked successfully via Servlet POST.\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"success\": false, \"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
