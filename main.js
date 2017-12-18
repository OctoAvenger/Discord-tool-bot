/***

    Discord utility bot built mostly by Jett and Jonah. 
    
***/

const Discord = require('discord.js');
const client = new Discord.Client();
//const fs = require('fs');

const prefix = '??';
const whitelistRoles = ['Trusty flagger'];
const creators = ["<@218397146049806337>", "<@309845156696424458>"];

const getDefaultChannel = async (guild) => {

    if(guild.channels.has(guild.id))
        return guild.channels.get(guild.id)

    if(guild.channels.exists("name", "general"))
        return guild.channels.find("name", "general");
    return guild.channels.filter(c => c.type === "text" && 
                                 c.permissionsFor(guild.client.user).has("SEND_MESSAGES"))
        .sort((a, b) => a.position - b.position || 
              Long.fromString(a.id).sub(Long.fromString(b.id)).toNumber()).first();
}

const commands = {
    help: {
        name: 'help',
        description: 'Returns all of my commands.',
        usage: `${prefix}help`,
        do: (message, client, args, Discord) => {
            try {
                if (!args[0]){
                    let embed = new Discord.RichEmbed();
                    embed.setColor('#00ffcc');
                    embed.setAuthor('My Commands', client.user.avatarURL);
                    embed.setDescription(Object.keys(commands));
                    message.channel.send({ embed });
                } else {                 
                    let selection = args[0];
                    let embed = new Discord.RichEmbed();
                    embed.setColor('#00ffcc');
                    embed.addField('Usage:', commands[selection].usage);
                    embed.addField('Description:', commands[selection].description);
                    message.channel.send({ embed });
                }

            } catch (e) {
                console.log(e);
            }
        }
    },
    purge: {
        name: 'purge',
        description: 'Remove messages in bulk, 1-100.',
        usage: `${prefix}purge <number>`,
        do: (message, client, args, Discord) => {
            try {
                if (message.member.hasPermission("MANAGE_MESSAGES")) {
                    if (args[0] <= 100 && args >= 1){
                        message.channel.bulkDelete(parseInt(args[0]) + 1).then(() => {
                            message.reply(`Deleted ${args[0]} messages`);
                        });
                    } else {
                        message.reply("Please provide a number ≤ 100 and ≥ 1");
                    }
                } else {
                    message.channel.send("You do not have permissions to use this command.");
                }
            } catch (e) {
                console.log(e);
            }
        }
    },
    kick: {
        name: 'kick',
        description: 'Kick a member.',
        usage: `${prefix}kick <member> [reason]`,
        do: (message, client, args, Discord) => {
            try {
                if (message.member.hasPermission("KICK_MEMBERS")){
                    let reason = args.slice(1).join(' ');
                    if(message.mentions.members.size !== 0){
                        message.mentions.members.first().kick(reason)
                        message.channel.send(`<@${message.mentions.users.first().id}> has been kicked by <@${message.author.id}> because: ${reason}`);
                       
                    } else {
                        message.channel.send("You didn't identify a valid user");
                    }
                } else {
                    message.channel.send("You do not have permissions to use this command.");
                }
            } catch(e) {
                console.log(e);
            }
        }
    },
    ban: {
        name: 'ban',
        description: 'Ban a member.',
        usage: `${prefix}ban <member> [reason]`,
        do: (message, client, args, Discord) => {
            try {
                if (message.member.hasPermission("BAN_MEMBERS")) {
                    let reason = args.slice(1).join(' ');
                    if(message.mentions.members.size !== 0){
                        message.mentions.members.first().ban(reason)
                        message.channel.send(`<@${message.mentions.users.first().id}> has been banned by <@${message.author.id}> because: ${reason}`);
                    } else {
                        message.channel.send("You didn't identify a valid user");
                    }
                }
            } catch(e) {
                console.log(e);              
            }
        }
    },
    memberCount: {
        name: 'memberCount',
        description: 'Check how many members are in the server.',
        usage: `${prefix}memberCount`,
        do: (message, client, args, Discord) => {
            try {
                let embed = new Discord.RichEmbed();
                embed.addField('Members', message.guild.memberCount);
                embed.setColor('#00ffcc'); // #00ffcc? #6699ff?
                message.channel.send({ embed });
            } catch(e) {
                console.log(e);
            }
        }
    },
    uptime: {
        name: 'uptime',
        description: 'Shows how long the bot has been online.',
        usage: `${prefix}uptime`,
        do: (message, client, args, Discord) => {
            try {
                millisToTime = function(milliseconds) {
                  let x = milliseconds / 1000;
                  let s = Math.floor(x % 60);
                  x /= 60;
                  let m = Math.floor(x % 60);
                  x /= 60;
                  let h = Math.floor(x % 24);

                  return h + ' Hours, ' + m + ' Minutes, ' + s + " Seconds";
              };
                message.channel.send(':clock230: Bot has been online for ' + millisToTime(client.uptime));
            } catch(e) {
                console.log(e);
            }
        }
    },
    info: {
        name: 'info',
        description: 'Shows info about this bot.',
        usage: `${prefix}info`,
        do: (message, client, args, Discord) => {
            try {
                let embed = new Discord.RichEmbed();
                embed.setThumbnail(client.user.avatarURL);
                embed.addField('Users', client.users.size, true);
                // embed.addField('Channels', client.channels.size, true); 
                embed.addField('Servers', client.guilds.size, true);
                embed.addField('Creators', creators[0] + ', ' + creators[1], true);
                embed.setColor('#00ffcc');
                message.channel.send({ embed });
            } catch(e) {
                console.log(e);
            }
        }
    },
    userInfo: {
        name: 'userInfo',
        description: 'Check info about a given user.',
        usage: `${prefix}userInfo <member>`,
        do: (message, client, args, Discord) => {
            try {
                let member = message.mentions.members.first();
                let joined = new Date(member.joinedAt);
                let registered = new Date(member.user.createdAt);
                let embed = new Discord.RichEmbed();
                let perms = [];
                for (let [key, value] of Object.entries(member.permissions.serialize())) {
                    if (value == true) {
                        perms.push(key);
                    } else {
                        continue;
                    }
                }
                embed.setAuthor(member.user.tag, member.user.avatarURL);
                embed.setThumbnail(member.user.avatarURL);
                embed.addField('ID', member.id, true);
                embed.addField('Nickname', (member.nickname != null ? member.nickname : 'None'), true);
                embed.addField('Status', member.presence.status, true);
                embed.addField('Game', (member.presence.game != null ? member.presence.game : 'None'), true);
                embed.addField('Joined', joined, true);
                embed.addField('Registered', registered, true);
                embed.addField('Roles', member.roles.map(x => x.name).join(', '), true);
                embed.addField('Permissions', perms.join(', ').toLowerCase(), true);
                embed.setColor('#00ffcc');
                message.channel.send({ embed });
                //console.log(Object.entries(Object.values(member.permissions.serialize()).filter(x => x == true)));
            } catch(e) {
                console.log(e);
            }
        }
    },
    setGame: {
        name: 'setGame',
        description: 'Set game of the bot.',
        usage: `${prefix}setGame <game>`,
        do: (message, client, args, Discord) => {
            try {
                if (message.author.id == '218397146049806337') {
                    client.user.setPresence({ game: { name: args[0], type: 0 } });
                    message.channel.send(':white_check_mark: Game set to: `' + args[0] + '`');
                } else {
                    message.channel.send(':x: You don\'t have permission to use this command!');
                }
            } catch(e) {
                console.log(e);
            }
        }
    },
    bans: {
        name: 'bans',
        description: 'View bans for this server',
        usage: `${prefix}bans`,
        do: (message, client, args, Discord) => {
            try {
                if (message.member.hasPermission("MANAGE_GUILD")) {
                    let embed = new Discord.RichEmbed();
                    //embed.setThumbnail(client.user.avatarURL);
                    embed.setColor('#00ffcc');
                    message.guild.fetchBans().then(promise => {
                        let resolvedBans = Promise.resolve(promise);
                        //embed.addField('Bans', resolvedBans.map(x => x.tag));
                        console.log(resolvedBans.map(x => x.username));
                    }).catch(reason => {
                        console.log(reason);
                    });
                    message.channel.send({ embed });
                } else {
                    message.channel.send(':x: You don\'t have permission to use this command!');
                }
            } catch(e) {
                console.log(e);
            }
        }
    }
    
    
    // messageHistory: {
    /*
    blacklist: {
        name: 'User blacklist',
        description: 'Add or remove member to blacklist, and view it.',
        usage: `${prefix}blacklist [add/remove] [member]`,
        do: (message, client, args, Discord) => {
            try {
                if (message.member.hasPermission("MANAGE_SERVER")) {
                    //let reason = args.slice(1).join(' ');
                    if (message.mentions.members.size !== 0) {
                        //message.mentions.members.first().ban(reason)
                        message.channel.send(`<@${message.mentions.users.first().id}> has been mentioned by <@${message.author.id}>.`);
                    } else {
                        message.channel.send("You didn't identify a valid user");
                    }
                }
            } catch(e) {
                console.log(e);              
            }
        }
    }*/
};

const sendDM = (msg) => {
    client.users.find('id', '218397146049806337').send(msg);
};

const otherFunctions = (message) => {
    if (message.content.toLowerCase().includes("good night") || message.content.toLowerCase().includes("g'night") || message.content.toLowerCase().includes("goodnight")) message.react("🌙");
    if (message.content.toLowerCase().includes("jett burns") || message.content.toLowerCase().includes("jett") || message.mentions.users.exists('id', '218397146049806337')) {
        let embed = new Discord.RichEmbed();
        let sent = new Date(message.createdTimestamp).toLocaleString();
        embed.setColor('#00ffcc');
        embed.setAuthor('You were mentioned!', message.author.avatarURL);
        embed.addField('Content', message.content);
        embed.addField('Sender', message.author);
        embed.addField('Sent', sent, true);
        embed.addField('Server', message.guild);
        embed.addField('Channel', message.channel, true);
        embed.setTimestamp();
        sendDM({ embed });
    }
    // If bot is mentioned, react with thinking.
    if (message.mentions.users.exists('id', '372013264453894154')) message.react("🤔");
};

/*
var d = new Date(Date.now());
console.log(d);
if (d.getMinutes() == 20) {
    client.channels.get('id', '372915908730945537').send('Test: ' + d);
}*/

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setUsername('Helpful Bot');
    client.user.setPresence({ game: { name: `${prefix}help`, type: 0 } });
    
    let embed = new Discord.RichEmbed();
    embed.setColor('#00ffcc');
    embed.setThumbnail('https://media.discordapp.net/attachments/307975805357522944/392142646618882060/image.png');
    embed.addField('Ready', 'I am online and at your service, Jett!');
    embed.setTimestamp();
    client.users.find('id', '218397146049806337').send({ embed });
});

client.on("guildCreate", guild => {
    sendDM(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    sendDM(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on('message', (message) => {
    if (message.author.bot) return;
    otherFunctions(message);
    if (!message.content.startsWith(prefix)) return;
    let args = message.content.split(" ").splice(1);
    let command = message.content.substring(prefix.length).split(' ');
    for (let i in commands){
        if (command[0] === commands[i].name){
            commands[i].do(message, client, args, Discord);
        }
    }
});


client.on("messageReactionAdd", (messageReaction, user) => {
    switch(messageReaction.emoji.name) {
            // Look for log sending messages
        case "🚩":
            let flagCount = 0;
            /*
            for (let i = 0; i < messageReaction.count; i ++) {
                for (let j = 0; j < whitelistRoles.length; j ++) {
                    if (messageReaction.message.guild.members.find("id", messageReaction.users[i]).roles.has(messageReaction.message.guild.roles.find("name", whitelistRoles[j]))) {
                        flagCount ++;
                        console.log(true);
                        break;
                    }
                }
            }*/
            
            if (flagCount >= 3) {
                //messageReaction.message.delete();
            } else {
                let embed = new Discord.RichEmbed();
                embed.setColor([247, 237, 96]);
                embed.setAuthor(messageReaction.message.author.tag, messageReaction.message.author.avatarURL);
                embed.addField(`Message flagged in #${messageReaction.message.channel.name} by <someone>`, messageReaction.message.content);
                embed.setFooter(messageReaction.message.createdTimestamp);
                // embed.addField('Flagged by:', 'WIP');
                client.channels.find('id', '369502585440436236').send({ embed });
            }
            break;
        case "📌":
            if (messageReaction.count >= 10) messageReaction.message.pin();
            break;
    }
});

client.on("guildMemberAdd", (member) => {
    var  welcomes = [
        `Hello there <@${member.id}>, welcome to **${member.guild.name}**!`,
        `Welcome to **${member.guild.name}**, <@${member.id}>!`,
        `Hi there <@${member.id}>, stay ahwile!`,
        `Hey everyone, welcome our newest member <@${member.id}> to **${member.guild.name}**!`
    ];
    var welcome = `Welcome to the ${member.guild.name}, <@${member.id}>! 
    Please provide us with your Khan Academy __name__ and __username__ so we can verify you. 
    Also, let us know what roles you'd like, which are all explained in <#372915117060522007>.`

    //let channel = getDefaultChannel(member.guild);
    member.guild.channels.find("name", "general").send(welcomes[Math.floor(Math.random() * welcomes.length)]);
    member.guild.channels.find("id", "380202012077457409").send(welcome);
 });

client.on("guildMemberRemove", (member) => {
    //let channel = getDefaultChannel(member.guild);
    member.guild.channels.find("name", "general").send(`Aw, ${member.user.tag} just left the server, bye bye...`);
});

client.login(process.env.BOT_TOKEN);
