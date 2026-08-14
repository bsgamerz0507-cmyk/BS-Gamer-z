// ==========================================
// BS Gamer_z - SETTINGS SYSTEM
// Social Media / Contact / Font / Background
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

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
    // OPEN SETTINGS
    // ==========================================

    if (settingsButton && settingsPanel) {

        settingsButton.addEventListener(
            "click",
            function () {

                loadSettings();

                settingsPanel.classList.add("show");

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
// CLOSE SETTINGS WHEN CLICKING OUTSIDE
// ==========================================

        if (settingsPanel) {

            settingsPanel.addEventListener(
                "click",
                function (event) {

                    if (event.target === settingsPanel) {

                        settingsPanel.classList.remove("show");

                    }

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
                    youtube: getValue("youtubeProfile"),

                    instagram: getValue("instagramProfile"),

                    facebook: getValue("facebookProfile"),

                    twitter: getValue("twitterProfile"),


                    // CONTACT
                    email: getValue("contactEmail"),

                    phone: getValue("contactPhone"),

                    website: getValue("contactWebsite"),


                    // APPEARANCE
                    font:
                        getValue("fontSelector") || "default",

                    background:
                        getValue("backgroundSelector") || "default",

                    theme:
                        getValue("themeSelector") || "dark"

                };


                // Save settings

                localStorage.setItem(
                    "bs_gamer_z_settings",
                    JSON.stringify(settings)
                );


                // Apply settings immediately

                applyFont(settings.font);

                applyBackground(settings.background);
                applyTheme(settings.theme);

                // Update footer

                displayContactInfo();


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
            localStorage.getItem(
                "bs_gamer_z_settings"
            );


        if (!saved) {

            return;

        }


        try {

            const settings =
                JSON.parse(saved);


            // Social media

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


            // Contact

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


            // Appearance

            setValue(
                "fontSelector",
                settings.font || "default"
            );

            setValue(
                "backgroundSelector",
                settings.background || "default"
            );

            setValue(
                "themeSelector",
                settings.theme || "dark"
            );

            // Apply

           applyFont(
                settings.font
            );

            applyBackground(
                settings.background
            );

            applyTheme(
                settings.theme || "dark"
            );
            applyTheme(settings.theme || "dark");

            // Footer

            displayContactInfo();


        } catch (error) {

            console.error(
                "Error loading settings:",
                error
            );

        }

    }


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


        element.value =
            value || "";

    }


    // ==========================================
    // APPLY FONT
    // ==========================================

    function applyFont(font) {

        let selectedFont;


        if (
            !font ||
            font === "default"
        ) {

            selectedFont =
                "Arial, Helvetica, sans-serif";

        }

        else if (
            font === "Trebuchet MS"
        ) {

            selectedFont =
                "'Trebuchet MS', sans-serif";

        }

        else {

            selectedFont =
                font;

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

        let bg;


        switch (background) {

            case "black":

                bg = "#000000";

                break;


            case "darkblue":

                bg = "#08131f";

                break;


            case "darkpurple":

                bg = "#1a102b";

                break;


            case "gradient":

                bg =
                    "linear-gradient(135deg, #111111, #2b0f3f, #111111)";

                break;


            case "default":

            default:

                bg = "#0f0f0f";

                break;

        }


        document.documentElement.style.setProperty(
            "--bs-background",
            bg
        );

        document.documentElement.classList.add(
            "bs-settings-active"
        );

    }
    // ==========================================
    // APPLY THEME
    // ==========================================

        function applyTheme(theme) {

            if (theme === "light") {

                document.documentElement.classList.add("light-theme");

            } else {

                document.documentElement.classList.remove("light-theme");

            }

        }
// ==========================================
// APPLY THEME
// ==========================================

    function applyTheme(theme) {

        if (theme === "light") {

            document.documentElement.classList.add(
                "light-theme"
            );

        } else {

            document.documentElement.classList.remove(
                "light-theme"
            );

        }

    }

    // ==========================================
    // DISPLAY FOOTER INFORMATION
    // ==========================================

    function displayContactInfo() {

        const socialLinks =
            document.getElementById(
                "socialLinks"
            );

        const contactInfo =
            document.getElementById(
                "contactInfo"
            );


        if (
            !socialLinks ||
            !contactInfo
        ) {

            return;

        }


        socialLinks.innerHTML = "";

        contactInfo.innerHTML = "";


        const saved =
            localStorage.getItem(
                "bs_gamer_z_settings"
            );


        if (!saved) {

            return;

        }


        try {

            const settings =
                JSON.parse(saved);


            // YouTube

            if (settings.youtube) {

                addSocialLink(
                    socialLinks,
                    settings.youtube,
                    "youtube",
                    "YouTube"
                );

            }


            // Instagram

            if (settings.instagram) {

                addSocialLink(
                    socialLinks,
                    settings.instagram,
                    "instagram",
                    "Instagram"
                );

            }


            // Facebook

            if (settings.facebook) {

                addSocialLink(
                    socialLinks,
                    settings.facebook,
                    "facebook",
                    "Facebook"
                );

            }


            // X / Twitter

            if (settings.twitter) {

                addSocialLink(
                    socialLinks,
                    settings.twitter,
                    "twitter",
                    "X / Twitter"
                );

            }


            // Email

            if (settings.email) {

                const emailDiv =
                    document.createElement(
                        "div"
                    );


                const emailLink =
                    document.createElement(
                        "a"
                    );


                emailLink.href =
                    "mailto:" + settings.email;

                emailLink.textContent =
                    "📧 Email: " + settings.email;


                emailDiv.appendChild(
                    emailLink
                );


                contactInfo.appendChild(
                    emailDiv
                );

            }


            // Phone

            if (settings.phone) {

                const phoneDiv =
                    document.createElement(
                        "div"
                    );


                const phoneLink =
                    document.createElement(
                        "a"
                    );


                phoneLink.href =
                    "tel:" + settings.phone;

                phoneLink.textContent =
                    "📞 Phone: " + settings.phone;


                phoneDiv.appendChild(
                    phoneLink
                );


                contactInfo.appendChild(
                    phoneDiv
                );

            }


            // Website

            if (settings.website) {

                const websiteDiv =
                    document.createElement(
                        "div"
                    );


                const websiteLink =
                    document.createElement(
                        "a"
                    );


                websiteLink.href =
                    settings.website;

                websiteLink.target =
                    "_blank";

                websiteLink.rel =
                    "noopener noreferrer";

                websiteLink.textContent =
                    "🌐 Website: " + settings.website;


                websiteDiv.appendChild(
                    websiteLink
                );


                contactInfo.appendChild(
                    websiteDiv
                );

            }


        } catch (error) {

            console.error(
                "Error displaying footer:",
                error
            );

        }

    }


    // ==========================================
    // ADD SOCIAL LINK
    // ==========================================

    function addSocialLink(
        container,
        url,
        platform,
        name
    ) {

        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;

        link.target =
            "_blank";

        link.rel =
            "noopener noreferrer";

        link.className =
            "social-link";


        // ==========================================
        // ICON
        // ==========================================

        let icon = "";


        // YouTube

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


        // Instagram

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


        // Facebook

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


        // X / Twitter

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

        link.innerHTML =
            '<span class="social-icon">' +
                icon +
            '</span>' +
            '<span>' +
                escapeHTML(name) +
            '</span>';


        container.appendChild(
            link
        );

    }


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


    // ==========================================
    // APPLY SAVED SETTINGS AT STARTUP
    // ==========================================

    function applyStartupSettings() {

        const saved =
            localStorage.getItem(
                "bs_gamer_z_settings"
            );


        if (!saved) {

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

            applyTheme(
                settings.theme || "dark"
            );
            applyTheme(settings.theme || "dark");

            displayContactInfo();


        } catch (error) {

            console.error(
                "Error applying startup settings:",
                error
            );

        }

    }

// ==========================================
// EXPORT BACKUP
// ==========================================

const exportButton =
    document.getElementById("exportData");

if (exportButton) {

    exportButton.addEventListener("click", function () {

        const backup = {

            website: "BS Gamer_z",

            version: "1.0",

            exportDate: new Date().toLocaleString(),

            settings: JSON.parse(
                localStorage.getItem("bs_gamer_z_settings") || "{}"
            ),

            content: JSON.parse(
                localStorage.getItem("bs_gamer_z_content") || "[]"
            )

        };

        const blob = new Blob(

            [JSON.stringify(backup, null, 2)],

            { type: "application/json" }

        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            "BS_Gamer_z_Backup.json";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    });

}
// ==========================================
// IMPORT BACKUP
// ==========================================

const importButton =
    document.getElementById("importData");

const importFile =
    document.getElementById("importFile");

if (importButton && importFile) {

    importButton.addEventListener("click", function () {

        importFile.click();

    });

    importFile.addEventListener("change", function (event) {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {

            try {

                const backup =
                    JSON.parse(e.target.result);

                // Restore settings

                localStorage.setItem(
                    "bs_gamer_z_settings",
                    JSON.stringify(backup.settings || {})
                );

                // Restore content

                localStorage.setItem(
                    "bs_gamer_z_content",
                    JSON.stringify(backup.content || [])
                );

                alert(
                    "Backup imported successfully! 🎉\nThe website will now reload."
                );

                location.reload();

            } catch (error) {

                alert(
                    "Invalid backup file!"
                );

                console.error(error);

            }

        };

        reader.readAsText(file);

    });

}

    // ==========================================
    // STARTUP
    // ==========================================

    applyStartupSettings();


    console.log(
        "BS Gamer_z Settings system ready! ✅"
    );

});