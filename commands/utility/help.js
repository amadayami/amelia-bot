const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const verboseCommands = {
	"bonk": "I bonk the provided user and keeps a tally of their bonks.",
	"cat": "I fetch a random gif of a cat from Tenor.",
	"cleargif": "I remove the provided gif from your saved gifs list. If you do not provide a gif name, I display the list of all gif names you have saved.",
	"countdown": "I fetch a countdown that has previously been saved by a user. If I do not find one by the provided name, I prompt you for a date (m d, y hh:mm OR mm-dd-yyyy hh:mm format) and save it for later.",
	"favegifs": "I fetch a gif from your personal set of gifs. I prompt you for the name and a link. If you provide just the name, I check the data based on the name. If you provide both, I save the link under the provided name (this also updates the gif if previously saved under the provided name). You can only have 50 saved gifs at a time.",
	"genshin": "I display the date of the next patch of Genshin Impact, time until that day, and the current banner half.",
	"genshinmats": "I display the talent materials that can be farmed today. If you provide the name of a specific character, then I display the days you can farm for their talent materials.",
	"math": "I perform the problem that you provide to me. I can only perform basic arithmetic (including parentheses and decimals) since I am a cat.",
	"randomgenshin": "I display a random world boss, trounce domain, team of four characters, element, and weapon type.",
	"randomgif": "I fetch a random gif based on a given keyword. I am not responsible for any strange or offensive gifs that I find. I am a cat and do not know what these things are.",
	"reportuser": "I will send a report for another user to any mods in the server.",
	"thread": "I create a new thread with the name that you provide me. The thread will be attached to whatever channel you use this command in.",
	"translate": "I translate whatever phrase you give me into cat. Please note that this is for fun and other cats won't understand you.",
	"weather": "I fetch the current weather data from Open Weather. The location you provide me must be in city,state format or I can't read it, and I can only search in the US."
}

function createHelpEmbed(){
	const helpEmbed = new EmbedBuilder()
		.setTitle('Commands List')
		.setDescription('Everything I can do!')
		.addFields(
			{ name: '/bonk', value: 'Bonks another user' },
			{ name: '/cat', value: 'Gets a random gif of a cat' },
			{ name: '/cleargif', value: 'Removes a gif from your saved gifs' },
			{ name: '/countdown', value: 'Creates a countdown to an event' },
			{ name: '/favegifs', value: 'Saves or gets your saved gifs' },
			{ name: '/genshin', value: 'Gets time of next patch' },
			{ name: '/genshinmats', value: 'Gets talent materials for the day or a given character' },
			{ name: '/math', value: 'Does basic arithmetic (supports parentheses and decimals)' },
			{ name: '/randomgenshin', value: 'Gets a random world boss, trounce domain, team, element, and weapon' },
			{ name: '/randomgif', value: 'Gets a random gif based on a given keyword' },
			{ name: '/reportuser', value: 'Sends a report about another user to mods' },
			{ name: '/thread', value: 'Creates a thread with a given name' },
			{ name: '/translate', value: 'Translates a given phrase into cat' },
			{ name: '/weather', value: 'Gets current weather data for given location (US states only)' }
		);
	return helpEmbed;	
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('help')
	.setDescription('Get all commands')
	.addStringOption(option =>
		option
			.setName('command')
			.setDescription('the command that you want a more verbose description for')
			.setRequired(false)
		),
			
	async execute(interaction) {
		const command = interaction.options.getString('command') ?? 'nocommand';
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