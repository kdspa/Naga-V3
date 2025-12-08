const { Precondition } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');

class MoverStarPrecondition extends Precondition {
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

    const moverStarId = '1224072458206711928';
    const moverDirectorId = '1225198018597228625';

    const roleIds = member.roles.cache.map(role => role.id);

    const hasPermission = roleIds.includes(moverStarId) ||
                          roleIds.includes(moverDirectorId) ||
                          member.permissions.has(PermissionFlagsBits.BanMembers) ||
                          member.permissions.has(PermissionFlagsBits.Administrator);

    if (hasPermission) return this.ok();

    return this.error();
  }
}

module.exports = { MoverStarPrecondition };