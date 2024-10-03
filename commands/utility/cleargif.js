const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const gifsfile = './resources/favoritegifs.json';

function getJSONData(){
	let rawData = fs.readFileSync(gifsfile);
	let gifData = JSON.parse(rawData);
	return gifData;
}

function getAllGifNames(gifUser){
	let gifs = getJSONData();
	let userGifs = gifs[gifUser];
	if(userGifs === undefined) return "No gifs found for user.";
	let keys = Object.keys(userGifs);
	let nameStr = "";
	for(let i = 0; i < keys.length; i++){
		nameStr += keys[i];
		if(i !== keys.length - 1) nameStr += ',';
	}
	return nameStr;
}

function checkGifs(user, gifName){
	let gifs = getJSONData();
	if(user in gifs){
		let userGifs = gifs[user];
		if(userGifs[gifName] === undefined){
			console.log(`gif not found (${gifName})`);
			return 0;
		}
		else return userGifs[gifName];
	}
	else {
		console.log(`user not found (${user})`);
		return 0;
	}
}

function removeGif(user, gifName){
	let gifs = getJSONData();
	delete gifs[user][gifName];
	let updata = JSON.stringify(gifs);
	fs.writeFileSync(gifsfile, updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('cleargif')
	.setDescription('Retrieves/removes gif from list of given user')
	.addStringOption(option => 
		option
			.setName('name')
			.setDescription('the name of the gif to remove')
			.setRequired(false)
		),	
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		const user = interaction.user.id;
		const username = interaction.user.username;
		const guildMember = guild.members.cache.get(user);
		const gifName = interaction.options.getString('name') ?? 'noname';
		
		if(gifName === 'noname'){
			await interaction.reply({ content: `All saved gif names for ${username}: ${getAllGifNames(user)}`, ephemeral: true });
			return;
		}
		
		if(checkGifs(user, gifName) === 0){
			await interaction.reply({ content: "gif not found", ephemeral: true });
		}
		else {
			await interaction.reply({ content: `${gifName} found in list`, ephemeral: true });
			const tsConfirmation = await interaction.channel.send({ content: `are you sure you want to remove ${gifName}?`});
			const filter = (m) => {
				m.author.id === interaction.user.id;
			};
			const collector = tsConfirmation.channel.createMessageCollector(filter, { max: 1, time: 30000 });
			collector.on('collect', async (m) => {
				collector.stop();
				console.log(m.content);
				let confirmation = m.content.toLowerCase();
				console.log("confirmation message: " + confirmation);
				if(confirmation === "yes" || confirmation === "y" || confirmation === "ye"){
					await removeGif(user, gifName);
					await m.reply({ content: `removed ${gifName} from gif list`, ephemeral: true });
				}
				else{
					await m.reply({ content: "cancelling", ephemeral: true });
				}
			});
		}
	}		
}	