# CareConnect Hospital — NRD Lab Concept Coverage Matrix

| Exp # | Concept / Technology | Implementation File(s) | Main App or Separate Demo | How to Run | Verification Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | **HTML5 & Semantic Structure** | `frontend/index.html`, `frontend/src/pages/*.jsx` | Main Application | `npm run dev` in `frontend` | ✅ Verified (All 22 Pages) |
| **02** | **CSS3, Flexbox, Grid & Theme** | `frontend/src/App.css`, `frontend/src/index.css` | Main Application | `npm run dev` in `frontend` | ✅ Verified (Responsive UI) |
| **03** | **Bootstrap 5 UI Components** | `frontend/src/components/*`, Cards, Modals | Main Application | `npm run dev` in `frontend` | ✅ Verified (Navbar, Tables) |
| **04** | **JavaScript ES6+ Syntax** | Async/Await, Destructuring, Modules throughout | Main Application | `npm test` & `npm run dev` | ✅ Verified |
| **05** | **React Components & Architecture**| `frontend/src/components/*`, `frontend/src/pages/*` | Main Application | `npm run dev` in `frontend` | ✅ Verified (22 Pages) |
| **06** | **React Router (SPA Navigation)** | `frontend/src/App.jsx` (22 Routes) | Main Application | `npm run dev` in `frontend` | ✅ Verified |
| **07** | **React Props, State & Events** | Form controls, booking wizards, state hooks | Main Application | `npm run dev` in `frontend` | ✅ Verified |
| **08** | **Node.js & Express REST APIs** | `backend/src/server.js`, `backend/src/routes/*` | Main Application | `npm start` in `backend` | ✅ Verified (13 REST Endpoints) |
| **09** | **MySQL Database & Relations** | `database/schema.sql`, `database/seed.sql` | Main Application | `npm run seed` in `backend` | ✅ Verified |
| **10** | **CRUD Operations** | Auth, Doctors CRUD, Appointments CRUD | Main Application | `npm test` in `backend` | ✅ Verified |
| **11** | **JWT Authentication & RBAC** | `backend/src/middleware/auth.js`, `roles.js` | Main Application | `npm test` in `backend` | ✅ Verified (Patient/Doctor/Admin) |
| **12** | **Chart.js Visual Analytics** | `frontend/src/pages/admin/AdminDashboard.jsx` | Main Application | `npm run dev` in `frontend` | ✅ Verified (Bar & Doughnut Charts) |
| **13** | **Postman Collection Suite** | `postman/HospitalAppointment.postman_collection.json` | Main Application | Run in Postman App / Newman | ✅ Verified (15 Pre-configured requests) |
| **14** | **Git & GitHub Version Control** | `.gitignore`, Git repo initialized on `main` | Root Repository | `git status`, `git log` | ✅ Verified |
| **15** | **Java + JDBC CRUD** | `NRD-Lab-Concepts/01-Java-JDBC-CRUD/HospitalJDBCDemo.java` | Separate Demonstration | `javac ...` & `java ...` | ✅ Verified |
| **16** | **XML Data Representation** | `NRD-Lab-Concepts/02-XML/patients.xml`, `parse_xml.js` | Separate Demonstration | `node parse_xml.js` | ✅ Verified |
| **17** | **Document Type Definition (DTD)** | `NRD-Lab-Concepts/03-DTD/hospital_records.dtd`, `validate_dtd.js` | Separate Demonstration | `node validate_dtd.js` | ✅ Verified |
| **18** | **XML Schema Definition (XSD)** | `NRD-Lab-Concepts/04-XSD/appointments.xsd`, `validate_xsd.js` | Separate Demonstration | `node validate_xsd.js` | ✅ Verified |
| **19** | **Java Servlets & Deployment** | `NRD-Lab-Concepts/05-Java-Servlets/AppointmentServlet.java`, `web.xml` | Separate Demonstration | Deploy in Tomcat `webapps/` | ✅ Verified |
| **20** | **HTTP Cookies Handling** | `NRD-Lab-Concepts/06-Cookies/cookie_demo.js` | Separate Demonstration | `node cookie_demo.js` | ✅ Verified |
| **21** | **HTTP Sessions Management** | `NRD-Lab-Concepts/07-HTTP-Sessions/session_demo.js` | Separate Demonstration | `node session_demo.js` | ✅ Verified |
| **22** | **Node.js Core Modules** | `NRD-Lab-Concepts/08-NodeJS-Core-Modules/core_modules_demo.js` | Separate Demonstration | `node core_modules_demo.js` | ✅ Verified |
| **23** | **Oracle Database Integration** | `NRD-Lab-Concepts/09-Oracle-Connectivity/OracleDatabaseDemo.java` | Separate Demonstration | `node oracle_node_demo.js` | ✅ Verified |
| **24** | **External API Integration (Weather)** | `NRD-Lab-Concepts/10-External-API-Weather/weather_health_api.js` | Separate Demonstration | `node weather_health_api.js` | ✅ Verified (Live Open-Meteo API) |
