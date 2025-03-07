const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const countdownsfile = './resources/countdowns.json'

function createCDEmbed(title, timestamp){
	let timeUntil = unixToRelative(timestamp);
	let date = new Date(timestamp * 1000);
	const cdEmbed = new EmbedBuilder()
		.setTitle(`✨${title} ${timeUntil}✨`)
		.setDescription(`${date}`);
	return cdEmbed;	
}

function unixToRelative(timestamp){
	let timeUntil = timestamp - Math.floor(Date.now()/1000);
	const timeLimits = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
	const rtf = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'auto' });
	const timeUnits = ["second", "minute", "hour", "day", "week", "month", "year"];
	let unitIndex = timeLimits.findIndex((e) => e > Math.abs(timeUntil));
	let divisor = unitIndex ? timeLimits[unitIndex - 1] : 1;
	return rtf.format(Math.floor(timeUntil/divisor), timeUnits[unitIndex]);
}

function checkCDs(name){
	let data = fs.readFileSync(countdownsfile);
	let countdowns = JSON.parse(data);
	for (const [key, value] of Object.entries(countdowns)){
		if( name.toLowerCase() === key.toLowerCase() ){
			return countdowns[key];
		}
	}
	return 0;
}

function formatCheck(input){
	let months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
	let regex1 = new RegExp("^\\d\\d-\\d\\d-\\d\\d\\d\\d \\d\\d:\\d\\d$");
	let regex2 = new RegExp("^\\d{1,2} \\d{1,2},{0,1} \\d{4} \\d\\d:\\d\\d$");
	let regex3 = new RegExp("^[a-z]+ \\d{1,2},{0,1} \\d{4} \\d\\d:\\d\\d$"); 
	let startsWithLetters = new RegExp("^[a-z]+");
	
	if(regex1.test(input) || regex2.test(input)) return input;
	if(regex3.test(input)){
		const inputArray = input.split(" ");
		let monthDigit = months.indexOf(inputArray[0].toLowerCase()) + 1;
		if(monthDigit < 1) return -1;
		inputArray[0] = monthDigit;
		return inputArray.join(" ");
	}
	return -1;
}

function updateCDs(name, timestamp){
	let rawdata = fs.readFileSync(countdownsfile);
	let countdowns = JSON.parse(rawdata);
	countdowns[name] = timestamp;
	let updata = JSON.stringify(countdowns);
	fs.writeFileSync(countdownsfile, updata);
}

function getTimestamp(date){
	return new Date(date).getTime()/1000;
}
		
module.exports = {
	data: new SlashCommandBuilder()
	.setName('countdown')
	.setDescription('Creates/gets a countdown to an event')
	.addStringOption(option => 
		option
			.setName('cdname')
			.setDescription('name of the countdown')
			.setRequired(true)
		),
			
	async execute(interaction) {
		let cdName = interaction.options.getString('cdname');
		if(cdName === "old"){
			await interaction.reply({ content: "old is a special keyword, please use a different name", ephemeral: true });
			return;
		}
		let timestamp = await checkCDs(cdName);
		if(timestamp !== 0){
			await interaction.reply({ embeds: [createCDEmbed(cdName, timestamp)] });
		}
		else{
			await interaction.reply({ content: "one moment", ephemeral: true });
			const tsConfirmation = await interaction.channel.send(`when is ${cdName}?`);
			const filter = (m) => {
				m.author.id === interaction.user.id;
			};
			const collector = tsConfirmation.channel.createMessageCollector(filter, { max: 1, time: 30000 });
			collector.on('collect', async (m) => {
				collector.stop();
				console.log(m.content);
				if(formatCheck(m.content) == -1){
					await m.reply({ content: "invalid date" });
				}
				else {
					let convertedDate = getTimestamp(m.content);
					await updateCDs(cdName, convertedDate);
					await m.reply({ embeds: [createCDEmbed(cdName, convertedDate)] });
				}
			});
		}
	}		
}	