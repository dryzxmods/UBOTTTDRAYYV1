 /*  
 * this code was created with assistance from chatgpt  
 * feature logic developed by kyuurzy
 */

const config = require("../config");

module.exports = {
  command: ["broadcast1"],
  owner: true,
  run: async ({ client, message, reply }) => {
    // Ambil argumen teks
    const args = message.message.split(" ").slice(1);
    const channelInput = args[0]; // contoh: /bcfwd @namaChannel

    let fromChat, messageId;

    // Jika user membalas pesan (reply)
    if (message.replyToMsgId) {
      const replyMsg = await message.getReplyMessage();
      fromChat = replyMsg.chatId;
      messageId = replyMsg.id;
    } 
    // Jika user memberikan username / ID channel di argumen
    else if (channelInput) {
      try {
        const channel = await client.getEntity(channelInput);
        const lastMsg = await client.getMessages(channel, { limit: 1 });
        if (!lastMsg.length) return reply("⚠️ Channel itu belum ada pesan.");
        fromChat = channel.id;
        messageId = lastMsg[0].id;
      } catch (err) {
        console.error(err);
        return reply("❌ Gagal mengambil pesan dari channel. Pastikan bot sudah join dan channel valid.");
      }
    } 
    else {
      return reply("🔁 Balas pesan dari channel **atau** kirim:\n`/bcfwd @usernameChannel`");
    }

    // Ambil semua chat tempat bot bergabung
    const dialogs = await client.getDialogs();
    const targets = dialogs.filter(d => d.isGroup || d.isChannel);

    let success = 0;
    let failed = 0;

    reply("🚀 Broadcast forward dimulai...");

    for (const chat of targets) {
      try {
        await client.forwardMessages(chat.id, fromChat, [messageId]);
        success++;
        await new Promise(r => setTimeout(r, 1500)); // delay anti flood
      } catch (e) {
        failed++;
      }
    }

    await reply(
      `✅ Forward broadcast selesai!\n\n` +
      `📢 Total target: ${targets.length}\n` +
      `✅ Berhasil: ${success}\n❌ Gagal: ${failed}`
    );
  }
};