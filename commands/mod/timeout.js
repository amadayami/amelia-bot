const { SlashCommandBuilder } = require('discord.js');
const { mod } = require('../../resources/roleids.json');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('timeout')
	.setDescription('timeouts another user')
	.addUserOption(option =>
		option
			.setName('user')
			.setDescription('person to warn')
			.setRequired(true)
		)
	.addIntegerOption(option =>
		option
			.setName('duration')
			.setDescription('duration of timeout')
			.setRequired(true)
			.addChoices(
				{ name: "10 minutes", value: 600000 },
				{ name: "30 minutes", value: 1800000 },
				{ name: "1 hour", value: 3600000 },
				{ name: "1 day", value: 86400000 },
				{ name: "1 week", value: 604800000 },
				{ name: "1 month", value: 2419200000 }
			)
		)
	.addStringOption(option =>
		option
			.setName('reason')
			.setDescription('reason for timeout')
			.setRequired(false)
		),	
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		const guildMember = await guild.members.fetch(interaction.user.id);
		if(!guildMember.roles.cache.some(role => role.id === mod)){
			await interaction.reply({ content: "must be a mod to timeout another member", ephemeral: true });
			return;
		}
		
		const tUser = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason') ?? 'No reason provided.';
		const timeoutD = interaction.options.getInteger('duration');
		
		console.log(interaction.options);

		const tGuildMember = await guild.members.fetch(tUser.id);
		
		tGuildMember.timeout(timeoutD);
		
		let time;
		switch(timeoutD){
			case 600000:
				time = "10 minutes";
				break;
			case 1800000:
				time = "30 minutes";
				break;
			case 3600000:
				time = "1 hour";
				break;
			case 86400000:
				time = "1 day";
				break;
			case 604800000:
				time = "1 week";
				break;
			case 2419200000:
				time = "1 month";
				break;
			default:
				console.log("time machine broke");
		}
		
		await interaction.reply({ content: `${tUser} you have been timed out for ${time} for the following reason: ${reason}`});
	}		
}	