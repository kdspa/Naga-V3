const { Command } = require('@sapphire/framework');

class Eval extends Command {
    constructor(context, options) {
        super(context, {
            ...options, 
            name: 'loadtenure',
            aliases: ['lt'],
            description: 'Loads staff tenure into database for Team command & guide page',
            preconditions: ['DevOnly']
        });
    };

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) =>
            builder
            .setName('loadtenure')
            .setDescription('Loads staff tenure into database for Team command & guide page')
            .addUserOption((option) =>
            option
            .setName('user')
            .setDescription('A staff member')
            .setRequired(true))
            .addStringOption((option) =>
            option
            .setName('date')
            .setDescription('Optional date (the current date is used if this is left out)'))
        )
    };

    /**
     * Loads a new staff member's start date into the database
     * @param {Message|Interact} msg Message or Interaction object
     * @param {string} args User ID
     * @returns 
     */
    async loadTenure(msg, user, tenure) {
        try {

            if (typeof user !== User) {
                user = this.resolver.user(user);
            };

            const doc = await this.container.models.get('profile').findById(user.id);
            let timestamp = this.container.utils.convertTimestampToUnix(tenure) || Date.now();

            doc.data.profile.staffTenure = timestamp;

            doc.save().then(this.container.utils.sendSucces(messageOrInteraction.channel, `Successfully loaded tenure for ${user.username}`))
        } catch (err) {
            this.container.utils.sendError(msg.channel, err);
        };
    };

    async messageRun(message, args) {
        let user = await args.pick('string').catch(() => null);
        let tenure = await args.pick('string').catch(() => null); 
        await this.loadTenure(message, user, tenure);
    };

    async chatInputRun(interaction) {
        let user = interaction.options.getUser('user');
        let tenure = interaction.options.getString('tenure')
        await this.loadTenure(interaction, user, tenure);
    };
};

module.exports = { LoadTenure };