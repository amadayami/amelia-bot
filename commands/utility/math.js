const { SlashCommandBuilder } = require('discord.js');
const { evaluate } = require('mathjs');
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('math')
	.setDescription('doing math for you')
	.addStringOption(option => 
		option
			.setName('equation')
			.setDescription('provided equation')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const equation = interaction.options.getString('equation').replace(/\s/g, '');
		let filter = new RegExp('^[\\d\\*\\+\\-\\(\\)\\/\\.]*$') 
		if(filter.test(equation)){
			let resp = `${equation} is ${evaluate(equation)} <3`;
			await interaction.reply({ content: resp, ephemeral: true });
		}
		else{
			await interaction.reply({ content: "invalid character :(", ephemeral: true });
		}
	}		
}