// ==========================================
// BS Gamer_z - Main App
// Add / Search / Filter / Edit / Delete
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
let editingId = null;

// ==========================================
// LOAD CONTENT
// ==========================================

function loadContent() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("Error loading content:", error);
        return [];
    }
}

// ==========================================
// SAVE CONTENT
// ==========================================

function saveContent() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(contentData)
    );
}

// ==========================================
// YOUTUBE VIDEO ID
// ==========================================

function getYouTubeVideoId(url) {
    try {
        const parsedURL = new URL(url);

        // youtube.com/watch?v=XXXX
        if (
            parsedURL.hostname.includes("youtube.com") &&
            parsedURL.searchParams.get("v")
        ) {
            return parsedURL.searchParams.get("v");
        }

        // youtube.com/shorts/XXXX
        if (
            parsedURL.hostname.includes("youtube.com") &&
            parsedURL.pathname.startsWith("/shorts/")
        ) {
            return parsedURL.pathname
                .split("/shorts/")[1]
                .split("/")[0];
        }

        // youtube.com/live/XXXX
        if (
            parsedURL.hostname.includes("youtube.com") &&
            parsedURL.pathname.startsWith("/live/")
        ) {
            return parsedURL.pathname
                .split("/live/")[1]
                .split("/")[0];
        }

        // youtu.be/XXXX
        if (parsedURL.hostname === "youtu.be") {
            return parsedURL.pathname
                .substring(1)
                .split("/")[0];
        }

    } catch (error) {
        console.error("Invalid YouTube URL:", error);
    }

    return null;
}

// ==========================================
// YOUTUBE THUMBNAIL
// ==========================================

function getYouTubeThumbnail(url) {
    const videoId = getYouTubeVideoId(url);

    if (!videoId) {
        return null;
    }

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// ==========================================
// CONTENT ICON
// ==========================================

function getContentIcon(type) {
    switch (type) {
        case "video":
            return "🎬";

        case "short":
            return "📱";

        case "live":
            return "🔴";

        case "post":
            return "📝";

        default:
            return "🎮";
    }
}

// ==========================================
// CREATE CONTENT CARD
// ==========================================

function createContentCard(content) {
    const card = document.createElement("div");
    card.className = "card";

    const thumbnail = getYouTubeThumbnail(content.url);
    const icon = getContentIcon(content.type);

    card.innerHTML = `
        <div class="thumbnail">

            ${
                thumbnail
                    ? `
                        <img
                            src="${escapeAttribute(thumbnail)}"
                            alt="YouTube thumbnail"
                            class="youtube-thumbnail"
                        >
                    `
                    : `
                        <span class="thumbnail-icon">
                            ${icon}
                        </span>
                    `
            }

        </div>

        <div class="card-content">

            <span class="content-type">
                ${escapeHTML(content.type.toUpperCase())}
            </span>

            <h3>
                ${escapeHTML(content.title)}
            </h3>

            <p>
                ${escapeHTML(content.description || "")}
            </p>

            ${
                content.category
                    ? `
                        <p>
                            🏷️ ${escapeHTML(content.category)}
                        </p>
                    `
                    : ""
            }

            <div class="card-footer">

                <span class="date">
                    ${escapeHTML(content.date || "")}
                </span>

                <a
                    href="${escapeAttribute(content.url)}"
                    class="watch-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Watch
                </a>

            </div>

            <div class="management-buttons">

                <button
                    type="button"
                    class="edit-btn"
                    data-id="${content.id}"
                >
                    ✏️ Edit
                </button>

                <button
                    type="button"
                    class="delete-btn"
                    data-id="${content.id}"
                >
                    🗑️ Delete
                </button>

            </div>

        </div>
    `;

    return card;
}

// ==========================================
// CREATOR DASHBOARD
// ==========================================

const dashboardButton =
    document.getElementById("dashboardButton");

const dashboardPanel =
    document.getElementById("dashboardPanel");

const closeDashboard =
    document.getElementById("closeDashboard");

if (dashboardButton && dashboardPanel) {

    dashboardButton.addEventListener("click", function () {

        updateDashboard();

        dashboardPanel.classList.add("show");

    });

}

if (closeDashboard && dashboardPanel) {

    closeDashboard.addEventListener("click", function () {

        dashboardPanel.classList.remove("show");

    });

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const videos =
        contentData.filter(item => item.type === "video").length;

    const shorts =
        contentData.filter(item => item.type === "short").length;

    const live =
        contentData.filter(item => item.type === "live").length;

    const posts =
        contentData.filter(item => item.type === "post").length;

    const visits =
        Number(localStorage.getItem("bs_website_visits")) || 0;

    const latestVideo =
        contentData.find(item => item.type === "video");


    setDashValue("dashVideos", videos);

    setDashValue("dashShorts", shorts);

    setDashValue("dashLive", live);

    setDashValue("dashPosts", posts);

    setDashValue("dashVisits", visits.toLocaleString());


    const latestTitle =
        document.getElementById("dashboardLatestTitle");

    if (latestTitle) {

        latestTitle.textContent =
            latestVideo
                ? latestVideo.title
                : "No videos yet";

    }

}


// ==========================================
// DASHBOARD HELPER
// ==========================================

function setDashValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent = value;

    }

}
// ==========================================
// SHARE WEBSITE
// ==========================================

const shareButton =
    document.getElementById("shareWebsite");

if (shareButton) {

    shareButton.addEventListener("click", async function () {

        const shareData = {

            title: "BS Gamer_z",

            text: "Check out BS Gamer_z for gaming videos, Shorts, live streams, and more!",

            url: window.location.origin

        };

        try {

            if (navigator.share) {

                await navigator.share(shareData);

            } else {

                await navigator.clipboard.writeText(shareData.url);

                alert("Website link copied to clipboard! 🔗");

            }

        } catch (error) {

            console.log("Share cancelled.");

        }

    });

}

// ==========================================
// RENDER CONTENT
// ==========================================

function renderContent() {

    if (!contentGrid) {
        return;
    }
     updateDashboard();
     updateFeaturedVideo();
    contentGrid.innerHTML = "";

    if (contentData.length === 0) {

        contentGrid.innerHTML = `
            <div class="card">

                <div class="thumbnail">
                    🎮
                </div>

                <div class="card-content">

                    <span class="content-type">
                        INFO
                    </span>

                    <h3>
                        No content added yet
                    </h3>

                    <p>
                        Click "+ Add Content"
                        to add your first content.
                    </p>

                </div>

            </div>
        `;

        updateStatistics();
        return;
    }

    contentData.forEach(function(content) {

        contentGrid.appendChild(
            createContentCard(content)
        );

    });

    updateStatistics();
    filterContent();
}

// ==========================================
// PWA SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", function () {

        navigator.serviceWorker.register("./sw.js")

            .then(function () {

                console.log("Service Worker registered ✅");

            })

            .catch(function (error) {

                console.error("Service Worker failed:", error);

            });

    });

}

// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        filterContent
    );

}

// ==========================================
// CATEGORY FILTER
// ==========================================

categoryButtons.forEach(function(button) {

    button.addEventListener(
        "click",
        function() {

            categoryButtons.forEach(
                function(btn) {
                    btn.classList.remove("active");
                }
            );

            button.classList.add("active");

            filterContent();
        }
    );

});

// ==========================================
// FILTER CONTENT
// ==========================================

function filterContent() {

    if (!contentGrid) {
        return;
    }

    const searchText = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const activeButton =
        document.querySelector(".category.active");

    let selectedCategory = "all";

    if (activeButton) {
        selectedCategory = activeButton.textContent
            .toLowerCase()
            .trim();
    }

    const cards =
        contentGrid.querySelectorAll(".card");

    cards.forEach(function(card) {

        const typeElement =
            card.querySelector(".content-type");

        if (!typeElement) {
            return;
        }

        const type =
            typeElement.textContent
                .toLowerCase()
                .trim();

        const cardText =
            card.textContent.toLowerCase();

        let categoryMatches = false;

        if (selectedCategory === "all") {
            categoryMatches = true;
        }
        else if (
            selectedCategory.includes("video") &&
            type === "video"
        ) {
            categoryMatches = true;
        }
        else if (
            selectedCategory.includes("short") &&
            type === "short"
        ) {
            categoryMatches = true;
        }
        else if (
            selectedCategory.includes("live") &&
            type === "live"
        ) {
            categoryMatches = true;
        }
        else if (
            selectedCategory.includes("post") &&
            type === "post"
        ) {
            categoryMatches = true;
        }

        const searchMatches =
            cardText.includes(searchText);

        if (
            categoryMatches &&
            searchMatches
        ) {
            card.style.display = "";
        }
        else {
            card.style.display = "none";
        }

    });
}

// ==========================================
// OPEN ADD CONTENT FORM
// ==========================================

if (
    addContentButton &&
    addContentForm &&
    contentForm
) {

    addContentButton.addEventListener(
        "click",
        function() {

            editingId = null;

            contentForm.reset();

            updateFormTitle();

            addContentForm.classList.add("show");

            addContentForm.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }
    );

}

// ==========================================
// CANCEL FORM
// ==========================================

if (
    cancelContentButton &&
    addContentForm &&
    contentForm
) {

    cancelContentButton.addEventListener(
        "click",
        closeForm
    );

}

function closeForm() {

    if (!contentForm || !addContentForm) {
        return;
    }

    editingId = null;

    contentForm.reset();

    addContentForm.classList.remove("show");

    updateFormTitle();
}

// ==========================================
// FORM TITLE
// ==========================================

function updateFormTitle() {

    if (!addContentForm) {
        return;
    }

    const title =
        addContentForm.querySelector("h2");

    if (!title) {
        return;
    }

    if (editingId !== null) {
        title.textContent = "Edit Content";
    }
    else {
        title.textContent = "Add New Content";
    }
}

// ==========================================
// ADD / EDIT CONTENT
// ==========================================

if (contentForm) {

    contentForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const type =
                document.querySelector("#contentType")?.value || "";

            const title =
                document.querySelector("#contentTitle")?.value.trim() || "";

            const url =
                document.querySelector("#contentUrl")?.value.trim() || "";

            const description =
                document.querySelector("#contentDescription")?.value.trim() || "";

            const category =
                document.querySelector("#contentCategory")?.value.trim() || "";

            const date =
                document.querySelector("#contentDate")?.value || "";

            if (!title) {
                alert("Please enter a title.");
                return;
            }

            if (!url) {
                alert("Please enter a YouTube link.");
                return;
            }

            // ==================================
            // EDIT EXISTING CONTENT
            // ==================================

            if (editingId !== null) {

                const index =
                    contentData.findIndex(
                        function(item) {
                            return item.id === editingId;
                        }
                    );

                if (index !== -1) {

                    contentData[index] = {
                        ...contentData[index],

                        type: type,
                        title: title,
                        url: url,
                        description: description,
                        category: category,
                        date: date
                    };

                }

                saveContent();
                renderContent();
                closeForm();

                alert(
                    "Content updated successfully! ✅"
                );

                return;
            }

            // ==================================
            // ADD NEW CONTENT
            // ==================================

            const newContent = {

                id: Date.now(),

                type: type,

                title: title,

                url: url,

                description: description,

                category: category,

                date: date

            };

            contentData.unshift(newContent);

            saveContent();

            renderContent();

            closeForm();

            alert(
                "Content added successfully! 🎉"
            );

        }
    );

}

// ==========================================
// EDIT / DELETE BUTTONS
// ==========================================

if (contentGrid) {

    contentGrid.addEventListener(
        "click",
        function(event) {

            const editButton =
                event.target.closest(".edit-btn");

            const deleteButton =
                event.target.closest(".delete-btn");

            if (editButton) {

                editContent(
                    Number(editButton.dataset.id)
                );

                return;
            }

            if (deleteButton) {

                deleteContent(
                    Number(deleteButton.dataset.id)
                );

            }

        }
    );

}

// ==========================================
// EDIT CONTENT
// ==========================================

function editContent(id) {

    const content =
        contentData.find(
            function(item) {
                return item.id === id;
            }
        );

    if (!content) {
        return;
    }

    if (!addContentForm || !contentForm) {
        return;
    }

    editingId = id;

    document.querySelector("#contentType").value =
        content.type;

    document.querySelector("#contentTitle").value =
        content.title;

    document.querySelector("#contentUrl").value =
        content.url;

    document.querySelector("#contentDescription").value =
        content.description || "";

    document.querySelector("#contentCategory").value =
        content.category || "";

    document.querySelector("#contentDate").value =
        content.date || "";

    updateFormTitle();

    addContentForm.classList.add("show");

    addContentForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// DELETE CONTENT
// ==========================================

function deleteContent(id) {

    const content =
        contentData.find(
            function(item) {
                return item.id === id;
            }
        );

    if (!content) {
        return;
    }

    const confirmed =
        confirm(
            `Delete "${content.title}"?`
        );

    if (!confirmed) {
        return;
    }

    contentData =
        contentData.filter(
            function(item) {
                return item.id !== id;
            }
        );

    saveContent();

    renderContent();

    alert(
        "Content deleted successfully."
    );
}

// ==========================================
// STATISTICS
// ==========================================

function updateStatistics() {

    let videos = 0;
    let shorts = 0;
    let live = 0;
    let posts = 0;

    contentData.forEach(
        function(content) {

            if (content.type === "video") {
                videos++;
            }
            else if (content.type === "short") {
                shorts++;
            }
            else if (content.type === "live") {
                live++;
            }
            else if (content.type === "post") {
                posts++;
            }

        }
    );

    const numbers =
        document.querySelectorAll(".stat-number");

    if (numbers.length >= 4) {

        numbers[0].textContent = videos;
        numbers[1].textContent = shorts;
        numbers[2].textContent = live;
        numbers[3].textContent = posts;

    }
}

// ==========================================
// SECURITY HELPERS
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = String(text);

    return div.innerHTML;
}

function escapeAttribute(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

// ==========================================
// FEATURED VIDEO
// ==========================================

function updateFeaturedVideo() {

    const featured =
        contentData.find(function(item){

            return item.type === "video";

        });

    const thumbnail =
        document.getElementById("featuredThumbnail");

    const title =
        document.getElementById("featuredTitle");

    const description =
        document.getElementById("featuredDescription");

    const date =
        document.getElementById("featuredDate");

    const watch =
        document.getElementById("featuredWatch");

    if(
        !thumbnail ||
        !title ||
        !description ||
        !date ||
        !watch
    ){
        return;
    }

    if(!featured){

        thumbnail.innerHTML =
            '<span class="featured-placeholder">🎬</span>';

        title.textContent =
            "No featured video yet";

        description.textContent =
            "Add your first YouTube video and it will appear here automatically.";

        date.textContent = "—";

        watch.href = "#";

        return;

    }

    const thumb =
        getYouTubeThumbnail(featured.url);

    thumbnail.innerHTML = thumb
        ? `<img src="${thumb}" alt="Featured Video">`
        : '<span class="featured-placeholder">🎬</span>';

    title.textContent =
        featured.title;

    description.textContent =
        featured.description ||
        "No description available.";

    date.textContent =
        featured.date ||
        "Recent upload";

    watch.href =
        featured.url;

}
// ==========================================
// START WEBSITE
// ==========================================

renderContent();

console.log(
    "BS Gamer_z website loaded successfully! ✅"
);

// ==========================================
// WEBSITE VISITOR COUNTER
// ==========================================

const visitorElement =
    document.getElementById("visitorCount");

if(visitorElement){

    let visits =
        Number(
            localStorage.getItem("bs_website_visits")
        ) || 0;

    visits++;

    localStorage.setItem(
        "bs_website_visits",
        visits
    );

    visitorElement.textContent =
        visits.toLocaleString();

}

// ==========================================
// SCROLL TO TOP BUTTON
// ==========================================

const scrollTopBtn =
    document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function(){

    if(window.scrollY > 300){

        scrollTopBtn.classList.add("show");

    }else{

        scrollTopBtn.classList.remove("show");

    }

});

scrollTopBtn.addEventListener("click", function(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ==========================================
// TOP NAVIGATION
// ==========================================

const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const page = button.textContent
            .toLowerCase()
            .trim();

        // Remove active from all navigation buttons
        navButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });

        // Add active to clicked button
        button.classList.add("active");


        // Home
        if (page === "home") {

            if (searchInput) {
                searchInput.value = "";
            }

            categoryButtons.forEach(function(btn) {

                btn.classList.remove("active");

            });

            const allButton =
                document.querySelector(
                    '.category[data-category="all"]'
                );

            if (allButton) {

                allButton.classList.add("active");

            }

            renderContent();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            return;
        }


        // Videos
        if (page === "videos") {

            selectCategoryFromNavigation("video");

        }


        // Shorts
        else if (page === "shorts") {

            selectCategoryFromNavigation("short");

        }


        // Live
        else if (page === "live") {

            selectCategoryFromNavigation("live");

        }


        // Posts
        else if (page === "posts") {

            selectCategoryFromNavigation("post");

        }

    });

});


// ==========================================
// SELECT CATEGORY FROM TOP NAVIGATION
// ==========================================

function selectCategoryFromNavigation(category) {

    const categoryButton =
        document.querySelector(
            '.category[data-category="' +
            category +
            '"]'
        );


    if (!categoryButton) {

        return;

    }


    // Remove active from all categories

    categoryButtons.forEach(function(button) {

        button.classList.remove("active");

    });


    // Activate selected category

    categoryButton.classList.add("active");


    // Clear search

    if (searchInput) {

        searchInput.value = "";

    }


    // Apply filter

    filterContent();


    // Scroll to content

    const contentSection =
        document.querySelector(".content-grid");


    if (contentSection) {

        contentSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}
// ==========================================
// SAFE NAVIGATION
// ==========================================

document.querySelectorAll(".nav-btn[data-nav]").forEach(function(btn){

    btn.addEventListener("click", function(){

        document.querySelectorAll(".nav-btn[data-nav]").forEach(function(b){
            b.classList.remove("active");
        });

        btn.classList.add("active");

        const target = btn.dataset.nav;

        const categoryBtn = document.querySelector(
            '.category[data-category="' +
            (target === "home" ? "all" : target) +
            '"]'
        );

        if (categoryBtn) {
            categoryBtn.click();
        }

    });

});
async function loadLatestYouTubeVideos() {
    try {
        const response = await fetch("data/youtube.json");
        const videos = await response.json();

        if (!videos.length) return;

        const latest = videos[0];

        // Featured thumbnail
        const thumbnail = document.getElementById("featuredThumbnail");
        thumbnail.innerHTML = `
            <img src="${latest.thumbnail}" alt="${latest.title}">
        `;

        // Featured title
        document.getElementById("featuredTitle").textContent = latest.title;

        // Description
        document.getElementById("featuredDescription").textContent =
            "Latest upload from BS Gamer_z.";

        // Upload date
        document.getElementById("featuredDate").textContent =
            new Date(latest.published).toLocaleDateString();

        // Watch button
        document.getElementById("featuredWatch").href = latest.url;

    } catch (err) {
        console.error("Failed to load YouTube data:", err);
    }
}

loadLatestYouTubeVideos();