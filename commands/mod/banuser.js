const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const banlog = './resources/banlog.json';
const { mod } = require('../../resources/roleids.json');

function updateBanLog(timestamp, userID, reason){
	let rawdata = fs.readFileSync(banlog);
	let bans = JSON.parse(rawdata);
	if(bans.hasOwnProperty(userID)){
		let userBans = bans[userID];
		let b = Object.keys(userBans);
		let bCode = parseInt(b[b.length-1]) + 1;
		userBans[bCode] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	else {
		bans[userID] = {};
		bans[userID][001] = {
			timestamp: timestamp,
			reason: reason
		}
	}
	let updata = JSON.stringify(bans);
	fs.writeFileSync(banlog, updata);
}

module.exports = {
	data: new SlashCommandBuilder()
	.setName('ban')
	.setDescription('bans another user from server')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to ban')
			.setRequired(true)
		)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('reason for ban')
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
		
		const bUser = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		const bGuildMember = await guild.members.fetch(bUser.id);
		
		let bannedUserName;
		if(bGuildMember.nickname === null) bannedUserName = (bUser.globalName === null) ? bUser.username : bUser.globalName;
		else bannedUserName = bGuildMember.nickname;
		
		const tsConfirmation = await interaction.reply({ content: `you are banning **${bannedUserName}** for **${reason}**\n continue? (y/n)` });
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
				await m.reply({ content: `banning ${bannedUserName} now`});
				updateBanLog(Math.floor(Date.now()/1000), bUser, reason);
				await bUser.send(`you have been banned from ${guild.name} for the following reason: \n ${reason}`);
				bGuildMember.ban();
			}
			else{
				await m.reply({ content: "cancelling"});
			}
		});
	}		
}	