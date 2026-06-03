const { Command, Resolvers } = require('@sapphire/framework');
const moment = require('moment');
require('moment-duration-format');
const pkg = require('../../../package.json');

class Info extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'info',
            aliases: ['about'],
            description: 'View bot info.',
            detailedDescription: {
                'Command Forms and Arguments': 'n.info'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('info')
        .setDescription('View bot info')
        )
    };

    async info(messageOrInteraction) {
        try {
            const duration = moment.duration(process.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
            let team = [];
        
            for (let dev of this.container.developers) {
                team.push(this.container.utils.fullName(this.container.client.users.cache.get(dev)));
            };

            let embed = {
                title: pkg.name,
                color: this.container.utils.getColor('blue'),
                thumbnail: {
                    url: this.container.client.user.avatarURL()
                },
                fields: [
                    { name: 'Description', value: pkg.description },
                    { name: 'Version', value: pkg.version, inline: true },
                    { name: 'Library', value: 'discord.js', inline: true },
                    { name: 'Created', value: `<t:${Math.floor(this.container.client.user.createdAt / 1000)}:F>` },
                    { name: 'Developers', value: team.join(', ') }
                ],
                footer: { text: `${this.container.client.user.username} | PID: ${process.pid} | Uptime: ${duration}`}
            };

            return await messageOrInteraction.channel.send({ embeds: [embed] });
        } catch (err) {
            return this.container.utils.sendError(messageOrInteraction.channel, `An error occurred: \`\`\`${err}\`\`\``);
        }
    }

    async messageRun(message) {
        this.info(message);
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();
        this.info(interaction);
    }
};

module.exports = { Info };