const fs = require('fs');
const path = require('path');
const glob = require('glob');

async function scanFrontendFiles(directory) {
    console.log(`🔍 Scanning ${directory} for dead UI elements...`);
    const files = glob.sync(`${directory}/**/*.{tsx,jsx,js,ts}`, { ignore: '**/node_modules/**' });
    
    const results = {
        deadButtons: [],
        brokenLinks: [],
        missingAltTags: [] // Bonus accessibility check
    };

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
            // 1. Detect Buttons without onClick or type="submit"
            if (line.includes('<button') && !line.includes('onClick') && !line.includes('type="submit"') && !line.includes('type=\'submit\'')) {
                results.deadButtons.push({
                    file: path.relative(process.cwd(), file),
                    line: index + 1,
                    content: line.trim()
                });
            }

            // 2. Detect Links with empty or # href
            if (line.includes('<a ') && (line.includes('href="#"') || line.includes('href=""'))) {
                results.brokenLinks.push({
                    file: path.relative(process.cwd(), file),
                    line: index + 1,
                    content: line.trim()
                });
            }
            
            // 3. React Router Link with missing 'to'
            if (line.includes('<Link ') && !line.includes('to=')) {
                results.brokenLinks.push({
                    file: path.relative(process.cwd(), file),
                    line: index + 1,
                    content: line.trim(),
                    type: 'ReactRouterLink'
                });
            }
        });
    });

    const reportPath = path.join(__dirname, 'static-analysis-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`✅ Static Analysis Complete. Found ${results.deadButtons.length} dead buttons and ${results.brokenLinks.length} broken links.`);
    return results;
}

const frontendPath = process.argv[2] || path.join(__dirname, '../OrderShieldOMS-Frontend/src');
scanFrontendFiles(frontendPath);
