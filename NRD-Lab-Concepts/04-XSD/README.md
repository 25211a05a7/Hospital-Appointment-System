# Experiment 4: XML Schema Definition (XSD)

## 1. Overview
XML Schema Definition (XSD) is an XML-based alternative to DTD that supports rich data types (`xs:positiveInteger`, `xs:date`, `xs:string`), enumerations (`Pending`, `Confirmed`, `Cancelled`, `Completed`), and regular expression patterns for time slots.

## 2. Files
- `appointments.xsd`: Schema defining custom data types, enumerations, and appointment constraints.
- `appointments.xml`: XML document adhering to the schema.
- `validate_xsd.js`: Schema validation runner.

## 3. How to Run
```bash
node validate_xsd.js
```

## 4. Expected Output
```text
======================================================
 CareConnect Hospital - XSD Data Type Validation
======================================================

[1] Loaded XSD Schema: appointments.xsd
[2] Loaded XML Instance: appointments.xml

 ✅ Validated Appointment #1:
    - Patient: Rahul Sharma (ID: 1)
    - Doctor:  Dr. Rajesh Sharma (ID: 1)
    - Schedule: 2026-10-02 at 10:00 AM [Confirmed]
 ✅ Validated Appointment #2:
    - Patient: Snehal Deshmukh (ID: 2)
    - Doctor:  Dr. Pooja Patel (ID: 8)
    - Schedule: 2026-10-04 at 11:00 AM [Confirmed]

------------------------------------------------------
✅ ALL 2 XML records strictly passed XSD Schema Validation!
```
