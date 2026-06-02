const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');

const { faq } = require('../../lib/guide/FAQ');
const { channelInfo } = require('../../lib/guide/Channels');
const { replyStore } = require('../../lib/guide/ReplyStore');

class ButtonSelector extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    };

    parse(interaction) {
        if (!interaction.customId.startsWith('guide_button')) {
            return this.none();
        }
        return this.some();
    }

    async run(interaction) {
        if (interaction.componentType !== 2) return;
        if (interaction.customId === 'guide_button_faq') {
            return interaction.reply(faq);
        };

        if (interaction.customId === 'guide_button_channelinfo') {
            let channels = channelInfo('guide');
            let reply = await interaction.reply(channels);
            replyStore.set(interaction.member.id, reply);
            return;
        };
    }
}

module.exports = { ButtonSelector };