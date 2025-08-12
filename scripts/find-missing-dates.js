const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', 'docs', 'charts.json');

function fmt(date) {
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
});
}
function addDays(d, days) {
  const nd = new Date(d.getTime());
  nd.setUTCDate(nd.getUTCDate() + days);
  return nd;
}

try {
  const raw = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(raw);

  const dates = data
    .filter(o => o && typeof o.date === 'string' && o.date.trim())
    .map(o => o.date.trim());

  if (dates.length === 0) {
    console.error('No dates found.');
    process.exit(1);
  }

  // Normalize and sort unique existing dates
  const existing = Array.from(new Set(dates))
    .map(s => {
      const d = new Date(s);
      if (isNaN(d)) throw new Error(`Invalid date in JSON: ${s}`);
      return d;
    })
    .sort((a, b) => a - b);

  const missingSet = new Set();

  for (let i = 0; i < existing.length - 1; i++) {
    const cur = existing[i];
    const next = existing[i + 1];

    // Step by 7 days from the current date until we reach the next existing date
    let probe = addDays(cur, 7);
    while (probe < next) {
      missingSet.add(fmt(probe));
      probe = addDays(probe, 7);
    }
  }

  const missing = Array.from(missingSet); //.sort();
  console.log(`Found ${existing.length} existing dates.`);
  console.log(`Missing weekly dates between first (${fmt(existing[0])}) and last (${fmt(existing[existing.length - 1])}): ${missing.length}`);
  console.log(missing.join('\n'));
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}