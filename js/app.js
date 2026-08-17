// ==========================================
// BS Gamer_z - FULLY WORKING APP (ALL FEATURES)
// ==========================================

const STORAGE_KEY = "bs_gamer_z_content";

// ==========================================
// PAGE ELEMENTS
// ==========================================

const searchInput = document.querySelector(".search-box input");
const categoryButtons = document.querySelectorAll(".category");
const contentGrid = document.querySelector(".content-grid");
const addContentButton = document.querySelector(".add-content-btn");
const addContentForm = document.querySelector("#addContentForm");
const contentForm = document.querySelector("#contentForm");
const cancelContentButton = document.querySelector("#cancelContent");

// ==========================================
// CONTENT DATA
// ==========================================

let contentData = loadContent();
let allYouTubeVideos = [];
let allYouTubePosts = [];
let editingId = null;
let currentPage = 1;
const ITEMS_PER_PAGE = 50;

// ==========================================
// LOAD CONTENT (Manual)
// ==========================================

function loadContent() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
}

function saveContent() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contentData));
}

// ==========================================
// AUTO-DETECT PATH
// ==========================================

function getDataPath() {
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
        return 'data/youtube.json';
    }
    return '/BS-Gamer-z/data/youtube.json';
}

// ==========================================
// LOAD YOUTUBE DATA
// ==========================================

async function loadYouTubeData() {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    container.innerHTML = '<p style="text-align:center;color:#fff;padding:40px;">⏳ Loading your videos...</p>';
    
    try {
        const path = getDataPath();
        const response = await fetch(path + '?t=' + Date.now());
        
        if (!response.ok) {
            throw new Error('Failed to load file');
        }
        
        const data = await response.json();
        allYouTubeVideos = data.videos || [];
        allYouTubePosts = data.posts || [];
        
        // UPDATE TIMESTAMP HERE
        updateTimestamp(data);
        
        updateStatistics();
        updateDashboard();
        updateFeaturedVideo();
        
        const activeCategory = document.querySelector('.category.active');
        const category = activeCategory ? activeCategory.dataset.category : 'all';
        renderContent(category);
        
        console.log(`✅ Loaded ${allYouTubeVideos.length} videos`);
        
    } catch (error) {
        console.error('Failed to load YouTube data:', error);
        container.innerHTML = `<p style="text-align:center;color:#ff0000;padding:40px;">❌ Could not find data/youtube.json.</p>`;
    }
}

// ==========================================
// UPDATE TIMESTAMP (NEW)
// ==========================================

function updateTimestamp(data) {
    const lastSyncEl = document.getElementById('lastSyncTime');
    if (lastSyncEl && data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        const formatted = date.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });
        lastSyncEl.textContent = formatted;
    } else if (lastSyncEl) {
        lastSyncEl.textContent = 'Not available';
    }
}

// ==========================================
// RENDER CONTENT
// ==========================================

function renderContent(type) {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    if (!container) return;
    
    container.innerHTML = '';
    
    let filtered = allYouTubeVideos;
    
    if (type === 'video') {
        filtered = allYouTubeVideos.filter(item => item.type === 'video');
    } else if (type === 'short') {
        filtered = allYouTubeVideos.filter(item => item.type === 'short');
    } else if (type === 'live') {
        filtered = allYouTubeVideos.filter(item => item.type === 'live');
    } else if (type === 'post') {
        filtered = allYouTubePosts;
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#666;padding:40px;">No ${type === 'all' ? '' : type} content found</p>`;
        return;
    }
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        // Thumbnail logic
        const videoId = item.id;
        const imgUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        card.innerHTML = `
            <div class="thumbnail" style="background:#2a2a2a; display:flex; align-items:center; justify-content:center; overflow:hidden; position:relative;">
                <img src="${imgUrl}" 
                     alt="${item.title}" 
                     class="youtube-thumbnail" 
                     loading="lazy" 
                     style="width:100%; height:100%; object-fit:cover;"
                     onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${videoId}/hqdefault.jpg';">
            </div>
            <div class="card-content">
                <span class="content-type">${item.type.toUpperCase()}</span>
                <h3>${item.title}</h3>
                <div class="card-footer">
                    <span class="date">${new Date(item.publishedAt).toLocaleDateString()}</span>
                    <a href="https://www.youtube.com/watch?v=${item.id}" class="watch-btn" target="_blank">Watch</a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// HELPERS
// ==========================================

function getContentIcon(type) {
    const icons = { video: '🎬', short: '📱', live: '🔴', post: '📝' };
    return icons[type] || '🎮';
}

// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {
    let videos = 0, shorts = 0, live = 0, posts = 0;
    
    allYouTubeVideos.forEach(v => {
        if (v.type === 'video') videos++;
        else if (v.type === 'short') shorts++;
        else if (v.type === 'live') live++;
    });
    
    allYouTubePosts.forEach(() => posts++);
    
    const numbers = document.querySelectorAll('.stat-number');
    if (numbers.length >= 4) {
        numbers[0].textContent = videos;
        numbers[1].textContent = shorts;
        numbers[2].textContent = live;
        numbers[3].textContent = posts;
    }
}

// ==========================================
// UPDATE FEATURED VIDEO
// ==========================================

function updateFeaturedVideo() {
    const featured = allYouTubeVideos.find(v => v.type === 'video');
    
    const thumbnail = document.getElementById('featuredThumbnail');
    const title = document.getElementById('featuredTitle');
    const description = document.getElementById('featuredDescription');
    const date = document.getElementById('featuredDate');
    const watch = document.getElementById('featuredWatch');
    
    if (!thumbnail || !title || !description || !date || !watch) return;
    
    if (!featured) {
        title.textContent = 'No featured video yet';
        return;
    }
    
    thumbnail.innerHTML = `<img src="${featured.thumbnail || `https://img.youtube.com/vi/${featured.id}/maxresdefault.jpg`}" alt="Featured Video">`;
    title.textContent = featured.title;
    description.textContent = 'Latest upload from BS Gamer_z.';
    date.textContent = new Date(featured.publishedAt).toLocaleDateString();
    watch.href = `https://www.youtube.com/watch?v=${featured.id}`;
}

// ==========================================
// CATEGORY BUTTONS
// ==========================================

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        categoryButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderContent(this.dataset.category);
    });
});

// ==========================================
// ADD CONTENT BUTTON (FIXED)
// ==========================================

if (addContentButton && addContentForm) {
    addContentButton.addEventListener('click', function() {
        editingId = null;
        contentForm.reset();
        addContentForm.classList.add('show');
        addContentForm.scrollIntoView({ behavior: 'smooth' });
    });
}

if (cancelContentButton && addContentForm) {
    cancelContentButton.addEventListener('click', function() {
        addContentForm.classList.remove('show');
    });
}

// ==========================================
// SHARE BUTTON (FIXED)
// ==========================================

const shareButton = document.getElementById('shareWebsite');
if (shareButton) {
    shareButton.addEventListener('click', async function() {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'BS Gamer_z',
                    text: 'Check out BS Gamer_z for gaming videos, Shorts, live streams, and more!',
                    url: window.location.origin
                });
            } else {
                await navigator.clipboard.writeText(window.location.origin);
                alert('Website link copied to clipboard! 🔗');
            }
        } catch (error) {
            console.log('Share cancelled or failed.');
        }
    });
}

// ==========================================
// DASHBOARD (FIXED)
// ==========================================

function updateDashboard() {
    const videos = allYouTubeVideos.filter(v => v.type === 'video').length;
    const shorts = allYouTubeVideos.filter(v => v.type === 'short').length;
    const live = allYouTubeVideos.filter(v => v.type === 'live').length;
    const posts = allYouTubePosts.length;
    const visits = Number(localStorage.getItem('bs_website_visits')) || 0;
    
    document.getElementById('dashVideos').textContent = videos;
    document.getElementById('dashShorts').textContent = shorts;
    document.getElementById('dashLive').textContent = live;
    document.getElementById('dashPosts').textContent = posts;
    document.getElementById('dashVisits').textContent = visits.toLocaleString();
}

document.getElementById('dashboardButton').addEventListener('click', () => {
    updateDashboard();
    document.getElementById('dashboardPanel').classList.add('show');
});
document.getElementById('closeDashboard').addEventListener('click', () => {
    document.getElementById('dashboardPanel').classList.remove('show');
});

// ==========================================
// VISITOR COUNTER
// ==========================================

const visitorElement = document.getElementById('visitorCount');
if (visitorElement) {
    let visits = Number(localStorage.getItem('bs_website_visits')) || 0;
    visits++;
    localStorage.setItem('bs_website_visits', visits);
    visitorElement.textContent = visits.toLocaleString();
}

// ==========================================
// INITIALIZE
// ==========================================

loadYouTubeData();

// ==========================================
// SCROLL-BASED HEADER (Shrink Effect)
// ==========================================

const header = document.querySelector('header');

if (header) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 80) {
            header.classList.add('shrink');
        } else {
            header.classList.remove('shrink');
        }
    });
}

// ==========================================
// SECRET ADMIN MODE (Hides buttons from public)
// ==========================================

const adminButtons = document.querySelectorAll('.add-content-btn, .dashboard-btn, #dashboardButton, .settings-btn, .share-btn');

// Hide admin buttons by default
adminButtons.forEach(btn => {
    if (btn) btn.style.display = 'none';
});

// Secret code: Type "bsgamerz" in the console to reveal buttons
console.log('🔒 Admin mode is hidden. Type "bsgamerz" in the console to unlock.');

// Listen for the secret key
window.addEventListener('keydown', function(e) {
    // Check if user types "bsgamerz" in the console or presses a secret key combo
    if (e.key === 'z' && e.ctrlKey && e.shiftKey) {
        // Ctrl + Shift + Z reveals the buttons
        adminButtons.forEach(btn => {
            if (btn) btn.style.display = 'inline-block';
        });
        console.log('✅ Admin mode unlocked! Add Content and Dashboard are now visible.');
        alert('🔓 Admin mode unlocked! You can now use Add Content and Dashboard.');
    }
});

// Also allow unlocking via console command
window.unlockAdmin = function() {
    adminButtons.forEach(btn => {
        if (btn) btn.style.display = 'inline-block';
    });
    console.log('✅ Admin mode unlocked via console!');
};

console.log('💡 Tip: You can also type unlockAdmin() in the console to show buttons.');

console.log('BS Gamer_z website loaded successfully! ✅');