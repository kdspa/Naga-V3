let partners = require('./Partners.json');
function generateComponent(partner) {
    let guild = this.container.client.fetchInvite(partner.links.discord);

    let component = {
        type: 17, // Container
        id: partner.id,
        accent_color: 15913095,
        components: [
            {
                type: 11, // Server icon
                media: {
                    url: partner.banner || `https://cdn.discord.com/icons/${partner.id}/${guild.banner}.gif`,
                    content_type: 'image'
                }
            },
            {
                type: 9, // Section
                components: [
                    {
                        type: 10, // Server name
                        content: `# ${partner.name}`
                    },
                    {
                        type: 10, // Server description
                        content: `${partner.description}`
                    },
                    {
                        type: 10, // Server representatives
                        content: `-# Representatives: <@${partner.reps.join('>, <@')}`
                    },
                ]
            },
            {
                type: 1, // Links
                components: [
                    {
                        type: 2, // Discord button
                        style: 5,
                        label: 'Join Server',
                        url: `discord://-/invite/${partner.links.discord}` // Ideally this should join the server within the Discord client rather than opening a web browser
                    }
                ]
            }
        ]
    };

    return {
        flags: MessageFlags.IsComponentsV2,
        allowed_mentions: { parse: [] },
        component: [ component ],
    };
};

function partners() {
    let components;
    for (let partner of partners) {
        components.push(generateComponent(partner));
    };
    return components;
}