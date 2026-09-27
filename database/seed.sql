-- =====================================================================
-- CareConnect Hospital Appointment System - Seed Data
-- =====================================================================

USE hospital_appointment;

-- ---------------------------------------------------------------------
-- 1. Insert Departments
-- ---------------------------------------------------------------------
INSERT INTO departments (id, name, description, icon) VALUES
(1, 'General Medicine', 'Comprehensive primary healthcare, diagnostics, and chronic disease management for all ages.', 'bi-capsule'),
(2, 'Cardiology', 'Advanced cardiac diagnostics, heart health screening, ECG, Echo, and cardiovascular treatments.', 'bi-heart-pulse-fill'),
(3, 'Dermatology', 'Expert skin, hair, and nail care, clinical dermatology, and aesthetic medical procedures.', 'bi-sun-fill'),
(4, 'Pediatrics', 'Dedicated medical care, neonatal care, child development, and vaccinations for infants and children.', 'bi-emoji-smile-fill'),
(5, 'Orthopedics', 'Bone, joint, spinal health, sports injuries, fracture management, and joint replacements.', 'bi-person-walking'),
(6, 'Neurology', 'Diagnosis and advanced therapeutic management for neurological, brain, and spinal disorders.', 'bi-activity'),
(7, 'ENT (Ear, Nose & Throat)', 'Surgical and clinical management for ear, nasal cavity, sinus, throat, and hearing conditions.', 'bi-headset'),
(8, 'Gynecology & Obstetrics', 'Comprehensive women\'s health, prenatal & postnatal care, maternal wellness, and reproductive health.', 'bi-gender-female');

-- ---------------------------------------------------------------------
-- 2. Insert Users (Admin, Doctor, Patient)
-- Passwords:
-- admin@careconnect.com   -> Admin@123
-- doctor@careconnect.com  -> Doctor@123
-- patient@careconnect.com -> Patient@123
-- ---------------------------------------------------------------------
INSERT INTO users (id, name, email, password, role, phone) VALUES
(1, 'System Administrator', 'admin@careconnect.com', '$2a$10$bmNAJHSJYYnd0yrG8SVmGOfPftXsSMGjadZR5ijs9ThH3q3T6/OwG', 'admin', '9876543210'),
(2, 'Dr. Rajesh Sharma', 'doctor@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012345'),
(3, 'Dr. Priya Venkatesh', 'priya.venkatesh@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012346'),
(4, 'Dr. Ananya Iyer', 'ananya.iyer@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012347'),
(5, 'Dr. Amit Verma', 'amit.verma@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012348'),
(6, 'Dr. Suresh Nair', 'suresh.nair@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012349'),
(7, 'Dr. Sneha Kulkarni', 'sneha.kulkarni@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012350'),
(8, 'Dr. Vikram Malhotra', 'vikram.malhotra@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012351'),
(9, 'Dr. Pooja Patel', 'pooja.patel@careconnect.com', '$2a$10$yiVJfSjBSXatrbXdrAsFkefjCj/k4wP/qZvkPWjpxbqhOf32PWn4K', 'doctor', '9845012352'),
(10, 'Rahul Sharma', 'patient@careconnect.com', '$2a$10$5DMW89rUrqVxQ4uS6fEpz.yH/UaGpMjsN9LcwDoeV1xYMAvavVfU.', 'patient', '9123456780'),
(11, 'Snehal Deshmukh', 'snehal.deshmukh@gmail.com', '$2a$10$5DMW89rUrqVxQ4uS6fEpz.yH/UaGpMjsN9LcwDoeV1xYMAvavVfU.', 'patient', '9123456781');

-- ---------------------------------------------------------------------
-- 3. Insert Patients
-- ---------------------------------------------------------------------
INSERT INTO patients (id, user_id, date_of_birth, gender, address, blood_group, emergency_contact) VALUES
(1, 10, '1998-05-15', 'Male', '42, Green Glen Layout, Bellandur, Bangalore, Karnataka - 560103', 'O+', '9123456789'),
(2, 11, '2001-08-22', 'Female', '15B, Sunrise Avenue, Indiranagar, Bangalore, Karnataka - 560038', 'B+', '9123456788');

-- ---------------------------------------------------------------------
-- 4. Insert 8 Doctors
-- ---------------------------------------------------------------------
INSERT INTO doctors (id, user_id, department_id, name, email, specialization, qualification, experience, consultation_fee, available_days, available_timings, profile_image, description, is_active) VALUES
(1, 2, 1, 'Dr. Rajesh Sharma', 'doctor@careconnect.com', 'General Medicine', 'MBBS, MD (Internal Medicine), FACP', 14, 600.00, 'Monday - Saturday', '09:00 AM - 01:00 PM', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500&auto=format&fit=crop&q=80', 'Senior consultant physician specializing in lifestyle disorders, infectious diseases, preventive health checkups, and diabetes management.', TRUE),

(2, 3, 2, 'Dr. Priya Venkatesh', 'priya.venkatesh@careconnect.com', 'Cardiology', 'MBBS, MD, DM (Cardiology), FESC', 12, 1000.00, 'Monday - Friday', '10:00 AM - 03:00 PM', 'https://images.unsplash.com/photo-1594824813620-bf02a466d3a8?w=500&auto=format&fit=crop&q=80', 'Distinguished interventional cardiologist specializing in cardiovascular diseases, coronary angiogram, heart failure prevention, and echocardiography.', TRUE),

(3, 4, 3, 'Dr. Ananya Iyer', 'ananya.iyer@careconnect.com', 'Dermatology', 'MBBS, MD (Dermatology, Venereology & Leprosy)', 9, 750.00, 'Tuesday - Saturday', '11:00 AM - 04:00 PM', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500&auto=format&fit=crop&q=80', 'Board-certified dermatologist focusing on acne therapies, clinical dermatopathology, pediatric dermatology, and advanced skin rejuvenation therapies.', TRUE),

(4, 5, 4, 'Dr. Amit Verma', 'amit.verma@careconnect.com', 'Pediatrics', 'MBBS, DCH, MD (Pediatrics), FIAP', 11, 650.00, 'Monday - Saturday', '09:30 AM - 02:30 PM', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=500&auto=format&fit=crop&q=80', 'Dedicated pediatrician with comprehensive expertise in newborn care, child growth monitoring, childhood allergies, and adolescent health.', TRUE),

(5, 6, 5, 'Dr. Suresh Nair', 'suresh.nair@careconnect.com', 'Orthopedics', 'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)', 16, 900.00, 'Monday, Wednesday, Friday', '02:00 PM - 07:00 PM', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=500&auto=format&fit=crop&q=80', 'Renowned orthopedic surgeon specializing in arthroscopy, sports trauma, minimally invasive knee & hip arthroplasty, and spine care.', TRUE),

(6, 7, 6, 'Dr. Sneha Kulkarni', 'sneha.kulkarni@careconnect.com', 'Neurology', 'MBBS, MD, DM (Neurology), FAAN', 10, 1100.00, 'Tuesday, Thursday, Saturday', '10:00 AM - 04:00 PM', 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=500&auto=format&fit=crop&q=80', 'Leading consultant neurologist treating epilepsy, stroke recovery, migraines, neurodegenerative disorders, and neuromuscular conditions.', TRUE),

(7, 8, 7, 'Dr. Vikram Malhotra', 'vikram.malhotra@careconnect.com', 'ENT (Ear, Nose & Throat)', 'MBBS, MS (ENT), DLO', 8, 700.00, 'Monday - Saturday', '09:00 AM - 01:00 PM', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=500&auto=format&fit=crop&q=80', 'Expert ENT surgeon with proficiency in endoscopic sinus surgery, tympanoplasty, vertigo clinics, voice disorders, and pediatric otolaryngology.', TRUE),

(8, 9, 8, 'Dr. Pooja Patel', 'pooja.patel@careconnect.com', 'Gynecology & Obstetrics', 'MBBS, MS (Obstetrics & Gynecology), FMAS', 13, 850.00, 'Monday - Friday', '10:30 AM - 03:30 PM', 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=500&auto=format&fit=crop&q=80', 'Consultant obstetrician & gynecologist providing compassionate high-risk pregnancy management, PCOS care, and laparoscopic gynecological procedures.', TRUE);

-- ---------------------------------------------------------------------
-- 5. Insert Sample Appointments
-- ---------------------------------------------------------------------
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES
(1, 1, 1, '2026-10-02', '10:00 AM', 'Routine annual health checkup and blood pressure monitoring.', 'Confirmed'),
(2, 1, 2, '2026-10-05', '11:30 AM', 'Consultation for mild chest discomfort and preventative ECG test.', 'Pending'),
(3, 1, 3, '2026-09-15', '02:00 PM', 'Skin allergy consultation and prescribed ointment evaluation.', 'Completed'),
(4, 2, 8, '2026-10-04', '11:00 AM', 'Routine prenatal maternal consultation and ultrasound review.', 'Confirmed'),
(5, 2, 5, '2026-09-20', '03:30 PM', 'Right ankle sprain treatment and post-physiotherapy check.', 'Completed'),
(6, 1, 6, '2026-09-10', '10:30 AM', 'Chronic migraine headache consultation.', 'Cancelled');
