/**
 * XML Parser in Node.js for Experiment 2
 */
const fs = require('fs');
const path = require('path');

function parseXmlDemo() {
  const xmlPath = path.join(__dirname, 'patients.xml');
  const xmlContent = fs.readFileSync(xmlPath, 'utf8');

  console.log('======================================================');
  console.log(' CareConnect Hospital - XML Parsing Demonstration');
  console.log('======================================================\n');
  console.log(`Loaded XML file: ${xmlPath} (${xmlContent.length} bytes)\n`);

  // Basic regex parser to extract patients
  const patientRegex = /<patient id="([^"]+)">[\s\S]*?<fullName>(.*?)<\/fullName>[\s\S]*?<gender>(.*?)<\/gender>[\s\S]*?<bloodGroup>(.*?)<\/bloodGroup>[\s\S]*?<email>(.*?)<\/email>[\s\S]*?<\/patient>/g;

  console.log('Parsed Patient Records:');
  console.log('------------------------------------------------------');
  let match;
  let count = 0;
  while ((match = patientRegex.exec(xmlContent)) !== null) {
    count++;
    console.log(`[${count}] ID: ${match[1]} | Name: ${match[2]} | Gender: ${match[3]} | Blood: ${match[4]} | Email: ${match[5]}`);
  }
  console.log('------------------------------------------------------');
  console.log(`\n✅ Successfully parsed ${count} patient records from XML.`);
}

parseXmlDemo();
