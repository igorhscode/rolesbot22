// Import constructors, configuration and login the client
const { Client, RichEmbed, Emoji, MessageReaction } = require('discord.js');
const CONFIG = require('./config.example');
const client = new Client({ disableEveryone: true });
client.login(process.env.BOT_TOKEN);

// Если для каждой роли нет реакции, предупредите пользователя
if (CONFIG.roles.length !== CONFIG.reactions.length)
    throw "Список ролей и список реакций пуст! Пожалуйста, дважды проверьте это в файле config.js";

// Функция для генерации ролевых сообщений на основе ваших настроек
function generateMessages() {
    return CONFIG.roles.map((r, e) => {
        return {
            role: r,
            message: `React below to get the **"${r}"** role!`, //не изменять!
            emoji: CONFIG.reactions[e]
        };
    });
}

// Функция для генерации полей встраивания, основываясь на ваших настройках и если вы установите
function generateEmbedFields() {
    return CONFIG.roles.map((r, e) => {
        return {
            emoji: CONFIG.reactions[e],
            role: r
        };
    });
}

// События клиента, чтобы сообщить вам, если клиент онлайн, и обработать любые ошибки Discord.js
client.on("ready", () => console.log("Role Reactions is online!"));
client.generateInvite(["ADMINISTRATOR"]).then(link =>{
    client.user.setPresence({ game: { name: '!roleshelp' }, status: 'idle' })
    .then(console.log)
    .catch(console.error);
    console.log(link);
});
client.on('error', console.error);

// Управляет созданием ролевых реакций. Будут ли отправлять ролевые сообщения отдельно или встраиваться
client.on("message", message => {
    if (message.content === "!createrole"){
        if(!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send("У вас нет прав!")  
      message.channel.send('Роли установлены')
        message.guild.createRole({name: 'VimeWorld', color: '#ffffff', })
        message.guild.createRole({name: 'Cs-go', color: '#ffffff'})
        message.guild.createRole({name: 'Dota 2', color: '#ffffff'})
        message.guild.createRole({name: 'MineCraft', color: '#ffffff'})
        message.guild.createRole({name: 'Osu', color: '#ffffff'})  
        message.guild.createRole({name: 'League of Legends', color: '#ffffff'})
  } 
  if (message.content === "!roleshelp"){
    if(!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send("У вас нет прав!")  
  message.channel.send('**Используй команду !createrole , после чего - !rolereact**')
  }
    if (message.author.bot) return;

    if (!message.guild) return;

    if (message.guild && !message.channel.permissionsFor(message.guild.me).missing('SEND_MESSAGES')) return;

    if ((message.author.id !== CONFIG.yourID) && (message.content.toLowerCase() !== CONFIG.setupCMD)) return;

    if (CONFIG.deleteSetupCMD) {
        const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
        // Here we check if the bot can actually delete messages in the channel the command is being ran in
        if (missing.includes('MANAGE_MESSAGES'))
            throw new Error("Мне нужно разрешение удалить ваше командное сообщение! Пожалуйста, назначьте мне разрешение «Управление сообщениями» на этом канале!");
        message.delete().catch(O_o=>{});
    }

    const missing = message.channel.permissionsFor(message.guild.me).missing('MANAGE_MESSAGES');
    // Here we check if the bot can actually add recations in the channel the command is being ran in
    if (missing.includes('ADD_REACTIONS'))
        throw new Error("Мне нужно разрешение, чтобы добавить реакции на эти сообщения! Пожалуйста, назначьте мне разрешение «Добавить реакцию» на этом канале!");

    if (!CONFIG.embed) {
        if (!CONFIG.initialMessage || (CONFIG.initialMessage === '')) 
            throw "Свойство initialMessage не задано в файле config.js. Пожалуйста, сделай это!";

        message.channel.send(CONFIG.initialMessage);

        const messages = generateMessages();
        for (const { role, message: msg, emoji } of messages) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            message.channel.send(msg).then(async m => {
                const customCheck = message.guild.emojis.find(e => e.name === emoji);
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }).catch(console.error);
        }
    } else {
        if (!CONFIG.embedMessage || (CONFIG.embedMessage === ''))
            throw "The 'embedMessage' property is not set in the config.js file. Please do this!";
        if (!CONFIG.embedFooter || (CONFIG.embedMessage === ''))
            throw "The 'embedFooter' property is not set in the config.js file. Please do this!";

        const roleEmbed = new RichEmbed()
            .setDescription(CONFIG.embedMessage)
            .setFooter(CONFIG.embedFooter);

        if (CONFIG.embedColor) roleEmbed.setColor(CONFIG.embedColor);

        if (CONFIG.embedThumbnail && (CONFIG.embedThumbnailLink !== '')) 
            roleEmbed.setThumbnail(CONFIG.embedThumbnailLink);
        else if (CONFIG.embedThumbnail && message.guild.icon)
            roleEmbed.setThumbnail(message.guild.iconURL);

        const fields = generateEmbedFields();
        if (fields.length > 25) throw "That maximum roles that can be set for an embed is 25!";

        for (const { emoji, role } of fields) {
            if (!message.guild.roles.find(r => r.name === role))
                throw `The role '${role}' does not exist!`;

            const customEmote = client.emojis.find(e => e.name === emoji);
            
            if (!customEmote) roleEmbed.addField(emoji, role, true);
            else roleEmbed.addField(customEmote, role, true);
        }

        message.channel.send(roleEmbed).then(async m => {
            for (const r of CONFIG.reactions) {
                const emoji = r;
                const customCheck = client.emojis.find(e => e.name === emoji);
                
                if (!customCheck) await m.react(emoji);
                else await m.react(customCheck.id);
            }
        });
    }
});

// This makes the events used a bit more readable
const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
};

// This event handles adding/removing users from the role(s) they chose based on message reactions
client.on('raw', async event => {
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
        // Create an object that can be passed through the event like normal
        const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
        reaction = new MessageReaction(message, emoji, 1, data.user_id === client.user.id);
    }

    let embedFooterText;
    if (message.embeds[0]) embedFooterText = message.embeds[0].footer.text;

    if (
        (message.author.id === client.user.id) && (message.content !== CONFIG.initialMessage || 
        (message.embeds[0] && (embedFooterText !== CONFIG.embedFooter)))
    ) {

        if (!CONFIG.embed && (message.embeds.length < 1)) {
            const re = `\\*\\*"(.+)?(?="\\*\\*)`;
            const role = message.content.match(re)[1];

            if (member.id !== client.user.id) {
                const guildRole = message.guild.roles.find(r => r.name === role);
                if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
            }
        } else if (CONFIG.embed && (message.embeds.length >= 1)) {
            const fields = message.embeds[0].fields;

            for (const { name, value } of fields) {
                if (member.id !== client.user.id) {
                    const guildRole = message.guild.roles.find(r => r.name === value);
                    if ((name === reaction.emoji.name) || (name === reaction.emoji.toString())) {
                        if (event.t === "MESSAGE_REACTION_ADD") member.addRole(guildRole.id);
                        else if (event.t === "MESSAGE_REACTION_REMOVE") member.removeRole(guildRole.id);
                    }
                }
            }
        }
    }
});

process.on('unhandledRejection', err => {
    const msg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
	console.error("Unhandled Rejection", msg);
});
