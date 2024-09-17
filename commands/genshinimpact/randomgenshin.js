const { SlashCommandBuilder, EmbedBuilder, ComponentType } = require('discord.js');
const fs = require('fs');

function createRandomEmbed(){
	let icon = `https://static.wikia.nocookie.net/gensin-impact/images/d/d6/Icon_Emoji_Paimon%27s_Paintings_13_Raiden_Shogun_2.png/revision/latest?cb=20220311050453`;
	let rawdata = fs.readFileSync('./commands/utility/resources/randomgenshindata.json');
	let data = JSON.parse(rawdata);
	
	let worldBoss = getElement(data["worldBosses"]);
	let trounceDomain = getElement(data["trounceDomains"]);
	let characters = getElements(data["characters"], 4);
	let elementType = getElement(data["elements"]);
	let weaponType = getElement(data["weapons"]);
	
	const randomEmbed = new EmbedBuilder()
		.setTitle('randomly generated genshin')
		.setThumbnail(icon);
	
	randomEmbed.addFields(
		{ name: "team", value: humanize(characters) },
		{ name: "world boss", value: worldBoss},
		{ name: "trounce domain", value: trounceDomain},
		{ name: "element", value: elementType},
		{ name: "weapon", value: weaponType}
	);
	return randomEmbed;	
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

function getElement(arr){
	return arr[Math.floor(Math.random() * arr.length)];
}

function getElements(arr, len){
	let elements = [];
	for(let i = 0; i < len; i++){
		elements.push(arr[Math.floor(Math.random() * arr.length)]);
	}
	return elements;
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('randomgenshin')
	.setDescription('Gets a random world boss, trounce domain, team, element, and weapon'),
			
	async execute(interaction) {
		await interaction.reply({ embeds: [createRandomEmbed()], ephemeral: true });
	}		
}	