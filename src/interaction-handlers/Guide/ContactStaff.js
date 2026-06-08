const { InteractionHandler, InteractionHandlerTypes } = require('@sapphire/framework');
const { MessageFlags } = require('discord.js');
const { modal } = require('../../lib/guide/contact/Modal.js');

class ContactStaff extends InteractionHandler {
    constructor(ctx, options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

  parse(interaction) {
    const [userId, expirationTime, customId] = interaction.customId.split(':');

    if (customId != 'guide_button_contact') return this.none();

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
        modal(interaction);
    };
}

module.exports = { ContactStaff };