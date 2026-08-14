// ==========================================
// BS Gamer_z - SETTINGS SYSTEM
// Social Media / Contact / Font / Background
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // SETTINGS STORAGE KEY
    // ==========================================

    const SETTINGS_KEY = "bs_gamer_z_settings";


    // ==========================================
    // GET ELEMENTS
    // ==========================================

    const settingsButton =
        document.getElementById("settingsButton");

    const settingsPanel =
        document.getElementById("settingsPanel");

    const closeSettings =
        document.getElementById("closeSettings");

    const saveSettings =
        document.getElementById("saveSettings");


    // ==========================================
    // GET VALUE
    // ==========================================

    function getValue(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value.trim();
    }


    // ==========================================
    // SET VALUE
    // ==========================================

    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.value = value || "";
    }


    // ==========================================
    // OPEN SETTINGS
    // ==========================================

    if (settingsButton && settingsPanel) {

        settingsButton.addEventListener(
            "click",
            function () {

                settingsPanel.classList.add("show");

                loadSettings();

            }
        );

    }


    // ==========================================
    // CLOSE SETTINGS
    // ==========================================

    if (closeSettings && settingsPanel) {

        closeSettings.addEventListener(
            "click",
            function () {

                settingsPanel.classList.remove("show");

            }
        );

    }


    // ==========================================
    // SAVE SETTINGS
    // ==========================================

    if (saveSettings) {

        saveSettings.addEventListener(
            "click",
            function () {

                const settings = {

                    // SOCIAL MEDIA
                    youtube:
                        getValue("youtubeProfile"),

                    instagram:
                        getValue("instagramProfile"),

                    facebook:
                        getValue("facebookProfile"),

                    twitter:
                        getValue("twitterProfile"),


                    // CONTACT
                    email:
                        getValue("contactEmail"),

                    phone:
                        getValue("contactPhone"),

                    website:
                        getValue("contactWebsite"),


                    // APPEARANCE
                    font:
                        getValue("fontSelector") || "default",

                    background:
                        getValue("backgroundSelector") || "default"

                };


                // Save permanently in browser
                localStorage.setItem(
                    SETTINGS_KEY,
                    JSON.stringify(settings)
                );


                // Apply appearance immediately
                applyFont(settings.font);

                applyBackground(settings.background);


                // Update footer
                displayFooter(settings);


                alert(
                    "Settings saved successfully! 🎉"
                );

            }
        );

    }


    // ==========================================
    // LOAD SETTINGS
    // ==========================================

    function loadSettings() {

        const saved =
            localStorage.getItem(SETTINGS_KEY);


        if (!saved) {

            // Apply default appearance
            applyFont("default");

            applyBackground("default");

            return;

        }


        try {

            const settings =
                JSON.parse(saved);


            // SOCIAL MEDIA
            setValue(
                "youtubeProfile",
                settings.youtube
            );

            setValue(
                "instagramProfile",
                settings.instagram
            );

            setValue(
                "facebookProfile",
                settings.facebook
            );

            setValue(
                "twitterProfile",
                settings.twitter
            );


            // CONTACT
            setValue(
                "contactEmail",
                settings.email
            );

            setValue(
                "contactPhone",
                settings.phone
            );

            setValue(
                "contactWebsite",
                settings.website
            );


            // FONT
            setValue(
                "fontSelector",
                settings.font || "default"
            );


            // BACKGROUND
            setValue(
                "backgroundSelector",
                settings.background || "default"
            );


            // Apply appearance
            applyFont(
                settings.font || "default"
            );

            applyBackground(
                settings.background || "default"
            );


            // Update footer
            displayFooter(settings);


            console.log(
                "Settings loaded successfully! ✅"
            );

        }

        catch (error) {

            console.error(
                "Error loading settings:",
                error
            );

        }

    }


    // ==========================================
    // APPLY FONT
    // ==========================================

    function applyFont(font) {

        let selectedFont;


        switch (font) {

            case "Arial":

                selectedFont =
                    "Arial, Helvetica, sans-serif";

                break;


            case "Verdana":

                selectedFont =
                    "Verdana, sans-serif";

                break;


            case "Georgia":

                selectedFont =
                    "Georgia, serif";

                break;


            case "Tahoma":

                selectedFont =
                    "Tahoma, sans-serif";

                break;


            case "Trebuchet MS":

                selectedFont =
                    "'Trebuchet MS', sans-serif";

                break;


            case "default":

            default:

                selectedFont =
                    "Arial, Helvetica, sans-serif";

                break;

        }


        document.documentElement.style.setProperty(
            "--bs-font",
            selectedFont
        );


        document.documentElement.classList.add(
            "bs-settings-active"
        );

    }


    // ==========================================
    // APPLY BACKGROUND
    // ==========================================

    function applyBackground(background) {

        let backgroundValue;


        switch (background) {

            case "black":

                backgroundValue =
                    "#000000";

                break;


            case "darkblue":

                backgroundValue =
                    "#08131f";

                break;


            case "darkpurple":

                backgroundValue =
                    "#1a102b";

                break;


            case "gradient":

                backgroundValue =
                    "linear-gradient(135deg, #111111, #2b0f3f, #111111)";

                break;


            case "default":

            default:

                backgroundValue =
                    "#0f0f0f";

                break;

        }


        document.documentElement.style.setProperty(
            "--bs-background",
            backgroundValue
        );


        document.documentElement.classList.add(
            "bs-settings-active"
        );

    }


    // ==========================================
    // DISPLAY FOOTER
    // ==========================================

    function displayFooter(settings) {

        const socialLinks =
            document.getElementById("socialLinks");

        const contactInfo =
            document.getElementById("contactInfo");


        if (!socialLinks || !contactInfo) {
            return;
        }


        // Clear old information
        socialLinks.innerHTML = "";

        contactInfo.innerHTML = "";


        // ==========================================
        // YOUTUBE
        // ==========================================

        if (settings.youtube) {

            addSocialLink(
                socialLinks,
                settings.youtube,
                "youtube",
                "YouTube"
            );

        }


        // ==========================================
        // INSTAGRAM
        // ==========================================

        if (settings.instagram) {

            addSocialLink(
                socialLinks,
                settings.instagram,
                "instagram",
                "Instagram"
            );

        }


        // ==========================================
        // FACEBOOK
        // ==========================================

        if (settings.facebook) {

            addSocialLink(
                socialLinks,
                settings.facebook,
                "facebook",
                "Facebook"
            );

        }


        // ==========================================
        // X / TWITTER
        // ==========================================

        if (settings.twitter) {

            addSocialLink(
                socialLinks,
                settings.twitter,
                "twitter",
                "X"
            );

        }


        // ==========================================
        // EMAIL
        // ==========================================

        if (settings.email) {

            const emailDiv =
                document.createElement("div");


            emailDiv.className =
                "contact-item";


            const emailLink =
                document.createElement("a");


            emailLink.href =
                "mailto:" + settings.email;


            emailLink.textContent =
                "📧 " + settings.email;


            emailDiv.appendChild(
                emailLink
            );


            contactInfo.appendChild(
                emailDiv
            );

        }


        // ==========================================
        // PHONE
        // ==========================================

        if (settings.phone) {

            const phoneDiv =
                document.createElement("div");


            phoneDiv.className =
                "contact-item";


            const phoneLink =
                document.createElement("a");


            phoneLink.href =
                "tel:" + settings.phone;


            phoneLink.textContent =
                "📞 " + settings.phone;


            phoneDiv.appendChild(
                phoneLink
            );


            contactInfo.appendChild(
                phoneDiv
            );

        }


        // ==========================================
        // WEBSITE
        // ==========================================

        if (settings.website) {

            const websiteDiv =
                document.createElement("div");


            websiteDiv.className =
                "contact-item";


            const websiteLink =
                document.createElement("a");


            websiteLink.href =
                settings.website;


            websiteLink.target =
                "_blank";


            websiteLink.rel =
                "noopener noreferrer";


            websiteLink.textContent =
                "🌐 " + settings.website;


            websiteDiv.appendChild(
                websiteLink
            );


            contactInfo.appendChild(
                websiteDiv
            );

        }

    }


// ==========================================
// ADD SOCIAL LINK
// ==========================================


// ==========================================
// ADD SOCIAL LINK
// ==========================================

function addSocialLink(
    container,
    url,
    platform,
    name
) {

    const link = document.createElement("a");

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "social-link";


    // ==========================================
    // ACTUAL SOCIAL ICON
    // ==========================================

    let icon = "";


    // ==========================================
    // YOUTUBE
    // ==========================================

    if (platform === "youtube") {

        icon = `
            <svg
                class="social-svg youtube-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.8V8.2l6.4 3.8-6.4 3.8Z"
                />
            </svg>
        `;

    }


    // ==========================================
    // INSTAGRAM
    // ==========================================

    else if (platform === "instagram") {

        icon = `
            <svg
                class="social-svg instagram-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    ry="5"
                />

                <circle
                    cx="12"
                    cy="12"
                    r="4"
                />

                <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                />
            </svg>
        `;

    }


    // ==========================================
    // FACEBOOK
    // ==========================================

    else if (platform === "facebook") {

        icon = `
            <svg
                class="social-svg facebook-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M14 8h3V4h-3c-3.3 0-5 1.9-5 5v3H6v4h3v6h4v-6h3.2l.8-4H13V9c0-.7.3-1 1-1Z"
                />
            </svg>
        `;

    }


    // ==========================================
    // X / TWITTER
    // ==========================================

    else if (platform === "twitter") {

        icon = `
            <svg
                class="social-svg twitter-svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.2-8.2L2.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.9h1.7L8.3 4H6.5l11.3 15.9Z"
                />
            </svg>
        `;

    }


    // ==========================================
    // CREATE LINK
    // ==========================================

    link.innerHTML = `
        <span class="social-icon">
            ${icon}
        </span>

        <span>
            ${escapeHTML(name)}
        </span>
    `;


    // ==========================================
    // ADD TO FOOTER
    // ==========================================

    container.appendChild(link);

}




    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement("div");


        div.textContent =
            text;


        return div.innerHTML;

    }


    // ==========================================
    // APPLY SAVED SETTINGS AT STARTUP
    // ==========================================

    function applyStartupSettings() {

        const saved =
            localStorage.getItem(SETTINGS_KEY);


        if (!saved) {

            applyFont("default");

            applyBackground("default");

            return;

        }


        try {

            const settings =
                JSON.parse(saved);


            applyFont(
                settings.font || "default"
            );


            applyBackground(
                settings.background || "default"
            );


            displayFooter(settings);


            console.log(
                "Saved settings applied! ✅"
            );

        }

        catch (error) {

            console.error(
                "Error applying startup settings:",
                error
            );

        }

    }


    // ==========================================
    // STARTUP
    // ==========================================

    applyStartupSettings();


    console.log(
        "BS Gamer_z Settings system ready! ✅"
    );

});
```
