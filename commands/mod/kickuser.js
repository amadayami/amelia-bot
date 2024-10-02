const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const kicklog = './resources/kicklog.json';
const { mod } = require('../../resources/roleids.json');

function updateKickLog(timestamp, userID, reason){
	let rawdata = fs.readFileSync(kicklog);
	let kicks = JSON.parse(rawdata);
	if(kicks.hasOwnProperty(userID)){
		let userKicks = kicks[userID];
		let k = Object.keys(userKicks);
		let kCode = parseInt(k[k.length-1]) + 1;
		userKicks[kCode] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	else {
		kicks[userID] = {};
		kicks[userID][001] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	let updata = JSON.stringify(kicks);
	fs.writeFileSync(kicklog, updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('kick')
	.setDescription('kicks another user from server')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to kick')
			.setRequired(true)
		)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('reason for kick')
			.setRequired(false)
		),	
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		const guildMember = await guild.members.fetch(interaction.user.id);
		console.log(guildMember);
		if(!guildMember.roles.cache.some(role => role.id === mod)){
			await interaction.reply({ content: "must be a mod to kick another member", ephemeral: true });
			return;
		}
		
		const kUser = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		const kGuildMember = await guild.members.fetch(kUser.id);
		
		let kickedUserName;
		if(kGuildMember.nickname === null) kickedUserName = (kUser.globalName === null) ? kUser.username : kUser.globalName;
		else kickedUserName = kGuildMember.nickname;
		
		const tsConfirmation = await interaction.reply({ content: `you are kicking **${kickedUserName}** for **${reason}**\n continue? (y/n)` });
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
				await m.reply({ content: `kicking ${kickedUserName} now`});
				updateKickLog(Math.floor(Date.now()/1000), kUser, reason);
				await kUser.send(`you have been kicked from ${guild.name} for the following reason: \n ${reason}`);
				kGuildMember.kick();
			}
			else{
				await m.reply({ content: "cancelling"});
			}
		});
	}		
}	