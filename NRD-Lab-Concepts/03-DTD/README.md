# Experiment 3: Document Type Definition (DTD)

## 1. Overview
Document Type Definition (DTD) defines the legal building blocks of an XML document. It defines the document structure with a list of legal elements and attributes to ensure consistency and correctness across health exchange records.

## 2. Files
- `hospital_records.dtd`: Formal schema defining elements (`hospital`, `doctor`, `name`, `specialization`, etc.) and attributes (`id`, `active`).
- `hospital_records.xml`: Valid XML document declaring and conforming to `hospital_records.dtd`.
- `validate_dtd.js`: Script validating the structure of the XML against the DTD rules.

## 3. How to Run
```bash
node validate_dtd.js
```

## 4. Expected Output
```text
======================================================
 CareConnect Hospital - DTD Structural Validation
======================================================

[1] Loaded DTD rules from hospital_records.dtd
[2] Loaded XML document from hospital_records.xml

✅ Validation Status: PASSED (XML is fully valid according to DTD specification).
   Validated 2 <doctor> element(s) with required attributes and tags.
```
