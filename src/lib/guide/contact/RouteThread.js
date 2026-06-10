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
            category = '719883529470738523';
            break;
        case 'suggestion':
            category = '719883529470738523';
            break;
        case 'eventmaster':
            category = '1039274712905298062';
            break;
        case 'partnerships':
            category = '1039274712905298062';
            break;
        case 'staffreport':
            category = '828540781291241492';
            break;
        case 'other':
            category = '719883529470738523';
            break;
    };

    const data = {
        user: interaction.member.user,
        category: category,
        content: interaction.components[0].components[1].values
    };

    const payload = createToken(data);
    const res = await fetch('https://hawky.atla.sh/threads/create', { method: 'POST', body: payload });
    return res.json();
};

module.exports = { route };