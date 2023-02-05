const ticketModel = require("../../models/ticket");
const config = require("../../json/config.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  description: "Remove someone from a ticket",
  userPerms: ["BAN_MEMBERS"],
  botPerms: ["MANAGE_CHANNELS", "EMBED_LINKS"],
  async execute(message, args) {
    let mention = message.mentions.members.first();
    let logs = await message.guild.channels.fetch(config.logs);

    if (mention) {
      const ticket = await ticketModel.findOne({ channel: message.channel.id });

      if (!ticket)
        return message.reply("This channel doesn't belong to a ticket");

      if (!mention.permissionsIn(message.channel).has(["VIEW_CHANNEL", "SEND_MESSAGES"]))
        return message.reply("That user isn't in this ticket");

      // remove perms to the channel from the user
      message.channel.permissionOverwrites.create(mention, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
      });

      message.reply(`Succesfully removed ${mention} from the ticket`).catch(console.error);

      // alternate image (author)
      const avatarGif = message.author.displayAvatarURL({
        dynamic: true,
      });

      const avatarPng = message.author.displayAvatarURL({
        type: "png",
      });

      let avatar = avatarGif.includes(".gif") ? avatarGif : avatarPng;

      // alternate image (user)
      const userGif = mention.user.displayAvatarURL({
        dynamic: true,
      });

      const userPng = mention.user.displayAvatarURL({
        type: "png",
      });

      let userAvatar = userGif.includes(".gif") ? userGif : userPng;

      // send member removed log
      const removedEmbed = new MessageEmbed()
        .setAuthor(message.author.username, avatar)
        .setColor("#f54542")
        .setTitle("Member removed")
        .setThumbnail(userAvatar)
        .addField("User ID", mention.id)
        .setFooter(`Ticket ID: ${ticket.channel}`)
        .setTimestamp();
      logs.send({ embeds: [removedEmbed] });

      // send alert embed to the user
      const removedDM = new MessageEmbed()
        .setAuthor(message.author.username, avatar)
        .setTitle("Removed from ticket")
        .setDescription(`You were removed from a ticket`)
        .setColor("#42c5f5");

      mention.send({ embeds: [removedDM] }).catch(console.log);
    } else {
      const member = await message.guild.members.fetch(args[0]);

      if ((!member && !mention) || !member)
        return message.reply("Specify a correct user or id");

      const ticket = await ticketModel.findOne({ channel: message.channel.id });

      if (!ticket)
        return message.reply("This channel doesn't belong to a ticket");

      if (!member.permissionsIn(message.channel).has(["VIEW_CHANNEL", "SEND_MESSAGES"]))
        return message.reply("That user isn't in this ticket");

      // remove perms to the channel from the user
      message.channel.permissionOverwrites.create(member, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        ATTACH_FILES: false,
        READ_MESSAGE_HISTORY: false,
      });

      message.reply(`Succesfully removed ${member} from the ticket`).catch(console.error);

      // alternate image (author)
      const avatarGif = message.author.displayAvatarURL({
        dynamic: true,
      });

      const avatarPng = message.author.displayAvatarURL({
        type: "png",
      });

      let avatar = avatarGif.includes(".gif") ? avatarGif : avatarPng;

      // alternate image (user)
      const userGif = member.user.displayAvatarURL({
        dynamic: true,
      });

      const userPng = member.user.displayAvatarURL({
        type: "png",
      });

      let userAvatar = userGif.includes(".gif") ? userGif : userPng;

      // send member removed log
      const removedEmbed = new MessageEmbed()
        .setAuthor(message.author.username, avatar)
        .setColor("#f54542")
        .setTitle("Member removed")
        .setThumbnail(userAvatar)
        .addField("User ID", member.id)
        .setFooter(`Ticket ID: ${ticket.channel}`)
        .setTimestamp();
      logs.send({ embeds: [removedEmbed] });

      // send alert embed to the user
      const removedDM = new MessageEmbed()
        .setAuthor(message.author.username, avatar)
        .setTitle("Removed from ticket")
        .setDescription(`You were removed from a ticket`)
        .setColor("#42c5f5");

      member.send({ embeds: [removedDM] }).catch(console.log);
    }
  },
};
