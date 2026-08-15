const fs = require("fs");

const CHANNEL_ID = "UC_DHq9eu17O5QFfVvne1Htg";
const API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchYouTube() {

    // Get uploads playlist ID
    const channelURL =
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;

    const channelData =
        await fetch(channelURL).then(r => r.json());

    const uploadsPlaylist =
        channelData.items[0].contentDetails.relatedPlaylists.uploads;

    let playlistItems = [];
    let nextPageToken = "";

    // Fetch every upload from the uploads playlist
    do {

        const playlistURL =
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${uploadsPlaylist}&maxResults=50&key=${API_KEY}` +
            (nextPageToken ? `&pageToken=${nextPageToken}` : "");

        const data =
            await fetch(playlistURL).then(r => r.json());

        playlistItems.push(...data.items);

        nextPageToken = data.nextPageToken || "";

    } while (nextPageToken);

    // Get full video details in batches of 50
    const ids =
        playlistItems.map(item => item.contentDetails.videoId);

    let detailsItems = [];

    for (let i = 0; i < ids.length; i += 50) {

        const chunk =
            ids.slice(i, i + 50).join(",");

        const detailsURL =
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,liveStreamingDetails,snippet&id=${chunk}&key=${API_KEY}`;

        const details =
            await fetch(detailsURL).then(r => r.json());

        detailsItems.push(...details.items);

    }

    const videos = detailsItems.map(item => {

        let type = "video";

        if (
            item.snippet.liveBroadcastContent === "live" ||
            item.snippet.liveBroadcastContent === "upcoming"
        ) {

            type = "live";

        } else {

            const seconds =
                durationToSeconds(item.contentDetails.duration);

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
            thumbnail: item.snippet.thumbnails.high.url,
            published: item.snippet.publishedAt

        };

    });

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
        "data/youtube.json",
        JSON.stringify(videos, null, 2)
    );

    console.log(`Fetched ${videos.length} uploads.`);

}

function durationToSeconds(duration) {

    const match =
        duration.match(/PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)S)?/);

    const h = Number(match?.[1] || 0);
    const m = Number(match?.[2] || 0);
    const s = Number(match?.[3] || 0);

    return h * 3600 + m * 60 + s;

}

fetchYouTube().catch(console.error);