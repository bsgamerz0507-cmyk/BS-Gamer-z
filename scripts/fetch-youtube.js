const fs = require('fs');
const path = require('path');
const https = require('https');

// YouTube API configuration
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UC_DHq9eu17O5QFfVvne1Htg';
const MAX_RESULTS = 50;

function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1] || 0) * 3600;
  const minutes = parseInt(match[2] || 0) * 60;
  const seconds = parseInt(match[3] || 0);
  return hours + minutes + seconds;
}

function fetchYouTubeData(endpoint, params = '') {
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/${endpoint}?key=${API_KEY}&${params}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
            return;
          }
          resolve(parsed);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllVideos(playlistId, pageToken = '') {
  let allItems = [];
  let nextPageToken = pageToken;

  while (true) {
    const params = `playlistId=${playlistId}&part=snippet,contentDetails&maxResults=${MAX_RESULTS}` +
      (nextPageToken ? `&pageToken=${nextPageToken}` : '');

    const response = await fetchYouTubeData('playlistItems', params);

    if (response.items && response.items.length > 0) {
      allItems = allItems.concat(response.items);
    }

    nextPageToken = response.nextPageToken || null;
    if (!nextPageToken) break;

    console.log(`📦 Fetched ${allItems.length} videos so far...`);
  }

  return allItems;
}

// ==========================================
// FETCH COMMUNITY POSTS VIA SCRAPER API
// ==========================================

async function fetchCommunityPostsScraper() {
  return new Promise((resolve) => {
    // Use a free community post scraper API
    const url = `https://yt-community-api.vercel.app/api/posts?channelId=${CHANNEL_ID}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const posts = [];
          
          if (parsed && parsed.items) {
            parsed.items.forEach((item, index) => {
              // Extract image if available
              let thumbnail = '';
              if (item.attachments && item.attachments.length > 0) {
                // Get the first image attachment
                const imgAttachment = item.attachments.find(a => a.image);
                if (imgAttachment) {
                  thumbnail = imgAttachment.image;
                }
              }
              
              posts.push({
                id: 'post_' + Date.now() + '_' + index,
                type: 'post',
                title: item.title || 'Community Post',
                description: item.text || '',
                thumbnail: thumbnail || '',
                publishedAt: item.published || new Date().toISOString(),
                url: `https://www.youtube.com/channel/${CHANNEL_ID}/community`,
                isAuto: true
              });
            });
          }
          
          console.log(`📝 Found ${posts.length} community posts via scraper`);
          resolve(posts);
          
        } catch (error) {
          console.warn('⚠️ Scraper parsing error:', error.message);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.warn('⚠️ Scraper fetch error:', err.message);
      resolve([]);
    });
  });
}

// ==========================================
// MAIN SYNC FUNCTION
// ==========================================

async function syncYouTubeData() {
  try {
    console.log('🔍 Starting full YouTube sync (including community posts)...');

    // --- Fetch Videos ---
    const channelResponse = await fetchYouTubeData(
      'channels',
      `id=${CHANNEL_ID}&part=contentDetails`
    );

    if (!channelResponse.items || channelResponse.items.length === 0) {
      throw new Error('Channel not found.');
    }

    const uploadsPlaylistId = channelResponse.items[0].contentDetails.relatedPlaylists.uploads;
    console.log(`📂 Uploads playlist ID: ${uploadsPlaylistId}`);

    console.log('⏳ Fetching ALL videos...');
    const allPlaylistItems = await fetchAllVideos(uploadsPlaylistId);

    console.log(`✅ Found ${allPlaylistItems.length} total videos in playlist`);

    if (allPlaylistItems.length === 0) {
      throw new Error('No videos found.');
    }

    const videoIds = allPlaylistItems
      .map(item => item.contentDetails?.videoId)
      .filter(id => id)
      .join(',');

    const videoIdChunks = [];
    const ids = videoIds.split(',');
    for (let i = 0; i < ids.length; i += 50) {
      videoIdChunks.push(ids.slice(i, i + 50).join(','));
    }

    let allVideoDetails = [];
    for (const chunk of videoIdChunks) {
      const response = await fetchYouTubeData(
        'videos',
        `id=${chunk}&part=contentDetails,snippet,liveStreamingDetails`
      );
      if (response.items) {
        allVideoDetails = allVideoDetails.concat(response.items);
      }
    }

    console.log(`✅ Received details for ${allVideoDetails.length} videos`);

    const videos = allVideoDetails
      .filter(item => item && item.contentDetails && item.contentDetails.duration)
      .map(item => {
        try {
          const durationSeconds = parseDuration(item.contentDetails.duration);
          const isShort = durationSeconds < 60;
          const isLive = item.snippet?.liveBroadcastContent === 'live' ||
                         item.snippet?.liveBroadcastContent === 'upcoming';

          return {
            id: item.id || 'unknown',
            title: item.snippet?.title || 'Untitled',
            description: item.snippet?.description || '',
            thumbnail: item.snippet?.thumbnails?.high?.url || '',
            publishedAt: item.snippet?.publishedAt || new Date().toISOString(),
            duration: item.contentDetails.duration || 'PT0S',
            durationSeconds: durationSeconds,
            type: isShort ? 'short' : isLive ? 'live' : 'video',
            isShort: isShort,
            isLive: isLive,
            channelId: item.snippet?.channelId || '',
            channelTitle: item.snippet?.channelTitle || ''
          };
        } catch (e) {
          console.warn('⚠️ Skipping a video due to error:', e.message);
          return null;
        }
      })
      .filter(item => item !== null);

    console.log(`✅ Processed ${videos.length} valid videos`);

    // --- Fetch Community Posts via Scraper ---
    console.log('⏳ Fetching community posts via scraper...');
    const posts = await fetchCommunityPostsScraper();

    // --- Save Combined Data ---
    const dataPath = path.join(__dirname, '../data/youtube.json');
    const output = {
      lastUpdated: new Date().toISOString(),
      totalVideos: videos.length,
      totalPosts: posts.length,
      videos: videos,
      posts: posts
    };

    const dataDir = path.dirname(dataPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(dataPath, JSON.stringify(output, null, 2));
    console.log(`✅ Saved ${videos.length} videos and ${posts.length} posts to data/youtube.json`);
    console.log('📊 Types breakdown:');
    console.log(`  - Shorts: ${videos.filter(v => v.type === 'short').length}`);
    console.log(`  - Videos: ${videos.filter(v => v.type === 'video').length}`);
    console.log(`  - Live: ${videos.filter(v => v.type === 'live').length}`);
    console.log(`  - Posts: ${posts.length}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

syncYouTubeData();