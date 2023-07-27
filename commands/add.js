module.exports = {
    name: 'add',
    description: 'Add a user to a ticket.',
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You must mention a user to add them to the ticket.');
        }
        const ticket = message.client.ticketManager.tickets.get(message.channel.id);
        if (ticket) {
            await ticket.channel.updateOverwrite(user, { VIEW_CHANNEL: true });
            message.reply(`User ${user.tag} has been added to the ticket.`);
        } else {
            message.reply('This command can only be used in ticket channels.');
        }
    },
};
