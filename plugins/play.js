 /*  
 * this code was created with assistance from chatgpt  
 * feature logic developed by kyuurzy
 */
 
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    command: ["play"],
    run: async ({ client, text, reply, message }) => {
        if (!text) return reply("contoh: play impossible");
        reply("🔍 mencari lagu...");

        let response = await axios.get(`https://www.laurine.site/api/downloader/ytdl?query=${encodeURIComponent(text)}`);
        let data = response.data;
        let audioUrl = data.data;

        const audioPath = "./temp_audio.mp3";
        const responseAudio = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const audioBuffer = responseAudio.data;

        fs.writeFileSync(audioPath, audioBuffer);

        await client.sendMessage(message.peerId, {
            message: `🎶 memutar: *${text}*`,
            file: audioPath,
            caption: `lagu: *${text}* 🎵`,
            replyTo: message.id
        });

        fs.unlinkSync(audioPath);
    },
};
