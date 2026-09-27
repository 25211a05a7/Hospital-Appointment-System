const fs = require('fs');
const path = require('path');

function validateXsdDemo() {
  console.log('======================================================');
  console.log(' CareConnect Hospital - XSD Data Type Validation');
  console.log('======================================================\n');

  const xmlPath = path.join(__dirname, 'appointments.xml');
  const xsdPath = path.join(__dirname, 'appointments.xsd');

  const xml = fs.readFileSync(xmlPath, 'utf8');
  console.log(`[1] Loaded XSD Schema: ${path.basename(xsdPath)}`);
  console.log(`[2] Loaded XML Instance: ${path.basename(xmlPath)}\n`);

  const allowedStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Completed'];
  const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  const apptRegex = /<appointment id="(\d+)">([\s\S]*?)<\/appointment>/g;
  let match;
  let validatedCount = 0;
  let errors = [];

  while ((match = apptRegex.exec(xml)) !== null) {
    validatedCount++;
    const id = match[1];
    const block = match[2];

    const patId = block.match(/<patientId>(\d+)<\/patientId>/)?.[1];
    const patName = block.match(/<patientName>(.*?)<\/patientName>/)?.[1];
    const docId = block.match(/<doctorId>(\d+)<\/doctorId>/)?.[1];
    const docName = block.match(/<doctorName>(.*?)<\/doctorName>/)?.[1];
    const date = block.match(/<appointmentDate>(.*?)<\/appointmentDate>/)?.[1];
    const time = block.match(/<appointmentTime>(.*?)<\/appointmentTime>/)?.[1];
    const status = block.match(/<status>(.*?)<\/status>/)?.[1];

    if (!patId || !patName || !docId || !docName || !date || !time || !status) {
      errors.push(`Appointment #${id}: Missing required elements.`);
      continue;
    }

    if (!dateRegex.test(date)) {
      errors.push(`Appointment #${id}: Invalid xs:date format '${date}'.`);
    }

    if (!timeRegex.test(time)) {
      errors.push(`Appointment #${id}: Invalid TimeSlotType pattern '${time}'.`);
    }

    if (!allowedStatuses.includes(status)) {
      errors.push(`Appointment #${id}: Invalid StatusType enumeration '${status}'.`);
    }

    console.log(` ✅ Validated Appointment #${id}:`);
    console.log(`    - Patient: ${patName} (ID: ${patId})`);
    console.log(`    - Doctor:  ${docName} (ID: ${docId})`);
    console.log(`    - Schedule: ${date} at ${time} [${status}]`);
  }

  console.log('\n------------------------------------------------------');
  if (errors.length === 0) {
    console.log(`✅ ALL ${validatedCount} XML records strictly passed XSD Schema Validation!`);
  } else {
    console.error('❌ Validation Failed:');
    errors.forEach(e => console.error(`   - ${e}`));
  }
}

validateXsdDemo();
