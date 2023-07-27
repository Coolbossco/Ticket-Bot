const Discord = require('discord.js');
const client = new Discord.Client();
const { TicketManager } = require('discord-tickets');
const config = require('./config.json');
const disbut = require('discord-buttons')(client);
const fs = require('fs');

// Initializing the ticket manager
client.ticketManager = new TicketManager(client, {
    enabled: true,
    parentId: config.parentId,
    staffRole: config.staffRole,
    closeParentId: config.closedParentId,
    channelTopic: true,
    storage: './tickets.json',
    ticketCache: true
});

client.commands = new Discord.Collection();

/* Load all commands */
fs.readdir("./commands/", (_err, files) => {
    files.forEach((file) => {
        if (!file.endsWith(".js")) return;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, props);
        console.log(`👌 Command loaded: ${commandName}`);
    });
});

client.on('ready', () => {
    console.log(`Bot is ready as: ${client.user.tag}`);
});

client.on('clickButton', async (button) => {
    if (button.id === 'ticket_create') {
        await client.ticketManager.createTicket(button.guild, button.clicker.user);
        button.reply.send('Ticket has been created!');
    } else if (button.id === 'ticket_close') {
        const ticket = client.ticketManager.tickets.get(button.channel.id);
        if (ticket) {
            await ticket.close();
            button.reply.send('Ticket has been closed!');
        } else {
            button.reply.send('This command can only be used in ticket channels.');
        }
    }
});

client.on('channelCreate', channel => {
    const ticket = client.ticketManager.tickets.get(channel.id);
    if (ticket) {
        let button = new disbut.MessageButton()
            .setLabel('Close this ticket')
            .setStyle('red')
            .setID('ticket_close');

        let embed = new Discord.MessageEmbed()
            .setTitle('Ticket created')
            .setDescription('Click the button below when you want to close this ticket.')
            .setColor('BLUE');

        channel.send({ embed: embed, button: button });
    }
});

client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error executing that command.');
    }
});

client.login(config.token);
