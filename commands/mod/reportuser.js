const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const reportlog = './resources/reportlog.json';
const { mod } = require('../../resources/roleids.json');

function updateReportLog(timestamp, userID, reportedUserID, reason){
	let rawdata = fs.readFileSync(reportlog);
	let reports = JSON.parse(rawdata);
	if(reports.hasOwnProperty(reportedUserID)){
		let userReports = reports[reportedUserID];
		let r = Object.keys(userReports);
		let rCode = parseInt(r[r.length-1]) + 1;
		userReports[rCode] = {
			timestamp: timestamp,
			reportedBy: userID,
			reason: reason
		}
	}
	else {
		reports[reportedUserID] = {};
		reports[reportedUserID][001] = {
			timestamp: timestamp,
			reportedBy: userID,
			reason: reason
		}
	}
	let updata = JSON.stringify(reports);
	fs.writeFileSync(reportlog, updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('report')
	.setDescription('sends a report to all moderators about a user')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to report')
			.setRequired(true)
		)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('reason for reporting')
			.setRequired(true)
		),
			
			
	async execute(interaction) {
		const userID = interaction.user.id;
		const username = interaction.user.username;	
		const reason = interaction.options.getString('reason');
		const reportedUser = interaction.options.getUser('user');
		console.log("reported user: \n" + reportedUser.username);
		let reportedUsername = reportedUser.username;	
			
		await interaction.reply({ content: `you have reported **${reportedUsername}** for **${reason}**, sending report to mods`, ephemeral: true });
		
		let mods = interaction.guild.roles.cache.get(mod).members.map(m => m.user.id);
		mods.forEach((mod) => {
			let user = interaction.guild.members.cache.get(mod);
			user.send(
			`**user report**\nuser: ${username}\nreporting: ${reportedUsername}\nreason: ${reason}`
			);
		});
		updateReportLog(Math.floor(Date.now()/1000), userID, reportedUser, reason)
	}		
}	