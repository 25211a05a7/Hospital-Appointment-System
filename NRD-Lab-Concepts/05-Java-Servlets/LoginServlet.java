package com.careconnect.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * CareConnect Hospital Appointment System
 * Experiment 5 & 7: Java Servlets Session & Authentication
 */
@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");

        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();

        if ("admin@careconnect.com".equals(email) && "Admin@123".equals(password)) {
            // Establish HTTP Session
            HttpSession session = request.getSession(true);
            session.setAttribute("userEmail", email);
            session.setAttribute("userRole", "admin");

            // Attach remember cookie
            Cookie userCookie = new Cookie("careconnect_user", email);
            userCookie.setMaxAge(60 * 60 * 24 * 7); // 7 days
            response.addCookie(userCookie);

            out.println("<div class='alert alert-success'>Admin authenticated successfully! Session ID: " + session.getId() + "</div>");
        } else {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            out.println("<div class='alert alert-danger'>Invalid credentials!</div>");
        }
    }
}
