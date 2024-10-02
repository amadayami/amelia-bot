const { SlashCommandBuilder } = require('discord.js');
const { mod } = require('../../resources/roleids.json');

const fs = require('fs');
const warninglog = './resources/warninglog.json';
const reportlog = './resources/reportlog.json';
const kicklog = './resources/kicklog.json';
const banlog = './resources/banlog.json';

function reportToString(reports){
	let reportStr = "";
	let count = 0;
	for(const report in reports){
		count++;
		reportStr += `report #${report}:\n date: ${new Date(reports[report].timestamp * 1000)}\n reported by: ${reports[report].reportedBy}\n reason: ${reports[report].reason}`;
		reportStr += "\n\n";
	}
	reportStr += `User has been reported ${count} times`;
	return reportStr;
}

function logToString(logs, type){
	let logStr = "";
	let count = 0;
	for(const log in logs){
		count++;
		logStr += `${type} #${log}:\ date: ${new Date(logs[log].timestamp * 1000)}\nreason: ${logs[log].reason}`;
		logStr += "\n\n";
	}
	if(type === "ban"){
		logStr += `User has been banned ${count} times.`;
	}
	else {
		logStr += `User has been ${type}ed ${count} times.`;
	}
	return logStr;
}

function retrieveData(user, type){
	let rawdata;
	switch(type){
		case "warn":
			rawdata = fs.readFileSync(warninglog);
			break;
		case "report":
			rawdata = fs.readFileSync(reportlog);
			break;
		case "kick":
			rawdata = fs.readFileSync(kicklog);
			break;
		case "ban":
			rawdata = fs.readFileSync(banlog);
			break;
		default:
			console.log("there was an error in data type");
			return;
	}
	let logs = JSON.parse(rawdata);
	if(logs.hasOwnProperty(user)){
		if(type === "report") return reportToString(logs[user]);
		else return logToString(logs[user], type);
	}
	else return 0;
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('modlogs')
	.setDescription('Retrieves mod information')
	.addStringOption(option =>
		option
			.setName('type')
			.setDescription('type of mod data to load')
			.setRequired(true)
			.addChoices(
				{ name: "Warnings", value: "warn" },
				{ name: "Reports", value: "report" },
				{ name: "Kicks", value: "kick" },
				{ name: "Bans", value: "ban" }
			)
		)	
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
			await interaction.reply({ content: "must be a mod to get mod data", ephemeral: true });
			return;
		}
		
		const user = interaction.options.getUser('user');
		const type = interaction.options.getString('type');
		console.log(type);
		let resp = retrieveData(user, type);
		if(resp === 0){
			await interaction.reply({ content: `No ${type}s found for user.`, ephemeral: true });
		}
		else await interaction.reply({ content: resp, ephemeral: true });
	}		
}	