# CareConnect Hospital — Viva Questions & Comprehensive Answers

### 1. What is React and why is it used in this project?
**Answer**: React is an open-source component-based JavaScript frontend library developed by Meta. In CareConnect Hospital, React allows us to build a dynamic Single Page Application (SPA) where state changes (such as selecting a doctor or time slot) re-render only the affected UI components efficiently using the Virtual DOM without full-page reloads.

### 2. What is Node.js and Express.js?
**Answer**: Node.js is an asynchronous, event-driven JavaScript runtime built on Chrome's V8 engine that allows executing JavaScript on the server side. Express.js is a minimalist web framework for Node.js that provides routing, middleware support, and simplified HTTP request/response processing to construct RESTful APIs.

### 3. What is a REST API?
**Answer**: Representational State Transfer (REST) is an architectural style for networked systems. REST APIs use standard HTTP methods (`GET` for reading, `POST` for creating, `PUT`/`PATCH` for updating, and `DELETE` for removing) with stateless communication and JSON payloads.

### 4. What is the role of MySQL and how does it maintain data integrity?
**Answer**: MySQL is an open-source relational database management system (RDBMS). It enforces ACID (Atomicity, Consistency, Isolation, Durability) properties, foreign key constraints (e.g., cascading deletes for patient appointments), unique keys (preventing duplicate doctor time slots), and indexed queries.

### 5. What is JDBC and how does it work?
**Answer**: Java Database Connectivity (JDBC) is a Java API that provides standard interfaces to connect and execute queries on relational databases. Key interfaces include `DriverManager`, `Connection`, `PreparedStatement` (for parameterized execution), and `ResultSet` (for tabular data extraction).

### 6. What is a Java Servlet?
**Answer**: A Servlet is a Java class executed within a web container (like Apache Tomcat) that extends the capabilities of a server to process HTTP requests (`doGet`, `doPost`) and generate dynamic web content.

### 7. What is the difference between XML, DTD, and XSD?
**Answer**:
- **XML**: Extensible Markup Language used for structured data serialization and interoperability.
- **DTD (Document Type Definition)**: A legacy grammatical schema defining permitted elements and attributes in an XML document.
- **XSD (XML Schema Definition)**: An XML-based schema language supporting rich data types, regular expression constraints, and namespaces.

### 8. What is the difference between Cookies and HTTP Sessions?
**Answer**:
- **Cookies**: Small key-value pairs stored on the client browser and sent in HTTP headers with each request. Useful for remembering preferences and lightweight tokens.
- **HTTP Sessions**: Server-side storage for maintaining state across multiple requests. The server assigns a unique Session ID to the client via a cookie, while sensitive session data resides securely on the server.

### 9. What is JWT (JSON Web Token) and how does it authenticate users?
**Answer**: JWT is an open standard (RFC 7519) for transmitting secure claims as a compact JSON object. It contains three parts separated by dots: Header, Payload (claims like user id and role), and HMAC SHA-256 Signature. The server signs the token using a secret key, enabling stateless authentication without database session lookups.

### 10. What is CRUD and where is it used?
**Answer**: CRUD stands for Create, Read, Update, and Delete. In CareConnect Hospital:
- **Create**: Register patient, book appointment, add doctor.
- **Read**: View doctors catalog, patient dashboard, admin stats.
- **Update**: Update appointment status, edit doctor details, edit profile.
- **Delete**: Cancel appointment, deactivate doctor.

### 11. What is Express Middleware?
**Answer**: Middleware functions are functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. They perform tasks like token authentication (`auth.js`), role verification (`roles.js`), request logging (`morgan`), and error handling (`errorHandler.js`).

### 12. How does CareConnect Hospital prevent duplicate appointment bookings?
**Answer**: CareConnect Hospital implements dual-layer prevention:
1. **Database Constraint**: A UNIQUE composite constraint on `(doctor_id, appointment_date, appointment_time)` prevents simultaneous duplicate entries.
2. **Backend API Validation**: The appointment controller checks the database for non-cancelled bookings matching the doctor and slot before inserting, returning an explicit HTTP 409 Conflict if occupied.

### 13. How does React Router facilitate SPA routing?
**Answer**: React Router manages client-side URL history using HTML5 History API (`pushState`/`replaceState`), rendering matching component hierarchies dynamically without making round-trip server requests for new HTML pages.

### 14. How does Chart.js render analytics on the Admin Dashboard?
**Answer**: Chart.js uses the HTML5 `<canvas>` element to render fast, interactive, and responsive visualizations (such as doughnut charts for appointment status distribution and bar charts for monthly trends) populated directly from backend REST API metrics.
