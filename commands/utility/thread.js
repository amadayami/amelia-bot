const { SlashCommandBuilder } = require('discord.js');
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('thread')
	.setDescription('Creates a new thread')
	.addStringOption(option => 
		option
			.setName('name')
			.setDescription('thread name')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const category = interaction.options.getString('name');
		await interaction.channel.threads.create({
			name: interaction.options.getString('name')
		})
		await interaction.reply({ content: "Thread created", ephemeral: true });
	}		
}	