const fs = require("fs");

const CHANNEL_ID = "UC_DHq9eu17O5QFfVvne1Htg";
const API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchYouTube() {

    let allItems = [];
let nextPageToken = "";

do {
    const searchURL =
        `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}` +
        `&channelId=${CHANNEL_ID}` +
        `&part=snippet,id` +
        `&order=date` +
        `&maxResults=50` +
        `&type=video` +
        (nextPageToken ? `&pageToken=${nextPageToken}` : "");

    const searchData = await fetch(searchURL).then(r => r.json());

    allItems.push(...searchData.items);

    nextPageToken = searchData.nextPageToken || "";

} while (nextPageToken);

    const ids =
        allItems.map(item => item.id.videoId);

    let detailsItems = [];

for (let i = 0; i < ids.length; i += 50) {

    const chunk = ids.slice(i, i + 50).join(",");

    const detailsURL =
        `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}` +
        `&part=contentDetails,liveStreamingDetails,snippet&id=${chunk}`;

    const details =
        await fetch(detailsURL).then(r => r.json());

    detailsItems.push(...details.items);

}

const videos = detailsItems.map(item => {

        const duration =
            item.contentDetails.duration;

        const live =
            item.snippet.liveBroadcastContent;

        let type = "video";

        if (live === "live" || live === "upcoming") {

            type = "live";

        } else {

            const seconds = durationToSeconds(duration);

            if (seconds <= 60) {

                type = "short";

            }

        }

        return {

            type,
            title: item.snippet.title,
            videoId: item.id,
            url:
                type === "short"
                    ? `https://www.youtube.com/shorts/${item.id}`
                    : `https://www.youtube.com/watch?v=${item.id}`,
            thumbnail:
                item.snippet.thumbnails.high.url,
            published:
                item.snippet.publishedAt

        };

    });

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
        "data/youtube.json",
        JSON.stringify(videos, null, 2)
    );

}

function durationToSeconds(duration) {

    const match =
        duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

    const h = Number(match?.[1] || 0);
    const m = Number(match?.[2] || 0);
    const s = Number(match?.[3] || 0);

    return h * 3600 + m * 60 + s;

}

fetchYouTube().catch(console.error);