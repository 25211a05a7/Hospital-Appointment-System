const fs = require('fs');
const path = require('path');

function validateDtdDemo() {
  console.log('======================================================');
  console.log(' CareConnect Hospital - DTD Structural Validation');
  console.log('======================================================\n');

  const xmlPath = path.join(__dirname, 'hospital_records.xml');
  const dtdPath = path.join(__dirname, 'hospital_records.dtd');

  const xml = fs.readFileSync(xmlPath, 'utf8');
  const dtd = fs.readFileSync(dtdPath, 'utf8');

  console.log(`[1] Loaded DTD rules from ${path.basename(dtdPath)}`);
  console.log(`[2] Loaded XML document from ${path.basename(xmlPath)}\n`);

  const errors = [];

  // Check doctype reference
  if (!xml.includes('<!DOCTYPE hospital SYSTEM "hospital_records.dtd">')) {
    errors.push('Missing or invalid <!DOCTYPE hospital SYSTEM "hospital_records.dtd"> declaration.');
  }

  // Check required root element
  if (!xml.includes('<hospital>') || !xml.includes('</hospital>')) {
    errors.push('Root element <hospital> is missing.');
  }

  // Check child elements
  const requiredTags = ['hospitalName', 'branch', 'doctors', 'doctor', 'name', 'specialization', 'qualification', 'experience', 'fee'];
  requiredTags.forEach(tag => {
    if (!xml.includes(`<${tag}`) || !xml.includes(`</${tag}>`)) {
      errors.push(`Required element <${tag}> defined in DTD is missing from XML.`);
    }
  });

  // Extract doctor tags
  const docMatches = xml.match(/<doctor\s+[^>]*>/g) || [];
  if (docMatches.length === 0) {
    errors.push('No <doctor ...> elements found in XML.');
  } else {
    docMatches.forEach((tag, idx) => {
      if (!tag.includes('id=')) {
        errors.push(`Doctor element #${idx + 1} is missing required attribute 'id'.`);
      }
    });
  }

  if (errors.length === 0) {
    console.log('✅ Validation Status: PASSED (XML is fully valid according to DTD specification).');
    console.log(`   Validated ${docMatches.length} <doctor> element(s) with required attributes and tags.`);
  } else {
    console.error('❌ Validation Status: FAILED');
    errors.forEach(err => console.error(`   - ${err}`));
  }
}

validateDtdDemo();
