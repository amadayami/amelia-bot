const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const { admin, mod } = require('./resources/roleids.json');

function getJSONData(){
	let rawData = fs.readFileSync('./commands/utility/resources/favoritegifs.json');
	let gifData = JSON.parse(rawData);
	return gifData;
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
	fs.writeFileSync('./commands/utility/resources/favoritegifs.json', updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('cleargif')
	.setDescription('Removes gif from list')
	.addStringOption(option => 
		option
			.setName('name')
			.setDescription('the name of the gif to remove')
			.setRequired(false)
		)
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('the user who added the gif')
			.setRequired(false)
		),	
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		let user = interaction.user.id;
		const guildMember = guild.members.cache.get(user);
		
		const gifName = interaction.options.getString('name');
		const gifUser = interaction.options.getUser('user');
		
		if(gifUser !== null){
			if(!guildMember.roles.cache.some(role => parseInt(role.id) === admin)){
				await interaction.reply({ content: "must be an admin to delete other users' gifs", ephemeral: true });
				return;
			}
			console.log(`admin ${interaction.user.username} removing gif from user ${gifUser.username} list`);
			user = gifUser.id;
		}
		
		//check if gif exists on user list
		//confirm removal
		
		if(checkGifs(user, gifName) === 0){
			await interaction.reply({ content: "gif not found :(", ephemeral: true });
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