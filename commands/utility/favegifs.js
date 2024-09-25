const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function getJSONData(){
	let rawData = fs.readFileSync('./commands/utility/resources/favoritegifs.json');
	let gifData = JSON.parse(rawData);
	return gifData;
}

function checkGifs(user, gifName){
	let gifs = getJSONData();
	if(user in gifs){
		let userGifs = gifs[user];
		if(userGifs[gifName] === undefined){
			console.log(`gif not found (${gifName})`);
			return 0;
		}
		else return userGifs[gifName];
	}
	else {
		console.log(`user not found (${user})`);
		return 0;
	}
}

function checkLimit(user){
	let gifs = getJSONData();
	if(gifs.hasOwnProperty(user)){
		let size = Object.keys(gifs[user]).length;
		if(size < 50 || size === undefined) return true;
	else return false;
	}
	else return true;
}

function getUserGifNames(user){
	let gifs = getJSONData();
	let userGifs = gifs[user];
	let gifStr = "Your gif names: \n";
	let gifNames = Object.keys(userGifs);
	console.log(gifNames);
	for(gif of gifNames){
		gifStr += gif + '\n';
	}
	return gifStr;
}

function updateGifs(user, gifName, gifLink){
	let gifData = getJSONData();
	if(gifData[user] === undefined){
		gifData[user] = {};
		gifData[user][gifName] = gifLink;
	}
	else{
		let userGifs = gifData[user];
		userGifs[gifName] = gifLink;
	}
	let updata = JSON.stringify(gifData);
	fs.writeFileSync('./commands/utility/resources/favoritegifs.json', updata);
}
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('favegifs')
	.setDescription('Adds or retrieves a specific gif')
	.addStringOption(option => 
		option
			.setName('name')
			.setDescription('gif name')
			.setRequired(true)
		)
	.addStringOption(option =>
		option
			.setName('link')
			.setDescription('link to gif')
			.setRequired(false)
		),	
			
	async execute(interaction) {
		const gifName = interaction.options.getString('name');
		const gifLinkP = interaction.options.getString('link');
		const user = interaction.user.id;
		
		if(gifName === "mygifs"){
			await interaction.reply({ content: getUserGifNames(user), ephemeral: true });
			return;
		}
		
		if(gifLinkP === null){
			//link not provided, check if given name is available
			let gifLink = checkGifs(user, gifName);
			if(gifLink === 0){
				await interaction.reply({ content: "gif not found, please provide link to add", ephemeral: true });
			}
			else {
				console.log(gifName + ": " + gifLink);
				await interaction.reply({ content: gifLink });
			}	
		}
		else {
			//link provided, update with new link
			if(!isValidUrl(gifLinkP)){
				await interaction.reply({ content: "please provide valid url for your gif/image", ephemeral: true });
				return;
			}
			let gifLink = checkGifs(user, gifName);
			if(gifLink === 0){
				//add new gif
				if(!checkLimit(user)){
					await interaction.reply({ content: "you have hit the limit for gifs, please remove some before adding new ones", ephemeral: true });
				}
				else {
					updateGifs(user, gifName, gifLinkP);
					await interaction.reply({ content: "gif added", ephemeral: true });
				}
			}
			else {
				updateGifs(user, gifName, gifLinkP);
				await interaction.reply({ content: "gif updated", ephemeral: true });
			}
		}
	}		
}	