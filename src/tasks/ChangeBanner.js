const { ScheduledTask } = require('@sapphire/plugin-scheduled-tasks');
const axios = require('axios');
const banners = require('../assets/banners.json');

export class ChangeBanner extends ScheduledTask {
    constructor(context, options) {
        super(context, {
            ...options,
            pattern: '0 0 * * 0' // Every Monday at midnight UTC
        });
    };

    async convertImage(image) {
		var res = await axios.get(image, {
			headers: { Accept: 'image/*' },
			responseType: 'arraybuffer',
		}).then(response => `data:${response.headers['content-type']};base64,${response.data.toString('base64')}`);
        return res;
    };

    async run() {
        const doc = await this.container.models.get('Server').findById(messageOrInteraction.guild.id);

        if (doc.data.usedBanners.length === banners.length) {
            doc.data.usedBanners = doc.data.usedBanners.slice(-1); // Keep last element only to prevent it from being used again
        };

        let index, banner;
        do { 
            index = Math.floor(Math.random() * banners.length);
            banner = banners[index]; 
        } while(doc.data.usedBanners.includes(banner));

        doc.data.usedBanners.push(banner);

        let res = await this.convertImage(banner);

        doc.save().then(async () => {
            try {
                await this.container.guilds.cache.get('370708369951948800').edit({ banner: res, discoverySplash: res }, 'Weekly autochange');
            } catch (err) {
                return console.error(`Failed to change the banner: ${err}`);
            };
        });
    };
};

module.exports = { ChangeBanner };