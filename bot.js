import Discord, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import { readFile } from "fs";
dotenv.config();

const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

function send(message,channel) {
    channel.send(message)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
}

client.on('ready', () => {
    console.log('The bot is ready');

    const guildID = '894868801919778826';
    const channelID = '932858602790748172'
    const roleID = '894869513781268541'
    const guild = client.guilds.cache.get(guildID);
    const channel = client.channels.cache.get(channelID);
    readFile("timetable.json", function(err, data) {
        if (err) throw err;
        const timetable = JSON.parse(data);
        const days = ["monday","tuesday","wednesday","thursday","friday"];
        var today = new Date();
        var schedule = timetable[days[today.getDay()-1]];
        for (const num in schedule) {
            var c = schedule[num];
            var now = new Date();
            var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), c['time'][0], c['time'][1], 0, 0) - now;
            console.log("Time till " + c['name'] + " : " + Math.floor(millisTill10/60000) + " minutes");
            if (millisTill10 > 0) {
                let output = "Class in 5 mins:\n";
                output += c['start'].join(":") + " - " + c['end'].join(":") + " -> " + c['name'] + "\n";
                output += "Room : " + c['room'] + "\n";
                output += "Link : " + c['link'] + "\n\n";
                setTimeout(function(){
                    send("<@&" + roleID + "> " + output, channel)
                }, millisTill10);
            }
        }
    });
})

client.login(process.env.TOKEN);