# Experiment 2: XML Data Representation

## 1. Overview
This experiment demonstrates structured data representation and exchange in Healthcare Systems using Extensible Markup Language (XML). XML allows human-readable and machine-readable data serialization for patient electronic health records (EHR) and interoperability.

## 2. Files
- `patients.xml`: Complete structured XML document representing patients, contact details, and clinical history.
- `parse_xml.js`: Runnable Node.js demonstration script parsing XML tags and attributes.

## 3. How to Run
```bash
node parse_xml.js
```

## 4. Expected Output
```text
======================================================
 CareConnect Hospital - XML Parsing Demonstration
======================================================

Loaded XML file: patients.xml (1250 bytes)

Parsed Patient Records:
------------------------------------------------------
[1] ID: P101 | Name: Rahul Sharma | Gender: Male | Blood: O+ | Email: patient@careconnect.com
[2] ID: P102 | Name: Snehal Deshmukh | Gender: Female | Blood: B+ | Email: snehal.deshmukh@gmail.com
------------------------------------------------------

✅ Successfully parsed 2 patient records from XML.
```
