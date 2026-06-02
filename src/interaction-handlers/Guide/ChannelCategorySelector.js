const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');

const { channelInfo } = require('../../lib/guide/Channels');
const { replyStore } = require('../../lib/guide/ReplyStore');

class ChannelCategorySelector extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu
        });
    };

    parse(interaction) {
        if (interaction.customId !== 'guide_channels_selectcategory') {
            return this.none();
        };
        return this.some();
    }

    async run(interaction) {
        interaction.deferUpdate();
        let category = interaction.values[0];
        let channels = channelInfo(category, true);
        let reply = replyStore.get(interaction.member.id);
        return reply.edit(channels);
    }
}

module.exports = { ChannelCategorySelector };