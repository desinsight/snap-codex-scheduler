const fs = require('fs');
const path = require('path');

const coveragePath = path.join(__dirname, '../coverage/lcov-report/lcov.info');
const coverageData = fs.readFileSync(coveragePath, 'utf8');

const lines = coverageData.split('\n');
const fileCoverage = {};

let currentFile = '';
let uncoveredLines = [];

lines.forEach(line => {
  if (line.startsWith('SF:')) {
    currentFile = line.replace('SF:', '').trim();
    fileCoverage[currentFile] = {
      uncoveredLines: [],
      totalLines: 0,
      coveredLines: 0
    };
  } else if (line.startsWith('DA:')) {
    const [_, lineNumber, hits] = line.split(':')[1].split(',');
    fileCoverage[currentFile].totalLines++;
    if (hits === '0') {
      fileCoverage[currentFile].uncoveredLines.push(parseInt(lineNumber));
    } else {
      fileCoverage[currentFile].coveredLines++;
    }
  }
});

// Generate coverage report
const report = Object.entries(fileCoverage)
  .map(([file, data]) => {
    const coverage = (data.coveredLines / data.totalLines * 100).toFixed(2);
    return {
      file,
      coverage: `${coverage}%`,
      uncoveredLines: data.uncoveredLines,
      totalLines: data.totalLines,
      coveredLines: data.coveredLines
    };
  })
  .sort((a, b) => parseFloat(b.coverage) - parseFloat(a.coverage));

// Write report to file
const reportPath = path.join(__dirname, '../coverage/coverage-analysis.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

// Print summary
console.log('\nTest Coverage Analysis:');
console.log('======================\n');

report.forEach(item => {
  console.log(`${item.file}:`);
  console.log(`  Coverage: ${item.coverage}`);
  console.log(`  Uncovered Lines: ${item.uncoveredLines.length}`);
  if (item.uncoveredLines.length > 0) {
    console.log(`  Lines to Test: ${item.uncoveredLines.join(', ')}`);
  }
  console.log('');
});

// Identify files with low coverage
const lowCoverageFiles = report.filter(item => 
  parseFloat(item.coverage) < 80 && 
  !item.file.includes('test') && 
  !item.file.includes('mock')
);

if (lowCoverageFiles.length > 0) {
  console.log('\nFiles with Low Coverage (< 80%):');
  console.log('================================\n');
  lowCoverageFiles.forEach(file => {
    console.log(`${file.file}: ${file.coverage}`);
  });
} 