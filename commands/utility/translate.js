const { SlashCommandBuilder } = require('discord.js');

function translate(phrase){
	let translated = '';
	let toTranslateArr = phrase.split(' ');
	for(let i = 0; i < toTranslateArr.length; i++){
		translated += translateWord(toTranslateArr[i]);
		if(i != toTranslateArr.length - 1) translated += " ";
	}
	return `"${phrase}" translates to "${translated}"`;
}

function translateWord(word){
	switch(word.length){
		case 0:
			console.log("can't have empty string");
			return "";
		case 1:
			return "purr";
		case 2:
			return "hiss";
		case 3:
			return "mew";
		case 4:
			return "meow";
		default:
			return "meo" + "w".repeat(word.length-3);
	}
}
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('translate')
	.setDescription('Translates into kitty')
	.addStringOption(option => 
		option
			.setName('phrase')
			.setDescription('the phrase you want to translate')
			.setRequired(true)
		),
			
	async execute(interaction) {
		let toTranslate = interaction.options.getString('phrase');
		toTranslate = toTranslate.replace("/^[\w\s]/g", '');
		await interaction.reply({ content: translate(toTranslate) });
	}		
}	