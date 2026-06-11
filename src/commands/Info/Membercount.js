const { Command, Resolvers } = require('@sapphire/framework');

class MemberCount extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'membercount',
            aliases: ['members'],
            description: 'View how many members are in your server',
            detailedDescription: {
                'Command Forms and Arguments': 'n.membercount'
            }
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
        .setName('membercount')
        .setDescription('View how many members are in your server')
        )
    };

    async memberCount(messageOrInteraction) {
        try {
            const guild = messageOrInteraction.channel.guild;
            let members = await guild.members.fetch();
            let total = guild.memberCount;
            let humans = members.filter(m => !m.user.bot).size;
            let bots = members.filter(m => m.user.bot).size;
        
            let embed = {
                color: this.container.utils.getColor('blue'),
                author: {
                    name: guild.name,
                    icon_url: guild.iconURL()
                },
                fields: [
                    { name: 'Members',  value: total.toLocaleString(),  inline: true },
                    { name: 'Humans',   value: humans.toLocaleString(), inline: true },
                    { name: 'Bots',     value: bots.toLocaleString(),   inline: true },
                ],
                footer: { text: `ID: ${guild.id}` },
                timestamp: new Date()
            };

            return await messageOrInteraction.channel.send({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            return this.container.utils.sendError(messageOrInteraction.channel, `An error occurred: \`\`\`${err}\`\`\``);
        }
    }

    async messageRun(message) {
        await this.memberCount(message);
    }

    async chatInputRun(interaction) {
        await interaction.deferReply();
        this.memberCount(interaction);
    }
};

module.exports = { MemberCount };