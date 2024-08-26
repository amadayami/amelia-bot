const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function createHelpEmbed(){
	const helpEmbed = new EmbedBuilder()
		.setTitle('Commands List')
		.setDescription('Everything your werewolf boyfriend can do <3')
		.addFields(
			{ name: '/cat', value; 'Gets a random gif of a cat' },
			{ name: '/countdown', value: 'Creates a countdown to an event' },
			{ name: '/math', value: 'Does basic arithmetic (supports parentheses)' },
			{ name: '/randomgif', value: 'Gets a random gif based on a given keyword' },
			{ name: '/thread', value: 'Creates a thread with a given name' },
			{ name: '/translate', value: 'Translates a given phrase into werewolf' },
			{ name: '/weather', value: 'Gets current weather data for given location (US states only)' },
			{ name: '/clearcd', value: 'Removes countdown from list (mod/admin only)' }
		);
		
	return helpEmbed;	
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Get all commands'),
			
	async execute(interaction) {
		let resp = createHelpEmbed();
		await interaction.reply({ embeds: [resp], ephemeral: true });
	}		
}