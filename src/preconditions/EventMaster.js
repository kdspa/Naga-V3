const { Precondition } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');

class EventMasterPrecondition extends Precondition {
  async messageRun(message) {
    return this.hasPerms(message.member);
  }

  async chatInputRun(interaction) {
    return this.hasPerms(interaction.member);
  }

  async contextMenuRun(interaction) {
    return this.hasPerms(interaction.member);
  }

  async hasPerms(member) {
    if (this.container.developers.includes(member.id)) return this.ok();

    const eventMasterId = '830138455337730049';

    const roleIds = member.roles.cache.map(role => role.id);

    const hasPermission = roleIds.includes(eventMasterId) ||
                          member.permissions.has(PermissionFlagsBits.BanMembers) ||
                          member.permissions.has(PermissionFlagsBits.Administrator);

    if (hasPermission) return this.ok();

    return this.error();
  }
}

module.exports = { EventMasterPrecondition };