module.exports = {
    name: 'close',
    description: 'Close a ticket.',
    async execute(message, args) {
        const ticket = message.client.ticketManager.tickets.get(message.channel.id);
        if (ticket) {
            await ticket.close();
            message.reply('Ticket has been closed!');
        } else {
            message.reply('This command can only be used in ticket channels.');
        }
    },
};
