// State Storage Keys
const STORAGE_KEYS = {
    GOATS: 'bondu_agro_goats',
    TRANSACTIONS: 'bondu_agro_transactions',
    FEED_STOCK: 'bondu_agro_feed_stock',
    FEED_LOGS: 'bondu_agro_feed_logs',
    THEME: 'bondu_agro_theme',
    GH_ENABLED: 'bondu_agro_gh_enabled',
    GH_USERNAME: 'bondu_agro_gh_username',
    GH_REPO: 'bondu_agro_gh_repo',
    GH_TOKEN: 'bondu_agro_gh_token',
    GH_SHA: 'bondu_agro_gh_sha'
};

// GitHub Cloud Sync Config
let ghConfig = {
    enabled: false,
    username: '',
    repo: '',
    token: '',
    sha: ''
};

// Default Mock Data for rich initial aesthetics
const DEFAULT_GOATS = [
    {
        code: 'GT-001',
        breed: 'Black Bengal',
        gender: 'Female',
        age: '১.৫ বছর',
        weight: 25.5,
        purchasePrice: 7500,
        purchaseDate: '2026-01-10',
        status: 'Pregnant',
        img: '',
        vaccineDate: '2026-06-25',
        dewormingDate: '2026-06-18',
        breedingDate: '2026-02-15',
        kidsCount: null,
        soldPrice: null,
        soldDate: null
    },
    {
        code: 'GT-002',
        breed: 'Jamunapari',
        gender: 'Male',
        age: '২ বছর',
        weight: 48.0,
        purchasePrice: 18000,
        purchaseDate: '2026-02-15',
        status: 'Healthy',
        img: '',
        vaccineDate: '2026-07-10',
        dewormingDate: '2026-06-30',
        breedingDate: '',
        kidsCount: null,
        soldPrice: null,
        soldDate: null
    },
    {
        code: 'GT-003',
        breed: 'Black Bengal',
        gender: 'Female',
        age: '৮ মাস',
        weight: 14.2,
        purchasePrice: 4800,
        purchaseDate: '2026-03-20',
        status: 'Sick',
        img: '',
        vaccineDate: '2026-06-14', // Due soon
        dewormingDate: '2026-06-08', // Overdue
        breedingDate: '',
        kidsCount: null,
        soldPrice: null,
        soldDate: null
    },
    {
        code: 'GT-004',
        breed: 'Beetal',
        gender: 'Female',
        age: '১ বছর ২ মাস',
        weight: 34.0,
        purchasePrice: 14500,
        purchaseDate: '2026-04-05',
        status: 'Healthy',
        img: '',
        vaccineDate: '2026-08-05',
        dewormingDate: '2026-07-20',
        breedingDate: '2026-05-01',
        kidsCount: null,
        soldPrice: null,
        soldDate: null
    }
];

const DEFAULT_TRANSACTIONS = [
    { id: 1, date: '2026-01-10', type: 'expense', category: 'ছাগল কেনার হিসাব', amount: 7500, note: 'GT-001 ক্রয়ের টাকা' },
    { id: 2, date: '2026-02-15', type: 'expense', category: 'ছাগল কেনার হিসাব', amount: 18000, note: 'GT-002 ক্রয়ের টাকা' },
    { id: 3, date: '2026-03-20', type: 'expense', category: 'ছাগল কেনার হিসাব', amount: 4800, note: 'GT-003 ক্রয়ের টাকা' },
    { id: 4, date: '2026-04-05', type: 'expense', category: 'ছাগল কেনার হিসাব', amount: 14500, note: 'GT-004 ক্রয়ের টাকা' },
    { id: 5, date: '2026-05-10', type: 'expense', category: 'খাবার খরচ', amount: 3200, note: '১০০ কেজি গমের ভুষি' },
    { id: 6, date: '2026-05-18', type: 'expense', category: 'চিকিৎসা খরচ', amount: 1200, note: 'ভ্যাকসিন ও কৃমিনাশক ঔষধ' },
    { id: 7, date: '2026-05-25', type: 'expense', category: 'শ্রমিক খরচ', amount: 8000, note: 'মে মাসের শ্রমিক বেতন' },
    { id: 8, date: '2026-06-02', type: 'income', category: 'ছাগল বিক্রির হিসাব', amount: 12500, note: 'পূর্বতন ছাগল বিক্রি (GT-000)' }
];

const DEFAULT_FEED_STOCK = [
    { name: 'গমের ভুষি (Wheat Bran)', quantity: 75.0, minThreshold: 15.0, pricePerKg: 35 },
    { name: 'ভুট্টা গুড়া (Maize Crush)', quantity: 8.5, minThreshold: 12.0, pricePerKg: 40 }, // Under threshold
    { name: 'সাইলেজ (Silage Feed)', quantity: 120.0, minThreshold: 30.0, pricePerKg: 12 },
    { name: 'খড় (Straw)', quantity: 45.0, minThreshold: 10.0, pricePerKg: 8 }
];

const DEFAULT_FEED_LOGS = [
    { date: '2026-06-11T08:30', name: 'গমের ভুষি (Wheat Bran)', quantity: 5.0, note: 'সকালের খাবার' },
    { date: '2026-06-11T16:00', name: 'খড় (Straw)', quantity: 3.5, note: 'বকেয়া বৈকালিক খাবার' },
    { date: '2026-06-12T08:00', name: 'সাইলেজ (Silage Feed)', quantity: 10.0, note: 'সকালের খাবার' }
];

// In-Memory Application State
let appState = {
    goats: [],
    transactions: [],
    feedStock: [],
    feedLogs: [],
    theme: 'dark'
};

// Chart Instance
let financeChartInstance = null;

// Initialize App
function initApp() {
    // Load GitHub settings
    ghConfig.enabled = localStorage.getItem(STORAGE_KEYS.GH_ENABLED) === 'true';
    ghConfig.username = localStorage.getItem(STORAGE_KEYS.GH_USERNAME) || '';
    ghConfig.repo = localStorage.getItem(STORAGE_KEYS.GH_REPO) || '';
    ghConfig.token = localStorage.getItem(STORAGE_KEYS.GH_TOKEN) || '';
    ghConfig.sha = localStorage.getItem(STORAGE_KEYS.GH_SHA) || '';

    // Load or set default data
    appState.goats = JSON.parse(localStorage.getItem(STORAGE_KEYS.GOATS)) || DEFAULT_GOATS;
    appState.transactions = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || DEFAULT_TRANSACTIONS;
    appState.feedStock = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEED_STOCK)) || DEFAULT_FEED_STOCK;
    appState.feedLogs = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEED_LOGS)) || DEFAULT_FEED_LOGS;
    appState.theme = localStorage.getItem(STORAGE_KEYS.THEME) || 'dark';

    // Apply theme
    document.body.setAttribute('data-theme', appState.theme);
    updateThemeUI();

    // Event Listeners
    setupEventListeners();

    // Load settings values into UI
    loadSyncSettingsUI();

    // UI Initial Rendering
    refreshUI();

    // If GitHub Sync is enabled, fetch latest data
    if (ghConfig.enabled) {
        fetchFromGitHub();
    } else {
        updateSyncIndicatorUI('disabled');
    }

    // Start Timer Interval for real-time countdown alerts
    setInterval(updateCountdowns, 5000); // Ticks every 5s
    updateCountdowns();
}

function saveState(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    // Auto push changes if sync is active
    if (key !== STORAGE_KEYS.THEME && ghConfig.enabled) {
        pushToGitHub();
    }
}

// UI Refresh Orchestrator
function refreshUI() {
    renderDashboard();
    renderGoatsGrid();
    renderTransactionsTable();
    renderFeedStockSection();
    renderDetailedNotifications();
    populateBreedFilters();
}

// Navigation & Tabs System
function setupEventListeners() {
    // Sidebar & Mobile Nav Tabs Switch
    const tabs = document.querySelectorAll('.nav-links li, .mobile-nav-item');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('data-target');
            
            // Remove active classes
            document.querySelectorAll('.nav-links li').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.mobile-nav-item').forEach(t => t.classList.remove('active'));
            
            // Set active class
            const sidebarTab = document.querySelector(`.nav-links li[data-target="${targetId}"]`);
            if (sidebarTab) sidebarTab.classList.add('active');
            
            const mobileTab = document.querySelector(`.mobile-nav-item[data-target="${targetId}"]`);
            if (mobileTab) mobileTab.classList.add('active');
            
            document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            // Header info adjustment
            const titleMap = {
                'dashboard-section': { title: 'ড্যাশবোর্ড ওভারভিউ', subtitle: 'খামারের রিয়েল-টাইম তথ্য এবং রিপোর্ট' },
                'goats-section': { title: 'ছাগল তালিকা ও ট্র্যাক', subtitle: 'সক্রিয় এবং বিক্রিত ছাগলের বিবরণ' },
                'finance-section': { title: 'আয় ও ব্যয়ের হিসাব', subtitle: 'খামারের যাবতীয় আর্থিক ট্রানজেকশন রেকর্ড' },
                'feed-section': { title: 'খাদ্য ব্যবস্থাপনা', subtitle: 'খাদ্যের স্টক এবং দৈনিক খাবার খাওয়ানোর লগ' },
                'notifications-section': { title: 'নোটিফিকেশন ও কাউন্টডাউন', subtitle: 'জরুরি টিকা, কৃমিনাশক ও প্রসবের সময়সীমা' },
                'settings-section': { title: 'সিঙ্ক সেটিংস', subtitle: 'গিটহাব ক্লাউড সিঙ্ক কনফিগারেশন' }
            };
            
            document.getElementById('currentSectionTitle').innerText = titleMap[targetId].title;
            document.getElementById('currentSectionSubtitle').innerText = titleMap[targetId].subtitle;

            if (targetId === 'dashboard-section' && financeChartInstance) {
                // Redraw chart to fit dimensions properly
                if (financeChartInstance) {
                    financeChartInstance.resize();
                }
            }

            // Close mobile sidebar after click
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('active');
        });
    });

    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });

    // Theme Switcher
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
        appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', appState.theme);
        saveState(STORAGE_KEYS.THEME, appState.theme);
        updateThemeUI();
    });

    // Filter controls change handlers
    document.getElementById('searchGoatInput').addEventListener('input', renderGoatsGrid);
    document.getElementById('filterBreed').addEventListener('change', renderGoatsGrid);
    document.getElementById('filterGender').addEventListener('change', renderGoatsGrid);
    document.getElementById('filterStatus').addEventListener('change', renderGoatsGrid);

    document.getElementById('filterTransactionType').addEventListener('change', renderTransactionsTable);
    document.getElementById('filterTransactionCategory').addEventListener('change', renderTransactionsTable);

    document.getElementById('filterNotifType').addEventListener('change', renderDetailedNotifications);
    document.getElementById('filterNotifUrgency').addEventListener('change', renderDetailedNotifications);

    // Image Input preview converter
    document.getElementById('goatImageFile').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('goatImagePreview').src = e.target.result;
                document.getElementById('goatImagePreview').style.display = 'block';
                document.getElementById('goatImageBase64').value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Low stock warning banner redirect click
    document.getElementById('lowStockAlert').addEventListener('click', () => {
        navigateToSection('feed-section');
    });

    // Bell icon click redirect to notifications
    document.getElementById('bellIconBtn').addEventListener('click', () => {
        navigateToSection('notifications-section');
    });
}

function navigateToSection(sectionId, filterValue = null) {
    const tab = document.querySelector(`.nav-links li[data-target="${sectionId}"]`);
    if (tab) {
        tab.click();
        
        // Handle filter shortcut inputs
        if (sectionId === 'goats-section' && filterValue) {
            if (filterValue === 'male') {
                document.getElementById('filterGender').value = 'Male';
            } else if (filterValue === 'female') {
                document.getElementById('filterGender').value = 'Female';
            } else if (filterValue === 'kid') {
                document.getElementById('filterGender').value = 'Kid';
            } else if (filterValue === 'sick') {
                document.getElementById('filterStatus').value = 'Sick';
            }
            renderGoatsGrid();
        }
    }
}

function updateThemeUI() {
    const icon = document.getElementById('themeIcon');
    const text = document.getElementById('themeText');
    if (appState.theme === 'dark') {
        icon.setAttribute('data-lucide', 'sun');
        text.innerText = 'লাইট মোড';
    } else {
        icon.setAttribute('data-lucide', 'moon');
        text.innerText = 'ডার্ক মোড';
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Convert English numbers to Bengali numbers utility
function toBengaliNumber(num) {
    if (num === null || num === undefined) return '';
    const numStr = num.toString();
    const englishToBengali = {
        '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
        '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
        '.': '.'
    };
    return numStr.split('').map(char => englishToBengali[char] || char).join('');
}

// Gestation date calculator helper (~150 days)
function getExpectedDeliveryDate(breedingDateStr) {
    if (!breedingDateStr) return null;
    const date = new Date(breedingDateStr + 'T00:00:00');
    date.setDate(date.getDate() + 150);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

// ----------------- 1. DASHBOARD CONTROLLER -----------------
function renderDashboard() {
    // Total Goats
    const activeGoats = appState.goats.filter(g => g.status !== 'Sold');
    const soldGoats = appState.goats.filter(g => g.status === 'Sold');
    
    document.getElementById('dashTotalGoats').innerText = toBengaliNumber(activeGoats.length);
    document.getElementById('dashGoatSubtext').innerText = `সক্রিয়: ${toBengaliNumber(activeGoats.length)} | বিক্রি: ${toBengaliNumber(soldGoats.length)}`;

    // Gender breakdown
    const males = activeGoats.filter(g => g.gender === 'Male').length;
    const females = activeGoats.filter(g => g.gender === 'Female').length;
    document.getElementById('dashGenderRatio').innerText = `${toBengaliNumber(males)} / ${toBengaliNumber(females)}`;

    // Kids count
    const kids = activeGoats.filter(g => g.gender === 'Kid').length;
    document.getElementById('dashTotalKids').innerText = toBengaliNumber(kids);

    // Sick Goats count
    const sick = activeGoats.filter(g => g.status === 'Sick').length;
    document.getElementById('dashSickGoats').innerText = toBengaliNumber(sick);

    // Calculate Investments & Finance
    let totalGoatPurchaseCost = activeGoats.reduce((sum, g) => sum + (Number(g.purchasePrice) || 0), 0);
    let otherExpenses = appState.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    let totalInvestment = otherExpenses; // The transactions include purchases, let's keep totalExpenses directly
    document.getElementById('dashTotalInvestment').innerText = `৳${toBengaliNumber(totalInvestment)}`;

    // Estimated current assets
    // Active goats purchasing value + appreciation (active goats weight * estimated rate or purchase price)
    // For simplicity, purchase price of active goats
    let assetValue = activeGoats.reduce((sum, g) => sum + (Number(g.purchasePrice) || 0), 0);
    document.getElementById('dashAssetValue').innerText = `৳${toBengaliNumber(assetValue)}`;

    // Net Profit/Loss
    let totalIncome = appState.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    let netProfit = totalIncome - totalInvestment;
    const profitEl = document.getElementById('dashNetProfit');
    const profitSub = document.getElementById('dashProfitSubtext');
    const profitCard = document.getElementById('profitStatCard');

    profitEl.innerText = `৳${toBengaliNumber(Math.abs(netProfit))}`;
    
    if (netProfit >= 0) {
        profitEl.style.color = 'var(--success)';
        profitSub.innerText = 'নিট লাভ (মোট লাভ হয়েছে)';
        profitCard.classList.remove('danger');
    } else {
        profitEl.style.color = 'var(--danger)';
        profitSub.innerText = 'নিট ক্ষতি (লোকসান)';
        profitCard.classList.add('danger');
    }

    // Render stock status in dashboard side box
    renderDashboardFeedAlerts();

    // Render Charts
    renderFinanceAnalyticsChart();
}

function renderDashboardFeedAlerts() {
    const listContainer = document.getElementById('dashboardFeedList');
    listContainer.innerHTML = '';

    let anyLowStock = false;
    let lowStockNames = [];

    appState.feedStock.forEach(feed => {
        const isLow = feed.quantity <= feed.minThreshold;
        if (isLow) {
            anyLowStock = true;
            lowStockNames.push(feed.name.split(' ')[0]);
        }

        const percentage = Math.min((feed.quantity / (feed.minThreshold * 3)) * 100, 100);

        const card = document.createElement('div');
        card.className = 'feed-stock-card';
        card.innerHTML = `
            <div class="feed-stock-info">
                <span>${feed.name}</span>
                <span style="color: ${isLow ? 'var(--danger)' : 'var(--gold)'};">
                    ${toBengaliNumber(feed.quantity.toFixed(1))} কেজি
                    ${isLow ? ' (সংকটপূর্ণ)' : ''}
                </span>
            </div>
            <div class="feed-progress-bar">
                <div class="feed-progress-fill ${isLow ? 'danger' : ''}" style="width: ${percentage}%;"></div>
            </div>
        `;
        listContainer.appendChild(card);
    });

    // Low stock Alert banner trigger
    const alertBanner = document.getElementById('lowStockAlert');
    if (anyLowStock) {
        alertBanner.classList.add('active');
        document.getElementById('lowStockAlertMsg').innerText = `আপনার ${lowStockNames.join(', ')} খাবারের স্টক ফুরিয়ে যাচ্ছে। দ্রুত স্টক পূরণ করুন।`;
    } else {
        alertBanner.classList.remove('active');
    }
}

// ----------------- Chart.js Renderer -----------------
function renderFinanceAnalyticsChart() {
    const ctx = document.getElementById('financeChart').getContext('2d');

    // Aggregate transactions by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const incomes = Array(12).fill(0);
    const expenses = Array(12).fill(0);

    appState.transactions.forEach(t => {
        if (!t.date) return;
        const dateObj = new Date(t.date);
        const monthIndex = dateObj.getMonth();
        if (t.type === 'income') {
            incomes[monthIndex] += Number(t.amount) || 0;
        } else {
            expenses[monthIndex] += Number(t.amount) || 0;
        }
    });

    // Destroy existing chart to redraw
    if (financeChartInstance) {
        financeChartInstance.destroy();
    }

    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#800020';
    const goldColor = getComputedStyle(document.body).getPropertyValue('--gold').trim() || '#d4af37';
    const textColor = getComputedStyle(document.body).getPropertyValue('--text-main').trim() || '#ffffff';
    const gridColor = appState.theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

    financeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [
                {
                    label: 'আয় (Income)',
                    data: incomes,
                    backgroundColor: goldColor,
                    borderColor: goldColor,
                    borderWidth: 1,
                    borderRadius: 4
                },
                {
                    label: 'ব্যয় (Expense)',
                    data: expenses,
                    backgroundColor: primaryColor,
                    borderColor: primaryColor,
                    borderWidth: 1,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                        font: { family: 'Outfit, Hind Siliguri', size: 12 }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Outfit' } }
                },
                y: {
                    grid: { color: gridColor },
                    ticks: { color: textColor, font: { family: 'Outfit' } }
                }
            }
        }
    });
}

// ----------------- 2. GOATS SECTION CONTROLLER -----------------
function populateBreedFilters() {
    const select = document.getElementById('filterBreed');
    const currentVal = select.value;
    select.innerHTML = '<option value="">সকল জাত (All Breeds)</option>';

    const breeds = [...new Set(appState.goats.map(g => g.breed).filter(Boolean))];
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed;
        option.innerText = breed;
        select.appendChild(option);
    });

    select.value = currentVal;
}

function renderGoatsGrid() {
    const grid = document.getElementById('goatsGridContainer');
    grid.innerHTML = '';

    const searchQuery = document.getElementById('searchGoatInput').value.toLowerCase().trim();
    const filterBreed = document.getElementById('filterBreed').value;
    const filterGender = document.getElementById('filterGender').value;
    const filterStatus = document.getElementById('filterStatus').value;

    const filteredGoats = appState.goats.filter(goat => {
        const matchesSearch = goat.code.toLowerCase().includes(searchQuery) || 
                              goat.breed.toLowerCase().includes(searchQuery);
        const matchesBreed = !filterBreed || goat.breed === filterBreed;
        const matchesGender = !filterGender || goat.gender === filterGender;
        const matchesStatus = !filterStatus || goat.status === filterStatus;

        return matchesSearch && matchesBreed && matchesGender && matchesStatus;
    });

    if (filteredGoats.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <i data-lucide="info" style="font-size: 3rem; color: var(--gold); margin-bottom: 12px; display: inline-block;"></i>
                <p>কোনো ছাগল পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন বা নতুন ছাগল যোগ করুন।</p>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    filteredGoats.forEach((goat, index) => {
        // Find index of this goat in parent array
        const realIndex = appState.goats.findIndex(g => g.code === goat.code);

        const card = document.createElement('div');
        card.className = 'goat-card';
        
        let statusBadgeText = '';
        if (goat.status === 'Healthy') statusBadgeText = 'সুস্থ';
        else if (goat.status === 'Sick') statusBadgeText = 'অসুস্থ';
        else if (goat.status === 'Pregnant') statusBadgeText = 'গর্ভবতী';
        else if (goat.status === 'Sold') statusBadgeText = 'বিক্রিত';

        const hasImage = !!goat.img;
        const purchasePriceTxt = goat.purchasePrice > 0 ? `৳${toBengaliNumber(goat.purchasePrice)}` : 'ঘরের বাচ্চা';

        let deliveryRow = '';
        if (goat.gender === 'Female' && goat.breedingDate && goat.status !== 'Sold') {
            const expectedDelivery = getExpectedDeliveryDate(goat.breedingDate);
            deliveryRow = `<li><span>সম্ভাব্য প্রসব:</span> <span style="color: var(--warning); font-weight:700;">${expectedDelivery}</span></li>`;
        }

        const editDisabled = goat.status === 'Sold' ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
        const sellBtnHtml = goat.status !== 'Sold' 
            ? `<button onclick="openSellModal(${realIndex})"><i data-lucide="badge-dollar-sign"></i> বিক্রি</button>` 
            : `<button disabled style="opacity: 0.5; cursor:not-allowed;"><i data-lucide="check"></i> বিক্রিত (৳${toBengaliNumber(goat.soldPrice)})</button>`;

        card.innerHTML = `
            <div class="goat-image-container">
                ${hasImage 
                    ? `<img class="goat-card-img" src="${goat.img}" alt="Goat">` 
                    : `<div class="goat-image-placeholder"><i data-lucide="paw-print"></i></div>`
                }
                <span class="goat-status-badge ${goat.status.toLowerCase()}">${statusBadgeText}</span>
                <span class="goat-tag-badge">${goat.code}</span>
            </div>
            <div class="goat-card-content">
                <div class="goat-card-title">
                    <h4>${goat.breed}</h4>
                    <span>${goat.gender === 'Male' ? 'পুরুষ (পাঠা)' : goat.gender === 'Female' ? 'মহিলা (ছাগী)' : 'বাচ্চা'}</span>
                </div>
                <ul class="goat-details-list">
                    <li><span>বয়স:</span> <span>${goat.age}</span></li>
                    <li><span>ওজন:</span> <span>${toBengaliNumber(goat.weight)} কেজি</span></li>
                    <li><span>ক্রয় মূল্য:</span> <span>${purchasePriceTxt}</span></li>
                    ${deliveryRow}
                    ${goat.vaccineDate ? `<li><span>পরবর্তী টিকা:</span> <span>${goat.vaccineDate}</span></li>` : ''}
                    ${goat.dewormingDate ? `<li><span>কৃমিনাশক:</span> <span>${goat.dewormingDate}</span></li>` : ''}
                </ul>
                <div class="goat-card-actions">
                    <button ${editDisabled} onclick="openGoatModal(${realIndex})"><i data-lucide="pencil"></i> এডিট</button>
                    ${sellBtnHtml}
                    <button onclick="deleteGoat(${realIndex})" style="border-color: rgba(239, 68, 68, 0.3); color: var(--danger);"><i data-lucide="trash-2"></i> মুছুন</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Goat Modal Controllers
function openGoatModal(realIndex = null) {
    const modal = document.getElementById('goatModal');
    const form = document.getElementById('goatForm');
    form.reset();

    // Reset preview
    document.getElementById('goatImagePreview').style.display = 'none';
    document.getElementById('goatImageBase64').value = '';

    if (realIndex !== null) {
        // Edit Mode
        const goat = appState.goats[realIndex];
        document.getElementById('goatIndex').value = realIndex;
        document.getElementById('goatModalTitle').innerText = 'ছাগলের তথ্য সংশোধন করুন';
        
        document.getElementById('goatCode').value = goat.code;
        document.getElementById('goatCode').readOnly = true; // Prevent changing Code ID
        document.getElementById('goatBreed').value = goat.breed;
        document.getElementById('goatGender').value = goat.gender;
        document.getElementById('goatAge').value = goat.age;
        document.getElementById('goatWeight').value = goat.weight;
        document.getElementById('goatPurchasePrice').value = goat.purchasePrice;
        document.getElementById('goatPurchaseDate').value = goat.purchaseDate;
        document.getElementById('goatStatus').value = goat.status;

        if (goat.img) {
            document.getElementById('goatImagePreview').src = goat.img;
            document.getElementById('goatImagePreview').style.display = 'block';
            document.getElementById('goatImageBase64').value = goat.img;
        }

        document.getElementById('goatVaccineDate').value = goat.vaccineDate || '';
        document.getElementById('goatDewormingDate').value = goat.dewormingDate || '';
        document.getElementById('goatBreedingDate').value = goat.breedingDate || '';
        document.getElementById('goatKidsCount').value = goat.kidsCount || '';
    } else {
        // Add Mode
        document.getElementById('goatIndex').value = '';
        document.getElementById('goatModalTitle').innerText = 'নতুন ছাগল যুক্ত করুন';
        document.getElementById('goatCode').readOnly = false;
        
        // Auto default date to today
        document.getElementById('goatPurchaseDate').value = new Date().toISOString().split('T')[0];
    }

    modal.classList.add('active');
}

function closeGoatModal() {
    document.getElementById('goatModal').classList.remove('active');
}

function saveGoat() {
    const form = document.getElementById('goatForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const indexVal = document.getElementById('goatIndex').value;
    const code = document.getElementById('goatCode').value.toUpperCase().trim();
    
    // Duplicate code check (Only on creation)
    if (indexVal === '') {
        const exists = appState.goats.some(g => g.code === code);
        if (exists) {
            alert('এই কোড সংবলিত ছাগল খামারে ইতিমধ্যে যুক্ত আছে। দয়া করে ভিন্ন কোড ব্যবহার করুন।');
            return;
        }
    }

    const goatData = {
        code: code,
        breed: document.getElementById('goatBreed').value.trim(),
        gender: document.getElementById('goatGender').value,
        age: document.getElementById('goatAge').value.trim(),
        weight: parseFloat(document.getElementById('goatWeight').value),
        purchasePrice: parseInt(document.getElementById('goatPurchasePrice').value) || 0,
        purchaseDate: document.getElementById('goatPurchaseDate').value,
        status: document.getElementById('goatStatus').value,
        img: document.getElementById('goatImageBase64').value,
        vaccineDate: document.getElementById('goatVaccineDate').value,
        dewormingDate: document.getElementById('goatDewormingDate').value,
        breedingDate: document.getElementById('goatBreedingDate').value,
        kidsCount: parseInt(document.getElementById('goatKidsCount').value) || null,
        soldPrice: indexVal !== '' ? appState.goats[indexVal].soldPrice : null,
        soldDate: indexVal !== '' ? appState.goats[indexVal].soldDate : null
    };

    if (indexVal !== '') {
        // Update existing
        appState.goats[indexVal] = goatData;

        // Sync and log purchases if price changed
        // For simplicity, we just keep transaction history independent or updated
    } else {
        // Push new
        appState.goats.push(goatData);

        // Auto log purchase transaction if price > 0
        if (goatData.purchasePrice > 0) {
            const newTx = {
                id: Date.now(),
                date: goatData.purchaseDate || new Date().toISOString().split('T')[0],
                type: 'expense',
                category: 'ছাগল কেনার হিসাব',
                amount: goatData.purchasePrice,
                note: `${goatData.code} (${goatData.breed}) ক্রয়ের হিসাব`
            };
            appState.transactions.push(newTx);
            saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
        }
    }

    saveState(STORAGE_KEYS.GOATS, appState.goats);
    closeGoatModal();
    refreshUI();
}

function deleteGoat(index) {
    if (confirm('আপনি কি নিশ্চিত যে এই ছাগলের সমস্ত ডাটা চিরতরে মুছে ফেলতে চান?')) {
        const deletedGoat = appState.goats[index];
        appState.goats.splice(index, 1);
        
        // Also remove related buying/selling transactions if needed, or keep them.
        // Keeping transaction logs for historical reports is standard accounting.
        
        saveState(STORAGE_KEYS.GOATS, appState.goats);
        refreshUI();
    }
}

// Selling Modal controllers
function openSellModal(index) {
    const modal = document.getElementById('sellGoatModal');
    const goat = appState.goats[index];
    
    document.getElementById('sellGoatIndex').value = index;
    document.getElementById('sellGoatCodeDisplay').value = goat.code;
    document.getElementById('sellPrice').value = '';
    document.getElementById('sellDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('sellNote').value = `কোড: ${goat.code} বিক্রয় হিসাব`;

    modal.classList.add('active');
}

function closeSellModal() {
    document.getElementById('sellGoatModal').classList.remove('active');
}

function saveGoatSale() {
    const index = document.getElementById('sellGoatIndex').value;
    const sellPrice = parseInt(document.getElementById('sellPrice').value);
    const sellDate = document.getElementById('sellDate').value;
    const sellNote = document.getElementById('sellNote').value;

    if (!sellPrice || !sellDate) {
        alert('দয়া করে বিক্রয় মূল্য এবং বিক্রির তারিখ প্রদান করুন।');
        return;
    }

    const goat = appState.goats[index];
    goat.status = 'Sold';
    goat.soldPrice = sellPrice;
    goat.soldDate = sellDate;

    // Add Income Transaction record
    const newTx = {
        id: Date.now(),
        date: sellDate,
        type: 'income',
        category: 'ছাগল বিক্রির হিসাব',
        amount: sellPrice,
        note: sellNote || `${goat.code} বিক্রি সম্পন্ন`
    };
    appState.transactions.push(newTx);

    saveState(STORAGE_KEYS.GOATS, appState.goats);
    saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
    closeSellModal();
    refreshUI();
}


// ----------------- 3. FINANCE / ACCOUNTING SECTION -----------------
function renderTransactionsTable() {
    const tableBody = document.getElementById('transactionTableBody');
    tableBody.innerHTML = '';

    const filterType = document.getElementById('filterTransactionType').value;
    const filterCat = document.getElementById('filterTransactionCategory').value;

    // Sort transactions by date descending
    const sortedTxs = [...appState.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

    const filteredTxs = sortedTxs.filter(t => {
        const matchesType = !filterType || t.type === filterType;
        const matchesCat = !filterCat || t.category === filterCat;
        return matchesType && matchesCat;
    });

    // Compute sums of filtered
    let totalInc = appState.transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    let totalExp = appState.transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    document.getElementById('financeSummaryText').innerText = `মোট আয়: ৳${toBengaliNumber(totalInc)} | মোট ব্যয়: ৳${toBengaliNumber(totalExp)}`;

    if (filteredTxs.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 30px;">
                    কোনো লেনদেন রেকর্ড পাওয়া যায়নি।
                </td>
            </tr>
        `;
        return;
    }

    filteredTxs.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.date}</td>
            <td style="font-weight: 500;">${t.category}</td>
            <td><span class="transaction-type ${t.type}">${t.type === 'income' ? 'আয়' : 'ব্যয়'}</span></td>
            <td style="font-weight: 700;">৳${toBengaliNumber(t.amount)}</td>
            <td style="font-size: 0.85rem; color: var(--text-muted);">${t.note || ''}</td>
            <td>
                <button onclick="deleteTransaction(${t.id})" style="background:transparent; border:none; color:var(--danger); cursor:pointer;">
                    <i data-lucide="trash-2" style="width: 16px;"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openTransactionModal() {
    const modal = document.getElementById('transactionModal');
    document.getElementById('transactionForm').reset();
    document.getElementById('txDate').value = new Date().toISOString().split('T')[0];
    modal.classList.add('active');
}

function closeTransactionModal() {
    document.getElementById('transactionModal').classList.remove('active');
}

function saveTransaction() {
    const form = document.getElementById('transactionForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const newTx = {
        id: Date.now(),
        date: document.getElementById('txDate').value,
        type: document.getElementById('txType').value,
        category: document.getElementById('txCategory').value,
        amount: parseInt(document.getElementById('txAmount').value),
        note: document.getElementById('txNote').value.trim()
    };

    appState.transactions.push(newTx);
    saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
    closeTransactionModal();
    refreshUI();
}

function deleteTransaction(id) {
    if (confirm('আপনি কি এই লেনদেনের রেকর্ডটি মুছে ফেলতে চান?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== id);
        saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
        refreshUI();
    }
}


// ----------------- 4. FEED STOCK & LOGS SECTION -----------------
function renderFeedStockSection() {
    // 1. Stock Inventory Table
    const stockBody = document.getElementById('feedStockTableBody');
    stockBody.innerHTML = '';

    appState.feedStock.forEach((feed, index) => {
        const isLow = feed.quantity <= feed.minThreshold;
        const statusHtml = isLow 
            ? `<span style="color: var(--danger); font-weight:700;"><i data-lucide="alert-circle" style="display:inline; width:14px; margin-right:4px;"></i>সংকটপূর্ণ</span>` 
            : `<span style="color: var(--success); font-weight:500;">পর্যাপ্ত</span>`;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight: 500;">${feed.name}</td>
            <td style="font-weight: 700; color: ${isLow ? 'var(--danger)' : 'var(--text-main)'};">${toBengaliNumber(feed.quantity.toFixed(1))} কেজি</td>
            <td>${toBengaliNumber(feed.minThreshold)} কেজি</td>
            <td>${statusHtml}</td>
            <td>
                <button class="btn-secondary" onclick="openFeedStockModal(${index})" style="padding: 4px 8px; font-size:0.75rem;"><i data-lucide="plus" style="width:12px;"></i> রিফিল</button>
            </td>
        `;
        stockBody.appendChild(tr);
    });

    // Populate drop-down inside feeding log form
    const select = document.getElementById('logFeedSelect');
    select.innerHTML = '';
    appState.feedStock.forEach(feed => {
        const opt = document.createElement('option');
        opt.value = feed.name;
        opt.innerText = `${feed.name} (বর্তমান: ${feed.quantity.toFixed(1)} কেজি)`;
        select.appendChild(opt);
    });

    // 2. Consumption Logs Table
    const logsBody = document.getElementById('feedLogsTableBody');
    logsBody.innerHTML = '';

    // Sort by date descending
    const sortedLogs = [...appState.feedLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedLogs.length === 0) {
        logsBody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">খাবার খাওয়ানোর কোনো রেকর্ড নেই।</td></tr>`;
    } else {
        sortedLogs.forEach(log => {
            const tr = document.createElement('tr');
            const dateDisplay = log.date.replace('T', ' ');
            tr.innerHTML = `
                <td>${dateDisplay}</td>
                <td style="font-weight: 500;">${log.name}</td>
                <td style="font-weight: 700;">${toBengaliNumber(log.quantity)} কেজি</td>
                <td style="font-size:0.85rem; color:var(--text-muted);">${log.note || ''}</td>
            `;
            logsBody.appendChild(tr);
        });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Stock Modal
let currentEditFeedIndex = null;
function openFeedStockModal(index = null) {
    const modal = document.getElementById('feedStockModal');
    document.getElementById('feedStockForm').reset();
    
    if (index !== null) {
        currentEditFeedIndex = index;
        const feed = appState.feedStock[index];
        document.getElementById('feedName').value = feed.name;
        document.getElementById('feedName').readOnly = true;
        document.getElementById('feedQuantity').value = ''; // Input refill amount
        document.getElementById('feedQuantity').placeholder = `বর্তমান: ${feed.quantity} কেজি | কত যোগ করবেন?`;
        document.getElementById('feedMinThreshold').value = feed.minThreshold;
        document.getElementById('feedPricePerKg').value = feed.pricePerKg || '';
    } else {
        currentEditFeedIndex = null;
        document.getElementById('feedName').readOnly = false;
        document.getElementById('feedQuantity').placeholder = 'খাবারের মোট পরিমাণ';
    }

    modal.classList.add('active');
}

function closeFeedStockModal() {
    document.getElementById('feedStockModal').classList.remove('active');
}

function saveFeedStock() {
    const form = document.getElementById('feedStockForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const name = document.getElementById('feedName').value.trim();
    const qtyInput = parseFloat(document.getElementById('feedQuantity').value);
    const minThreshold = parseFloat(document.getElementById('feedMinThreshold').value);
    const pricePerKg = parseFloat(document.getElementById('feedPricePerKg').value) || 0;
    const addToExpenses = document.getElementById('feedAddToExpenses').checked;

    if (currentEditFeedIndex !== null) {
        // Refill action
        const feed = appState.feedStock[currentEditFeedIndex];
        feed.quantity += qtyInput;
        feed.minThreshold = minThreshold;
        feed.pricePerKg = pricePerKg;

        // Log transaction if checked
        if (addToExpenses && pricePerKg > 0 && qtyInput > 0) {
            const cost = qtyInput * pricePerKg;
            appState.transactions.push({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: 'খাবার খরচ',
                amount: cost,
                note: `${feed.name} ${qtyInput} কেজি রিফিল ক্রয়`
            });
            saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
        }
    } else {
        // Add new feed type
        const newFeed = { name, quantity: qtyInput, minThreshold, pricePerKg };
        appState.feedStock.push(newFeed);

        if (addToExpenses && pricePerKg > 0 && qtyInput > 0) {
            const cost = qtyInput * pricePerKg;
            appState.transactions.push({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                category: 'খাবার খরচ',
                amount: cost,
                note: `${name} ${qtyInput} কেজি প্রারম্ভিক স্টক`
            });
            saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
        }
    }

    saveState(STORAGE_KEYS.FEED_STOCK, appState.feedStock);
    closeFeedStockModal();
    refreshUI();
}

// Consumption Modal
function openFeedLogModal() {
    const modal = document.getElementById('feedLogModal');
    document.getElementById('feedLogForm').reset();
    
    // Auto populate date
    const now = new Date();
    // Offset local timezone
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    const localISOTime = new Date(now.getTime() - offsetMs).toISOString().substring(0, 16);
    document.getElementById('logDate').value = localISOTime;

    modal.classList.add('active');
}

function closeFeedLogModal() {
    document.getElementById('feedLogModal').classList.remove('active');
}

function saveFeedLog() {
    const form = document.getElementById('feedLogForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const feedName = document.getElementById('logFeedSelect').value;
    const qty = parseFloat(document.getElementById('logFeedQty').value);
    const date = document.getElementById('logDate').value;
    const note = document.getElementById('logNote').value.trim();

    // Deduct stock
    const stockItem = appState.feedStock.find(f => f.name === feedName);
    if (!stockItem) {
        alert('খাবারের স্টক আইটেম খুঁজে পাওয়া যায়নি।');
        return;
    }

    if (stockItem.quantity < qty) {
        alert(`দুঃখিত! স্টকে পর্যাপ্ত খাদ্য নেই। বর্তমান স্টক: ${stockItem.quantity} কেজি।`);
        return;
    }

    stockItem.quantity -= qty;
    
    // Add consumption log
    appState.feedLogs.push({ date, name: feedName, quantity: qty, note });

    saveState(STORAGE_KEYS.FEED_STOCK, appState.feedStock);
    saveState(STORAGE_KEYS.FEED_LOGS, appState.feedLogs);
    closeFeedLogModal();
    refreshUI();
}


// ----------------- 5. DETAILED NOTIFICATIONS & REAL-TIME ALERTS -----------------
let urgentAlertsCountGlobal = 0;

function calculateCountdown(dueDateStr) {
    if (!dueDateStr) return null;
    
    const now = new Date();
    const due = new Date(dueDateStr);
    const timeDiff = due - now;

    const isOverdue = timeDiff < 0;
    const absDiff = Math.abs(timeDiff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return {
        days,
        hours,
        isOverdue,
        totalHours: timeDiff / (1000 * 60 * 60)
    };
}

function getCountdownText(countdown) {
    if (!countdown) return '';
    const bDays = toBengaliNumber(countdown.days);
    const bHours = toBengaliNumber(countdown.hours);

    if (countdown.isOverdue) {
        if (countdown.days === 0) {
            return `আজকে প্রদেয় (আজকের দিন)`;
        }
        return `ওভারডিউ! (${bDays} দিন অতিবাহিত)`;
    } else {
        if (countdown.days === 0) {
            return `আসন্ন (${bHours} ঘন্টা বাকি)`;
        }
        return `আসন্ন (${bDays} দিন ${bHours} ঘন্টা বাকি)`;
    }
}

function getUrgentNotificationItems() {
    const alerts = [];

    appState.goats.forEach(goat => {
        if (goat.status === 'Sold') return; // Ignore sold goats

        // 1. Vaccine Date Check
        if (goat.vaccineDate) {
            const cd = calculateCountdown(goat.vaccineDate);
            if (cd) {
                // If past due or due in less than 3 days
                const isUrgent = cd.isOverdue || cd.totalHours <= 72;
                alerts.push({
                    type: 'vaccine',
                    goatCode: goat.code,
                    title: `টিকা দেওয়ার সময় - ছাগল কোড: ${goat.code}`,
                    subtitle: `ভ্যাকসিন ডেট: ${goat.vaccineDate}`,
                    dueDate: goat.vaccineDate,
                    countdown: cd,
                    isUrgent
                });
            }
        }

        // 2. Deworming Check
        if (goat.dewormingDate) {
            const cd = calculateCountdown(goat.dewormingDate);
            if (cd) {
                const isUrgent = cd.isOverdue || cd.totalHours <= 72;
                alerts.push({
                    type: 'deworming',
                    goatCode: goat.code,
                    title: `কৃমিনাশক দেওয়ার সময় - ছাগল কোড: ${goat.code}`,
                    subtitle: `কৃমিনাশক ডেট: ${goat.dewormingDate}`,
                    dueDate: goat.dewormingDate,
                    countdown: cd,
                    isUrgent
                });
            }
        }

        // 3. Pregnancy / Expected Delivery Check
        if (goat.gender === 'Female' && goat.breedingDate && goat.status === 'Pregnant') {
            const expDelivery = getExpectedDeliveryDate(goat.breedingDate);
            const cd = calculateCountdown(expDelivery);
            if (cd) {
                // Urgent if due in less than 7 days, or overdue
                const isUrgent = cd.isOverdue || cd.totalHours <= 168;
                alerts.push({
                    type: 'delivery',
                    goatCode: goat.code,
                    title: `বাচ্চা প্রসবের সম্ভাব্য সময় - ছাগল কোড: ${goat.code}`,
                    subtitle: `প্রজনন তারিখ: ${goat.breedingDate} | সম্ভাব্য প্রসব: ${expDelivery}`,
                    dueDate: expDelivery,
                    countdown: cd,
                    isUrgent
                });
            }
        }

        // 4. General Breeding Date Alarm
        if (goat.gender === 'Female' && goat.breedingDate && goat.status !== 'Pregnant' && goat.status !== 'Sold') {
            // Check pregnancy status confirm alarm (usually 21 days after breeding)
            const checkDate = new Date(goat.breedingDate);
            checkDate.setDate(checkDate.getDate() + 21);
            const checkDateStr = checkDate.toISOString().split('T')[0];
            const cd = calculateCountdown(checkDateStr);
            if (cd) {
                const isUrgent = cd.isOverdue || cd.totalHours <= 48;
                alerts.push({
                    type: 'breeding',
                    goatCode: goat.code,
                    title: `গর্ভধারণ নিশ্চিতকরণ পরীক্ষা - ছাগল কোড: ${goat.code}`,
                    subtitle: `প্রজনন করা হয়েছিল: ${goat.breedingDate}`,
                    dueDate: checkDateStr,
                    countdown: cd,
                    isUrgent
                });
            }
        }
    });

    // Sort by countdown time remaining (closest to deadline first)
    alerts.sort((a, b) => a.countdown.totalHours - b.countdown.totalHours);
    return alerts;
}

function updateCountdowns() {
    const alerts = getUrgentNotificationItems();
    
    // Count urgent alarms
    const urgentCount = alerts.filter(a => a.isUrgent).length;
    urgentAlertsCountGlobal = urgentCount;

    // Update bell icon badge
    const badge = document.getElementById('alertBadgeCount');
    badge.innerText = toBengaliNumber(urgentCount);
    if (urgentCount > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }

    // Update dashboard overview statistics
    document.getElementById('dashUrgentTimerCount').innerText = `${toBengaliNumber(alerts.length)}টি কাউন্টডাউন ও নোটিফিকেশন`;

    // Render Mini List in Dashboard
    const miniList = document.getElementById('dashboardNotificationsList');
    miniList.innerHTML = '';
    
    // Only display top 5 upcoming alarms on dashboard
    const displayAlerts = alerts.slice(0, 5);
    
    if (displayAlerts.length === 0) {
        miniList.innerHTML = `<div style="text-align: center; padding: 20px; color: var(--text-muted);">আপাতত কোনো আসন্ন সময়সীমা নেই।</div>`;
        return;
    }

    displayAlerts.forEach(alertItem => {
        const item = document.createElement('div');
        item.className = `notification-item ${alertItem.isUrgent ? 'urgent' : ''}`;
        
        let iconName = 'bell';
        if (alertItem.type === 'vaccine') iconName = 'syringe';
        else if (alertItem.type === 'deworming') iconName = 'pill';
        else if (alertItem.type === 'breeding') iconName = 'heart';
        else if (alertItem.type === 'delivery') iconName = 'baby';

        item.innerHTML = `
            <div class="notification-icon"><i data-lucide="${iconName}"></i></div>
            <div class="notification-details">
                <p>${alertItem.title}</p>
                <span>${alertItem.subtitle}</span>
            </div>
            <span class="countdown-timer">${getCountdownText(alertItem.countdown)}</span>
        `;
        miniList.appendChild(item);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderDetailedNotifications() {
    const list = document.getElementById('notificationsDetailedList');
    list.innerHTML = '';

    const filterType = document.getElementById('filterNotifType').value;
    const filterUrgency = document.getElementById('filterNotifUrgency').value;

    const allAlerts = getUrgentNotificationItems();

    const filteredAlerts = allAlerts.filter(alertItem => {
        const matchesType = !filterType || alertItem.type === filterType;
        const matchesUrgency = !filterUrgency || 
            (filterUrgency === 'urgent' && alertItem.isUrgent) || 
            (filterUrgency === 'upcoming' && !alertItem.isUrgent);
        return matchesType && matchesUrgency;
    });

    // Update header total
    document.getElementById('notifActiveCount').innerText = `${toBengaliNumber(filteredAlerts.length)}টি সক্রিয় ইভেন্ট`;

    if (filteredAlerts.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted);">নির্ধারিত ফিল্টারে কোনো কাউন্টডাউন এলার্ট পাওয়া যায়নি।</div>`;
        return;
    }

    filteredAlerts.forEach(alertItem => {
        const item = document.createElement('div');
        item.className = `notification-item ${alertItem.isUrgent ? 'urgent' : ''}`;
        
        let iconName = 'bell';
        if (alertItem.type === 'vaccine') iconName = 'syringe';
        else if (alertItem.type === 'deworming') iconName = 'pill';
        else if (alertItem.type === 'breeding') iconName = 'heart';
        else if (alertItem.type === 'delivery') iconName = 'baby';

        item.innerHTML = `
            <div class="notification-icon" style="width: 44px; height: 44px; font-size:1.3rem;"><i data-lucide="${iconName}"></i></div>
            <div class="notification-details">
                <p style="font-size:1rem; font-weight:600;">${alertItem.title}</p>
                <span style="font-size:0.8rem; color:var(--text-muted);">${alertItem.subtitle}</span>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap: 4px;">
                <span class="countdown-timer" style="padding: 6px 12px; font-size:0.85rem;">${getCountdownText(alertItem.countdown)}</span>
                <button class="btn-secondary" onclick="navigateToSection('goats-section', '${alertItem.goatCode.toLowerCase()}')" style="padding:4px 8px; font-size:0.75rem;">ছাগল প্রোফাইল</button>
            </div>
        `;
        list.appendChild(item);
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ----------------- GitHub Cloud Sync Logic -----------------
function loadSyncSettingsUI() {
    document.getElementById('ghEnabled').checked = ghConfig.enabled;
    document.getElementById('ghUsername').value = ghConfig.username;
    document.getElementById('ghRepo').value = ghConfig.repo;
    document.getElementById('ghToken').value = ghConfig.token;
}

function saveSyncSettings() {
    const enabled = document.getElementById('ghEnabled').checked;
    const username = document.getElementById('ghUsername').value.trim();
    const repo = document.getElementById('ghRepo').value.trim();
    const token = document.getElementById('ghToken').value.trim();

    if (enabled && (!username || !repo || !token)) {
        alert('গিটহাব ক্লাউড সিঙ্ক চালু করতে ইউজারনেম, রিপোজিটরি এবং টোকেন অবশ্যই প্রদান করতে হবে।');
        return;
    }

    ghConfig.enabled = enabled;
    ghConfig.username = username;
    ghConfig.repo = repo;
    ghConfig.token = token;

    localStorage.setItem(STORAGE_KEYS.GH_ENABLED, enabled);
    localStorage.setItem(STORAGE_KEYS.GH_USERNAME, username);
    localStorage.setItem(STORAGE_KEYS.GH_REPO, repo);
    localStorage.setItem(STORAGE_KEYS.GH_TOKEN, token);

    alert('সিঙ্ক সেটিংস সফলভাবে সেভ করা হয়েছে!');

    if (enabled) {
        fetchFromGitHub();
    } else {
        updateSyncIndicatorUI('disabled');
    }
}

// Update the header cloud sync status indicator
function updateSyncIndicatorUI(status, details = '') {
    const icon = document.getElementById('headerSyncIcon');
    const text = document.getElementById('headerSyncText');
    const box = document.getElementById('syncStatusBox');
    const statusText = document.getElementById('syncStatusText');

    if (!icon || !text) return;

    if (status === 'disabled') {
        icon.setAttribute('data-lucide', 'cloud-off');
        icon.style.color = 'var(--text-muted)';
        text.innerText = 'সিঙ্ক বন্ধ';
        if (box) box.style.display = 'none';
    } else if (status === 'syncing') {
        icon.setAttribute('data-lucide', 'refresh-cw');
        icon.style.color = 'var(--gold)';
        icon.classList.add('spinning-animation'); 
        text.innerText = 'সিঙ্ক হচ্ছে...';
        if (box) {
            box.style.display = 'block';
            statusText.innerHTML = `<span style="color: var(--gold);"><i data-lucide="refresh-cw" style="display:inline-block; width:14px; animation: text-pulse 1s infinite;"></i> গিটহাব ক্লাউডের সাথে ডেটা সিঙ্ক হচ্ছে...</span>`;
        }
    } else if (status === 'success') {
        icon.setAttribute('data-lucide', 'cloud-lightning');
        icon.style.color = 'var(--success)';
        icon.classList.remove('spinning-animation');
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        text.innerText = `সিঙ্কড (${nowStr})`;
        if (box) {
            box.style.display = 'block';
            statusText.innerHTML = `<span style="color: var(--success);">✔ সফলভাবে গিটহাব ক্লাউডের সাথে কানেক্টেড এবং সিঙ্কড! (${details})</span>`;
        }
    } else if (status === 'error') {
        icon.setAttribute('data-lucide', 'cloud-alert');
        icon.style.color = 'var(--danger)';
        icon.classList.remove('spinning-animation');
        text.innerText = 'সিঙ্ক এরর';
        if (box) {
            box.style.display = 'block';
            statusText.innerHTML = `<span style="color: var(--danger);">✖ কানেকশন এরর: ${details}</span>`;
        }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Fetch (Pull) Latest Data from GitHub repo
async function fetchFromGitHub() {
    if (!ghConfig.enabled || !ghConfig.username || !ghConfig.repo || !ghConfig.token) return;

    updateSyncIndicatorUI('syncing');

    const url = `https://api.github.com/repos/${ghConfig.username}/${ghConfig.repo}/contents/data.json`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${ghConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Cache-Control': 'no-cache'
            }
        });

        if (response.status === 200) {
            const data = await response.json();
            ghConfig.sha = data.sha;
            localStorage.setItem(STORAGE_KEYS.GH_SHA, data.sha);

            // Decode contents safely
            const decodedContent = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
            const cloudData = JSON.parse(decodedContent);

            // Overwrite local state with cloud state
            appState.goats = cloudData.goats || [];
            appState.transactions = cloudData.transactions || [];
            appState.feedStock = cloudData.feedStock || [];
            appState.feedLogs = cloudData.feedLogs || [];

            // Save to localStorage (Offline copy)
            localStorage.setItem(STORAGE_KEYS.GOATS, JSON.stringify(appState.goats));
            localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(appState.transactions));
            localStorage.setItem(STORAGE_KEYS.FEED_STOCK, JSON.stringify(appState.feedStock));
            localStorage.setItem(STORAGE_KEYS.FEED_LOGS, JSON.stringify(appState.feedLogs));

            refreshUI();
            updateSyncIndicatorUI('success', 'ডেটা ডাউনলোড সম্পন্ন');
        } else if (response.status === 404) {
            // File doesn't exist yet, push initial data to create it
            console.log('GitHub database file not found. Creating a new one with current state...');
            await pushToGitHub();
        } else {
            const errData = await response.json();
            updateSyncIndicatorUI('error', errData.message || 'কানেকশন ব্যর্থ');
        }
    } catch (err) {
        console.error('GitHub Sync Error:', err);
        updateSyncIndicatorUI('error', 'নেটওয়ার্ক এরর বা ভুল ইনফরমেশন');
    }
}

// Push (Commit) Local Data to GitHub repo
async function pushToGitHub() {
    if (!ghConfig.enabled || !ghConfig.username || !ghConfig.repo || !ghConfig.token) return;

    // Get current SHA from GitHub first to avoid conflicts
    const url = `https://api.github.com/repos/${ghConfig.username}/${ghConfig.repo}/contents/data.json`;
    let sha = ghConfig.sha || '';

    try {
        const checkRes = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `token ${ghConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Cache-Control': 'no-cache'
            }
        });

        if (checkRes.status === 200) {
            const checkData = await checkRes.json();
            sha = checkData.sha;
            ghConfig.sha = sha;
            localStorage.setItem(STORAGE_KEYS.GH_SHA, sha);
        }

        // Prepare backup payload
        const backupData = {
            goats: appState.goats,
            transactions: appState.transactions,
            feedStock: appState.feedStock,
            feedLogs: appState.feedLogs
        };

        const jsonStr = JSON.stringify(backupData, null, 2);
        const base64Content = btoa(unescape(encodeURIComponent(jsonStr)));

        const bodyPayload = {
            message: 'Update Bondu Agro farm records from client-sync',
            content: base64Content
        };
        if (sha) {
            bodyPayload.sha = sha;
        }

        const putRes = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${ghConfig.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify(bodyPayload)
        });

        if (putRes.status === 200 || putRes.status === 201) {
            const putData = await putRes.json();
            ghConfig.sha = putData.content.sha;
            localStorage.setItem(STORAGE_KEYS.GH_SHA, putData.content.sha);
            updateSyncIndicatorUI('success', 'ডেটা আপলোড সম্পন্ন');
        } else {
            const errData = await putRes.json();
            updateSyncIndicatorUI('error', errData.message || 'আপলোড ব্যর্থ');
        }
    } catch (err) {
        console.error('GitHub Upload Error:', err);
        updateSyncIndicatorUI('error', 'নেটওয়ার্ক এরর');
    }
}

// Test GitHub API credentials
async function testGitHubSync() {
    const username = document.getElementById('ghUsername').value.trim();
    const repo = document.getElementById('ghRepo').value.trim();
    const token = document.getElementById('ghToken').value.trim();

    if (!username || !repo || !token) {
        alert('অনুগ্রহ করে ইউজারনেম, রিপোজিটরি এবং টোকেন সবগুলি প্রদান করুন।');
        return;
    }

    const testBtn = document.getElementById('ghTestBtn');
    testBtn.disabled = true;
    testBtn.innerHTML = '<i class="spinning-animation" data-lucide="refresh-cw"></i> লোড হচ্ছে...';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const url = `https://api.github.com/repos/${username}/${repo}`;
    
    try {
        const res = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (res.status === 200) {
            alert('কানেকশন সফল! গিটহাব রিপোজিটরিটি সঠিকভাবে পাওয়া গেছে।');
            document.getElementById('ghEnabled').checked = true;
        } else {
            const data = await res.json();
            alert(`কানেকশন ব্যর্থ! গিটহাব এরর: ${data.message || res.statusText}`);
        }
    } catch (err) {
        alert('কানেকশন টেস্ট করার সময় নেটওয়ার্ক এরর হয়েছে।');
    } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = '<i data-lucide="refresh-cw"></i> কানেকশন টেস্ট করুন';
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
}

function manualSync() {
    if (ghConfig.enabled) {
        fetchFromGitHub();
    } else {
        alert('গিটহাব ক্লাউড সিঙ্ক চালু নেই। অনুগ্রহ করে সিঙ্ক সেটিংস পেজে গিয়ে এটি কনফিগার করে চালু করুন।');
    }
}

// ----------------- Data Backup & Restore (Export/Import) -----------------
function exportDataBackup() {
    const backupData = {
        goats: appState.goats,
        transactions: appState.transactions,
        feedStock: appState.feedStock,
        feedLogs: appState.feedLogs
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("download", `bondu_agro_backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function importDataBackup(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate basic structure
            if (!importedData.goats || !importedData.transactions || !importedData.feedStock || !importedData.feedLogs) {
                alert('ভুল ফাইল ফরম্যাট! এটি বন্ধু এগ্রোর ব্যাকআপ ফাইল নয়।');
                return;
            }
            
            if (confirm('আপনি কি এই ব্যাকআপ ফাইলটি রিস্টোর করতে চান? এটি আপনার বর্তমান ডেক্সটপ বা ল্যাপটপের সমস্ত ডেটা পরিবর্তন করে ফেলবে।')) {
                appState.goats = importedData.goats;
                appState.transactions = importedData.transactions;
                appState.feedStock = importedData.feedStock;
                appState.feedLogs = importedData.feedLogs;
                
                saveState(STORAGE_KEYS.GOATS, appState.goats);
                saveState(STORAGE_KEYS.TRANSACTIONS, appState.transactions);
                saveState(STORAGE_KEYS.FEED_STOCK, appState.feedStock);
                saveState(STORAGE_KEYS.FEED_LOGS, appState.feedLogs);
                
                alert('ডেটা সফলভাবে পুনরুদ্ধার করা হয়েছে (Data Restored Successfully)!');
                window.location.reload();
            }
        } catch (err) {
            alert('ফাইলটি পড়তে সমস্যা হয়েছে। দয়া করে সঠিক JSON ফাইল সিলেক্ট করুন।');
        }
    };
    reader.readAsText(file);
    
    // Clear selection
    inputElement.value = '';
}

// ----------------- Page Bootloader -----------------
document.addEventListener('DOMContentLoaded', initApp);
