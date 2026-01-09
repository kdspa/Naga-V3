const { Command } = require('@sapphire/framework');

class Spotify extends Command {
    constructor(context, options) {
        super(context, {
        ...options, 
        name: 'spotify',
        description: 'Displays the Spotify presence for a given user. Returns your own Spotify presence if no user is provided.',
        detailedDescription: {
            'Command Forms and Arguments': 'spotify [user]'
        },
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
        builder
            .setName('spotify')
            .setDescription('Displays the Spotify presence for a given user.')
            .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('A member of the server')
                .setRequired(false)
            )
        )
    }

    /**
     * Returns the embed with Spotify presence info
     * @param {User} member 
     */
    spotifyPresence(member) {
        let spotify = (member.presence.activities.filter(n => n.name === 'Spotify'))[0];
        let embed = {
            author: {
                name: 'Spotify',
                icon_url: 'https://cdn.discordapp.com/emojis/663452041992994846.png?v=1'
            },
            thumbnail: { url: `https://i.scdn.co/image/${ spotify.assets.largeImage.slice(8)}` || null },
            color: 1947988,
            fields: [
                { name: 'Title', value: `[${spotify.details}](https://open.spotify.com/track/${spotify.syncId})`},
                { name: 'Artist', value: spotify.state, inline: false },
                { name: 'Album', value: spotify.assets.largeText, inline: false }
            ],
            footer: {
                text: member.username,
                icon_url: member.displayAvatarURL
            }
        };
        return embed;
    }

    async messageRun(message, args) {
        const memberArg = await args.pick('string').catch(() => null);
        const member = message.mentions.members.first() || (message.channel.guild.members.cache.get(memberArg)) || message.member;

        try {
            if (member.user.bot) return this.container.utils.sendError(message.channel, 'Please enter a human user.');
            let embed = this.spotifyPresence(member);

            message.channel.send({embeds: [embed]});
        } catch (err) {
            console.error(err);
            this.container.utils.sendError(message.channel, `An error occurred: \`\`\`${err}\`\`\``);
        }
    }

    async chatInputRun(interaction) {
        const user = interaction.options.getUser('member');
        const member = interaction.channel.guild.members.cache.get(user.id);
        await interaction.deferReply();

        try {
            if (member.user.bot) return interaction.editReply('Please enter a human user.');
            let embed = this.spotifyPresence(member);

            interaction.editReply({embeds: [embed]});
        } catch (err) {
            console.error(err);
            interaction.channel.editReply(`An error occurred: \`\`\`${err}\`\`\``);
        }
    }
}

module.exports = Spotify;