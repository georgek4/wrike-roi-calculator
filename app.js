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
            { id: 'cross-func', label: 'Cross-functional coordination & handoffs', defaultHours: 6, benchmarkRange: '4–8', benchmarkSource: 'McKinsey Digital, 2023 — "The case for digital reinvention"', description: 'Time spent aligning engineering, design, QA, and supply chain teams' },
            { id: 'status-reporting', label: 'Status reporting & milestone tracking', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'Manual status updates, spreadsheet tracking, executive reporting' },
            { id: 'change-mgmt', label: 'Change request management', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'Gartner Product Development Benchmark, 2022', description: 'Processing ECOs, tracking change impacts across workstreams' },
            { id: 'doc-search', label: 'Document search & version control', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'IDC "The Knowledge Quotient" Study, 2023', description: 'Finding latest specs, managing document versions, audit trails' },
            { id: 'approval-wait', label: 'Waiting for approvals & sign-offs', defaultHours: 5, benchmarkRange: '3–7', benchmarkSource: 'Aberdeen Group — Engineering Efficiency Report, 2022', description: 'Gate reviews, design approvals, compliance sign-offs' },
            { id: 'meetings', label: 'Unnecessary meetings & syncs', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'Harvard Business Review — "Stop the Meeting Madness", 2023 update', description: 'Status meetings that could be replaced with async updates' }
        ],
        valueDrivers: [
            { id: 'ttm', label: 'Faster Time-to-Market', defaultPct: 30, benchmarkRange: '20–45%', benchmarkSource: 'McKinsey — "Accelerating product development", 2023', description: 'Accelerate product launch through streamlined workflows', unit: '%' },
            { id: 'rework', label: 'Reduction in Engineering Rework', defaultPct: 35, benchmarkRange: '25–50%', benchmarkSource: 'CIMdata PLM Industry Report, 2023', description: 'Fewer design iterations through better visibility & proofing', unit: '%' },
            { id: 'resource', label: 'Improved Resource Utilization', defaultPct: 20, benchmarkRange: '10–30%', benchmarkSource: 'Gartner PPM Resource Optimization Study, 2022', description: 'Better allocation of engineering and design resources', unit: '%' },
            { id: 'compliance', label: 'Faster Compliance & Audit Readiness', defaultPct: 40, benchmarkRange: '30–60%', benchmarkSource: 'Deloitte Regulatory Compliance Benchmark, 2023', description: 'Automated audit trails and compliance documentation', unit: '%' }
        ]
    },
    csd: {
        name: 'Client Service Delivery',
        icon: 'fa-headset',
        color: '#EC4899',
        painPoints: [
            { id: 'client-comm', label: 'Client communication & updates', defaultHours: 5, benchmarkRange: '3–7', benchmarkSource: 'Forrester — "The State of Client Service Ops", 2023', description: 'Sending status updates, responding to client inquiries' },
            { id: 'resource-plan', label: 'Resource planning & scheduling', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'SPI Research — PS Maturity Benchmark, 2023', description: 'Assigning team members, managing capacity, scheduling work' },
            { id: 'scope-tracking', label: 'Scope tracking & change orders', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'Managing scope creep, processing change orders' },
            { id: 'time-tracking', label: 'Time tracking & billing prep', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'TSIA Professional Services Benchmark, 2023', description: 'Logging hours, preparing invoices, reconciling time' },
            { id: 'internal-handoffs', label: 'Internal handoffs & escalations', defaultHours: 4, benchmarkRange: '2–6', benchmarkSource: 'McKinsey — "The social economy" operational study, 2022', description: 'Transferring work between teams, escalation management' },
            { id: 'reporting', label: 'Client reporting & dashboards', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'Forrester — "Analytics Drives Better Client Outcomes", 2023', description: 'Building reports, updating dashboards, preparing QBRs' }
        ],
        valueDrivers: [
            { id: 'delivery-speed', label: 'Faster Service Delivery', defaultPct: 35, benchmarkRange: '25–45%', benchmarkSource: 'SPI Research — PS Maturity Benchmark, 2023', description: 'Reduce average project delivery timelines', unit: '%' },
            { id: 'utilization', label: 'Improved Team Utilization', defaultPct: 20, benchmarkRange: '10–25%', benchmarkSource: 'TSIA Professional Services Benchmark, 2023', description: 'Increase billable utilization through better resource management', unit: '%' },
            { id: 'client-sat', label: 'Client Satisfaction Improvement', defaultPct: 25, benchmarkRange: '15–35%', benchmarkSource: 'Forrester CX Index, 2023', description: 'Higher NPS/CSAT through better visibility and communication', unit: '%' },
            { id: 'scope-control', label: 'Better Scope & Budget Control', defaultPct: 30, benchmarkRange: '20–40%', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'Reduce scope creep and budget overruns', unit: '%' }
        ]
    },
    marketing: {
        name: 'Marketing — Creative & Campaigns',
        icon: 'fa-bullhorn',
        color: '#F59E0B',
        painPoints: [
            { id: 'creative-review', label: 'Creative review & approval cycles', defaultHours: 6, benchmarkRange: '4–8', benchmarkSource: 'Workfront/Adobe "State of Work" Report, 2023', description: 'Routing assets for feedback, consolidating comments, revision rounds' },
            { id: 'campaign-plan', label: 'Campaign planning & coordination', defaultHours: 5, benchmarkRange: '3–7', benchmarkSource: 'Gartner Marketing Operations Survey, 2023', description: 'Aligning teams on campaign timelines, channel coordination' },
            { id: 'asset-mgmt', label: 'Asset management & version control', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'Forrester — "Digital Asset Management Best Practices", 2022', description: 'Finding approved assets, managing versions, DAM coordination' },
            { id: 'brief-intake', label: 'Brief intake & request management', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'Workfront/Adobe "State of Work" Report, 2023', description: 'Processing creative requests, clarifying requirements' },
            { id: 'stakeholder-align', label: 'Stakeholder alignment & feedback', defaultHours: 4, benchmarkRange: '3–7', benchmarkSource: 'Harvard Business Review — "Cross-Functional Collaboration", 2022', description: 'Getting buy-in from multiple stakeholders, consolidating feedback' },
            { id: 'perf-reporting', label: 'Performance reporting & analytics', defaultHours: 3, benchmarkRange: '2–4', benchmarkSource: 'Gartner CMO Spend Survey, 2023', description: 'Pulling campaign metrics, building performance reports' }
        ],
        valueDrivers: [
            { id: 'campaign-velocity', label: 'Faster Campaign Launch', defaultPct: 40, benchmarkRange: '30–55%', benchmarkSource: 'Gartner Marketing Operations Survey, 2023', description: 'Reduce time from brief to launch', unit: '%' },
            { id: 'review-cycles', label: 'Fewer Revision Cycles', defaultPct: 45, benchmarkRange: '35–60%', benchmarkSource: 'Workfront/Adobe "State of Work" Report, 2023', description: 'Reduce creative revision rounds through better proofing', unit: '%' },
            { id: 'brand-consistency', label: 'Improved Brand Consistency', defaultPct: 30, benchmarkRange: '20–45%', benchmarkSource: 'Forrester — "Brand Management in the Digital Age", 2022', description: 'Standardized templates and approval workflows', unit: '%' },
            { id: 'throughput', label: 'Increased Creative Throughput', defaultPct: 25, benchmarkRange: '15–35%', benchmarkSource: 'IDC MarketScape — Enterprise Content Management, 2023', description: 'Produce more assets with the same team', unit: '%' }
        ]
    },
    pmo: {
        name: 'Project Management Office',
        icon: 'fa-project-diagram',
        color: '#10B981',
        painPoints: [
            { id: 'portfolio-visibility', label: 'Portfolio visibility & reporting', defaultHours: 5, benchmarkRange: '3–7', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'Aggregating project statuses, building executive dashboards' },
            { id: 'resource-mgmt', label: 'Resource management & allocation', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'Gartner PPM Resource Optimization Study, 2022', description: 'Balancing workloads, identifying bottlenecks, capacity planning' },
            { id: 'methodology', label: 'Methodology & process enforcement', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'PMI — "The Standard for Project Management", 7th Edition benchmarks', description: 'Ensuring teams follow standards, templates, and governance' },
            { id: 'risk-mgmt', label: 'Risk & issue management', defaultHours: 3, benchmarkRange: '2–4', benchmarkSource: 'KPMG Global Project Management Survey, 2023', description: 'Tracking risks, managing issues, escalation workflows' },
            { id: 'stakeholder-comm', label: 'Stakeholder communication', defaultHours: 4, benchmarkRange: '3–6', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'Executive updates, steering committee prep, status meetings' },
            { id: 'tool-admin', label: 'Tool administration & data hygiene', defaultHours: 3, benchmarkRange: '2–5', benchmarkSource: 'Forrester — "PPM Tools Total Economic Impact", 2022', description: 'Maintaining PM tools, cleaning data, managing access' }
        ],
        valueDrivers: [
            { id: 'project-success', label: 'Improved Project Success Rate', defaultPct: 25, benchmarkRange: '15–35%', benchmarkSource: 'PMI Pulse of the Profession, 2023', description: 'More projects delivered on time and on budget', unit: '%' },
            { id: 'capacity', label: 'Increased Delivery Capacity', defaultPct: 20, benchmarkRange: '10–25%', benchmarkSource: 'Gartner PPM Market Guide, 2023', description: 'Take on more projects without adding headcount', unit: '%' },
            { id: 'visibility', label: 'Real-Time Portfolio Visibility', defaultPct: 60, benchmarkRange: '40–75%', benchmarkSource: 'Forrester — "PPM Tools Total Economic Impact", 2022', description: 'Eliminate manual status collection and reporting', unit: '%' },
            { id: 'standardization', label: 'Process Standardization', defaultPct: 40, benchmarkRange: '25–55%', benchmarkSource: 'KPMG Global Project Management Survey, 2023', description: 'Consistent methodologies across all project types', unit: '%' }
        ]
    }
};

const INDUSTRY_BENCHMARKS = {
    costDrivers: {
        delayCost: { range: '$75K–$500K', description: 'Annual cost of project delays', source: 'PMI Pulse of the Profession, 2023 — 48% of projects experience schedule delays with average cost overrun of 27%' },
        reworkCost: { range: '$50K–$300K', description: 'Annual cost of rework & errors', source: 'CISQ "Cost of Poor Software Quality" Report, 2022 & Construction Industry Institute' },
        revenueRisk: { range: '$100K–$1M+', description: 'Revenue at risk from inefficiency', source: 'McKinsey — "The case for digital reinvention", 2023 — Companies lose 20-30% of revenue annually to operational inefficiency' },
        toolSpend: { range: '$20K–$200K', description: 'Redundant tool spend', source: 'Zylo SaaS Management Index, 2023 — Average enterprise wastes $18M/yr on unused or redundant SaaS' }
    },
    costRecovery: {
        delayReduction: { range: '20–50%', source: 'PMI & Gartner PPM benchmarks, 2022–2023' },
        reworkReduction: { range: '20–45%', source: 'CIMdata & Aberdeen Group operational studies, 2022' },
        revenueRecovery: { range: '10–35%', source: 'Forrester TEI studies across work management platforms, 2023' },
        toolSavings: { range: '40–80%', source: 'Zylo SaaS Management Index, 2023' }
    }
};

// ---- Pricing Configuration ----
const PLANS = {
    free: { name: 'Free', pricePerUser: 0, minUsers: 1, maxUsers: 9999 },
    team: { name: 'Team', pricePerUser: 10, minUsers: 2, maxUsers: 15 },
    business: { name: 'Business', pricePerUser: 25, minUsers: 5, maxUsers: 200 },
    pinnacle: { name: 'Pinnacle', pricePerUser: 25, minUsers: 5, maxUsers: 9999, customPricing: true },
    apex: { name: 'Apex', pricePerUser: 25, minUsers: 5, maxUsers: 9999, customPricing: true }
};

const ADDONS = {
    'addon-whiteboard': { name: 'Wrike Whiteboard', pricePerUser: 15 },
    'addon-integrate': { name: 'Wrike Integrate', pricePerUser: 5 },
    'addon-twoway-sync': { name: 'Wrike Two-Way Sync', pricePerUser: 5 },
    'addon-datahub': { name: 'Wrike Datahub', pricePerUser: 5 },
    'addon-wrike-lock': { name: 'Wrike Lock', pricePerUser: 5 }
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
    if (page === 'ai-agents') calculateAIAgents();

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
            <div class="benchmark-hint">
                <i class="fas fa-chart-bar"></i>
                <span>Industry benchmark: <strong>${pp.benchmarkRange} hrs/week</strong></span>
                <button class="benchmark-source-btn" onclick="event.stopPropagation(); toggleBenchmarkTooltip(this)" title="View source">
                    <i class="fas fa-info-circle"></i>
                </button>
                <div class="benchmark-tooltip">${pp.benchmarkSource}</div>
            </div>
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
            <div class="benchmark-hint">
                <i class="fas fa-chart-bar"></i>
                <span>Industry benchmark: <strong>${vd.benchmarkRange}</strong></span>
                <button class="benchmark-source-btn" onclick="event.stopPropagation(); toggleBenchmarkTooltip(this)" title="View source">
                    <i class="fas fa-info-circle"></i>
                </button>
                <div class="benchmark-tooltip">${vd.benchmarkSource}</div>
            </div>
            <div class="slider-group">
                <input type="range" id="vd-${vd.id}" min="0" max="80" value="${vd.defaultPct}" oninput="syncSlider(this)">
                <span class="slider-value">${vd.defaultPct}%</span>
            </div>
        </div>
    `).join('');
}

function toggleBenchmarkTooltip(btn) {
    const tooltip = btn.nextElementSibling;
    const isVisible = tooltip.classList.contains('visible');
    document.querySelectorAll('.benchmark-tooltip.visible').forEach(t => t.classList.remove('visible'));
    if (!isVisible) tooltip.classList.add('visible');
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
    let plan;
    if (users <= 15) plan = 'team';
    else if (users <= 200) plan = 'business';
    else plan = 'pinnacle';

    const price = PLANS[plan].pricePerUser;
    return users * price * 12;
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

    // Charts — defer to next frame so the panel has rendered and canvases have dimensions
    requestAnimationFrame(() => {
        drawSavingsChart(r);
        drawProjectionChart(r);
    });
}

function generateValueStory(r) {
    const scenarioText = r.scenario === 'new'
        ? `by implementing Wrike for ${r.verticalName}`
        : r.scenario === 'existing'
        ? `through their existing Wrike deployment for ${r.verticalName}`
        : `by expanding Wrike to additional ${r.verticalName} workflows`;

    const hoursSavedPerUserWeek = r.users > 0 ? (r.totalWeeklyHoursSaved).toFixed(1) : '0';
    const hoursSavedPerUserYear = r.users > 0 ? (r.totalWeeklyHoursSaved * 52).toFixed(0) : '0';
    const savingsPerUser = r.users > 0 ? formatCurrency(r.totalAnnualSavings / r.users) : '$0';
    const netPerUser = r.users > 0 ? formatCurrency(r.netBenefit / r.users) : '$0';
    const prodPct = r.totalAnnualSavings > 0 ? Math.round((r.totalProductivitySavings / r.totalAnnualSavings) * 100) : 0;
    const costPct = r.totalAnnualSavings > 0 ? Math.round((r.totalCostAvoidance / r.totalAnnualSavings) * 100) : 0;

    const year1Savings = r.totalAnnualSavings * 0.7;
    const year2Savings = r.totalAnnualSavings * 0.9;
    const year3Savings = r.totalAnnualSavings * 1.0;
    const cumulative3Year = (year1Savings + year2Savings + year3Savings) - (r.annualInvestment * 3);

    return `
        <div class="story-block">
            <div class="story-headline">
                <h3>The Bottom Line</h3>
                <p class="story-lead"><strong>${r.company}</strong> stands to save <strong>${formatCurrency(r.totalAnnualSavings)} per year</strong> ${scenarioText} — that's <strong>${savingsPerUser} in value per employee</strong> across ${r.users} users.</p>
            </div>

            <div class="story-section">
                <h4>What This Means for Your Team</h4>
                <p>Right now, every employee loses roughly <strong>${hoursSavedPerUserWeek} hours each week</strong> to manual coordination, status chasing, and process inefficiencies. That adds up to <strong>${hoursSavedPerUserYear} hours per person per year</strong> — time your team could spend on higher-value work.</p>
                <p>With Wrike in place, your organization recovers that time and redirects it toward revenue-generating activities, strategic initiatives, and faster delivery.</p>
            </div>

            <div class="story-section">
                <h4>Where the Value Comes From</h4>
                <div class="story-value-split">
                    <div class="story-value-item">
                        <span class="story-value-num">${formatCurrency(r.totalProductivitySavings)}</span>
                        <span class="story-value-label">Productivity Recovery (${prodPct}%)</span>
                        <p>Time savings from eliminating manual status updates, reducing unnecessary meetings, and streamlining handoffs and approvals.</p>
                    </div>
                    <div class="story-value-item">
                        <span class="story-value-num">${formatCurrency(r.totalCostAvoidance)}</span>
                        <span class="story-value-label">Cost Avoidance & Recovery (${costPct}%)</span>
                        <p>Reduced project delays, fewer errors and rework cycles, recovered revenue from faster execution, and tool consolidation savings.</p>
                    </div>
                </div>
            </div>

            <div class="story-section">
                <h4>The Investment</h4>
                <p>Wrike costs <strong>${formatCurrency(r.annualInvestment)} per year</strong> for ${r.users} users. After factoring in this investment, the <strong>net benefit is ${formatCurrency(r.netBenefit)} in Year 1</strong>, with the investment paying for itself in just <strong>${r.paybackMonths} months</strong>.</p>
                <p>That means for every dollar invested in Wrike, your organization gets back <strong>${netPerUser} per employee</strong> in annual net value.</p>
            </div>

            <div class="story-section">
                <h4>3-Year Outlook</h4>
                <p>As adoption matures (70% value capture in Year 1, ramping to 100% by Year 3), the <strong>cumulative net benefit over 3 years reaches ${formatCurrency(cumulative3Year)}</strong>. This accounts for the typical ramp-up period as teams adopt new workflows and the platform reaches full utilization.</p>
            </div>

            <div class="story-section story-next-steps">
                <h4>Recommended Next Steps</h4>
                <ol>
                    <li><strong>Validate assumptions</strong> — Review the hours and cost estimates above with your team leads to confirm they reflect your reality.</li>
                    <li><strong>Pilot with a focused team</strong> — Start with one department or workflow to prove value quickly.</li>
                    <li><strong>Measure outcomes at 90 days</strong> — Track time savings and delivery improvements against these projections.</li>
                    <li><strong>Scale across the organization</strong> — Use pilot results to build the case for broader rollout.</li>
                </ol>
            </div>
        </div>
    `;
}

// ---- Charts (Canvas-based, no external libraries) ----
function drawSavingsChart(r) {
    const canvas = document.getElementById('savings-chart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(rect.width, 360);
    const h = 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

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
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(rect.width, 360);
    const h = 280;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

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
    document.getElementById('quote-per-user-display').textContent = plan.customPricing ? 'Custom/user/mo' : '$' + monthlyPerUser.toFixed(0) + '/user/mo';
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
        const paybackMo = totalAnnual > 0 ? Math.ceil((totalAnnual / roiResults.totalAnnualSavings) * 12) : 0;
        document.getElementById('quote-roi-payback').textContent = paybackMo + ' months';
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
                        <span class="mini-kpi-label">Net Benefit</span>
                        <span class="mini-kpi-value">${formatCurrencyShort(a.netBenefit)}</span>
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
    const wrikeLogo = '<svg width="90" height="44" viewBox="0 0 124 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_6002_277)"><path d="M66.2113 35.0665H69.7493V29.6051C69.7493 26.3051 72.6847 26.363 74.2204 26.6139V22.8893C71.7711 22.6771 70.3131 23.3525 69.6521 24.6648H69.5744L69.5938 22.9472H66.1919V35.0667H66.2113Z" fill="#162136"/><path d="M84.562 35.0667H86.7781L90.4328 30.493L93.5237 35.0667H97.6448L92.785 28.0421L97.0422 22.9281H92.9405L88.0806 29.0263H88.0028L88.0417 16.8684H84.562V35.0667Z" fill="#162136"/><path d="M44.614 35.0666H47.355L51.5539 27.2701L55.6168 35.0666H58.3967L64.6368 22.928H60.4961L56.6665 30.6666L53.0313 22.928H50.0571L46.2275 30.7052L42.5923 22.928H38.4517L44.614 35.0666Z" fill="#162136"/><path d="M78.9443 21.1912C80.1468 21.1912 81.1216 20.2235 81.1216 19.0298C81.1216 17.8361 80.1468 16.8684 78.9443 16.8684C77.7419 16.8684 76.7671 17.8361 76.7671 19.0298C76.7671 20.2235 77.7419 21.1912 78.9443 21.1912Z" fill="#162136"/><path d="M80.694 22.928H77.1948V35.0666H80.694V22.928Z" fill="#162136"/><path d="M8.20331 23.9702C9.89456 23.9702 10.6916 24.279 11.9163 25.4948L18.4869 32.0176C18.6812 32.2106 18.7201 32.2878 18.759 32.4035C18.7784 32.4421 18.7784 32.5 18.7784 32.5386C18.7784 32.5772 18.7784 32.6351 18.759 32.6737C18.7201 32.7895 18.6812 32.8667 18.4869 33.0597L13.9963 37.5369C13.8019 37.7299 13.7242 37.7685 13.6075 37.8071C13.5686 37.8264 13.5103 37.8264 13.4714 37.8264C13.4326 37.8264 13.3742 37.8264 13.3354 37.8071C13.2187 37.7685 13.141 37.7299 12.9466 37.5369L0.213646 24.8965C-0.155706 24.5299 -0.0196293 23.9702 0.602437 23.9702H8.20331Z" fill="#00E05C"/><path d="M26.749 16C25.0577 16 24.2607 16.3088 23.036 17.5246L16.4654 24.0474C16.271 24.2404 16.2321 24.3176 16.1933 24.4333C16.1738 24.4719 16.1738 24.5298 16.1738 24.5684C16.1738 24.607 16.1738 24.6649 16.1933 24.7035C16.2321 24.8193 16.271 24.8965 16.4654 25.0895L20.956 29.5474C21.1504 29.7404 21.2281 29.779 21.3448 29.8176C21.3836 29.8369 21.442 29.8369 21.4808 29.8369C21.5197 29.8369 21.578 29.8369 21.6169 29.8176C21.7335 29.779 21.8113 29.7404 22.0057 29.5474L34.7386 16.907C35.108 16.5404 34.9719 15.9807 34.3498 15.9807H26.749V16Z" fill="#00E05C"/><path d="M107.579 31.0334C107.151 31.6702 106.257 32.4614 104.76 32.4614C103.01 32.4614 101.766 31.4579 101.494 30.0106H111C111 29.7597 111 29.393 111 29.0456C111 25.5334 108.453 22.7158 104.682 22.7158C100.988 22.7158 98.1309 25.4948 98.1309 29.0456C98.1309 32.5772 100.93 35.3755 104.682 35.3755C107.481 35.3755 109.173 34.2755 110.261 32.8667L107.579 31.0334ZM104.488 25.4369C106.101 25.4369 107.229 26.3246 107.617 27.5983H101.338C101.727 26.3246 102.835 25.4369 104.488 25.4369Z" fill="#162136"/></g><defs><clipPath id="clip0_6002_277"><rect width="111" height="22" fill="white" transform="translate(0 16)"/></clipPath></defs></svg>';
    const styles = `
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #162136; padding: 40px; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; margin-bottom: 0; }
            .header-accent { height: 3px; background: #00E05C; margin-bottom: 30px; }
            .logo-block { display: flex; flex-direction: column; }
            .logo-subtitle { font-size: 12px; color: #657594; margin-top: 4px; letter-spacing: 0.5px; text-transform: uppercase; }
            .title { font-size: 22px; font-weight: 700; color: #162136; }
            .subtitle { font-size: 14px; color: #657594; }
            .meta { display: flex; gap: 30px; margin-bottom: 30px; }
            .meta-item { font-size: 13px; }
            .meta-item strong { display: block; color: #2B3A57; }
            .kpi-row { display: flex; gap: 16px; margin-bottom: 30px; }
            .kpi { flex: 1; background: #F2F5FA; border-radius: 8px; padding: 16px; text-align: center; }
            .kpi-label { font-size: 11px; text-transform: uppercase; color: #657594; display: block; }
            .kpi-value { font-size: 24px; font-weight: 700; }
            .kpi.green .kpi-value { color: #00E05C; }
            .kpi.blue .kpi-value { color: #6366F1; }
            .kpi.purple .kpi-value { color: #8B5CF6; }
            .kpi.teal .kpi-value { color: #10B981; }
            .section { margin-bottom: 24px; }
            .section h3 { font-size: 16px; color: #162136; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 12px; }
            table { width: 100%; border-collapse: collapse; font-size: 13px; }
            th { background: #F2F5FA; padding: 8px 12px; text-align: left; font-weight: 600; }
            td { padding: 8px 12px; border-bottom: 1px solid #eee; }
            .total-row td { font-weight: 700; background: #F2F5FA; }
            .story { background: #F2F5FA; padding: 20px; border-radius: 8px; font-size: 13px; line-height: 1.8; }
            .story strong { color: #00E05C; }
            .story h3 { border: none; font-size: 18px; margin-bottom: 8px; }
            .story h4 { font-size: 14px; margin: 16px 0 6px; color: #162136; }
            .story ol, .story ul { padding-left: 20px; margin: 8px 0; }
            .story li { margin-bottom: 4px; }
            .story-value-split { display: flex; gap: 20px; margin: 12px 0; }
            .story-value-item { flex: 1; background: #fff; border: 1px solid #eee; border-radius: 8px; padding: 16px; }
            .story-value-num { font-size: 22px; font-weight: 700; color: #00E05C; display: block; }
            .story-value-label { font-size: 12px; color: #657594; text-transform: uppercase; display: block; margin-bottom: 6px; }
            .story-value-item p { font-size: 12px; color: #657594; margin: 0; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 11px; color: #657594; text-align: center; }
            .quote-line { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
            .quote-line.total { font-weight: 700; font-size: 18px; border-top: 2px solid #00E05C; padding-top: 12px; }
            @media print { body { padding: 20px; } }
        </style>
    `;

    if (type === 'roi' && r) {
        return `<!DOCTYPE html><html><head><title>Business Case — ${r.company}</title>${styles}</head><body>
            <div class="header">
                <div class="logo-block">${wrikeLogo}<span class="logo-subtitle">Value Engineering</span></div>
                <div style="text-align:right;"><div class="title">Business Case Analysis</div><div class="subtitle">${r.verticalName}</div></div>
            </div>
            <div class="header-accent"></div>
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
                <div class="kpi teal"><span class="kpi-label">Payback</span><span class="kpi-value">${r.paybackMonths} months</span></div>
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
            <div class="section"><h3>Executive Summary & Business Case</h3><div class="story">${generateValueStory(r)}</div></div>
            <div class="footer">Confidential — Wrike Value Engineering | ${new Date().toLocaleDateString()}</div>
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
            <div class="logo-block">${wrikeLogo}<span class="logo-subtitle">Value Engineering</span></div>
            <div style="text-align:right;"><div class="title">Pricing Quote</div><div class="subtitle">${new Date().toLocaleDateString()}</div></div>
        </div>
        <div class="header-accent"></div>
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
            ${document.getElementById('quote-discount-line').style.display !== 'none' ? `<div class="quote-line" style="color:#00E05C;"><span>Discount</span><span>${document.getElementById('quote-discount-display').textContent}</span></div>` : ''}
            <div class="quote-line total"><span>Total Annual Investment</span><span>${total}</span></div>
            <div class="quote-line"><span>Effective Monthly</span><span>${monthly}</span></div>
            <div class="quote-line"><span>Effective Per User / Month</span><span>${perUser}</span></div>
        </div>
        ${roiResults ? `
        <div class="section">
            <h3>Linked Value Analysis</h3>
            <div class="quote-line"><span>Projected Annual Savings</span><span style="color:#00E05C;">${formatCurrency(roiResults.totalAnnualSavings)}</span></div>
            <div class="quote-line"><span>Net Benefit (Year 1)</span><span style="color:#00E05C;">${formatCurrency(roiResults.netBenefit)}</span></div>
            <div class="quote-line"><span>Payback Period</span><span>${roiResults.paybackMonths} months</span></div>
        </div>` : ''}
        <div class="footer">
            <p>This quote is valid for 30 days from the date above.</p>
            <p>Confidential — Wrike Value Engineering | ${new Date().toLocaleDateString()}</p>
        </div>
    </body></html>`;
}

// ---- PowerPoint Export ----
function exportROIPPTX() {
    if (!roiResults) {
        showToast('Complete an ROI analysis first', 'warning');
        return;
    }
    const r = roiResults;
    const scenarioLabel = r.scenario === 'new' ? 'New Customer' : r.scenario === 'existing' ? 'Existing Customer' : 'Expansion';
    const savingsPerUser = r.users > 0 ? formatCurrency(r.totalAnnualSavings / r.users) : '$0';
    const prodPct = r.totalAnnualSavings > 0 ? Math.round((r.totalProductivitySavings / r.totalAnnualSavings) * 100) : 0;
    const costPct = r.totalAnnualSavings > 0 ? Math.round((r.totalCostAvoidance / r.totalAnnualSavings) * 100) : 0;
    const year1Net = (r.totalAnnualSavings * 0.7) - r.annualInvestment;
    const year2Net = (r.totalAnnualSavings * 0.9) - r.annualInvestment;
    const year3Net = r.totalAnnualSavings - r.annualInvestment;
    const cumulative3Year = year1Net + year2Net + year3Net;

    const pptx = new PptxGenJS();
    pptx.author = r.preparedBy || 'Wrike Value Engineering';
    pptx.company = 'Wrike';
    pptx.subject = `Business Case for ${r.company}`;
    pptx.title = `${r.company} — Wrike Business Case`;

    const BRAND = {
        dark: '162136', darkSecondary: '2B3A57', white: 'FFFFFF',
        green: '00E05C', greenLight: 'A4F5C6', greenMedium: '62ED9C',
        surface: 'F2F5FA', muted: '657594',
        purple: '6366F1', pink: 'EC4899', teal: '10B981',
        yellow: 'FFE77B', golden: 'FFCF00', pinkSoft: 'FFCACD',
        tableBorder: 'DCE1EA'
    };

    let slideNum = 0;

    function addBrandChrome(slide) {
        slideNum++;

        // Green accent bar at top
        slide.addShape(pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: 0.05,
            fill: { color: BRAND.green }
        });

        // Subtle green glow in top-right corner
        slide.addShape(pptx.ShapeType.ellipse, {
            x: 7.5, y: -0.8, w: 3.5, h: 2.5,
            fill: { type: 'solid', color: BRAND.greenLight },
            transparency: 88
        });

        // "wrike" text logo at top-left
        slide.addText([
            { text: '✓ ', options: { color: BRAND.green, fontSize: 11, bold: true } },
            { text: 'wrike', options: { color: BRAND.dark, fontSize: 11, bold: true } }
        ], { x: 0.4, y: 0.2, w: 1.2, h: 0.3, fontFace: 'Arial' });

        // Decorative geometric shapes in green (top-right area)
        slide.addShape(pptx.ShapeType.ellipse, {
            x: 9.05, y: 0.25, w: 0.18, h: 0.18,
            line: { color: BRAND.green, width: 1 },
            fill: { type: 'none' }
        });
        slide.addText('+', {
            x: 9.35, y: 0.15, w: 0.2, h: 0.2,
            fontSize: 10, color: BRAND.green, fontFace: 'Arial', align: 'center'
        });

        // Page number at bottom-right
        slide.addText(String(slideNum), {
            x: 9.0, y: 6.9, w: 0.5, h: 0.25,
            fontSize: 8, color: BRAND.muted, fontFace: 'Arial', align: 'right'
        });
    }

    pptx.defineSlideMaster({
        title: 'WRIKE_BRAND',
        background: { color: BRAND.white }
    });

    // --- Slide 1: Title ---
    const slide1 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide1);

    slide1.addShape(pptx.ShapeType.rect, {
        x: 0.6, y: 1.8, w: 0.06, h: 1.6,
        fill: { color: BRAND.green }
    });
    slide1.addText('Business Case', {
        x: 0.9, y: 1.4, w: 8.5, h: 0.7,
        fontSize: 38, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });
    slide1.addText(r.company, {
        x: 0.9, y: 2.1, w: 8.5, h: 0.6,
        fontSize: 28, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });
    slide1.addText(`${r.verticalName}  |  ${scenarioLabel}  |  ${r.users} Users`, {
        x: 0.9, y: 2.85, w: 8.5, h: 0.4,
        fontSize: 14, color: BRAND.muted, fontFace: 'Arial'
    });
    slide1.addShape(pptx.ShapeType.rect, {
        x: 0.9, y: 3.45, w: 3.0, h: 0.02,
        fill: { color: BRAND.surface }
    });
    slide1.addText(`Prepared by ${r.preparedBy || 'Wrike Value Engineering'}  —  ${r.date}`, {
        x: 0.9, y: 3.65, w: 8.5, h: 0.3,
        fontSize: 11, color: BRAND.muted, fontFace: 'Arial'
    });

    // --- Slide 2: Executive Snapshot ---
    const slide2 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide2);

    slide2.addText('Executive Snapshot', {
        x: 0.6, y: 0.55, w: 8.8, h: 0.5,
        fontSize: 24, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });

    const kpis = [
        { label: 'Annual Savings', value: formatCurrency(r.totalAnnualSavings), accent: BRAND.green },
        { label: 'Wrike Investment', value: formatCurrency(r.annualInvestment), accent: BRAND.purple },
        { label: 'Net Benefit (Yr 1)', value: formatCurrency(r.netBenefit), accent: BRAND.pink },
        { label: 'Payback Period', value: r.paybackMonths + ' months', accent: BRAND.teal }
    ];
    kpis.forEach((kpi, i) => {
        const x = 0.5 + i * 2.35;
        slide2.addShape(pptx.ShapeType.roundRect, {
            x: x, y: 1.25, w: 2.15, h: 1.25,
            fill: { color: BRAND.surface }, rectRadius: 0.08,
            line: { color: BRAND.tableBorder, width: 0.5 }
        });
        slide2.addShape(pptx.ShapeType.rect, {
            x: x, y: 1.25, w: 2.15, h: 0.05,
            fill: { color: kpi.accent }
        });
        slide2.addText(kpi.label, {
            x: x, y: 1.42, w: 2.15, h: 0.28,
            fontSize: 9, color: BRAND.muted, fontFace: 'Arial', align: 'center'
        });
        slide2.addText(kpi.value, {
            x: x, y: 1.72, w: 2.15, h: 0.5,
            fontSize: 22, bold: true, color: BRAND.dark, fontFace: 'Arial', align: 'center'
        });
    });

    slide2.addText(`${r.company} can save ${formatCurrency(r.totalAnnualSavings)} per year (${savingsPerUser} per employee) by implementing Wrike for ${r.verticalName}. The investment pays for itself in just ${r.paybackMonths} months.`, {
        x: 0.6, y: 2.75, w: 8.8, h: 0.7,
        fontSize: 12, color: BRAND.dark, fontFace: 'Arial', lineSpacingMultiple: 1.4
    });

    // Value split cards
    slide2.addShape(pptx.ShapeType.roundRect, {
        x: 0.5, y: 3.65, w: 4.3, h: 1.55,
        fill: { color: BRAND.surface }, rectRadius: 0.08,
        line: { color: BRAND.tableBorder, width: 0.5 }
    });
    slide2.addShape(pptx.ShapeType.rect, {
        x: 0.5, y: 3.65, w: 4.3, h: 0.05,
        fill: { color: BRAND.green }
    });
    slide2.addText(formatCurrency(r.totalProductivitySavings), {
        x: 0.7, y: 3.8, w: 3.9, h: 0.4,
        fontSize: 20, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });
    slide2.addText(`Productivity Recovery (${prodPct}%)`, {
        x: 0.7, y: 4.2, w: 3.9, h: 0.25,
        fontSize: 10, color: BRAND.muted, fontFace: 'Arial'
    });
    slide2.addText('Time savings from streamlined handoffs,\nfewer meetings, and automated reporting', {
        x: 0.7, y: 4.5, w: 3.9, h: 0.5,
        fontSize: 10, color: BRAND.dark, fontFace: 'Arial', lineSpacingMultiple: 1.3
    });

    slide2.addShape(pptx.ShapeType.roundRect, {
        x: 5.2, y: 3.65, w: 4.3, h: 1.55,
        fill: { color: BRAND.surface }, rectRadius: 0.08,
        line: { color: BRAND.tableBorder, width: 0.5 }
    });
    slide2.addShape(pptx.ShapeType.rect, {
        x: 5.2, y: 3.65, w: 4.3, h: 0.05,
        fill: { color: BRAND.green }
    });
    slide2.addText(formatCurrency(r.totalCostAvoidance), {
        x: 5.4, y: 3.8, w: 3.9, h: 0.4,
        fontSize: 20, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });
    slide2.addText(`Cost Avoidance (${costPct}%)`, {
        x: 5.4, y: 4.2, w: 3.9, h: 0.25,
        fontSize: 10, color: BRAND.muted, fontFace: 'Arial'
    });
    slide2.addText('Reduced delays, fewer errors,\nrecovered revenue, and tool consolidation', {
        x: 5.4, y: 4.5, w: 3.9, h: 0.5,
        fontSize: 10, color: BRAND.dark, fontFace: 'Arial', lineSpacingMultiple: 1.3
    });

    // --- Slide 3: Productivity Breakdown ---
    const slide3 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide3);

    slide3.addText('Productivity Savings Breakdown', {
        x: 0.6, y: 0.55, w: 8.8, h: 0.5,
        fontSize: 24, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });

    const prodHeaderRow = [
        { text: 'Activity', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', fill: { color: BRAND.white } } },
        { text: 'Current (hrs/wk)', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', align: 'center', fill: { color: BRAND.white } } },
        { text: 'Saved (hrs/wk)', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', align: 'center', fill: { color: BRAND.white } } },
        { text: 'Annual Savings', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', align: 'right', fill: { color: BRAND.white } } }
    ];
    const prodRows = r.productivityItems.map(item => [
        { text: item.label, options: { fontSize: 10, color: BRAND.dark, fontFace: 'Arial' } },
        { text: item.currentHours.toFixed(1), options: { fontSize: 10, color: BRAND.dark, fontFace: 'Arial', align: 'center' } },
        { text: item.hoursSaved.toFixed(1), options: { fontSize: 10, color: BRAND.green, fontFace: 'Arial', align: 'center', bold: true } },
        { text: formatCurrency(item.annualSavings), options: { fontSize: 10, color: BRAND.dark, fontFace: 'Arial', align: 'right' } }
    ]);
    prodRows.push([
        { text: 'TOTAL', options: { fontSize: 10, bold: true, color: BRAND.dark, fontFace: 'Arial' } },
        { text: '', options: {} },
        { text: r.totalWeeklyHoursSaved.toFixed(1), options: { fontSize: 10, bold: true, color: BRAND.green, fontFace: 'Arial', align: 'center' } },
        { text: formatCurrency(r.totalProductivitySavings), options: { fontSize: 10, bold: true, color: BRAND.green, fontFace: 'Arial', align: 'right' } }
    ]);

    slide3.addTable(
        [prodHeaderRow, ...prodRows],
        {
            x: 0.5, y: 1.2, w: 9.0, colW: [4.2, 1.6, 1.6, 1.6],
            border: { type: 'solid', pt: 0.5, color: BRAND.tableBorder },
            fill: { color: BRAND.surface },
            rowH: 0.4,
            autoPage: false
        }
    );

    // --- Slide 4: Cost Avoidance ---
    const slide4 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide4);

    slide4.addText('Cost Avoidance & Recovery', {
        x: 0.6, y: 0.55, w: 8.8, h: 0.5,
        fontSize: 24, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });

    const costHeaderRow = [
        { text: 'Category', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', fill: { color: BRAND.white } } },
        { text: 'Annual Savings', options: { fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial', align: 'right', fill: { color: BRAND.white } } }
    ];
    const costItems = [
        ['Reduction in Project Delays', formatCurrency(r.delaySavings)],
        ['Reduction in Rework & Errors', formatCurrency(r.reworkSavings)],
        ['Revenue Risk Recovered', formatCurrency(r.revenueSavings)],
        ['Tool Consolidation Savings', formatCurrency(r.toolConsolidation)]
    ];
    const costRows = costItems.map(([cat, val]) => [
        { text: cat, options: { fontSize: 11, color: BRAND.dark, fontFace: 'Arial' } },
        { text: val, options: { fontSize: 11, color: BRAND.dark, fontFace: 'Arial', align: 'right' } }
    ]);
    costRows.push([
        { text: 'TOTAL COST AVOIDANCE', options: { fontSize: 11, bold: true, color: BRAND.green, fontFace: 'Arial' } },
        { text: formatCurrency(r.totalCostAvoidance), options: { fontSize: 11, bold: true, color: BRAND.green, fontFace: 'Arial', align: 'right' } }
    ]);

    slide4.addTable(
        [costHeaderRow, ...costRows],
        {
            x: 0.5, y: 1.2, w: 9.0, colW: [6.2, 2.8],
            border: { type: 'solid', pt: 0.5, color: BRAND.tableBorder },
            fill: { color: BRAND.surface },
            rowH: 0.45,
            autoPage: false
        }
    );

    // --- Slide 5: 3-Year Projection ---
    const slide5 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide5);

    slide5.addText('3-Year Value Projection', {
        x: 0.6, y: 0.55, w: 8.8, h: 0.5,
        fontSize: 24, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });

    const projHeaderRow = ['', 'Savings', 'Investment', 'Net Benefit'].map((h, i) => ({
        text: h,
        options: {
            fontSize: 9, bold: true, color: BRAND.muted, fontFace: 'Arial',
            align: i === 0 ? 'left' : 'right',
            fill: { color: BRAND.white }
        }
    }));
    const projRows = [
        ['Year 1 (70% adoption)', formatCurrency(r.totalAnnualSavings * 0.7), formatCurrency(r.annualInvestment), formatCurrency(year1Net)],
        ['Year 2 (90% adoption)', formatCurrency(r.totalAnnualSavings * 0.9), formatCurrency(r.annualInvestment), formatCurrency(year2Net)],
        ['Year 3 (100% adoption)', formatCurrency(r.totalAnnualSavings), formatCurrency(r.annualInvestment), formatCurrency(year3Net)],
        ['3-Year Total', formatCurrency(r.totalAnnualSavings * 2.6), formatCurrency(r.annualInvestment * 3), formatCurrency(cumulative3Year)]
    ].map((row, idx) => row.map((cell, ci) => ({
        text: cell,
        options: {
            fontSize: 11,
            bold: idx === 3,
            color: (idx === 3 && ci === 3) ? BRAND.green : BRAND.dark,
            fontFace: 'Arial',
            align: ci === 0 ? 'left' : 'right'
        }
    })));

    slide5.addTable(
        [projHeaderRow, ...projRows],
        {
            x: 0.5, y: 1.2, w: 9.0, colW: [3.2, 2.0, 2.0, 1.8],
            border: { type: 'solid', pt: 0.5, color: BRAND.tableBorder },
            fill: { color: BRAND.surface },
            rowH: 0.45,
            autoPage: false
        }
    );

    slide5.addShape(pptx.ShapeType.roundRect, {
        x: 2.0, y: 3.8, w: 6.0, h: 0.6,
        fill: { color: BRAND.surface }, rectRadius: 0.08,
        line: { color: BRAND.green, width: 1 }
    });
    slide5.addText(`Cumulative 3-Year Net Benefit: ${formatCurrency(cumulative3Year)}`, {
        x: 2.0, y: 3.8, w: 6.0, h: 0.6,
        fontSize: 16, bold: true, color: BRAND.dark, fontFace: 'Arial', align: 'center', valign: 'middle'
    });

    // --- Slide 6: Recommended Next Steps ---
    const slide6 = pptx.addSlide({ masterName: 'WRIKE_BRAND' });
    addBrandChrome(slide6);

    slide6.addText('Recommended Next Steps', {
        x: 0.6, y: 0.55, w: 8.8, h: 0.5,
        fontSize: 24, bold: true, color: BRAND.dark, fontFace: 'Arial'
    });

    const steps = [
        { num: '1', title: 'Validate Assumptions', desc: 'Review the hours and cost estimates with your team leads to confirm they reflect your reality.' },
        { num: '2', title: 'Pilot with a Focused Team', desc: 'Start with one department or workflow to prove value quickly and build internal champions.' },
        { num: '3', title: 'Measure Outcomes at 90 Days', desc: 'Track time savings and delivery improvements against these projections to quantify real impact.' },
        { num: '4', title: 'Scale Across the Organization', desc: 'Use pilot results to build the case for broader rollout and maximize organizational value.' }
    ];

    steps.forEach((step, i) => {
        const y = 1.3 + i * 1.25;
        slide6.addShape(pptx.ShapeType.roundRect, {
            x: 0.5, y: y, w: 9.0, h: 1.05,
            fill: { color: BRAND.surface }, rectRadius: 0.08,
            line: { color: BRAND.tableBorder, width: 0.5 }
        });
        slide6.addShape(pptx.ShapeType.ellipse, {
            x: 0.8, y: y + 0.27, w: 0.5, h: 0.5,
            fill: { color: BRAND.green }
        });
        slide6.addText(step.num, {
            x: 0.8, y: y + 0.27, w: 0.5, h: 0.5,
            fontSize: 16, bold: true, color: BRAND.white, fontFace: 'Arial', align: 'center', valign: 'middle'
        });
        slide6.addText(step.title, {
            x: 1.6, y: y + 0.15, w: 7.6, h: 0.35,
            fontSize: 14, bold: true, color: BRAND.dark, fontFace: 'Arial'
        });
        slide6.addText(step.desc, {
            x: 1.6, y: y + 0.55, w: 7.6, h: 0.35,
            fontSize: 11, color: BRAND.muted, fontFace: 'Arial'
        });
    });

    pptx.writeFile({ fileName: `${r.company.replace(/[^a-zA-Z0-9]/g, '_')}_Wrike_Business_Case.pptx` })
        .then(() => showToast('PowerPoint exported successfully!', 'success'))
        .catch(err => {
            console.error('PPTX export error:', err);
            showToast('Export failed — check console for details', 'warning');
        });
}

// ---- Improved PDF Export ----
function exportROIPDFDirect() {
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

// ---- AI Agent PDF Export ----
function exportAIAgentPDF() {
    const data = getEventRowData();
    if (data.length === 0) {
        showToast('Add at least one event before exporting', 'warning');
        return;
    }
    const hourlyRate = parseFloat(document.getElementById('ai-hourly-rate').value) || 50;
    const plan = document.getElementById('ai-plan-type').value;
    const numUsers = parseInt(document.getElementById('ai-num-users').value) || 1;
    const unitsPerUser = PLAN_UNITS_MAP[plan] || 10;

    let totalHours = 0, totalValue = 0, totalActions = 0;
    const rows = data.map(row => {
        const hrs = (row.minSaved / 60) * row.eventsPerMonth * 12;
        const val = hrs * row.rate;
        const acts = row.actions * row.eventsPerMonth;
        totalHours += hrs; totalValue += val; totalActions += acts;
        return { ...row, hoursSaved: hrs, annualValue: val, monthlyActions: acts };
    });
    const monthlyAllotted = numUsers * unitsPerUser;
    const excess = Math.max(0, (totalActions - monthlyAllotted) * 12);
    const spend = Math.ceil(excess / 10000) * 1000;
    const net = totalValue - spend;

    const wrikeLogo = '<svg width="90" height="44" viewBox="0 0 124 60" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M66.2113 35.0665H69.7493V29.6051C69.7493 26.3051 72.6847 26.363 74.2204 26.6139V22.8893C71.7711 22.6771 70.3131 23.3525 69.6521 24.6648H69.5744L69.5938 22.9472H66.1919V35.0667H66.2113Z" fill="#162136"/><path d="M84.562 35.0667H86.7781L90.4328 30.493L93.5237 35.0667H97.6448L92.785 28.0421L97.0422 22.9281H92.9405L88.0806 29.0263H88.0028L88.0417 16.8684H84.562V35.0667Z" fill="#162136"/><path d="M44.614 35.0666H47.355L51.5539 27.2701L55.6168 35.0666H58.3967L64.6368 22.928H60.4961L56.6665 30.6666L53.0313 22.928H50.0571L46.2275 30.7052L42.5923 22.928H38.4517L44.614 35.0666Z" fill="#162136"/><path d="M78.9443 21.1912C80.1468 21.1912 81.1216 20.2235 81.1216 19.0298C81.1216 17.8361 80.1468 16.8684 78.9443 16.8684C77.7419 16.8684 76.7671 17.8361 76.7671 19.0298C76.7671 20.2235 77.7419 21.1912 78.9443 21.1912Z" fill="#162136"/><path d="M80.694 22.928H77.1948V35.0666H80.694V22.928Z" fill="#162136"/><path d="M8.20331 23.9702C9.89456 23.9702 10.6916 24.279 11.9163 25.4948L18.4869 32.0176C18.6812 32.2106 18.7201 32.2878 18.759 32.4035C18.7784 32.4421 18.7784 32.5 18.7784 32.5386C18.7784 32.5772 18.7784 32.6351 18.759 32.6737C18.7201 32.7895 18.6812 32.8667 18.4869 33.0597L13.9963 37.5369C13.8019 37.7299 13.7242 37.7685 13.6075 37.8071C13.5686 37.8264 13.5103 37.8264 13.4714 37.8264C13.4326 37.8264 13.3742 37.8264 13.3354 37.8071C13.2187 37.7685 13.141 37.7299 12.9466 37.5369L0.213646 24.8965C-0.155706 24.5299 -0.0196293 23.9702 0.602437 23.9702H8.20331Z" fill="#00E05C"/><path d="M26.749 16C25.0577 16 24.2607 16.3088 23.036 17.5246L16.4654 24.0474C16.271 24.2404 16.2321 24.3176 16.1933 24.4333C16.1738 24.4719 16.1738 24.5298 16.1738 24.5684C16.1738 24.607 16.1738 24.6649 16.1933 24.7035C16.2321 24.8193 16.271 24.8965 16.4654 25.0895L20.956 29.5474C21.1504 29.7404 21.2281 29.779 21.3448 29.8176C21.3836 29.8369 21.442 29.8369 21.4808 29.8369C21.5197 29.8369 21.578 29.8369 21.6169 29.8176C21.7335 29.779 21.8113 29.7404 22.0057 29.5474L34.7386 16.907C35.108 16.5404 34.9719 15.9807 34.3498 15.9807H26.749V16Z" fill="#00E05C"/><path d="M107.579 31.0334C107.151 31.6702 106.257 32.4614 104.76 32.4614C103.01 32.4614 101.766 31.4579 101.494 30.0106H111C111 29.7597 111 29.393 111 29.0456C111 25.5334 108.453 22.7158 104.682 22.7158C100.988 22.7158 98.1309 25.4948 98.1309 29.0456C98.1309 32.5772 100.93 35.3755 104.682 35.3755C107.481 35.3755 109.173 34.2755 110.261 32.8667L107.579 31.0334ZM104.488 25.4369C106.101 25.4369 107.229 26.3246 107.617 27.5983H101.338C101.727 26.3246 102.835 25.4369 104.488 25.4369Z" fill="#162136"/></g><defs><clipPath id="clip0"><rect width="111" height="22" fill="white" transform="translate(0 16)"/></clipPath></defs></svg>';
    const html = `<!DOCTYPE html><html><head><title>Wrike AI Agent — Time Savings</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Helvetica Neue',Arial,sans-serif; color:#162136; padding:40px; line-height:1.6; }
        .header { display:flex; justify-content:space-between; align-items:center; padding-bottom:20px; }
        .header-accent { height:3px; background:#00E05C; margin-bottom:30px; }
        .logo-block { display:flex; flex-direction:column; }
        .logo-subtitle { font-size:12px; color:#657594; margin-top:4px; letter-spacing:0.5px; text-transform:uppercase; }
        .title { font-size:22px; font-weight:700; }
        .subtitle { font-size:14px; color:#657594; }
        .meta { display:flex; gap:30px; margin-bottom:24px; }
        .meta-item { font-size:13px; }
        .meta-item strong { display:block; color:#2B3A57; }
        .kpi-row { display:flex; gap:16px; margin-bottom:24px; }
        .kpi { flex:1; background:#F2F5FA; border-radius:8px; padding:16px; text-align:center; }
        .kpi-label { font-size:11px; text-transform:uppercase; color:#657594; display:block; }
        .kpi-value { font-size:24px; font-weight:700; }
        .kpi.green .kpi-value { color:#00E05C; }
        .kpi.blue .kpi-value { color:#6366F1; }
        .section { margin-bottom:24px; }
        .section h3 { font-size:16px; border-bottom:1px solid #eee; padding-bottom:8px; margin-bottom:12px; }
        table { width:100%; border-collapse:collapse; font-size:12px; }
        th { background:#F2F5FA; padding:8px 10px; text-align:left; font-weight:600; }
        td { padding:8px 10px; border-bottom:1px solid #eee; }
        .total-row td { font-weight:700; background:#F2F5FA; }
        .cons-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:12px; }
        .cons-box { background:#F2F5FA; border-radius:8px; padding:14px; }
        .cons-label { font-size:11px; color:#657594; text-transform:uppercase; display:block; }
        .cons-val { font-size:18px; font-weight:700; color:#162136; display:block; margin-top:2px; }
        .cons-val.green { color:#00E05C; }
        .footer { margin-top:40px; padding-top:20px; border-top:1px solid #eee; font-size:11px; color:#657594; text-align:center; }
        @media print { body { padding:20px; } }
    </style></head><body>
    <div class="header">
        <div class="logo-block">${wrikeLogo}<span class="logo-subtitle">AI Agent Time Savings</span></div>
        <div style="text-align:right;"><div class="title">AI Agent Value Analysis</div><div class="subtitle">${new Date().toLocaleDateString()}</div></div>
    </div>
    <div class="header-accent"></div>
    <div class="meta">
        <div class="meta-item"><strong>Wrike Plan</strong>${plan}</div>
        <div class="meta-item"><strong>Users</strong>${numUsers}</div>
        <div class="meta-item"><strong>Default Rate</strong>$${hourlyRate}/hr</div>
    </div>
    <div class="kpi-row">
        <div class="kpi green"><span class="kpi-label">Annual Hours Saved</span><span class="kpi-value">${Math.round(totalHours).toLocaleString()}</span></div>
        <div class="kpi green"><span class="kpi-label">Annual Value</span><span class="kpi-value">${formatCurrency(totalValue)}</span></div>
        <div class="kpi blue"><span class="kpi-label">Working Days</span><span class="kpi-value">${Math.round(totalHours / 8)}</span></div>
        <div class="kpi blue"><span class="kpi-label">FTE Equivalent</span><span class="kpi-value">${(totalHours / 2080).toFixed(1)}</span></div>
    </div>
    <div class="section"><h3>Event Breakdown</h3>
        <table><thead><tr><th>Event</th><th>Team</th><th>Events/Mo</th><th>Min Saved</th><th>$/hr</th><th>Actions/Evt</th><th>Hours/Yr</th><th>Annual Value</th></tr></thead>
        <tbody>${rows.map(r => `<tr><td>${r.label}</td><td>${r.team}</td><td>${r.eventsPerMonth}</td><td>${r.minSaved}</td><td>$${r.rate}</td><td>${r.actions}</td><td>${Math.round(r.hoursSaved)}</td><td>${formatCurrency(r.annualValue)}</td></tr>`).join('')}
        <tr class="total-row"><td colspan="6">Total</td><td>${Math.round(totalHours)}</td><td>${formatCurrency(totalValue)}</td></tr></tbody></table>
    </div>
    <div class="section"><h3>AI Agent Consumption & ROI</h3>
        <div class="cons-grid">
            <div class="cons-box"><span class="cons-label">Monthly Actions Required</span><span class="cons-val">${Math.round(totalActions).toLocaleString()}</span></div>
            <div class="cons-box"><span class="cons-label">Monthly Allotted (${plan})</span><span class="cons-val">${monthlyAllotted.toLocaleString()}</span></div>
            <div class="cons-box"><span class="cons-label">Est. Annual Overage Spend</span><span class="cons-val">${formatCurrency(spend)}</span></div>
            <div class="cons-box"><span class="cons-label">Net Annual Value</span><span class="cons-val green">${formatCurrency(net)}</span></div>
        </div>
    </div>
    <div class="footer">Confidential — Wrike Value Engineering | ${new Date().toLocaleDateString()}</div>
    </body></html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
}

// ---- AI Agent PPTX Export ----
function exportAIAgentPPTX() {
    const data = getEventRowData();
    if (data.length === 0) {
        showToast('Add at least one event before exporting', 'warning');
        return;
    }
    const hourlyRate = parseFloat(document.getElementById('ai-hourly-rate').value) || 50;
    const plan = document.getElementById('ai-plan-type').value;
    const numUsers = parseInt(document.getElementById('ai-num-users').value) || 1;
    const unitsPerUser = PLAN_UNITS_MAP[plan] || 10;

    let totalHours = 0, totalValue = 0, totalActions = 0;
    const rows = data.map(row => {
        const hrs = (row.minSaved / 60) * row.eventsPerMonth * 12;
        const val = hrs * row.rate;
        const acts = row.actions * row.eventsPerMonth;
        totalHours += hrs; totalValue += val; totalActions += acts;
        return { ...row, hoursSaved: hrs, annualValue: val, monthlyActions: acts };
    });
    const monthlyAllotted = numUsers * unitsPerUser;
    const excess = Math.max(0, (totalActions - monthlyAllotted) * 12);
    const spend = Math.ceil(excess / 10000) * 1000;
    const net = totalValue - spend;

    const pptx = new PptxGenJS();
    pptx.author = 'Wrike Value Engineering';
    pptx.company = 'Wrike';
    pptx.title = 'Wrike AI Agent — Time Savings Analysis';

    const B = { dark: '162136', white: 'FFFFFF', green: '00E05C', surface: 'F2F5FA', muted: '657594', purple: '6366F1', teal: '10B981', tableBorder: 'DCE1EA' };

    function chrome(slide, title) {
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.05, fill: { color: B.green } });
        slide.addText([{ text: 'wrike', options: { fontSize: 14, bold: true, color: B.green } }], { x: 0.5, y: 0.15, w: 1.5, h: 0.35 });
        if (title) slide.addText(title, { x: 0.5, y: 0.55, w: 9, h: 0.4, fontSize: 20, bold: true, color: B.dark, fontFace: 'Arial' });
        slide.addText('Confidential — Wrike Value Engineering', { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 8, color: B.muted, fontFace: 'Arial', align: 'center' });
    }

    // Slide 1 - Title
    const s1 = pptx.addSlide();
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: B.dark } });
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: B.green } });
    s1.addText([{ text: 'wrike', options: { fontSize: 28, bold: true, color: B.green } }], { x: 0.8, y: 1.0, w: 3, h: 0.6 });
    s1.addText('AI Agent Time Savings Analysis', { x: 0.8, y: 1.8, w: 8.5, h: 0.6, fontSize: 28, bold: true, color: B.white, fontFace: 'Arial' });
    s1.addText(`Plan: ${plan}  |  ${numUsers} Users  |  ${new Date().toLocaleDateString()}`, { x: 0.8, y: 2.5, w: 8.5, h: 0.35, fontSize: 14, color: B.muted, fontFace: 'Arial' });

    // Slide 2 - KPIs
    const s2 = pptx.addSlide();
    chrome(s2, 'Annual Impact Summary');
    const kpis = [
        { label: 'Hours Saved', value: Math.round(totalHours).toLocaleString(), color: B.green },
        { label: 'Annual Value', value: formatCurrency(totalValue), color: B.green },
        { label: 'Working Days', value: String(Math.round(totalHours / 8)), color: B.purple },
        { label: 'FTE Equivalent', value: (totalHours / 2080).toFixed(1), color: B.teal },
    ];
    kpis.forEach((kpi, i) => {
        const x = 0.5 + i * 2.35;
        s2.addShape(pptx.ShapeType.roundRect, { x, y: 1.2, w: 2.15, h: 1.3, fill: { color: B.surface }, rectRadius: 0.08 });
        s2.addText(kpi.label, { x, y: 1.3, w: 2.15, h: 0.3, fontSize: 10, color: B.muted, fontFace: 'Arial', align: 'center', bold: true });
        s2.addText(kpi.value, { x, y: 1.65, w: 2.15, h: 0.55, fontSize: 28, color: kpi.color, fontFace: 'Arial', align: 'center', bold: true });
    });

    // Consumption row
    const cons = [
        { label: 'Monthly Actions Required', value: Math.round(totalActions).toLocaleString() },
        { label: 'Monthly Allotted', value: monthlyAllotted.toLocaleString() },
        { label: 'Est. Overage Spend', value: formatCurrency(spend) },
        { label: 'Net Annual Value', value: formatCurrency(net) },
    ];
    cons.forEach((c, i) => {
        const x = 0.5 + i * 2.35;
        s2.addShape(pptx.ShapeType.roundRect, { x, y: 2.8, w: 2.15, h: 1.1, fill: { color: B.surface }, rectRadius: 0.08 });
        s2.addText(c.label, { x, y: 2.85, w: 2.15, h: 0.3, fontSize: 9, color: B.muted, fontFace: 'Arial', align: 'center', bold: true });
        s2.addText(c.value, { x, y: 3.15, w: 2.15, h: 0.45, fontSize: 20, color: B.dark, fontFace: 'Arial', align: 'center', bold: true });
    });

    // Slide 3 - Event Table
    const s3 = pptx.addSlide();
    chrome(s3, 'Event Breakdown');
    const tableRows = [
        [{ text: 'Event', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9 } },
         { text: 'Team', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9 } },
         { text: 'Evt/Mo', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9, align: 'center' } },
         { text: 'Min', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9, align: 'center' } },
         { text: 'Hrs/Yr', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9, align: 'center' } },
         { text: 'Value', options: { bold: true, fill: B.surface, color: B.dark, fontSize: 9, align: 'right' } }]
    ];
    rows.forEach(r => {
        tableRows.push([
            { text: r.label, options: { fontSize: 8, color: B.dark } },
            { text: r.team, options: { fontSize: 8, color: B.muted } },
            { text: String(r.eventsPerMonth), options: { fontSize: 8, align: 'center' } },
            { text: String(r.minSaved), options: { fontSize: 8, align: 'center' } },
            { text: String(Math.round(r.hoursSaved)), options: { fontSize: 8, align: 'center', color: B.green, bold: true } },
            { text: formatCurrency(r.annualValue), options: { fontSize: 8, align: 'right', color: B.green, bold: true } }
        ]);
    });
    tableRows.push([
        { text: 'Total', options: { bold: true, fill: B.surface, fontSize: 9 } },
        { text: '', options: { fill: B.surface } },
        { text: '', options: { fill: B.surface } },
        { text: '', options: { fill: B.surface } },
        { text: String(Math.round(totalHours)), options: { bold: true, fill: B.surface, fontSize: 9, align: 'center', color: B.green } },
        { text: formatCurrency(totalValue), options: { bold: true, fill: B.surface, fontSize: 9, align: 'right', color: B.green } }
    ]);
    s3.addTable(tableRows, { x: 0.5, y: 1.1, w: 9, colW: [3.2, 1.3, 0.9, 0.8, 0.9, 1.2], border: { pt: 0.5, color: B.tableBorder }, rowH: 0.32, fontFace: 'Arial' });

    pptx.writeFile({ fileName: 'Wrike_AI_Agent_Time_Savings.pptx' })
        .then(() => showToast('PowerPoint exported!', 'success'))
        .catch(err => { console.error(err); showToast('Export failed', 'warning'); });
}

// ---- Quote PPTX Export ----
function exportQuotePPTX() {
    const plan = PLANS[selectedPlan];
    const customer = document.getElementById('quote-customer').value || 'Customer';
    const users = document.getElementById('quote-users').value;
    const total = document.getElementById('quote-total-display').textContent;
    const monthly = document.getElementById('quote-monthly-display').textContent;
    const perUser = document.getElementById('quote-effective-per-user').textContent;

    const pptx = new PptxGenJS();
    pptx.author = 'Wrike Value Engineering';
    pptx.company = 'Wrike';
    pptx.title = `Pricing Quote — ${customer}`;

    const B = { dark: '162136', white: 'FFFFFF', green: '00E05C', surface: 'F2F5FA', muted: '657594', purple: '6366F1', tableBorder: 'DCE1EA' };

    function chrome(slide, title) {
        slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.05, fill: { color: B.green } });
        slide.addText([{ text: 'wrike', options: { fontSize: 14, bold: true, color: B.green } }], { x: 0.5, y: 0.15, w: 1.5, h: 0.35 });
        if (title) slide.addText(title, { x: 0.5, y: 0.55, w: 9, h: 0.4, fontSize: 20, bold: true, color: B.dark, fontFace: 'Arial' });
        slide.addText('Confidential — Wrike Value Engineering', { x: 0.5, y: 5.2, w: 9, h: 0.3, fontSize: 8, color: B.muted, fontFace: 'Arial', align: 'center' });
    }

    // Slide 1 - Title
    const s1 = pptx.addSlide();
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: '100%', fill: { color: B.dark } });
    s1.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: '100%', h: 0.08, fill: { color: B.green } });
    s1.addText([{ text: 'wrike', options: { fontSize: 28, bold: true, color: B.green } }], { x: 0.8, y: 1.0, w: 3, h: 0.6 });
    s1.addText('Pricing Quote', { x: 0.8, y: 1.8, w: 8.5, h: 0.6, fontSize: 28, bold: true, color: B.white, fontFace: 'Arial' });
    s1.addText(`${customer}  |  ${new Date().toLocaleDateString()}`, { x: 0.8, y: 2.5, w: 8.5, h: 0.35, fontSize: 14, color: B.muted, fontFace: 'Arial' });

    // Slide 2 - Quote Details
    const s2 = pptx.addSlide();
    chrome(s2, `Quote for ${customer}`);

    const lineItems = [
        ['Plan', `${plan.name} — ${plan.customPricing ? 'Custom pricing' : '$' + plan.pricePerUser + '/user/mo'}`],
        ['Licensed Users', users],
    ];

    const baseTxt = document.getElementById('quote-base-display').textContent;
    lineItems.push(['Base License', baseTxt]);

    if (document.getElementById('quote-addons-line').style.display !== 'none') {
        lineItems.push(['Add-Ons', document.getElementById('quote-addons-display').textContent]);
    }
    if (document.getElementById('quote-services-line').style.display !== 'none') {
        lineItems.push(['Professional Services', document.getElementById('quote-services-display').textContent]);
    }
    if (document.getElementById('quote-discount-line').style.display !== 'none') {
        lineItems.push(['Discount', document.getElementById('quote-discount-display').textContent]);
    }

    const tableRows = lineItems.map(([label, value]) => [
        { text: label, options: { fontSize: 11, color: B.dark, fontFace: 'Arial' } },
        { text: value, options: { fontSize: 11, color: B.dark, fontFace: 'Arial', align: 'right' } }
    ]);
    tableRows.push([
        { text: 'Total Annual Investment', options: { fontSize: 13, bold: true, color: B.dark, fill: B.surface } },
        { text: total, options: { fontSize: 13, bold: true, color: B.green, fill: B.surface, align: 'right' } }
    ]);
    tableRows.push([
        { text: 'Effective Monthly', options: { fontSize: 11, color: B.muted } },
        { text: monthly, options: { fontSize: 11, color: B.muted, align: 'right' } }
    ]);
    tableRows.push([
        { text: 'Effective Per User / Month', options: { fontSize: 11, color: B.muted } },
        { text: perUser, options: { fontSize: 11, color: B.muted, align: 'right' } }
    ]);
    s2.addTable(tableRows, { x: 1.0, y: 1.2, w: 8, colW: [4.5, 3.5], border: { pt: 0.5, color: B.tableBorder }, rowH: 0.38, fontFace: 'Arial' });

    if (roiResults) {
        s2.addText('Linked Value Analysis', { x: 1.0, y: 1.2 + tableRows.length * 0.38 + 0.3, w: 8, h: 0.35, fontSize: 14, bold: true, color: B.dark, fontFace: 'Arial' });
        const roiY = 1.2 + tableRows.length * 0.38 + 0.7;
        const roiItems = [
            { label: 'Annual Savings', value: formatCurrency(roiResults.totalAnnualSavings) },
            { label: 'Net Benefit', value: formatCurrency(roiResults.netBenefit) },
            { label: 'Payback', value: roiResults.paybackMonths + ' months' },
        ];
        roiItems.forEach((item, i) => {
            const x = 1.0 + i * 2.8;
            s2.addShape(pptx.ShapeType.roundRect, { x, y: roiY, w: 2.5, h: 0.9, fill: { color: B.surface }, rectRadius: 0.06 });
            s2.addText(item.label, { x, y: roiY + 0.05, w: 2.5, h: 0.25, fontSize: 9, color: B.muted, align: 'center', fontFace: 'Arial', bold: true });
            s2.addText(item.value, { x, y: roiY + 0.35, w: 2.5, h: 0.4, fontSize: 18, color: B.green, align: 'center', fontFace: 'Arial', bold: true });
        });
    }

    pptx.writeFile({ fileName: `${customer.replace(/[^a-zA-Z0-9]/g, '_')}_Wrike_Quote.pptx` })
        .then(() => showToast('Quote PowerPoint exported!', 'success'))
        .catch(err => { console.error(err); showToast('Export failed', 'warning'); });
}

// ---- AI Agent ROI Calculator ----
// ---- Wrike AI Agent Event Descriptions ----
const AI_EVENT_OPTIONS = [
    { value: '', label: '— Select an event —' },
    { value: 'intake-review', label: '[Intake] Reviewing & routing inbound requests', defaultMin: 15, defaultActions: 3, icon: 'fa-inbox' },
    { value: 'triage-prioritize', label: '[Triage] Prioritize inbound requests', defaultMin: 10, defaultActions: 2, icon: 'fa-sort-amount-down' },
    { value: 'risk-consolidate', label: '[Risk] Consolidating project updates to understand risk', defaultMin: 20, defaultActions: 2, icon: 'fa-exclamation-triangle' },
    { value: 'follow-up-missing', label: 'Manual follow-up on missing fields / incomplete submissions', defaultMin: 8, defaultActions: 2, icon: 'fa-clipboard-check' },
    { value: 'back-schedule', label: 'Back-scheduling tasks according to lead times', defaultMin: 12, defaultActions: 2, icon: 'fa-calendar-alt' },
    { value: 'consolidate-feedback', label: 'Consolidating feedback from team members or stakeholders', defaultMin: 15, defaultActions: 2, icon: 'fa-comments' },
    { value: 'assign-requests', label: 'Assign inbound requests to specific role, team or individual', defaultMin: 5, defaultActions: 1, icon: 'fa-user-plus' },
    { value: 'status-change', label: 'Automatic status changes based on conditions', defaultMin: 3, defaultActions: 1, icon: 'fa-exchange-alt' },
    { value: 'custom-field-update', label: 'Classify & update custom fields on tasks', defaultMin: 5, defaultActions: 2, icon: 'fa-edit' },
    { value: 'validate-completeness', label: 'Validate request completeness before work begins', defaultMin: 10, defaultActions: 3, icon: 'fa-check-double' },
    { value: 'risk-scan', label: 'Scan projects for overdue or blocked items & post summary', defaultMin: 20, defaultActions: 2, icon: 'fa-search' },
    { value: 'rename-items', label: 'Standardize task/project naming based on content', defaultMin: 3, defaultActions: 1, icon: 'fa-font' },
    { value: 'date-management', label: 'Push due dates when tasks are blocked', defaultMin: 5, defaultActions: 1, icon: 'fa-clock' },
    { value: 'custom', label: 'Custom scenario (type your own)', defaultMin: 10, defaultActions: 2, icon: 'fa-cog' }
];

const AI_VERTICAL_PRESETS = {
    custom: { label: 'Custom', events: [] },
    plm: {
        label: 'Product Lifecycle Management',
        events: [
            { event: 'intake-review', team: 'Engineering', eventsPerMonth: 80, minSaved: 15, actions: 3 },
            { event: 'risk-consolidate', team: 'Program Mgmt', eventsPerMonth: 20, minSaved: 25, actions: 2 },
            { event: 'back-schedule', team: 'Engineering', eventsPerMonth: 40, minSaved: 12, actions: 2 },
            { event: 'status-change', team: 'QA', eventsPerMonth: 120, minSaved: 3, actions: 1 },
            { event: 'validate-completeness', team: 'Supply Chain', eventsPerMonth: 60, minSaved: 10, actions: 3 },
        ]
    },
    csd: {
        label: 'Client Service Delivery',
        events: [
            { event: 'intake-review', team: 'Account Mgmt', eventsPerMonth: 100, minSaved: 15, actions: 3 },
            { event: 'triage-prioritize', team: 'Service Ops', eventsPerMonth: 100, minSaved: 10, actions: 2 },
            { event: 'assign-requests', team: 'Operations', eventsPerMonth: 100, minSaved: 5, actions: 1 },
            { event: 'follow-up-missing', team: 'Account Mgmt', eventsPerMonth: 60, minSaved: 8, actions: 2 },
            { event: 'consolidate-feedback', team: 'Delivery', eventsPerMonth: 30, minSaved: 15, actions: 2 },
        ]
    },
    marketing: {
        label: 'Marketing — Creative & Campaigns',
        events: [
            { event: 'intake-review', team: 'Creative Ops', eventsPerMonth: 120, minSaved: 15, actions: 3 },
            { event: 'triage-prioritize', team: 'Marketing Ops', eventsPerMonth: 120, minSaved: 10, actions: 2 },
            { event: 'validate-completeness', team: 'Creative', eventsPerMonth: 80, minSaved: 10, actions: 3 },
            { event: 'custom-field-update', team: 'Campaign Mgmt', eventsPerMonth: 60, minSaved: 5, actions: 2 },
            { event: 'consolidate-feedback', team: 'Stakeholders', eventsPerMonth: 40, minSaved: 15, actions: 2 },
        ]
    },
    pmo: {
        label: 'Project Management Office',
        events: [
            { event: 'risk-consolidate', team: 'PMO', eventsPerMonth: 30, minSaved: 25, actions: 2 },
            { event: 'risk-scan', team: 'PMO', eventsPerMonth: 20, minSaved: 20, actions: 2 },
            { event: 'status-change', team: 'Project Leads', eventsPerMonth: 200, minSaved: 3, actions: 1 },
            { event: 'assign-requests', team: 'PMO', eventsPerMonth: 50, minSaved: 5, actions: 1 },
            { event: 'date-management', team: 'Delivery Mgrs', eventsPerMonth: 40, minSaved: 5, actions: 1 },
        ]
    }
};

const PLAN_UNITS_MAP = { Business: 3, Enterprise: 5, Pinnacle: 10, Apex: 100 };

let aiEventRowCount = 0;

function buildEventSelectOptions(selectedValue) {
    return AI_EVENT_OPTIONS.map(opt =>
        `<option value="${opt.value}" ${opt.value === selectedValue ? 'selected' : ''}>${opt.label}</option>`
    ).join('');
}

function addAIEventRow(preset) {
    const container = document.getElementById('ai-event-rows');
    const idx = aiEventRowCount++;
    const hourlyRate = parseFloat(document.getElementById('ai-hourly-rate').value) || 50;
    const ev = preset || { event: '', team: '', eventsPerMonth: '', minSaved: '', actions: '', rate: hourlyRate };

    const row = document.createElement('div');
    row.className = 'ai-event-row';
    row.id = 'ai-evt-row-' + idx;
    row.innerHTML = `
        <select class="ai-evt-select" data-idx="${idx}" onchange="onEventSelect(this); calculateAIAgents()">
            ${buildEventSelectOptions(ev.event)}
        </select>
        <input type="text" class="ai-evt-team" placeholder="e.g. Marketing" value="${ev.team || ''}" onchange="calculateAIAgents()">
        <input type="number" class="ai-evt-num" placeholder="0" min="0" value="${ev.eventsPerMonth || ''}" onchange="calculateAIAgents()">
        <input type="number" class="ai-evt-num" placeholder="0" min="0" value="${ev.minSaved || ''}" onchange="calculateAIAgents()">
        <input type="number" class="ai-evt-num ai-evt-rate" placeholder="${hourlyRate}" min="0" value="${ev.rate || ''}" onchange="calculateAIAgents()">
        <input type="number" class="ai-evt-num" placeholder="0" min="0" value="${ev.actions || ''}" onchange="calculateAIAgents()">
        <button class="ai-evt-remove" onclick="removeAIEventRow(${idx})"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(row);
}

function onEventSelect(selectEl) {
    const opt = AI_EVENT_OPTIONS.find(o => o.value === selectEl.value);
    if (!opt || !opt.value) return;
    const row = selectEl.closest('.ai-event-row');
    const inputs = row.querySelectorAll('input[type="number"].ai-evt-num');
    if (inputs[1] && !inputs[1].value) inputs[1].value = opt.defaultMin;
    if (inputs[3] && !inputs[3].value) inputs[3].value = opt.defaultActions;
}

function removeAIEventRow(idx) {
    const row = document.getElementById('ai-evt-row-' + idx);
    if (row) row.remove();
    calculateAIAgents();
}

function getEventRowData() {
    const rows = document.querySelectorAll('.ai-event-row');
    const data = [];
    const defaultRate = parseFloat(document.getElementById('ai-hourly-rate').value) || 50;
    rows.forEach(row => {
        const select = row.querySelector('select');
        const teamInput = row.querySelector('.ai-evt-team');
        const nums = row.querySelectorAll('input[type="number"].ai-evt-num');
        const evtLabel = select.options[select.selectedIndex]?.text || '';
        const evtValue = select.value;
        const eventsPerMonth = parseFloat(nums[0]?.value) || 0;
        const minSaved = parseFloat(nums[1]?.value) || 0;
        const rate = parseFloat(nums[2]?.value) || defaultRate;
        const actions = parseFloat(nums[3]?.value) || 0;
        if (evtValue) {
            data.push({ label: evtLabel, eventsPerMonth, minSaved, rate, actions, team: teamInput?.value || '' });
        }
    });
    return data;
}

function calculateAIAgents() {
    const eventRows = getEventRowData();
    const numUsers = parseInt(document.getElementById('ai-num-users').value) || 1;
    const plan = document.getElementById('ai-plan-type').value;
    const unitsPerUser = PLAN_UNITS_MAP[plan] || 10;

    let totalHoursSaved = 0;
    let totalValue = 0;
    let totalActionsPerMonth = 0;
    const breakdown = [];

    eventRows.forEach(row => {
        const hoursSaved = (row.minSaved / 60) * row.eventsPerMonth * 12;
        const value = hoursSaved * row.rate;
        const monthlyActions = row.actions * row.eventsPerMonth;
        totalHoursSaved += hoursSaved;
        totalValue += value;
        totalActionsPerMonth += monthlyActions;
        breakdown.push({ label: row.label, team: row.team, hoursSaved, value, monthlyActions });
    });

    const workingDays = totalHoursSaved / 8;
    const fte = totalHoursSaved / 2080;

    const monthlyAllotted = numUsers * unitsPerUser;
    const excessAnnual = Math.max(0, (totalActionsPerMonth - monthlyAllotted) * 12);
    const annualSpend = Math.ceil(excessAnnual / 10000) * 1000;
    const monthlyPPU = numUsers > 0 ? annualSpend / numUsers / 12 : 0;
    const netValue = totalValue - annualSpend;
    const roi = annualSpend > 0 ? ((totalValue - annualSpend) / annualSpend) : (totalValue > 0 ? Infinity : 0);

    document.getElementById('ai-kpi-hours').textContent = Math.round(totalHoursSaved).toLocaleString();
    document.getElementById('ai-kpi-total-value').textContent = formatCurrency(totalValue);
    document.getElementById('ai-equiv-days').textContent = Math.round(workingDays).toLocaleString();
    document.getElementById('ai-equiv-fte').textContent = fte.toFixed(1);

    document.getElementById('ai-cons-required').textContent = Math.round(totalActionsPerMonth).toLocaleString();
    document.getElementById('ai-cons-allotted').textContent = Math.round(monthlyAllotted).toLocaleString();
    document.getElementById('ai-cons-spend').textContent = formatCurrency(annualSpend);
    document.getElementById('ai-cons-ppu').textContent = '$' + monthlyPPU.toFixed(2) + '/user/mo';

    const maxBar = Math.max(totalActionsPerMonth, monthlyAllotted, 1);
    document.getElementById('ai-cons-bar-allotted').style.width = (monthlyAllotted / maxBar * 100) + '%';
    document.getElementById('ai-cons-bar-required').style.width = (totalActionsPerMonth / maxBar * 100) + '%';

    document.getElementById('ai-net-value').textContent = formatCurrency(netValue);
    const roiText = roi === Infinity ? 'Included in plan' : (roi * 100).toFixed(0) + '%';
    document.getElementById('ai-roi-pct').textContent = roiText;

    const breakdownList = document.getElementById('ai-breakdown-list');
    const maxVal = Math.max(...breakdown.map(b => b.value), 1);
    breakdownList.innerHTML = breakdown.map(item => {
        const barPct = (item.value / maxVal) * 100;
        const opt = AI_EVENT_OPTIONS.find(o => item.label.includes(o.label));
        const icon = opt ? opt.icon : 'fa-robot';
        return `
            <div class="ai-breakdown-item">
                <div class="ai-bd-label">
                    <i class="fas ${icon}"></i>
                    <span>${item.label}</span>
                </div>
                <div class="ai-bd-bar-container">
                    <div class="ai-bd-bar" style="width: ${barPct}%"></div>
                </div>
                <div class="ai-bd-values">
                    <span class="ai-bd-hours">${Math.round(item.hoursSaved)} hrs/yr</span>
                    <span class="ai-bd-savings">${formatCurrencyShort(item.value)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function applyAIVertical(verticalKey) {
    document.querySelectorAll('.ai-vtab').forEach(t => t.classList.remove('active'));
    const tab = document.querySelector(`.ai-vtab[data-ai-vertical="${verticalKey}"]`);
    if (tab) tab.classList.add('active');

    document.getElementById('ai-event-rows').innerHTML = '';
    aiEventRowCount = 0;

    const preset = AI_VERTICAL_PRESETS[verticalKey];
    if (preset && preset.events.length > 0) {
        preset.events.forEach(ev => addAIEventRow(ev));
    } else {
        addAIEventRow();
        addAIEventRow();
        addAIEventRow();
    }
    calculateAIAgents();
}

function resetAICalculator() {
    document.getElementById('ai-hourly-rate').value = 50;
    document.getElementById('ai-plan-type').value = 'Pinnacle';
    document.getElementById('ai-num-users').value = 25;
    applyAIVertical('custom');
    showToast('AI Calculator reset', 'info');
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
    applyAIVertical('custom');
});
