const { SlashCommandBuilder } = require('discord.js');
const { tenorAPIKey } = require('./resources/apikeys.json');

const Tenor = require("tenorjs").client({
	"Key": tenorAPIKey,
	"Filter": "off",
	"Locale": "en_US",
	"MediaFilter": "minimal",
	"DateFormat": "D/MM/YYYY - H:mm:ss A"
});
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('randomgif')
	.setDescription('Retrieves a random gif')
	.addStringOption(option => 
		option
			.setName('search_term')
			.setDescription('what kind of gif')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const search_term = interaction.options.getString('search_term');
		let resp = await Tenor.Search.Random(search_term, "1");
		console.log(resp[0].url);
		await interaction.reply({ content: resp[0].url ?? "didn't find gif"});
	}		
}	