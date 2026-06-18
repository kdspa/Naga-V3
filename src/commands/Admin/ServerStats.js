const util = require('util');
const { exec } = require('child_process');
const { Command } = require('@sapphire/framework');

class Restart extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'restart',
            aliases: ['rs'],
            description: 'Restarts the bot client',
            preconditions: ['DevOnly']
        });
    };

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('restart')
            .setDescription('restarts the bot client')
        )
    };

    async serverStats(msg) {
        const guild = messageOrInteraction.guild;
        const doc = await this.container.models.get('Server').findById(guild.id);
        try {
            let embed = {
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL
                },
                color: this.utils.getColor('blue'),
                fields: [
                    { name: 'Server Owner', value: this.container.utils.fullName(this.container.resolver.user(guild, guild.ownerID)), inline: false },
                    { name: 'Members', value: guild.memberCount.toLocaleString(), inline: false },
                    { name: 'Naga Added On', value: `<t:${Math.floor(guild.joinedAt / 1000)}:F>`, inline: false },
                    { name: 'Topics Used', value: `${doc.data.ignoredTopics.length} / ${doc.data.topics.length}`, inline: false },
                    { name: 'WYRs Used', value: `${doc.data.ignoredWyrs.length} / ${doc.data.wyrs.length}`, inline: false },
                ],
                footer: {
                    text: `Server ID: ${guild.id}`
                }
            };

            return this.container.utils.sendMessage(msg.channel, embed);
        } catch (err) {
            this.container.utils.sendError(msg.channel, err);
        };
    };

    messageRun(message) {
        await this.restart(message);
    };

    chatInputRun(interaction) {
        await this.restart(interaction);
    };
};

module.exports = { Restart };