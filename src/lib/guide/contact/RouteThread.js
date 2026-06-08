let https = require('https');
let jwt = require('jsonwebtoken');

function createToken(data, duration) {
    const options = {
      issuer: 'modmail-api'
    };
  
    if (duration) {
      options.expiresIn = duration;
    };
  
    return jwt.sign(data, process.env.HAWKY_API_SECRET, options);
};

async function route(interaction) {
    let category;
    switch (interaction.components[0].components[0].values[0]) {
        case 'report':
            category = '';
            break;
        case 'suggestion':
            category = '';
            break;
        case 'eventmaster':
            category = '';
            break;
        case 'partnerships':
            category = '';
            break;
        case 'staffreport':
            category = '';
            break;
        case 'other':
            category = '';
            break;
    };

    let data = {
        user: interaction.member.user,
        category: category,
        content: interaction.components[0].components[1].values
    };
    
    const payload = createToken(data);
    await https.post('https://hawky.atla.sh/threads/create', { method: 'POST' }, (res) => {
        let d = '';
        res.on('data', (chunk) => {
            d += chunk;
        });
        req.write(payload);
        req.end();
    });
};

module.exports = { route };