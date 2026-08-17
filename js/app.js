// ==========================================
// BS Gamer_z - ULTIMATE FIX
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
// LOAD YOUTUBE DATA (ULTIMATE FIX)
// ==========================================

async function loadYouTubeData() {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    container.innerHTML = '<p style="text-align:center;color:#fff;padding:40px;">⏳ Loading your videos...</p>';
    
    try {
        // ULTIMATE FIX: Exact path with cache-buster
        const response = await fetch('/BS-Gamer-z/data/youtube.json?t=' + Date.now());
        
        if (!response.ok) {
            throw new Error('Failed to load file');
        }
        
        const data = await response.json();
        allYouTubeVideos = data.videos || [];
        
        // Update everything
        updateStatistics();
        updateFeaturedVideo();
        renderContent('all');
        
        console.log(`✅ Loaded ${allYouTubeVideos.length} videos`);
        
    } catch (error) {
        console.error('Failed to load YouTube data:', error);
        container.innerHTML = `<p style="text-align:center;color:#ff0000;padding:40px;">❌ Could not find data/youtube.json. Please make sure the file exists.</p>`;
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
    }
    
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center;color:#666;padding:40px;">No ${type === 'all' ? '' : type} content found</p>`;
        return;
    }
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <div class="thumbnail">
                <img src="${item.thumbnail}" alt="${item.title}" class="youtube-thumbnail" loading="lazy">
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
// UPDATE STATISTICS
// ==========================================

function updateStatistics() {
    let videos = 0, shorts = 0, live = 0;
    
    allYouTubeVideos.forEach(v => {
        if (v.type === 'video') videos++;
        else if (v.type === 'short') shorts++;
        else if (v.type === 'live') live++;
    });
    
    const numbers = document.querySelectorAll('.stat-number');
    if (numbers.length >= 4) {
        numbers[0].textContent = videos;
        numbers[1].textContent = shorts;
        numbers[2].textContent = live;
        numbers[3].textContent = 0;
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
    
    thumbnail.innerHTML = `<img src="${featured.thumbnail}" alt="Featured Video">`;
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
// INITIALIZE
// ==========================================

loadYouTubeData();

console.log('BS Gamer_z website loaded!');