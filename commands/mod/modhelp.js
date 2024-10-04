const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { mod } = require('../../resources/roleids.json');

const verboseCommands = {
	"banuser": "I ban a user from the current server. I will send a message informing the user about the ban, including the reason if you provide one. I will also keep a log about bans.",
	"clearcd": "I remove a specific countdown from the saved countdown list. If you wish to remove all past countdowns, use the keyword 'old'.",
	"cleargifmod": "I remove the provided gif from the user's saved gifs list. If you do not provide a gif name, I display the list of all gif names the user has saved.",
	"getmoddata": "I display the logs for previous warnings, reports, kicks, or bans for the provided user.",
	"kickuser": "I kick a user from the current server. I will send a message informing the user about the kick, including the reason if you provide one. I will also keep a log about kicks.",
	"timeout": "I timeout a user for the specified duration.",
	"warnuser": "I send a user a message warning them about their behavior. I also keep a log about warnings and inform you of how many times they have been warned previously."
}

function createHelpEmbed(){
	const helpEmbed = new EmbedBuilder()
		.setTitle('Moderation Commands List')
		.setDescription('Everything I can do!')
		.addFields(
			{ name: '/banuser', value: 'Bans a user from the server.' },
			{ name: '/clearcd', value: 'Removes a countdown from the saved countdown list.' },
			{ name: '/cleargifmod', value: 'Retrieves/removes gifs from a user\'s list.' },
			{ name: '/getmoddata', value: 'Retrieves logs for warnings, reports, kicks, and bans.' },
			{ name: '/kickuser', value: 'Kicks a user from the server.' },
			{ name: '/timeout', value: 'Times out a user for a given time' },
			{ name: '/warnuser', value: 'Sends a user a warning message.' }
		);
	return helpEmbed;	
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('modhelp')
	.setDescription('Get all commands')
	.addStringOption(option =>
		option
			.setName('command')
			.setDescription('the command that you want a more verbose description for')
			.setRequired(false)
		),
			
	async execute(interaction) {
		const command = interaction.options.getString('command') ?? 'nocommand';
		
		const guild = interaction.member.guild;
		const guildMember = await guild.members.fetch(interaction.user.id);
		if(!guildMember.roles.cache.some(role => role.id === mod)){
			await interaction.reply({ content: "must be a mod to access these commands", ephemeral: true });
			return;
		}
		
		
		if(command === 'nocommand'){
			let resp = createHelpEmbed();
			await interaction.reply({ embeds: [resp], ephemeral: true });
			return;
		}
		
		if(verboseCommands.hasOwnProperty(command.toLowerCase())){
			await interaction.reply({ content: verboseCommands[command], ephemeral: true });
		}
		else await interaction.reply({ content: "I don't have a command by that name.", ephemeral: true });
	}		
}