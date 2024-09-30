const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const bonkgif = "https://media1.tenor.com/m/-OtjAkp4Sa8AAAAC/not-mine.gif";
const bonktally = './resources/bonktally.json';

function createBonkEmbed(bonker, bonkee, bonkC){
	const bonkEmbed = new EmbedBuilder()
		.setTitle(`**${bonker}** has bonked **${bonkee}**`)
		.setDescription(`${bonkee} has been bonked **${bonkC} times**`)
		.setImage(bonkgif);
	return bonkEmbed;	
}

function updateBonkTally(userID){
	let rawdata = fs.readFileSync(bonktally);
	let bonks = JSON.parse(rawdata);
	bonks[userID] = (bonks.hasOwnProperty(userID)) ? bonks[userID] + 1 : 1;
	let updata = JSON.stringify(bonks);
	fs.writeFileSync(bonktally, updata);
	return bonks[userID];
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('bonk')
	.setDescription('Bonk')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to bonk')
			.setRequired(true)
		),	
			
	async execute(interaction) {
		const bonkedUser = interaction.options.getUser('user');
		let bonkedUserName;
		const guildMember = await interaction.member.guild.members.fetch(bonkedUser)
			.then((res) => {
				if(res.nickname === null){
					bonkedUserName = (res.user.globalName === null) ? res.user.username : res.user.globalName;
				}
				else bonkedUserName = res.nickname;
			});
		const userName = (interaction.member.nickname === undefined) ? interaction.user.globalName : interaction.member.nickname;
		
		let bonkC = updateBonkTally(bonkedUser.id);
		await interaction.reply({ embeds: [createBonkEmbed(userName, bonkedUserName, bonkC)] });
	}		
}	