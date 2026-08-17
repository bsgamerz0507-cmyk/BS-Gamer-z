// ==========================================
// BS Gamer_z - Main App (FULLY WORKING)
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
// LOAD YOUTUBE DATA (WITH SKELETON LOADING)
// ==========================================

async function loadYouTubeData() {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    
    // Show skeletons immediately
    showSkeletons(container);
    
    try {
        const response = await fetch('data/youtube.json');
        const data = await response.json();
        allYouTubeVideos = data.videos || [];
        allYouTubePosts = data.posts || [];
        // ==========================================
// UPDATE LAST SYNCED TIMESTAMP
// ==========================================
   // ==========================================
// UPDATE LAST SYNCED TIMESTAMP (SAFER VERSION)
// ==========================================
const lastSyncEl = document.getElementById('lastSyncTime');
if (lastSyncEl) {
    if (data.lastUpdated) {
        const date = new Date(data.lastUpdated);
        const formatted = date.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true
        });
        lastSyncEl.textContent = formatted;
    } else {
        // If the field is missing, show a friendly fallback
        lastSyncEl.textContent = "Not available";
    }
}
        checkLiveStreams();
        console.log(`✅ Loaded ${allYouTubeVideos.length} YouTube videos`);
        console.log(`✅ Loaded ${allYouTubePosts.length} community posts`);
        
        updateStatistics();
        updateDashboard();
        updateFeaturedVideo();
        
        const activeCategory = document.querySelector('.category.active');
        const category = activeCategory ? activeCategory.dataset.category : 'all';
        renderContent(category);
        
    } catch (error) {
        console.error('Failed to load YouTube data:', error);
        // Show error message
        container.innerHTML = `<p style="text-align:center;color:#ff0000;padding:40px;">⚠️ Failed to load data. Please refresh.</p>`;
    }
}

// ==========================================
// RENDER CONTENT WITH PAGINATION
// ==========================================

function renderContent(type) {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    if (!container) return;
    
    // Only use YouTube data (ignore localStorage to prevent duplicates)
    let allContent = [];
    
    allYouTubeVideos.forEach(video => {
        allContent.push({
            id: 'yt_v_' + video.id,
            type: video.type,
            title: video.title,
            description: video.description || '',
            url: `https://www.youtube.com/watch?v=${video.id}`,
            thumbnail: video.thumbnail,
            category: 'YouTube',
            date: new Date(video.publishedAt).toISOString().split('T')[0],
            isAuto: true,
            durationSeconds: video.durationSeconds,
            isShort: video.isShort,
            isLive: video.isLive,
            publishedAt: video.publishedAt
        });
    });
    
    allYouTubePosts.forEach(post => {
        allContent.push({
            id: 'yt_p_' + post.id,
            type: 'post',
            title: post.title || 'Community Post',
            description: post.description || '',
            url: post.url || `https://www.youtube.com/channel/UC_DHq9eu17O5QFfVvne1Htg/community`,
            thumbnail: post.thumbnail || '',
            category: 'YouTube Community',
            date: new Date(post.publishedAt).toISOString().split('T')[0],
            isAuto: true,
            publishedAt: post.publishedAt
        });
    });
    
    let filtered = allContent;
    if (type === 'video') {
        filtered = allContent.filter(item => item.type === 'video');
    } else if (type === 'short') {
        filtered = allContent.filter(item => item.type === 'short');
    } else if (type === 'live') {
        filtered = allContent.filter(item => item.type === 'live');
    } else if (type === 'post') {
        filtered = allContent.filter(item => item.type === 'post');
    }
    
    currentPage = 1;
    renderPage(filtered, type);
        // ... inside renderContent, after the cards are added
    initLazyLoading();
}
}

// ==========================================
// RENDER A SINGLE PAGE (WITH CATEGORY ICON + TYPE BADGE)
// ==========================================

function renderPage(filteredItems, type) {
    const container = document.getElementById('youtubeContentGrid') || contentGrid;
    if (!container) return;
    
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const pageItems = filteredItems.slice(start, end);
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    
    console.log(`📊 Showing page ${currentPage} of ${totalPages} (${pageItems.length} items)`);
    
    container.innerHTML = '';
    
    if (pageItems.length === 0 && currentPage === 1) {
        container.innerHTML = `<p style="text-align:center;color:#666;padding:40px;">No ${type === 'all' ? '' : type} content found</p>`;
        return;
    }
    
    pageItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const icon = getContentIcon(item.type);
        const thumbnail = item.thumbnail || getYouTubeThumbnail(item.url);
        
        // Category icon label (top-left)
        let categoryLabel = '';
        if (item.type === 'video') categoryLabel = '🎬 Video';
        else if (item.type === 'short') categoryLabel = '📱 Short';
        else if (item.type === 'live') categoryLabel = '🔴 Live';
        else if (item.type === 'post') categoryLabel = '📝 Post';
        
        // Type badge label (bottom-left)
        let badgeLabel = '';
        let badgeClass = '';
        if (item.type === 'video') { badgeLabel = 'Video'; badgeClass = 'video'; }
        else if (item.type === 'short') { badgeLabel = 'Short'; badgeClass = 'short'; }
        else if (item.type === 'live') { badgeLabel = 'Live'; badgeClass = 'live'; }
        else if (item.type === 'post') { badgeLabel = 'Post'; badgeClass = 'post'; }
        
        if (item.type === 'post') {
            card.innerHTML = `
                <div class="thumbnail" style="background:#272727;min-height:80px;display:flex;align-items:center;justify-content:center;position:relative;">
                    <span class="category-icon">${categoryLabel}</span>
                    <span class="type-badge ${badgeClass}">${badgeLabel}</span>
                    ${thumbnail ? `<img src="${thumbnail}" alt="${item.title}" class="youtube-thumbnail" loading="lazy" style="height:80px;object-fit:cover;">` : `<span class="thumbnail-icon" style="font-size:40px;">📝</span>`}
                </div>
                <div class="card-content">
                    <span class="content-type">📝 POST ${item.isAuto ? '🔁' : ''}</span>
                    <h3>${escapeHTML(item.title)}</h3>
                    <p>${escapeHTML(item.description || '').substring(0, 120)}${item.description && item.description.length > 120 ? '...' : ''}</p>
                    <div class="card-footer">
                        <span class="date">${item.date || new Date(item.publishedAt || Date.now()).toLocaleDateString()}</span>
                        <a href="${escapeAttribute(item.url)}" class="watch-btn" target="_blank" rel="noopener noreferrer">View Post</a>
                    </div>
                </div>
            `;
        } else {
            card.innerHTML = `
                <div class="thumbnail" style="position:relative;">
                    <span class="category-icon">${categoryLabel}</span>
                    <span class="type-badge ${badgeClass}">${badgeLabel}</span>
                    ${thumbnail ? `<img src="${thumbnail}" alt="${item.title}" class="youtube-thumbnail" loading="lazy">` : `<span class="thumbnail-icon">${icon}</span>`}
                </div>
                <div class="card-content">
                    <span class="content-type">${item.type.toUpperCase()} ${item.isAuto ? '🔁' : ''}</span>
                    <h3>${escapeHTML(item.title)}</h3>
                    <p>${escapeHTML(item.description || '').substring(0, 80)}${item.description && item.description.length > 80 ? '...' : ''}</p>
                    ${item.category ? `<p>🏷️ ${escapeHTML(item.category)}</p>` : ''}
                    <div class="card-footer">
                        <span class="date">${item.date || new Date(item.publishedAt || Date.now()).toLocaleDateString()}</span>
                        <a href="${escapeAttribute(item.url)}" class="watch-btn" target="_blank" rel="noopener noreferrer">Watch</a>
                    </div>
                </div>
            `;
        }
        
        container.appendChild(card);
        
        if (item.type === 'short') {
            const watchBtn = card.querySelector('.watch-btn');
            if (watchBtn) {
                watchBtn.textContent = '📱 Watch Short';
                watchBtn.target = '_blank';
                watchBtn.rel = 'noopener noreferrer';
            }
        }
    });
    
    if (currentPage < totalPages) {
        const loadMoreWrapper = document.createElement('div');
        loadMoreWrapper.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 20px 0;';
        
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.textContent = `📥 Load More (${currentPage} / ${totalPages})`;
        loadMoreBtn.style.cssText = `
            background: #ff0000;
            color: #fff;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
            font-size: 16px;
            transition: 0.2s;
        `;
        loadMoreBtn.addEventListener('mouseover', () => {
            loadMoreBtn.style.background = '#cc0000';
        });
        loadMoreBtn.addEventListener('mouseout', () => {
            loadMoreBtn.style.background = '#ff0000';
        });
        
        loadMoreBtn.addEventListener('click', function() {
            currentPage++;
            renderPage(filteredItems, type);
            const grid = document.getElementById('youtubeContentGrid') || contentGrid;
            if (grid) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        
        loadMoreWrapper.appendChild(loadMoreBtn);
        container.appendChild(loadMoreWrapper);
    }
}

// ==========================================
// HELPERS
// ==========================================

function getContentIcon(type) {
    const icons = { video: '🎬', short: '📱', live: '🔴', post: '📝' };
    return icons[type] || '🎮';
}

function getYouTubeThumbnail(url) {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
}

function getYouTubeVideoId(url) {
    try {
        const parsed = new URL(url);
        if (parsed.hostname.includes('youtube.com')) {
            if (parsed.searchParams.get('v')) return parsed.searchParams.get('v');
            if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/shorts/')[1].split('/')[0];
            if (parsed.pathname.startsWith('/live/')) return parsed.pathname.split('/live/')[1].split('/')[0];
        }
        if (parsed.hostname === 'youtu.be') return parsed.pathname.substring(1).split('/')[0];
    } catch {}
    return null;
}

function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function escapeAttribute(text) {
    return String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================
// UPDATE STATISTICS (FIXED - NO DOUBLE COUNTING)
// ==========================================

function updateStatistics() {
    let videos = 0, shorts = 0, live = 0, posts = 0;
    
    // Only count from YouTube data (ignore localStorage to prevent duplicates)
    allYouTubeVideos.forEach(v => {
        if (v.type === 'video') videos++;
        else if (v.type === 'short') shorts++;
        else if (v.type === 'live') live++;
    });
    
    // Count posts from YouTube
    allYouTubePosts.forEach(() => posts++);
    
    // Show the numbers
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
    let featured = allYouTubeVideos.find(v => v.type === 'video');
    if (!featured) featured = contentData.find(v => v.type === 'video');
    
    const thumbnail = document.getElementById('featuredThumbnail');
    const title = document.getElementById('featuredTitle');
    const description = document.getElementById('featuredDescription');
    const date = document.getElementById('featuredDate');
    const watch = document.getElementById('featuredWatch');
    
    if (!thumbnail || !title || !description || !date || !watch) return;
    
    if (!featured) {
        thumbnail.innerHTML = '<span class="featured-placeholder">🎬</span>';
        title.textContent = 'No featured video yet';
        description.textContent = 'Add your first YouTube video and it will appear here automatically.';
        date.textContent = '—';
        watch.href = '#';
        return;
    }
    
    const thumb = featured.thumbnail || getYouTubeThumbnail(featured.url);
    thumbnail.innerHTML = thumb ? `<img src="${thumb}" alt="Featured Video">` : '<span class="featured-placeholder">🎬</span>';
    title.textContent = featured.title;
    description.textContent = featured.description || 'Latest upload from BS Gamer_z.';
    date.textContent = featured.date || new Date(featured.publishedAt || Date.now()).toLocaleDateString();
    watch.href = featured.url || `https://www.youtube.com/watch?v=${featured.id}`;
}

// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {
    const videos = allYouTubeVideos.filter(v => v.type === 'video').length + contentData.filter(v => v.type === 'video').length;
    const shorts = allYouTubeVideos.filter(v => v.type === 'short').length + contentData.filter(v => v.type === 'short').length;
    const live = allYouTubeVideos.filter(v => v.type === 'live').length + contentData.filter(v => v.type === 'live').length;
    const posts = allYouTubePosts.length + contentData.filter(v => v.type === 'post').length;
    const visits = Number(localStorage.getItem('bs_website_visits')) || 0;
    const latestVideo = allYouTubeVideos.find(v => v.type === 'video') || contentData.find(v => v.type === 'video');
    
    document.getElementById('dashVideos').textContent = videos;
    document.getElementById('dashShorts').textContent = shorts;
    document.getElementById('dashLive').textContent = live;
    document.getElementById('dashPosts').textContent = posts;
    document.getElementById('dashVisits').textContent = visits.toLocaleString();
    document.getElementById('dashboardLatestTitle').textContent = latestVideo ? latestVideo.title : 'No videos yet';
}

// ==========================================
// CATEGORY BUTTONS (FIXED)
// ==========================================

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        categoryButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.category;
        renderContent(category);
    });
});

// ==========================================
// SEARCH
// ==========================================

function filterContent() {
    const searchText = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeButton = document.querySelector('.category.active');
    const category = activeButton ? activeButton.dataset.category : 'all';
    
    currentPage = 1;
    renderContent(category);
    
    setTimeout(() => {
        const cards = contentGrid.querySelectorAll('.card');
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(searchText) ? '' : 'none';
        });
    }, 100);
}

if (searchInput) {
    searchInput.addEventListener('input', filterContent);
}

// ==========================================
// ADD / EDIT / DELETE CONTENT (Manual)
// ==========================================

if (addContentButton && addContentForm) {
    addContentButton.addEventListener('click', function() {
        editingId = null;
        contentForm.reset();
        updateFormTitle();
        addContentForm.classList.add('show');
        addContentForm.scrollIntoView({ behavior: 'smooth' });
    });
}

if (cancelContentButton && addContentForm) {
    cancelContentButton.addEventListener('click', closeForm);
}

function closeForm() {
    editingId = null;
    contentForm.reset();
    addContentForm.classList.remove('show');
    updateFormTitle();
}

function updateFormTitle() {
    const title = addContentForm.querySelector('h2');
    if (title) {
        title.textContent = editingId !== null ? 'Edit Content' : 'Add New Content';
    }
}

if (contentForm) {
    contentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const type = document.querySelector('#contentType')?.value || '';
        const title = document.querySelector('#contentTitle')?.value.trim() || '';
        const url = document.querySelector('#contentUrl')?.value.trim() || '';
        const description = document.querySelector('#contentDescription')?.value.trim() || '';
        const category = document.querySelector('#contentCategory')?.value.trim() || '';
        const date = document.querySelector('#contentDate')?.value || '';
        
        if (!title || !url) {
            alert('Please enter a title and YouTube link.');
            return;
        }
        
        if (editingId !== null) {
            const index = contentData.findIndex(item => item.id === editingId);
            if (index !== -1) {
                contentData[index] = { ...contentData[index], type, title, url, description, category, date };
            }
            saveContent();
            renderContent(document.querySelector('.category.active')?.dataset.category || 'all');
            closeForm();
            alert('Content updated successfully! ✅');
            return;
        }
        
        contentData.unshift({
            id: Date.now(),
            type, title, url, description, category, date
        });
        saveContent();
        renderContent(document.querySelector('.category.active')?.dataset.category || 'all');
        closeForm();
        alert('Content added successfully! 🎉');
    });
}

if (contentGrid) {
    contentGrid.addEventListener('click', function(event) {
        const editBtn = event.target.closest('.edit-btn');
        const deleteBtn = event.target.closest('.delete-btn');
        
        if (editBtn) editContent(Number(editBtn.dataset.id));
        if (deleteBtn) deleteContent(Number(deleteBtn.dataset.id));
    });
}

function editContent(id) {
    const content = contentData.find(item => item.id === id);
    if (!content || !addContentForm || !contentForm) return;
    
    editingId = id;
    document.querySelector('#contentType').value = content.type;
    document.querySelector('#contentTitle').value = content.title;
    document.querySelector('#contentUrl').value = content.url;
    document.querySelector('#contentDescription').value = content.description || '';
    document.querySelector('#contentCategory').value = content.category || '';
    document.querySelector('#contentDate').value = content.date || '';
    
    updateFormTitle();
    addContentForm.classList.add('show');
    addContentForm.scrollIntoView({ behavior: 'smooth' });
}

function deleteContent(id) {
    const content = contentData.find(item => item.id === id);
    if (!content) return;
    if (!confirm(`Delete "${content.title}"?`)) return;
    
    contentData = contentData.filter(item => item.id !== id);
    saveContent();
    renderContent(document.querySelector('.category.active')?.dataset.category || 'all');
    alert('Content deleted successfully.');
}

// ==========================================
// NAVIGATION
// ==========================================

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const page = this.textContent.toLowerCase().trim();
        const categoryMap = { home: 'all', videos: 'video', shorts: 'short', live: 'live', posts: 'post' };
        const category = categoryMap[page] || 'all';
        const categoryBtn = document.querySelector(`.category[data-category="${category}"]`);
        if (categoryBtn) categoryBtn.click();
    });
});

// ==========================================
// SHARE BUTTON
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
        } catch {}
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================

const scrollTopBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================
// DASHBOARD
// ==========================================

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
// SHOW SKELETON LOADING CARDS
// ==========================================

function showSkeletons(container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create skeleton wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-wrapper';
    
    // Generate 6 skeleton cards
    for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'skeleton-card';
        card.innerHTML = `
            <div class="skeleton-thumbnail"></div>
            <div class="skeleton-content">
                <div class="skeleton-line short"></div>
                <div class="skeleton-line long"></div>
                <div class="skeleton-line medium"></div>
                <div class="skeleton-line short" style="margin-bottom:0;"></div>
            </div>
        `;
        wrapper.appendChild(card);
    }
    
    container.appendChild(wrapper);
}
// ==========================================
// INITIALIZE
// ==========================================

loadYouTubeData();
renderContent('all');

// ==========================================
// LIVE NOW BANNER LOGIC
// ==========================================

function checkLiveStreams() {
    const banner = document.getElementById('liveBanner');
    const link = document.getElementById('liveBannerLink');
    
    if (!banner || !link) return;
    
    // Check YouTube videos for any currently live streams
    const liveStream = allYouTubeVideos.find(v => v.isLive === true);
    
    if (liveStream) {
        // Show banner
        banner.style.display = 'block';
        link.href = `https://www.youtube.com/watch?v=${liveStream.id}`;
    } else {
        // Hide banner
        banner.style.display = 'none';
    }
}

// ==========================================
// SCROLL-BASED HEADER
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
// LAZY LOAD IMAGES (Intersection Observer)
// ==========================================

function initLazyLoading() {
    const images = document.querySelectorAll('.youtube-thumbnail, .card img, .featured-thumbnail img');
    
    if (!('IntersectionObserver' in window)) {
        // If browser doesn't support IntersectionObserver, just load all images
        images.forEach(img => {
            img.loading = 'lazy';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                // If the image has a data-src, load it
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '200px 0px', // Start loading 200px before the image comes into view
        threshold: 0.01
    });

    images.forEach(img => {
        // If the image already has a src, don't lazy load it (it's already loaded)
        if (!img.src || img.src === '') {
            // Store the original source in data-src
            if (img.dataset.src) return;
            // For images loaded via JS, they'll have a src already
            return;
        }
        
        // If the image has a src but isn't loaded yet, observe it
        if (img.src && img.complete === false) {
            observer.observe(img);
        } else if (!img.src) {
            observer.observe(img);
        }
    });
}

console.log('BS Gamer_z website loaded successfully! ✅');