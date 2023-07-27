module.exports = {
    name: 'remove',
    description: 'Remove a user from a ticket.',
    async execute(message, args) {
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('You must mention a user to remove them from the ticket.');
        }
        const ticket = message.client.ticketManager.tickets.get(message.channel.id);
        if (ticket) {
            await ticket.channel.updateOverwrite(user, { VIEW_CHANNEL: false });
            message.reply(`User ${user.tag} has been removed from the ticket.`);
        } else {
            message.reply('This command can only be used in ticket channels.');
        }
    },
};
