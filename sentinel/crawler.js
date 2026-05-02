const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runSentinel(url) {
    console.log(`🚀 Starting Sentinel Integrity Scan on ${url}`);
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const results = {
        deadButtons: [],
        brokenLinks: [],
        consoleErrors: [],
        networkFailures: []
    };

    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            results.consoleErrors.push({
                text: msg.text(),
                location: msg.location()
            });
        }
    });

    // Capture failed network requests
    page.on('requestfailed', request => {
        results.networkFailures.push({
            url: request.url(),
            error: request.failure().errorText
        });
    });

    try {
        await page.goto(url, { waitUntil: 'networkidle' });

        // 1. Scan for Dead Links (Static Check in DOM)
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({
                text: a.innerText,
                href: a.getAttribute('href'),
                outerHTML: a.outerHTML
            }));
        });

        for (const link of links) {
            if (!link.href || link.href === '#' || link.href.includes('undefined')) {
                results.brokenLinks.push({ ...link, reason: 'Invalid or missing href' });
            }
        }

        // 2. Scan for Dead Buttons (Interactions)
        const buttons = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('button')).map((b, index) => ({
                text: b.innerText,
                index: index,
                outerHTML: b.outerHTML
            }));
        });

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            const selector = `button >> nth=${i}`;
            
            // Check if button is actually interactive
            const isDead = await page.evaluate((idx) => {
                const btn = document.querySelectorAll('button')[idx];
                const hasOnClick = btn.onclick !== null || !!btn.getAttribute('onclick');
                // Note: Simple DOM check doesn't catch React listeners, so we rely on interaction outcome
                return false; 
            }, i);

            // Simulation
            try {
                const prevUrl = page.url();
                await page.click(selector, { timeout: 1000 });
                await page.waitForTimeout(500); // Wait for state change

                // If URL didn't change and no console error/network error occurred, might be suspicious
                // But many buttons are for internal state. We focus on hard errors.
            } catch (err) {
                // If it timed out or failed to click
                results.deadButtons.push({ ...button, error: err.message });
            }
        }

    } catch (error) {
        console.error('Scan failed:', error);
    } finally {
        await browser.close();
    }

    // Save report
    const reportPath = path.join(__dirname, 'integrity-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`✅ Scan Complete. Report saved to ${reportPath}`);
    return results;
}

// CLI usage
const targetUrl = process.argv[2] || 'http://localhost:5173';
runSentinel(targetUrl);
