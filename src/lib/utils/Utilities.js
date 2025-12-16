class Utilities {
  async sendSuccess(channel, content) {
    return await channel.send({ embeds: [
      { 
        color: 4437377,
        description: `<:yes:917982955362734100> ${content}`
      }
    ]});
  }

  async sendError(channel, content) {
    return await channel.send({ embeds: [
      {
        color: 15747399,
        description: `<:no:917982868922335272> ${content}`
      }
    ]});
  }
}

module.exports = { Utilities };