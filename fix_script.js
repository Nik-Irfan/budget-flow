const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
const fixedContent = content.replace(
  'processRecurring(); render(); renderCalendarGrid();',
  'resetMonthlyStatus(moKey(viewMo));\n      processRecurring(); render(); renderCalendarGrid();'
);
fs.writeFileSync('index.html', fixedContent, 'utf8');
console.log('Fixed successfully!');
