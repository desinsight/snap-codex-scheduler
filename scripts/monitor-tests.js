const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TEST_RESULTS_DIR = path.join(__dirname, '../test-results');
const COVERAGE_DIR = path.join(__dirname, '../coverage');
const REPORT_FILE = path.join(__dirname, '../test-report.json');

// Ensure directories exist
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR);
}

// Run tests and collect metrics
function runTests() {
  const startTime = Date.now();
  
  try {
    execSync('npm run test:coverage', { stdio: 'inherit' });
  } catch (error) {
    console.error('Tests failed:', error);
    return;
  }
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  // Read coverage report
  const coverageReport = JSON.parse(
    fs.readFileSync(path.join(COVERAGE_DIR, 'coverage-final.json'), 'utf8')
  );
  
  // Calculate metrics
  const metrics = {
    timestamp: new Date().toISOString(),
    duration,
    coverage: {
      statements: coverageReport.total.statements.pct,
      branches: coverageReport.total.branches.pct,
      functions: coverageReport.total.functions.pct,
      lines: coverageReport.total.lines.pct,
    },
    testCount: {
      total: coverageReport.total.testCount,
      passed: coverageReport.total.passed,
      failed: coverageReport.total.failed,
    },
  };
  
  // Save metrics
  const metricsFile = path.join(TEST_RESULTS_DIR, 'metrics.json');
  let metricsHistory = [];
  
  if (fs.existsSync(metricsFile)) {
    metricsHistory = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
  }
  
  metricsHistory.push(metrics);
  fs.writeFileSync(metricsFile, JSON.stringify(metricsHistory, null, 2));
  
  // Generate trend report
  generateTrendReport(metricsHistory);
}

function generateTrendReport(metricsHistory) {
  const report = {
    coverageTrend: {
      statements: metricsHistory.map(m => m.coverage.statements),
      branches: metricsHistory.map(m => m.coverage.branches),
      functions: metricsHistory.map(m => m.coverage.functions),
      lines: metricsHistory.map(m => m.coverage.lines),
    },
    performanceTrend: metricsHistory.map(m => m.duration),
    testCountTrend: {
      total: metricsHistory.map(m => m.testCount.total),
      passed: metricsHistory.map(m => m.testCount.passed),
      failed: metricsHistory.map(m => m.testCount.failed),
    },
  };
  
  fs.writeFileSync(
    path.join(TEST_RESULTS_DIR, 'trend-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Print summary
  console.log('\nTest Monitoring Summary:');
  console.log('=======================\n');
  
  const latest = metricsHistory[metricsHistory.length - 1];
  console.log('Latest Metrics:');
  console.log(`Duration: ${latest.duration}ms`);
  console.log('Coverage:');
  console.log(`  Statements: ${latest.coverage.statements}%`);
  console.log(`  Branches: ${latest.coverage.branches}%`);
  console.log(`  Functions: ${latest.coverage.functions}%`);
  console.log(`  Lines: ${latest.coverage.lines}%`);
  console.log('\nTest Count:');
  console.log(`  Total: ${latest.testCount.total}`);
  console.log(`  Passed: ${latest.testCount.passed}`);
  console.log(`  Failed: ${latest.testCount.failed}`);
  
  if (metricsHistory.length > 1) {
    const previous = metricsHistory[metricsHistory.length - 2];
    console.log('\nTrend Analysis:');
    console.log(`Duration Change: ${latest.duration - previous.duration}ms`);
    console.log('Coverage Change:');
    console.log(`  Statements: ${latest.coverage.statements - previous.coverage.statements}%`);
    console.log(`  Branches: ${latest.coverage.branches - previous.coverage.branches}%`);
    console.log(`  Functions: ${latest.coverage.functions - previous.coverage.functions}%`);
    console.log(`  Lines: ${latest.coverage.lines - previous.coverage.lines}%`);
  }
}

function collectMetrics() {
  try {
    // Run tests and collect coverage
    execSync('npm run test:coverage', { stdio: 'inherit' });

    // Read coverage data
    const coverageData = JSON.parse(
      fs.readFileSync(path.join(COVERAGE_DIR, 'coverage-summary.json'), 'utf8')
    );

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      coverage: coverageData.total,
      files: Object.entries(coverageData).reduce((acc, [file, data]) => {
        if (file !== 'total') {
          acc[file] = {
            statements: data.statements.pct,
            branches: data.branches.pct,
            functions: data.functions.pct,
            lines: data.lines.pct,
          };
        }
        return acc;
      }, {}),
    };

    // Save report
    fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

    // Print summary
    console.log('\nTest Coverage Summary:');
    console.log('---------------------');
    console.log(`Statements: ${report.coverage.statements.pct}%`);
    console.log(`Branches: ${report.coverage.branches.pct}%`);
    console.log(`Functions: ${report.coverage.functions.pct}%`);
    console.log(`Lines: ${report.coverage.lines.pct}%`);

    // Identify files with low coverage
    const lowCoverageFiles = Object.entries(report.files)
      .filter(([_, data]) => 
        data.statements < 80 || 
        data.branches < 80 || 
        data.functions < 80 || 
        data.lines < 80
      )
      .map(([file, data]) => ({
        file,
        ...data,
      }));

    if (lowCoverageFiles.length > 0) {
      console.log('\nFiles with Low Coverage:');
      console.log('----------------------');
      lowCoverageFiles.forEach(({ file, statements, branches, functions, lines }) => {
        console.log(`\n${file}:`);
        console.log(`  Statements: ${statements}%`);
        console.log(`  Branches: ${branches}%`);
        console.log(`  Functions: ${functions}%`);
        console.log(`  Lines: ${lines}%`);
      });
    }

  } catch (error) {
    console.error('Error collecting test metrics:', error);
    process.exit(1);
  }
}

// Run the monitoring
runTests();
collectMetrics(); 