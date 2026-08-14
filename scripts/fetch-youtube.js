const fs = require("fs");

const CHANNEL_ID = "UC_DHq9eu17O5QFfVvne1Htg";

async function fetchVideos() {

    const url =
        `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

    const response =
        await fetch(url);

    const xml =
        await response.text();

    const entries =
        [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)];

    const videos =
        entries.map(entry => {

            const block = entry[1];

            const title =
                block.match(/<title>(.*?)<\/title>/)?.[1] || "";

            const videoId =
                block.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "";

            const published =
                block.match(/<published>(.*?)<\/published>/)?.[1] || "";

            return {

                title,

                videoId,

                url: `https://youtu.be/${videoId}`,

                thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,

                published

            };

        });

    fs.mkdirSync("data", { recursive: true });

    fs.writeFileSync(
        "data/youtube.json",
        JSON.stringify(videos, null, 2)
    );

    console.log("YouTube data saved successfully!");
}

fetchVideos().catch(console.error);