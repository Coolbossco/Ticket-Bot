const disbut = require('discord-buttons');

module.exports = {
    name: 'setup',
    description: 'Setup ticket system.',
    async execute(message, args) {
        if (!args[0]) {
            return message.reply('You must provide a channel ID.');
        }

        const channel = message.guild.channels.cache.get(args[0]);

        if (!channel) {
            return message.reply('Channel not found.');
        }

        let button = new disbut.MessageButton()
            .setLabel('Create a ticket')
            .setStyle('green')
            .setID('ticket_create');

        let embed = new Discord.MessageEmbed()
            .setTitle('Need help?')
            .setDescription('If you need help, click the button below to create a new ticket.')
            .setColor('BLUE');

        channel.send({ embed: embed, button: button });
    },
};
