const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const warninglog = './resources/warninglog.json';
const { mod } = require('../../resources/roleids.json');

function warningToString(warnings){
	let warningStr = "";
	let count = 0;
	for(const warning in warnings){
		count++;
		warningStr += `warning #${warning}:\ndate: ${new Date(warnings[warning].timestamp * 1000)}\nreason: ${warnings[warning].reason}`;
		warningStr += "\n\n";
	}
	warningStr += `User has been warned ${count} times`;
	return warningStr;
}

function retrieveData(user){
	let rawdata = fs.readFileSync(warninglog);
	let warnings = JSON.parse(rawdata);
	if(warnings.hasOwnProperty(user)){
		return warningToString(warnings[user]);
	}
	else return 0;
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('getwarnings')
	.setDescription('Retrieves all warnings sent to a user')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('user to search')
			.setRequired(true)
		),
			
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		const guildMember = await guild.members.fetch(interaction.user.id);
		if(!guildMember.roles.cache.some(role => role.id === mod)){
			await interaction.reply({ content: "must be a mod to get user warnings", ephemeral: true });
			return;
		}
		
		const user = interaction.options.getUser('user');
		let resp = retrieveData(user);
		if(resp === 0){
			await interaction.reply({ content: "No warnings found for user.", ephemeral: true });
		}
		else await interaction.reply({ content: resp, ephemeral: true });
	}		
}	