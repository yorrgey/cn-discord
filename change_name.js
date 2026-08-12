const { REST, Routes } = require('discord.js');

const token = process.env.DISCORD_BOT_TOKEN;
const guildId = process.env.DISCORD_GUILD_ID;
const userId = process.env.TARGET_USER_ID;
const newIgn = process.env.NEW_IGN;

const rest = new REST({ version: '10' }).setToken(token);

async function updateNickname() {
    try {
        // Ambil data user dari Discord API untuk mendapatkan nama asli (username)
        const user = await rest.get(Routes.user(userId));
        const discordName = user.username;

        // Format baru: NamaAsli | IGN Baru (maksimal 32 karakter)
        let newNickname = `${discordName} | ${newIgn}`;
        if (newNickname.length > 32) {
            console.error("Gagal: Panjang nickname melebihi batas maksimal 32 karakter.");
            process.exit(1);
        }

        // Ubah nickname member di guild/server
        await rest.patch(Routes.guildMember(guildId, userId), {
            body: { nick: newNickname }
        });

        console.log(`Berhasil mengubah nickname ${discordName} menjadi: ${newNickname}`);
    } catch (error) {
        console.error("Gagal mengubah nickname:", error);
        process.exit(1);
    }
}

updateNickname();
