const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({
	intents: [
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMembers
	]
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for(const folder of commandFolders){
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for(const file of commandFiles){
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if('data' in command && 'execute' in command){
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});


client.on(Events.MessageCreate, async message => {
	if(message.author.bot) return;
	let mConNormal = message.content.toLowerCase();
	if(message.mentions.has(client.user.id)){
		let memberName = message.member.nickname === null ? message.member.user.username : message.member.nickname;
		await message.reply(`meow hi ${memberName} 🐱 i am a cat and have no reading comprehension meow`);
	}
	
	try{
		if(mConNormal.includes("cat") || mConNormal.includes("kitty")){
			await message.react("🐱");
		}
	}
	catch(e){
		console.log("error with reacting to message, message content: " + mConNormal);
		console.error(e);
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if(!interaction.isChatInputCommand()) return;
	console.log(interaction);
	const command = interaction.client.commands.get(interaction.commandName);
	if(!command){
		console.log(`No command matching ${interaction.commandName} was found.`);
		return;
	}
	
	try{
		await command.execute(interaction);
	} catch(error){
		console.error(error);
		if(interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Sorry there was an error', ephemeral: true });
		}
		else{
			await interaction.reply({ content: 'Sorry there was an error', ephemeral: true });
		}
	}
});

client.login(token);