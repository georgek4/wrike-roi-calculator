// ============================================================
// Wrike Value Engineering — ROI & Pricing Calculator
// Main Application Logic
// ============================================================

// ---- Vertical Configuration & Benchmarks ----
const VERTICALS = {
    plm: {
        name: 'Product Lifecycle Management',
        icon: 'fa-cogs',
        color: '#6366F1',
        painPoints: [
            { id: 'cross-func', label: 'Cross-functional coordination & handoffs', defaultHours: 6, description: 'Time spent aligning engineering, design, QA, and supply chain teams' },
            { id: 'status-reporting', label: 'Status reporting & milestone tracking', defaultHours: 4, description: 'Manual status updates, spreadsheet tracking, executive reporting' },
            { id: 'change-mgmt', label: 'Change request management', defaultHours: 3, description: 'Processing ECOs, tracking change impacts across workstreams' },
            { id: 'doc-search', label: 'Document search & version control', defaultHours: 3, description: 'Finding latest specs, managing document versions, audit trails' },
            { id: 'approval-wait', label: 'Waiting for approvals & sign-offs', defaultHours: 5, description: 'Gate reviews, design approvals, compliance sign-offs' },
            { id: 'meetings', label: 'Unnecessary meetings & syncs', defaultHours: 4, description: 'Status meetings that could be replaced with async updates' }
        ],
        valueDrivers: [
            { id: 'ttm', label: 'Faster Time-to-Market', defaultPct: 30, description: 'Accelerate product launch through streamlined workflows', unit: '%' },
            { id: 'rework', label: 'Reduction in Engineering Rework', defaultPct: 35, description: 'Fewer design iterations through better visibility & proofing', unit: '%' },
            { id: 'resource', label: 'Improved Resource Utilization', defaultPct: 20, description: 'Better allocation of engineering and design resources', unit: '%' },
            { id: 'compliance', label: 'Faster Compliance & Audit Readiness', defaultPct: 40, description: 'Automated audit trails and compliance documentation', unit: '%' }
        ]
    },
    csd: {
        name: 'Client Service Delivery',
        icon: 'fa-headset',
        color: '#EC4899',
        painPoints: [
            { id: 'client-comm', label: 'Client communication & updates', defaultHours: 5, description: 'Sending status updates, responding to client inquiries' },
            { id: 'resource-plan', label: 'Resource planning & scheduling', defaultHours: 4, description: 'Assigning team members, managing capacity, scheduling work' },
            { id: 'scope-tracking', label: 'Scope tracking & change orders', defaultHours: 3, description: 'Managing scope creep, processing change orders' },
            { id: 'time-tracking', label: 'Time tracking & billing prep', defaultHours: 3, description: 'Logging hours, preparing invoices, reconciling time' },
            { id: 'internal-handoffs', label: 'Internal handoffs & escalations', defaultHours: 4, description: 'Transferring work between teams, escalation management' },
            { id: 'reporting', label: 'Client reporting & dashboards', defaultHours: 3, description: 'Building reports, updating dashboards, preparing QBRs' }
        ],
        valueDrivers: [
            { id: 'delivery-speed', label: 'Faster Service Delivery', defaultPct: 35, description: 'Reduce average project delivery timelines', unit: '%' },
            { id: 'utilization', label: 'Improved Team Utilization', defaultPct: 20, description: 'Increase billable utilization through better resource management', unit: '%' },
            { id: 'client-sat', label: 'Client Satisfaction Improvement', defaultPct: 25, description: 'Higher NPS/CSAT through better visibility and communication', unit: '%' },
            { id: 'scope-control', label: 'Better Scope & Budget Control', defaultPct: 30, description: 'Reduce scope creep and budget overruns', unit: '%' }
        ]
    },
    marketing: {
        name: 'Marketing — Creative & Campaigns',
        icon: 'fa-bullhorn',
        color: '#F59E0B',
        painPoints: [
            { id: 'creative-review', label: 'Creative review & approval cycles', defaultHours: 6, description: 'Routing assets for feedback, consolidating comments, revision rounds' },
            { id: 'campaign-plan', label: 'Campaign planning & coordination', defaultHours: 5, description: 'Aligning teams on campaign timelines, channel coordination' },
            { id: 'asset-mgmt', label: 'Asset management & version control', defaultHours: 3, description: 'Finding approved assets, managing versions, DAM coordination' },
            { id: 'brief-intake', label: 'Brief intake & request management', defaultHours: 4, description: 'Processing creative requests, clarifying requirements' },
            { id: 'stakeholder-align', label: 'Stakeholder alignment & feedback', defaultHours: 4, description: 'Getting buy-in from multiple stakeholders, consolidating feedback' },
            { id: 'perf-reporting', label: 'Performance reporting & analytics', defaultHours: 3, description: 'Pulling campaign metrics, building performance reports' }
        ],
        valueDrivers: [
            { id: 'campaign-velocity', label: 'Faster Campaign Launch', defaultPct: 40, description: 'Reduce time from brief to launch', unit: '%' },
            { id: 'review-cycles', label: 'Fewer Revision Cycles', defaultPct: 45, description: 'Reduce creative revision rounds through better proofing', unit: '%' },
            { id: 'brand-consistency', label: 'Improved Brand Consistency', defaultPct: 30, description: 'Standardized templates and approval workflows', unit: '%' },
            { id: 'throughput', label: 'Increased Creative Throughput', defaultPct: 25, description: 'Produce more assets with the same team', unit: '%' }
        ]
    },
    pmo: {
        name: 'Project Management Office',
        icon: 'fa-project-diagram',
        color: '#10B981',
        painPoints: [
            { id: 'portfolio-visibility', label: 'Portfolio visibility & reporting', defaultHours: 5, description: 'Aggregating project statuses, building executive dashboards' },
            { id: 'resource-mgmt', label: 'Resource management & allocation', defaultHours: 4, description: 'Balancing workloads, identifying bottlenecks, capacity planning' },
            { id: 'methodology', label: 'Methodology & process enforcement', defaultHours: 3, description: 'Ensuring teams follow standards, templates, and governance' },
            { id: 'risk-mgmt', label: 'Risk & issue management', defaultHours: 3, description: 'Tracking risks, managing issues, escalation workflows' },
            { id: 'stakeholder-comm', label: 'Stakeholder communication', defaultHours: 4, description: 'Executive updates, steering committee prep, status meetings' },
            { id: 'tool-admin', label: 'Tool administration & data hygiene', defaultHours: 3, description: 'Maintaining PM tools, cleaning data, managing access' }
        ],
        valueDrivers: [
            { id: 'project-success', label: 'Improved Project Success Rate', defaultPct: 25, description: 'More projects delivered on time and on budget', unit: '%' },
            { id: 'capacity', label: 'Increased Delivery Capacity', defaultPct: 20, description: 'Take on more projects without adding headcount', unit: '%' },
            { id: 'visibility', label: 'Real-Time Portfolio Visibility', defaultPct: 60, description: 'Eliminate manual status collection and reporting', unit: '%' },
            { id: 'standardization', label: 'Process Standardization', defaultPct: 40, description: 'Consistent methodologies across all project types', unit: '%' }
        ]
    }
};

// ---- Pricing Configuration ----
const PLANS = {
    team: { name: 'Team', pricePerUser: 10, minUsers: 2, maxUsers: 25 },
    business: { name: 'Business', pricePerUser: 25, minUsers: 5, maxUsers: 200 },
    enterprise: { name: 'Enterprise', pricePerUser: 35, minUsers: 5, maxUsers: 9999 },
    pinnacle: { name: 'Pinnacle', pricePerUser: 45, minUsers: 5, maxUsers: 9999 }
};

const ADDONS = {
    'addon-wrike-lock': { name: 'Wrike Lock', pricePerUser: 5 },
    'addon-integrate': { name: 'Wrike Integrate', pricePerUser: 4 },
    'addon-publish': { name: 'Wrike Publish', pricePerUser: 8 },
    'addon-twoway-sync': { name: 'Two-Way Sync', pricePerUser: 6 }
};

// ---- State ----
let currentPage = 'dashboard';
let currentStep = 1;
let selectedPlan = 'business';
let roiResults = null;
let savedAssessments = JSON.parse(localStorage.getItem('wrike_assessments') || '[]');

// ---- Navigation ----
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');
    document.querySelector(`.nav-tab[data-page="${page}"]`).classList.add('active');
    currentPage = page;

    if (page === 'pricing') updateQuote();
    if (page === 'saved') renderSavedAssessments();

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ---- Scenario Starters ----
function startScenario(type) {
    navigateTo('roi-calculator');
    document.getElementById('roi-scenario').value = type;
    handleScenarioChange();
    goToStep(1);
}

function startVertical(vertical) {
    navigateTo('roi-calculator');
    document.getElementById('roi-vertical').value = vertical;
    updateVerticalDefaults();
    goToStep(1);
}

// ---- Wizard Navigation ----
function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('roi-step-' + step).classList.add('active');

    document.querySelectorAll('.wizard-step').forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'completed');
        if (sNum === step) s.classList.add('active');
        if (sNum < step) s.classList.add('completed');
    });

    if (step === 2) populatePainPoints();
    if (step === 3) populateValueDrivers();
    if (step === 4) calculateROI();

    window.scrollTo({ top: 200, behavior: 'smooth' });
}

// ---- Scenario Handling ----
function handleScenarioChange() {
    const scenario = document.getElementById('roi-scenario').value;
    document.getElementById('expansion-fields').style.display = scenario === 'expansion' ? 'block' : 'none';
    document.getElementById('existing-fields').style.display = scenario === 'existing' ? 'block' : 'none';
}

// ---- Vertical Defaults ----
function updateVerticalDefaults() {
    const vertical = document.getElementById('roi-vertical').value;
    const v = VERTICALS[vertical];
    // Update defaults when changing vertical on step 2/3
    if (currentStep >= 2) populatePainPoints();
    if (currentStep >= 3) populateValueDrivers();
}

// ---- Pain Points Grid ----
function populatePainPoints() {
    const vertical = document.getElementById('roi-vertical').value;
    const v = VERTICALS[vertical];
    const container = document.getElementById('pain-points-container');

    container.innerHTML = v.painPoints.map(pp => `
        <div class="pain-point-card">
            <div class="pp-header">
                <h4>${pp.label}</h4>
                <div class="pp-hours">
                    <input type="number" id="pp-${pp.id}" value="${pp.defaultHours}" min="0" max="40" step="0.5">
                    <span>hrs/week</span>
                </div>
            </div>
            <p class="pp-desc">${pp.description}</p>
        </div>
    `).join('');
}

// ---- Value Drivers Grid ----
function populateValueDrivers() {
    const vertical = document.getElementById('roi-vertical').value;
    const v = VERTICALS[vertical];
    const container = document.getElementById('value-drivers-container');

    container.innerHTML = v.valueDrivers.map(vd => `
        <div class="value-driver-card" style="border-left: 4px solid ${v.color}">
            <div class="vd-header">
                <h4>${vd.label}</h4>
            </div>
            <p class="vd-desc">${vd.description}</p>
            <div class="slider-group">
                <input type="range" id="vd-${vd.id}" min="0" max="80" value="${vd.defaultPct}" oninput="syncSlider(this)">
                <span class="slider-value">${vd.defaultPct}%</span>
            </div>
        </div>
    `).join('');
}

function syncSlider(el) {
    el.nextElementSibling.textContent = el.value + '%';
}

// ---- ROI Calculation Engine ----
function calculateROI() {
    const vertical = document.getElementById('roi-vertical').value;
    const v = VERTICALS[vertical];
    const scenario = document.getElementById('roi-scenario').value;

    const users = parseInt(document.getElementById('roi-users').value) || 100;
    const salary = parseFloat(document.getElementById('roi-salary').value) || 95000;
    const annualHours = parseInt(document.getElementById('roi-hours').value) || 2080;
    const hourlyRate = salary / annualHours;
    const weeksPerYear = 52;

    // 1. Calculate productivity savings from pain points
    let totalWeeklyHoursSaved = 0;
    const productivityItems = [];

    v.painPoints.forEach(pp => {
        const el = document.getElementById('pp-' + pp.id);
        const currentHours = el ? parseFloat(el.value) || 0 : pp.defaultHours;
        // Average improvement from value drivers (weighted)
        const avgImprovement = getAverageImprovement(vertical);
        const hoursSaved = currentHours * (avgImprovement / 100);
        const annualSavings = hoursSaved * weeksPerYear * users * hourlyRate;
        totalWeeklyHoursSaved += hoursSaved;

        productivityItems.push({
            label: pp.label,
            currentHours: currentHours,
            hoursSaved: hoursSaved,
            annualSavings: annualSavings
        });
    });

    const totalProductivitySavings = productivityItems.reduce((sum, item) => sum + item.annualSavings, 0);

    // 2. Cost avoidance savings
    const delayCost = parseFloat(document.getElementById('roi-delay-cost').value) || 0;
    const reworkCost = parseFloat(document.getElementById('roi-rework-cost').value) || 0;
    const revenueRisk = parseFloat(document.getElementById('roi-revenue-risk').value) || 0;
    const toolSpend = parseFloat(document.getElementById('roi-tool-spend').value) || 0;

    const delayReduction = parseFloat(document.getElementById('roi-delay-reduction').value) / 100;
    const reworkReduction = parseFloat(document.getElementById('roi-rework-reduction').value) / 100;
    const revenueRecovery = parseFloat(document.getElementById('roi-revenue-recovery').value) / 100;
    const toolSavings = parseFloat(document.getElementById('roi-tool-savings').value) / 100;

    const delaySavings = delayCost * delayReduction;
    const reworkSavings = reworkCost * reworkReduction;
    const revenueSavings = revenueRisk * revenueRecovery;
    const toolConsolidation = toolSpend * toolSavings;

    const totalCostAvoidance = delaySavings + reworkSavings + revenueSavings + toolConsolidation;

    // 3. Total savings
    const totalAnnualSavings = totalProductivitySavings + totalCostAvoidance;

    // 4. Investment calculation
    const planPrice = estimateWrikeInvestment(users);
    const annualInvestment = planPrice;

    // 5. ROI metrics
    const netBenefit = totalAnnualSavings - annualInvestment;
    const roi = annualInvestment > 0 ? ((netBenefit / annualInvestment) * 100) : 0;
    const paybackMonths = annualInvestment > 0 ? Math.ceil((annualInvestment / totalAnnualSavings) * 12) : 0;

    // Store results
    roiResults = {
        company: document.getElementById('roi-company').value || 'Customer',
        preparedBy: document.getElementById('roi-prepared-by').value || '',
        date: document.getElementById('roi-date').value || new Date().toISOString().split('T')[0],
        scenario: scenario,
        vertical: vertical,
        verticalName: v.name,
        users: users,
        salary: salary,
        hourlyRate: hourlyRate,
        productivityItems: productivityItems,
        totalProductivitySavings: totalProductivitySavings,
        delaySavings: delaySavings,
        reworkSavings: reworkSavings,
        revenueSavings: revenueSavings,
        toolConsolidation: toolConsolidation,
        totalCostAvoidance: totalCostAvoidance,
        totalAnnualSavings: totalAnnualSavings,
        annualInvestment: annualInvestment,
        netBenefit: netBenefit,
        roi: roi,
        paybackMonths: paybackMonths,
        totalWeeklyHoursSaved: totalWeeklyHoursSaved
    };

    renderResults();
}

function getAverageImprovement(vertical) {
    const v = VERTICALS[vertical];
    let total = 0;
    let count = 0;
    v.valueDrivers.forEach(vd => {
        const el = document.getElementById('vd-' + vd.id);
        total += el ? parseFloat(el.value) : vd.defaultPct;
        count++;
    });
    return count > 0 ? total / count : 30;
}

function estimateWrikeInvestment(users) {
    // Smart plan recommendation based on user count
    let plan;
    if (users <= 25) plan = 'business';
    else if (users <= 200) plan = 'business';
    else plan = 'enterprise';

    const price = PLANS[plan].pricePerUser;
    return users * price * 12; // Annual
}

// ---- Render Results ----
function renderResults() {
    if (!roiResults) return;
    const r = roiResults;

    // Header
    document.getElementById('results-company-name').textContent = r.company + ' — ROI Analysis';
    document.getElementById('results-scenario-badge').textContent =
        r.scenario === 'new' ? '🆕 New Customer' :
        r.scenario === 'existing' ? '📊 Existing Customer' : '📈 Expansion';
    document.getElementById('results-vertical-badge').textContent = r.verticalName;

    // KPIs
    document.getElementById('kpi-total-savings').textContent = formatCurrency(r.totalAnnualSavings);
    document.getElementById('kpi-investment').textContent = formatCurrency(r.annualInvestment);
    document.getElementById('kpi-net-benefit').textContent = formatCurrency(r.netBenefit);
    document.getElementById('kpi-roi').textContent = Math.round(r.roi) + '%';
    document.getElementById('kpi-payback').textContent = r.paybackMonths + ' mo';

    // Productivity breakdown table
    const prodTable = document.getElementById('productivity-breakdown');
    prodTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Activity</th>
                    <th>Current (hrs/wk)</th>
                    <th>Saved (hrs/wk)</th>
                    <th>Annual Savings</th>
                </tr>
            </thead>
            <tbody>
                ${r.productivityItems.map(item => `
                    <tr>
                        <td>${item.label}</td>
                        <td>${item.currentHours.toFixed(1)}</td>
                        <td>${item.hoursSaved.toFixed(1)}</td>
                        <td>${formatCurrency(item.annualSavings)}</td>
                    </tr>
                `).join('')}
                <tr class="total-row">
                    <td><strong>Total Productivity Savings</strong></td>
                    <td></td>
                    <td><strong>${r.totalWeeklyHoursSaved.toFixed(1)}</strong></td>
                    <td><strong>${formatCurrency(r.totalProductivitySavings)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

    // Cost avoidance breakdown
    const costTable = document.getElementById('cost-avoidance-breakdown');
    costTable.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Annual Savings</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>Reduction in Project Delays</td><td>${formatCurrency(r.delaySavings)}</td></tr>
                <tr><td>Reduction in Rework & Errors</td><td>${formatCurrency(r.reworkSavings)}</td></tr>
                <tr><td>Revenue Risk Recovered</td><td>${formatCurrency(r.revenueSavings)}</td></tr>
                <tr><td>Tool Consolidation Savings</td><td>${formatCurrency(r.toolConsolidation)}</td></tr>
                <tr class="total-row">
                    <td><strong>Total Cost Avoidance</strong></td>
                    <td><strong>${formatCurrency(r.totalCostAvoidance)}</strong></td>
                </tr>
            </tbody>
        </table>
    `;

    // Value Story
    const storyDiv = document.getElementById('value-story-text');
    storyDiv.innerHTML = generateValueStory(r);

    // Charts
    drawSavingsChart(r);
    drawProjectionChart(r);
}

function generateValueStory(r) {
    const scenarioText = r.scenario === 'new'
        ? `By implementing Wrike for ${r.verticalName}`
        : r.scenario === 'existing'
        ? `Through their existing Wrike deployment for ${r.verticalName}`
        : `By expanding Wrike to additional ${r.verticalName} workflows`;

    return `
        <div class="story-block">
            <p><strong>${r.company}</strong> can realize significant operational and financial value through Wrike.</p>
            <p>${scenarioText}, the organization can achieve <strong>${formatCurrency(r.totalAnnualSavings)} in annual savings</strong> across ${r.users} users.</p>
            <p>Key value drivers include:</p>
            <ul>
                <li><strong>Productivity Recovery:</strong> ${formatCurrency(r.totalProductivitySavings)} annually by recovering ${r.totalWeeklyHoursSaved.toFixed(0)} hours per week per employee from inefficient processes</li>
                <li><strong>Cost Avoidance:</strong> ${formatCurrency(r.totalCostAvoidance)} through reduced delays, rework, and tool consolidation</li>
            </ul>
            <p>Against a Wrike investment of <strong>${formatCurrency(r.annualInvestment)} per year</strong>, this delivers a <strong>${Math.round(r.roi)}% ROI</strong> with a payback period of just <strong>${r.paybackMonths} months</strong>.</p>
            <p>Over 3 years, the projected cumulative net benefit is <strong>${formatCurrency(r.netBenefit * 3)}</strong>.</p>
        </div>
    `;
}

// ---- Charts (Canvas-based, no external libraries) ----
function drawSavingsChart(r) {
    const canvas = document.getElementById('savings-chart');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const data = [
        { label: 'Productivity', value: r.totalProductivitySavings, color: '#08CF65' },
        { label: 'Delay Reduction', value: r.delaySavings, color: '#6366F1' },
        { label: 'Rework Reduction', value: r.reworkSavings, color: '#EC4899' },
        { label: 'Revenue Recovery', value: r.revenueSavings, color: '#F59E0B' },
        { label: 'Tool Consolidation', value: r.toolConsolidation, color: '#10B981' }
    ].filter(d => d.value > 0);

    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return;

    const cx = w / 2;
    const cy = 120;
    const radius = 90;
    let startAngle = -Math.PI / 2;

    data.forEach(d => {
        const sliceAngle = (d.value / total) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = d.color;
        ctx.fill();
        startAngle += sliceAngle;
    });

    // Center hole (donut)
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0, 2 * Math.PI);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();

    // Center text
    ctx.fillStyle = '#fff';
    ctx.font = '600 14px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(formatCurrencyShort(total), cx, cy + 5);

    // Legend
    let ly = 230;
    ctx.font = '500 11px Inter';
    data.forEach(d => {
        const pct = ((d.value / total) * 100).toFixed(0);
        ctx.fillStyle = d.color;
        ctx.fillRect(20, ly - 8, 12, 12);
        ctx.fillStyle = '#ccc';
        ctx.textAlign = 'left';
        ctx.fillText(`${d.label} — ${formatCurrencyShort(d.value)} (${pct}%)`, 38, ly);
        ly += 18;
    });
}

function drawProjectionChart(r) {
    const canvas = document.getElementById('projection-chart');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const years = [1, 2, 3];
    const rampUp = [0.7, 0.9, 1.0]; // Adoption ramp
    const savings = years.map((y, i) => r.totalAnnualSavings * rampUp[i]);
    const investments = years.map(() => r.annualInvestment);
    const cumNet = [];
    let cumSum = 0;
    years.forEach((y, i) => {
        cumSum += savings[i] - investments[i];
        cumNet.push(cumSum);
    });

    const maxVal = Math.max(...savings, ...cumNet);
    const chartLeft = 70;
    const chartRight = w - 20;
    const chartTop = 30;
    const chartBottom = h - 60;
    const chartW = chartRight - chartLeft;
    const chartH = chartBottom - chartTop;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = chartTop + (chartH / 4) * i;
        ctx.beginPath();
        ctx.moveTo(chartLeft, y);
        ctx.lineTo(chartRight, y);
        ctx.stroke();

        ctx.fillStyle = '#888';
        ctx.font = '500 10px Inter';
        ctx.textAlign = 'right';
        ctx.fillText(formatCurrencyShort(maxVal * (1 - i / 4)), chartLeft - 8, y + 4);
    }

    const barWidth = chartW / years.length / 3;

    years.forEach((year, i) => {
        const x = chartLeft + (i + 0.5) * (chartW / years.length);

        // Savings bar
        const savH = (savings[i] / maxVal) * chartH;
        ctx.fillStyle = '#08CF65';
        ctx.fillRect(x - barWidth - 2, chartBottom - savH, barWidth, savH);

        // Investment bar
        const invH = (investments[i] / maxVal) * chartH;
        ctx.fillStyle = '#6366F1';
        ctx.fillRect(x + 2, chartBottom - invH, barWidth, invH);

        // Year label
        ctx.fillStyle = '#ccc';
        ctx.font = '500 12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Year ' + year, x, chartBottom + 20);

        // Values on bars
        ctx.font = '600 9px Inter';
        ctx.fillStyle = '#08CF65';
        ctx.fillText(formatCurrencyShort(savings[i]), x - barWidth / 2 - 2, chartBottom - savH - 6);
        ctx.fillStyle = '#6366F1';
        ctx.fillText(formatCurrencyShort(investments[i]), x + barWidth / 2 + 2, chartBottom - invH - 6);
    });

    // Legend
    ctx.font = '500 11px Inter';
    ctx.fillStyle = '#08CF65';
    ctx.fillRect(chartLeft, chartBottom + 36, 12, 12);
    ctx.fillText('Savings', chartLeft + 16, chartBottom + 47);
    ctx.fillStyle = '#6366F1';
    ctx.fillRect(chartLeft + 90, chartBottom + 36, 12, 12);
    ctx.fillText('Investment', chartLeft + 106, chartBottom + 47);
    ctx.fillStyle = '#F59E0B';
    ctx.fillRect(chartLeft + 190, chartBottom + 36, 12, 12);
    ctx.fillText('Cum. Net: ' + formatCurrencyShort(cumNet[2]), chartLeft + 206, chartBottom + 47);
}

// ---- Pricing Calculator ----
function selectPlan(plan) {
    selectedPlan = plan;
    document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('selected'));
    document.querySelector(`.plan-card[data-plan="${plan}"]`).classList.add('selected');
    updateQuote();
}

function updateQuote() {
    const plan = PLANS[selectedPlan];
    const users = parseInt(document.getElementById('quote-users').value) || 1;
    const term = document.getElementById('quote-term').value;
    const billing = document.getElementById('quote-billing').value;

    // Base cost
    let monthlyPerUser = plan.pricePerUser;
    if (billing === 'monthly') monthlyPerUser *= 1.2; // Monthly premium

    const baseAnnual = users * monthlyPerUser * 12;

    // Add-ons
    let addonsAnnual = 0;
    Object.keys(ADDONS).forEach(id => {
        const el = document.getElementById(id);
        if (el && el.checked) {
            addonsAnnual += ADDONS[id].pricePerUser * users * 12;
        }
    });

    // Professional Services (one-time)
    let servicesCost = 0;
    if (document.getElementById('svc-implementation').checked) {
        servicesCost += parseInt(document.getElementById('svc-impl-tier').value);
    }
    if (document.getElementById('svc-training').checked) {
        servicesCost += parseInt(document.getElementById('svc-training-tier').value);
    }
    if (document.getElementById('svc-csm').checked) {
        servicesCost += parseInt(document.getElementById('svc-csm-tier').value);
    }

    // Discounts
    const volumeDisc = parseFloat(document.getElementById('quote-volume-discount').value) / 100 || 0;
    const multiYearDisc = parseFloat(document.getElementById('quote-multiyear-discount').value) / 100 || 0;
    const strategicDisc = parseFloat(document.getElementById('quote-strategic-discount').value) / 100 || 0;
    const totalDiscount = Math.min(volumeDisc + multiYearDisc + strategicDisc, 0.60); // Cap at 60%

    const subtotal = baseAnnual + addonsAnnual;
    const discountAmount = subtotal * totalDiscount;
    const totalAnnual = subtotal - discountAmount + servicesCost;
    const monthlyTotal = (totalAnnual - servicesCost) / 12;
    const effectivePerUser = totalAnnual > 0 ? (totalAnnual - servicesCost) / users / 12 : 0;

    // Update display
    document.getElementById('quote-plan-display').textContent = plan.name;
    document.getElementById('quote-per-user-display').textContent = '$' + monthlyPerUser.toFixed(0) + '/user/mo';
    document.getElementById('quote-users-display').textContent = users;
    document.getElementById('quote-base-display').textContent = formatCurrency(baseAnnual) + '/yr';

    const addonsLine = document.getElementById('quote-addons-line');
    if (addonsAnnual > 0) {
        addonsLine.style.display = 'flex';
        document.getElementById('quote-addons-display').textContent = formatCurrency(addonsAnnual) + '/yr';
    } else {
        addonsLine.style.display = 'none';
    }

    const servicesLine = document.getElementById('quote-services-line');
    if (servicesCost > 0) {
        servicesLine.style.display = 'flex';
        document.getElementById('quote-services-display').textContent = formatCurrency(servicesCost);
    } else {
        servicesLine.style.display = 'none';
    }

    document.getElementById('quote-subtotal-display').textContent = formatCurrency(subtotal + servicesCost);

    const discountLine = document.getElementById('quote-discount-line');
    if (discountAmount > 0) {
        discountLine.style.display = 'flex';
        document.getElementById('quote-discount-display').textContent = '-' + formatCurrency(discountAmount) + ' (' + Math.round(totalDiscount * 100) + '%)';
    } else {
        discountLine.style.display = 'none';
    }

    document.getElementById('quote-total-display').textContent = formatCurrency(totalAnnual);
    document.getElementById('quote-monthly-display').textContent = formatCurrency(monthlyTotal) + '/mo';
    document.getElementById('quote-effective-per-user').textContent = '$' + effectivePerUser.toFixed(2);

    // Customer name
    const custName = document.getElementById('quote-customer').value;
    document.getElementById('quote-customer-display').textContent = custName || '—';

    // Link ROI if available
    if (roiResults) {
        document.getElementById('quote-roi-link').style.display = 'block';
        document.getElementById('quote-roi-savings').textContent = formatCurrency(roiResults.totalAnnualSavings);
        document.getElementById('quote-roi-net').textContent = formatCurrency(roiResults.totalAnnualSavings - totalAnnual);
        const linkedROI = totalAnnual > 0 ? (((roiResults.totalAnnualSavings - totalAnnual) / totalAnnual) * 100) : 0;
        document.getElementById('quote-roi-pct').textContent = Math.round(linkedROI) + '%';
    }
}

function linkROIToQuote() {
    if (roiResults) {
        updateQuote();
        showToast('ROI analysis linked to quote!', 'success');
    } else {
        showToast('Complete an ROI analysis first', 'warning');
    }
}

function resetPricing() {
    document.getElementById('quote-customer').value = '';
    document.getElementById('quote-contact').value = '';
    document.getElementById('quote-users').value = 50;
    document.getElementById('quote-collaborators').value = 20;
    document.getElementById('quote-volume-discount').value = 0;
    document.getElementById('quote-multiyear-discount').value = 0;
    document.getElementById('quote-strategic-discount').value = 0;
    document.querySelectorAll('.addons-list input[type="checkbox"]').forEach(cb => cb.checked = false);
    selectPlan('business');
    updateQuote();
}

// ---- Save / Load Assessments ----
function saveAssessment() {
    if (!roiResults) {
        showToast('Complete an ROI analysis first', 'warning');
        return;
    }

    const assessment = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...roiResults
    };

    savedAssessments.push(assessment);
    localStorage.setItem('wrike_assessments', JSON.stringify(savedAssessments));
    showToast('Assessment saved successfully!', 'success');
}

function renderSavedAssessments() {
    const container = document.getElementById('saved-list');
    if (savedAssessments.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <h3>No saved assessments yet</h3>
                <p>Start a new ROI analysis or build a quote to save it here</p>
                <button class="btn btn-primary" onclick="navigateTo('roi-calculator')">Start New Assessment</button>
            </div>
        `;
        return;
    }

    container.innerHTML = savedAssessments.map(a => `
        <div class="saved-card">
            <div class="saved-card-header">
                <div>
                    <h3>${a.company}</h3>
                    <div class="saved-meta">
                        <span class="badge small">${a.verticalName}</span>
                        <span class="badge small">${a.scenario === 'new' ? 'New Customer' : a.scenario === 'existing' ? 'Existing' : 'Expansion'}</span>
                        <span class="text-muted">${new Date(a.timestamp).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="saved-kpis">
                    <div class="mini-kpi green">
                        <span class="mini-kpi-label">Savings</span>
                        <span class="mini-kpi-value">${formatCurrencyShort(a.totalAnnualSavings)}</span>
                    </div>
                    <div class="mini-kpi blue">
                        <span class="mini-kpi-label">ROI</span>
                        <span class="mini-kpi-value">${Math.round(a.roi)}%</span>
                    </div>
                    <div class="mini-kpi purple">
                        <span class="mini-kpi-label">Payback</span>
                        <span class="mini-kpi-value">${a.paybackMonths}mo</span>
                    </div>
                </div>
            </div>
            <div class="saved-card-actions">
                <button class="btn btn-sm btn-outline" onclick="loadAssessment(${a.id})"><i class="fas fa-eye"></i> View</button>
                <button class="btn btn-sm btn-outline" onclick="deleteAssessment(${a.id})"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>
    `).join('');
}

function loadAssessment(id) {
    const assessment = savedAssessments.find(a => a.id === id);
    if (!assessment) return;

    roiResults = assessment;
    navigateTo('roi-calculator');
    goToStep(4);
    renderResults();
}

function deleteAssessment(id) {
    savedAssessments = savedAssessments.filter(a => a.id !== id);
    localStorage.setItem('wrike_assessments', JSON.stringify(savedAssessments));
    renderSavedAssessments();
    showToast('Assessment deleted', 'info');
}

function clearAllSaved() {
    if (confirm('Are you sure you want to delete all saved assessments?')) {
        savedAssessments = [];
        localStorage.setItem('wrike_assessments', '[]');
        renderSavedAssessments();
        showToast('All assessments cleared', 'info');
    }
}

// ---- Reset ROI Calculator ----
function resetROICalculator() {
    document.getElementById('roi-company').value = '';
    document.getElementById('roi-prepared-by').value = '';
    document.getElementById('roi-users').value = 100;
    document.getElementById('roi-salary').value = 95000;
    document.getElementById('roi-hours').value = 2080;
    document.getElementById('roi-delay-cost').value = 150000;
    document.getElementById('roi-rework-cost').value = 100000;
    document.getElementById('roi-revenue-risk').value = 250000;
    document.getElementById('roi-tool-spend').value = 50000;
    roiResults = null;
    goToStep(1);
    showToast('Calculator reset', 'info');
}

// ---- Export PDF ----
function exportROIPDF() {
    if (!roiResults) {
        showToast('Complete an ROI analysis first', 'warning');
        return;
    }
    const r = roiResults;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePDFHTML(r, 'roi'));
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
}

function exportQuotePDF() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePDFHTML(null, 'quote'));
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
}

function generatePDFHTML(r, type) {
    const styles = `
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: #1a1a2e; padding: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #08CF65; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 28px; font-weight: 800; color: #08CF65; }
            .title { font-size: 22px; font-weight: 700; color: #1a1a2e; }
            .subtitle { font-size: 14px; color: #666; }
            .meta { display: flex; gap: 30px; margin-bottom: 30px; }
            .meta-item { font-size: 13px; }
            .meta-item strong { display: block; color: #333; }
            .kpi-row { display: flex; gap: 16px; margin-bottom: 30px; }
            .kpi { flex: 1; background: #f8f9fa; border-radius: 8px; padding: 16px; text-align: center; }
            .kpi-label { font-size: 11px; text-transform: uppercase; color: #666; display: block; }
            .kpi-value { font-size: 24px; font-weight: 700; }
            .kpi.green .kpi-value { color: #08CF65; }
            .kpi.blue .kpi-value { color: #6366F1; }
            .kpi.purple .kpi-value { color: #8B5CF6; }
            .kpi.orange .kpi-value { color: #F59E0B; }
            .section { margin-bottom: 24px; }
            .section h3 { font-size: 16px; color: #1a1a2e; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #f1f3f5; padding: 8px 12px; text-align: left; font-weight: 600; }
            td { padding: 8px 12px; border-bottom: 1px solid #eee; }
            .total-row td { font-weight: 700; background: #f8f9fa; }
            .story { background: #f8f9fa; padding: 20px; border-radius: 8px; font-size: 13px; line-height: 1.8; }
            .story strong { color: #08CF65; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #999; text-align: center; }
            .quote-line { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .quote-line.total { font-weight: 700; font-size: 18px; border-top: 2px solid #08CF65; padding-top: 12px; }
            @media print { body { padding: 20px; } }
        </style>
    `;

    if (type === 'roi' && r) {
        return `<!DOCTYPE html><html><head><title>ROI Analysis — ${r.company}</title>${styles}</head><body>
            <div class="header">
                <div><span class="logo">Wrike</span> <span style="color:#666; margin-left:8px;">Value Engineering</span></div>
                <div style="text-align:right;"><div class="title">ROI Analysis</div><div class="subtitle">${r.verticalName}</div></div>
            </div>
            <div class="meta">
                <div class="meta-item"><strong>Company</strong>${r.company}</div>
                <div class="meta-item"><strong>Prepared By</strong>${r.preparedBy || 'Wrike Value Engineering'}</div>
                <div class="meta-item"><strong>Date</strong>${r.date}</div>
                <div class="meta-item"><strong>Scenario</strong>${r.scenario === 'new' ? 'New Customer' : r.scenario === 'existing' ? 'Existing Customer' : 'Expansion'}</div>
                <div class="meta-item"><strong>Users</strong>${r.users}</div>
            </div>
            <div class="kpi-row">
                <div class="kpi green"><span class="kpi-label">Annual Savings</span><span class="kpi-value">${formatCurrency(r.totalAnnualSavings)}</span></div>
                <div class="kpi blue"><span class="kpi-label">Investment</span><span class="kpi-value">${formatCurrency(r.annualInvestment)}</span></div>
                <div class="kpi purple"><span class="kpi-label">Net Benefit</span><span class="kpi-value">${formatCurrency(r.netBenefit)}</span></div>
                <div class="kpi orange"><span class="kpi-label">ROI</span><span class="kpi-value">${Math.round(r.roi)}%</span></div>
            </div>
            <div class="section"><h3>Productivity Savings</h3>
                <table><thead><tr><th>Activity</th><th>Current (hrs/wk)</th><th>Saved (hrs/wk)</th><th>Annual Savings</th></tr></thead>
                <tbody>${r.productivityItems.map(i => `<tr><td>${i.label}</td><td>${i.currentHours.toFixed(1)}</td><td>${i.hoursSaved.toFixed(1)}</td><td>${formatCurrency(i.annualSavings)}</td></tr>`).join('')}
                <tr class="total-row"><td>Total</td><td></td><td>${r.totalWeeklyHoursSaved.toFixed(1)}</td><td>${formatCurrency(r.totalProductivitySavings)}</td></tr></tbody></table>
            </div>
            <div class="section"><h3>Cost Avoidance</h3>
                <table><thead><tr><th>Category</th><th>Annual Savings</th></tr></thead>
                <tbody>
                    <tr><td>Reduction in Project Delays</td><td>${formatCurrency(r.delaySavings)}</td></tr>
                    <tr><td>Reduction in Rework</td><td>${formatCurrency(r.reworkSavings)}</td></tr>
                    <tr><td>Revenue Risk Recovered</td><td>${formatCurrency(r.revenueSavings)}</td></tr>
                    <tr><td>Tool Consolidation</td><td>${formatCurrency(r.toolConsolidation)}</td></tr>
                    <tr class="total-row"><td>Total</td><td>${formatCurrency(r.totalCostAvoidance)}</td></tr>
                </tbody></table>
            </div>
            <div class="section"><h3>Executive Summary</h3><div class="story">${generateValueStory(r)}</div></div>
            <div class="footer">Confidential — Prepared by Wrike Value Engineering | ${new Date().toLocaleDateString()}</div>
        </body></html>`;
    }

    // Quote PDF
    const customer = document.getElementById('quote-customer').value || 'Customer';
    const contact = document.getElementById('quote-contact').value || '';
    const planName = PLANS[selectedPlan].name;
    const users = document.getElementById('quote-users').value;
    const total = document.getElementById('quote-total-display').textContent;
    const monthly = document.getElementById('quote-monthly-display').textContent;
    const perUser = document.getElementById('quote-effective-per-user').textContent;

    return `<!DOCTYPE html><html><head><title>Quote — ${customer}</title>${styles}</head><body>
        <div class="header">
            <div><span class="logo">Wrike</span> <span style="color:#666; margin-left:8px;">Quote</span></div>
            <div style="text-align:right;"><div class="title">Pricing Quote</div><div class="subtitle">${new Date().toLocaleDateString()}</div></div>
        </div>
        <div class="meta">
            <div class="meta-item"><strong>Customer</strong>${customer}</div>
            <div class="meta-item"><strong>Contact</strong>${contact}</div>
            <div class="meta-item"><strong>Plan</strong>${planName}</div>
            <div class="meta-item"><strong>Users</strong>${users}</div>
        </div>
        <div class="section">
            <h3>Quote Summary</h3>
            <div class="quote-line"><span>Plan: ${planName}</span><span>${document.getElementById('quote-per-user-display').textContent}</span></div>
            <div class="quote-line"><span>Licensed Users: ${users}</span><span>${document.getElementById('quote-base-display').textContent}</span></div>
            ${document.getElementById('quote-addons-line').style.display !== 'none' ? `<div class="quote-line"><span>Add-Ons</span><span>${document.getElementById('quote-addons-display').textContent}</span></div>` : ''}
            ${document.getElementById('quote-services-line').style.display !== 'none' ? `<div class="quote-line"><span>Professional Services</span><span>${document.getElementById('quote-services-display').textContent}</span></div>` : ''}
            ${document.getElementById('quote-discount-line').style.display !== 'none' ? `<div class="quote-line" style="color:#08CF65;"><span>Discount</span><span>${document.getElementById('quote-discount-display').textContent}</span></div>` : ''}
            <div class="quote-line total"><span>Total Annual Investment</span><span>${total}</span></div>
            <div class="quote-line"><span>Effective Monthly</span><span>${monthly}</span></div>
            <div class="quote-line"><span>Effective Per User / Month</span><span>${perUser}</span></div>
        </div>
        ${roiResults ? `
        <div class="section">
            <h3>Linked ROI Analysis</h3>
            <div class="quote-line"><span>Projected Annual Savings</span><span style="color:#08CF65;">${formatCurrency(roiResults.totalAnnualSavings)}</span></div>
            <div class="quote-line"><span>ROI</span><span style="color:#08CF65;">${Math.round(roiResults.roi)}%</span></div>
            <div class="quote-line"><span>Payback Period</span><span>${roiResults.paybackMonths} months</span></div>
        </div>` : ''}
        <div class="footer">
            <p>This quote is valid for 30 days from the date above.</p>
            <p>Confidential — Wrike, a Citrix Company | ${new Date().toLocaleDateString()}</p>
        </div>
    </body></html>`;
}

// ---- Utility Functions ----
function formatCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) return '$0';
    return '$' + Math.round(num).toLocaleString('en-US');
}

function formatCurrencyShort(num) {
    if (num >= 1000000) return '$' + (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return '$' + (num / 1000).toFixed(0) + 'K';
    return '$' + Math.round(num);
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => toast.className = 'toast', 3000);
}

function showHelp() {
    document.getElementById('help-modal').style.display = 'flex';
}

function closeHelp() {
    document.getElementById('help-modal').style.display = 'none';
}

// ---- Initialization ----
document.addEventListener('DOMContentLoaded', () => {
    // Set default date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('roi-date').value = today;
    document.getElementById('quote-date').value = today;

    const validDate = new Date();
    validDate.setDate(validDate.getDate() + 30);
    document.getElementById('quote-valid').value = validDate.toISOString().split('T')[0];

    // Scenario change handler
    document.getElementById('roi-scenario').addEventListener('change', handleScenarioChange);

    // Quote input listeners
    document.getElementById('quote-customer').addEventListener('input', updateQuote);

    // Initialize
    updateQuote();
});
