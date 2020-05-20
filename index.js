const token = "NzEyNjA0MTg5NTczNzc1Mzcw.XsT-lA.05yT5xto6IRSiGN6D9HsA3Yu9g4";

const { Client, Attachment } = require("discord.js");

const bot = new Client();

const ytdl = require("ytdl-core");

const prefix = "!";

var servers = {};

bot.on("ready", () => {
  console.log("Bot is online");
});

bot.login(token);

bot.on("message", (message) => {
  let args = message.content.substring(prefix.length).split(" ");

  switch (args[0]) {
    case "play":
      function play(connection, message) {
        var server = servers[message.guild.id];

        server.dispatcher = connection.playStream(
          ytdl(server.queue[(0, { filter: "audioonly" })])
        );

        server.queue.shift();

        server.dispatcher.on("end", function () {
          if (server.queue[0]) {
            play(connection, message);
          } else {
            connection.disconnect();
          }
        });
      }

      if (!args[1]) {
        message.channel.send("paste the video link after play");
        return;
      }

      if (!message.member.voiceChannel) {
        message.channel.send("You must be in a voice channel");
        return;
      }

      if (!servers[message.guild.id])
        servers[message.guild.id] = {
          queue: [],
        };

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.guild.voiceConnection)
        message.member.voiceChannel.join().then(function (connection) {
          play(connection, message);
        });

      break;
  }
});
