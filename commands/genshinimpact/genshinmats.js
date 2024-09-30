const { SlashCommandBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const fs = require('fs');
const talentfile = './resources/talentmaterials.json';

const weekday = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function createMatEmbed(day){
	let objArr = findDailyMats(day);
	let icon = `https://static.wikia.nocookie.net/gensin-impact/images/b/b1/Emblem_Domains.png/revision/latest?cb=20210615025731`;
	const matsEmbed = new EmbedBuilder()
		.setTitle(`talent materials for ${day}`)
		.setThumbnail(icon);
	for(let i = 0;  i < objArr.length; i++){
		matsEmbed.addFields(
			{ name: `${objArr[i][1]["nation"]}: ${objArr[i][0]}`, value: `for ${humanize(objArr[i][1]["characters"])}`}
		);
	}		
	return matsEmbed;	
}

function findDailyMats(day){
	console.log("today: " + day);
	let objArr = [];
	let rawdata = fs.readFileSync(talentfile);
	let materials = JSON.parse(rawdata);
	for(const [key, obj] of Object.entries(materials)){
		for(availableDay of obj["availability"]){
			if(availableDay === day){
				objArr.push([key, obj]);
			}
		}
	}
	return objArr;
}

function humanize(arr){
	let str = "";
	for(let i = 0; i < arr.length; i++){
		str += arr[i];
		if(i !== arr.length - 1){
			str += ", ";
		}
	}
	return str;
}

function findCharacterMats(name){
	let rawdata = fs.readFileSync(talentfile);
	let materials = JSON.parse(rawdata);
	for(const [key, obj] of Object.entries(materials)){
		for(character of obj["characters"]){
			if(character === name.toLowerCase()) return [key, obj];
		}
	}
	return [0,0];
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('genshinmats')
	.setDescription('Gets the talent materials for today or specific character')
	.addStringOption(option => 
		option
			.setName('character')
			.setDescription('character name')
			.setRequired(false)
		),
			
	async execute(interaction) {
		let cName = interaction.options.getString('character');
		if(cName){
			let [material, matdetails] = findCharacterMats(cName);
			if(material === 0){
				await interaction.reply({ content: "character not found :(", ephemeral: true });
			}
			else{
				let resp = `${cName}'s talent material is ${material} in ${matdetails["nation"]} and is available on ${matdetails["availability"][0]}, ${matdetails["availability"][1]}, and sunday <3`;
				await interaction.reply({ content: resp });
			}
		}
		else{
			let d = new Date().getDay();
			if(d === 0) {
				await interaction.reply({ content: "All talent domains are available today (sunday) <3" })
			}
			else{
				await interaction.reply({ embeds: [createMatEmbed(weekday[d])] });
			}
		}
	}		
}	