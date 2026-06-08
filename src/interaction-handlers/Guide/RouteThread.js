const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');
const { route } = require('../../lib/guide/contact/RouteThread.js');

class RouteThread extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        })
    }

  parse(interaction) {
    const [userId, expirationTime, customId] = interaction.customId.split(':');

    if (customId != 'modal_contact') return this.none();

    if (userId != interaction.user.id) {
        interaction.reply({
            content: 'You can\'t use this menu',
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return this.none();
    }
    
    if (Date.now() > expirationTime) {
        interaction.reply({
            content: 'This menu has expired',
            flags: MessageFlags.Ephemeral
        }).catch(() => {});

        return this.none();
    }

        return this.some();
    }

    async run(interaction) {
        route(interaction);
    };
}

module.exports = { RouteThread };