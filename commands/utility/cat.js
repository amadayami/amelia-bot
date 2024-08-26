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
	.setName('cat')
	.setDescription('Retrieves a random gif of a cat'),
			
	async execute(interaction) {
		let resp = await Tenor.Search.Random("cat", "1");
		console.log(resp[0].url);
		await interaction.reply({ content: resp[0].url ?? "didn't find gif"});
	}		
}	