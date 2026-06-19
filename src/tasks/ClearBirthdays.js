const { ScheduledTask } = require('@sapphire/plugin-scheduled-tasks');

const GUILD_ID = '370708369951948800';
const BIRTHDAY_ROLE = '787644908705153024'

const IGNORED_MEMBERS = [
	'83773809529716736' // Aura
];

export class ClearBirthdays extends ScheduledTask {
    constructor(context, options) {
        super(context, {
            ...options,
            pattern: '0 0 * * 0'
        });
    };

    async clearBirthdays(guild) {
        let existingBirthdays = guild.members.cache.filter(m => (m.roles.includes(BIRTHDAY_ROLE)) && (!IGNORED_MEMBERS.includes(m.id)));

        for (let i of existingBirthdays) {
            i.roles.remove(BIRTHDAY_ROLE, 'Birthday ended');
            console.log(`[Birthday] Birthday role (should have been) removed from ${i.id}.`);
        };
    };

    async postBirthdays(db, guild) {
        let birthdayMentions = [];
        try {
            db.find({ 'data.profile.birthday': moment().format('Do MMMM') }, async (err, docs) => {
                const members = docs.map(x => x._id);

                for (let m of members) {
                    m = guild.members.cache.get(m);
                    if (guild.members.has(m)) {
                        birthdayMentions.push(`<@!${m}>`);
                        m.roles.add(BIRTHDAY_ROLE, 'It\'s their birthday!');
                    };
                };

                let embed = {
                    title: 'Happy Birthday!',
                    color: parseInt('f294f3', 16),
                    description: `Don't worry, the captain cares enough to remember the birthday(s) of ${birthdayMentions.join(', ')}!\n\nWishing you a very happy birthday! Welcome to the Pink Lotus!`,
                    thumbnail: { url: 'https://cdn.discordapp.com/emojis/887756769865109546.png?v=1' },
                    image: { url: 'https://cdn.discordapp.com/attachments/411903716996677639/890018048298332160/happy-birthday-avatar.gif' }
                };

                if (birthdayMentions.length >= 1) {
                    const birthdayChannel = guild.channels.cache.get('1007044599287656559');

                    let birthdayChannelMessages = await birthdayChannel.message.fetch();
                    birthdayChannelMessages.pop(); // First message in birthday channel won't be deleted

                    if (birthdayChannelMessages.length >= 1) birthdayChannelMessages.forEach((msg) => msg.delete());
                    await birthdayChannel.send({ content: birthdayMentions.join(', '), embed: embed });
                };
                if (err) {
                    return console.error(err);
                }
            });
        } catch (err) {
            return console.error(err);
        };
    };

    async run() {
        const db = await this.container.models.get('Server').findById(GUILD_ID);
        const guild = await this.container.client.guilds.cache.get(GUILD_ID);

        await this.clearBirthdays();
        await this.postBirthdays(db, guild);
    };
}

module.exports = { ClearBirthdays };