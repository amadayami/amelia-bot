const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const reportlog = './resources/reportlog.json';
const { mod } = require('../../resources/roleids.json');

function reportToString(reports){
	let reportStr = "";
	let count = 0;
	for(const report in reports){
		count++;
		reportStr += `report #${report}:\ndate: ${new Date(reports[report].timestamp * 1000)}\nreported by: ${reports[report].reportedBy}\nreason: ${reports[report].reason}`;
		reportStr += "\n\n";
	}
	reportStr += `User has been reported ${count} times`;
	return reportStr;
}

function retrieveData(user){
	let rawdata = fs.readFileSync(reportlog);
	let reports = JSON.parse(rawdata);
	if(reports.hasOwnProperty(user)){
		return reportToString(reports[user]);
	}
	else return 0;
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('getreports')
	.setDescription('Retrieves all reports about a user')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('user to search')
			.setRequired(true)
		),
			
			
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		let resp = retrieveData(user);
		if(resp === 0){
			await interaction.reply({ content: "No reports found for user.", ephemeral: true });
		}
		else await interaction.reply({ content: resp, ephemeral: true });
	}		
}	