const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
//add/change role here
const { admin, mod } = require('./resources/roleids.json');

function checkCDs(name){
	let data = fs.readFileSync('./commands/utility/resources/countdowns.json');
	let countdowns = JSON.parse(data);
	if(name in countdowns){
		return 1;
	}
	else return 0;
}

function removeCD(name){
	let rawdata = fs.readFileSync('./commands/utility/resources/countdowns.json');
	let countdowns = JSON.parse(rawdata);
	delete countdowns[name];
	let updata = JSON.stringify(countdowns);
	fs.writeFileSync('./commands/utility/resources/countdowns.json', updata);
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('clearcd')
	.setDescription('Removes countdown from list')
	.addStringOption(option => 
		option
			.setName('countdown')
			.setDescription('the name of the countdown to remove')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const guild = interaction.member.guild;
		const guildMember = guild.members.cache.get(interaction.user.id);
		//add/change roles here
		if(!guildMember.roles.cache.some(role => parseInt(role.id) === admin || parseInt(role.id) === mod)){
			//can also update bot reply here
			await interaction.reply({ content: "must be an admin or mod", ephemeral: true });
			return;
		}
		let cdName = interaction.options.getString('countdown');
		if(checkCDs(cdName)){
			await interaction.reply({ content: `${cdName} found in list`, ephemeral: true });
			const tsConfirmation = await interaction.channel.send({ content: `are you sure you want to remove ${cdName}?`, ephemeral: true });
			const filter = (m) => {
				m.author.id === interaction.user.id;
			};
			const collector = tsConfirmation.channel.createMessageCollector(filter, { max: 1, time: 30000 });
			collector.on('collect', async (m) => {
				collector.stop();
				console.log(m.content);
				let confirmation = m.content.toLowerCase();
				console.log("confirmation message: " + confirmation);
				if(confirmation === "yes" || confirmation === "y" || confirmation === "ye"){
					await removeCD(cdName);
					await m.reply({ content: `removed ${cdName} from countdowns list`, ephemeral: true });
				}
				else{
					await m.reply({ content: "cancelling", ephemeral: true });
				}
			});
		}
		else{
			await interaction.reply({ content: "countdown not found", ephemeral: true });
		}
	}		
}	