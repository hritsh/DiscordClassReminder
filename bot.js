import Discord, { Intents } from 'discord.js';
import dotenv from 'dotenv';
import { readFile } from "fs";
import keepAlive from './server.js';
dotenv.config();

const client = new Discord.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

function send(message,channel) {
    channel.send(message)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
}

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

client.on('ready', () => {
    console.log('The bot is ready');

    const guildID = '845744634751483914';
    const channelID = '847532489408512030'
    const roleID = '932652332381007873'
    const guild = client.guilds.cache.get(guildID);
    const channel = client.channels.cache.get(channelID);
    readFile("timetable.json", function(err, data) {
        if (err) throw err;
        const timetable = JSON.parse(data);
        const days = ["monday","tuesday","wednesday","thursday","friday"];
        var today = new Date();
        today = convertTZ(today, "Asia/Dubai")
        var schedule = timetable[days[today.getDay()-1]];
        for (const num in schedule) {
            var c = schedule[num];
            var now = new Date();
            now = convertTZ(now, "Asia/Dubai")
            var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), c['time'][0], c['time'][1], 0, 0) - now;
            console.log("Time till " + c['name'] + " : " + millisTill10);
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

keepAlive();
client.login(process.env.TOKEN);