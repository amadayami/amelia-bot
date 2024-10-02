const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const warninglog = './resources/warninglog.json';
const { mod } = require('../../resources/roleids.json');

function ordinalSuffix(count){
	let x = count % 10;
	let y = count % 100;
	
	if(x === 1 && y !== 11){
		return count + "st";
	}
	else if(x === 2 && y !== 12){
		return count + "nd";
	}
	else if(x === 3 && y !== 13){
		return count + "rd";
	}
	else return count + "th";
}

function getWarningCount(userID){
	let rawdata = fs.readFileSync(warninglog);
	let warnings = JSON.parse(rawdata);
	let warningCount = 0;
	let lastWarningTimestamp = 0;
	if(warnings.hasOwnProperty(userID)){
		let wk = Object.keys(warnings[userID])
		warningCount = wk.length;
		console.log("wk: " + parseInt(wk[wk.length-1]));
		console.log("warnings: " + warnings[userID][wk[wk.length-1]].timestamp);
		lastWarningTimestamp = warnings[userID][wk[wk.length-1]].timestamp;
	}
	return [warningCount, lastWarningTimestamp];
}

function updateWarningLog(timestamp, userID, reason){
	let rawdata = fs.readFileSync(warninglog);
	let warnings = JSON.parse(rawdata);
	if(warnings.hasOwnProperty(userID)){
		let userWarnings = warnings[userID];
		let w = Object.keys(userWarnings);
		let wcode = parseInt(w[w.length-1]) + 1;
		userWarnings[wcode] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	else {
		warnings[userID] = {};
		warnings[userID][001] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	let updata = JSON.stringify(warnings);
	fs.writeFileSync(warninglog, updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('warn')
	.setDescription('warns another member about their behavior')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to warn')
			.setRequired(true)
		)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('reason for warning')
			.setRequired(true)
		),	
			
	async execute(interaction) {
		const userID = interaction.user.id;
		const reason = interaction.options.getString('reason');
		
		const guild = interaction.member.guild;
		const guildMember = await guild.members.fetch(userID);
		if(!guildMember.roles.cache.some(role => role.id === mod)){
			await interaction.reply({ content: "must be an admin or mod to warn another member", ephemeral: true });
			return;
		}
		
		const warnedUser = interaction.options.getUser('user');
		console.log("warned user: " + warnedUser);
		let warnedUserName;
		const warnedGuildMember = await interaction.member.guild.members.fetch(warnedUser)
			.then((res) => {
				if(res.nickname === null){
					warnedUserName = (res.user.globalName === null) ? res.user.username : res.user.globalName;
				}
				else warnedUserName = res.nickname;
			});
		let [warnCount, lastWarningTimestamp] = getWarningCount(warnedUser);
		console.log(lastWarningTimestamp, Math.floor(Date.now() / 1000));
		if(lastWarningTimestamp + 300 > Math.floor(Date.now() / 1000)){
			await interaction.reply({ content: "user warned less than 5 minutes ago, on cooldown", ephemeral: true });
			return;
		}
		
		const tsConfirmation = await interaction.reply({ content: `you are warning **${warnedUserName}** for **${reason}**, this will be their ${ordinalSuffix(warnCount+1)} warning \n continue? (y/n)` });
		const filter = (m) => {
			m.author.id === interaction.user.id;
		};
		const collector = interaction.channel.createMessageCollector(filter, { max: 1, time: 30000 });
		collector.on('collect', async (m) => {
			collector.stop();
			console.log(m.content);
			let confirmation = m.content.toLowerCase();
			console.log("confirmation message: " + confirmation);
			if(confirmation === "y"){
				await m.reply({ content: `sending warning now`});
				updateWarningLog(Math.floor(Date.now()/1000), warnedUser, reason);
				warnedUser.send(`you have received a warning from ${interaction.member.guild.name} for the following reason: \n ${reason}`);
			}
			else{
				await m.reply({ content: "cancelling"});
			}
		});
	}		
}	