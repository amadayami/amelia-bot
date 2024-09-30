const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const https = require('https');
const { weatherAPIKey } = require('../../resources/apikeys.json');

function getLatLon(city, state){
	let geocodehttp = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=1&appid=${weatherAPIKey}`;
	return new Promise((resolve, reject) => {
		https.get(geocodehttp, res => {
			console.log('Status code:', res.statusCode);
			let contentType = res.headers['content-type']
			let data = [];
			
			let error;
			if(res.statusCode !== 200){
				error = new Error('Request Failed. Status Code: ' + res.statusCode);
			}
			else if(!/^application\/json/.test(contentType)){
				error = new Error('Invalid content-type. Expected application/json, received ' + contentType);
			}
			
			if(error){
				console.error(error.message);
				res.resume();
			}
			
			res.on('data', chunk => {
				data.push(chunk);
			});
			
			res.on('end', () => {
				try{
					const locationData = JSON.parse(Buffer.concat(data).toString());
					resolve(locationData);
				} catch(e){
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject('Got error: ' + e.message);
		});
	});
}

function getWeatherData(lat, lon){
	//console.log("lat: " + lat + ", lon: " + lon);
	let weatherhttp = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${weatherAPIKey}`;
	return new Promise((resolve, reject) => {
		https.get(weatherhttp, res => {
			console.log('Status code:', res.statusCode);
			let contentType = res.headers['content-type']
			let data = [];
			
			let error;
			if(res.statusCode !== 200){
				error = new Error('Request Failed. Status Code: ' + res.statusCode);
			}
			else if(!/^application\/json/.test(contentType)){
				error = new Error('Invalid content-type. Expected application/json, received ' + contentType);
			}
			
			if(error){
				console.error(error.message);
				res.resume();
			}
			
			res.on('data', chunk => {
				data.push(chunk);
			});
			
			res.on('end', () => {
				try{
					const weatherData = JSON.parse(Buffer.concat(data).toString());
					resolve(weatherData);
				} catch(e){
					reject(e.message);
				}
			});
		}).on('error', (e) => {
			reject('Got error: ' + e.message);
		});
	});
}

function weather(city, state){
	let lat, lon;
	return new Promise((resolve, reject) => {
		getLatLon(city, state)
			.then(res => {
				getWeatherData(res[0].lat, res[0].lon)
					.then(res => {
						//console.log(res);
						resolve(res);
					})
					.catch(err => {
						console.log(err);
						reject(err);
					});	
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
	});
}

function createWeatherEmbed(city, state, res){
	let icon = `https://openweathermap.org/img/wn/${res.weather[0].icon}.png`;
	const weatherEmbed = new EmbedBuilder()
		.setTitle(`Current weather for ${city}, ${state}`)
		.setDescription(`${res.weather[0].main}: ${res.weather[0].description}`)
		.setThumbnail(icon)
		.addFields(
			{ name: 'Temp', value: `${res.main.temp}°F` },
			{ name: 'Feels Like', value: `${res.main.feels_like}°F`, inline: true },
			{ name: 'Min/max', value: `${res.main.temp_min}°F/${res.main.temp_max}°F`, inline: true },
			{ name: 'Humidity', value: `${res.main.humidity}%`, inline: true }	
		);
	return weatherEmbed;	
}
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('weather')
	.setDescription('Gets the weather for a given location')
	.addStringOption(option => 
		option
			.setName('location')
			.setDescription('city,state')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const loca = interaction.options.getString('location');
		
		if(!loca.includes(',')){
			await interaction.reply({ content: "improper format :(", ephemeral: true });
			return;
		}
		let args = loca.split(',');
		
		console.log("weather args provided: " + args);
		if(args[0] === undefined || args[1] === undefined){
			await interaction.reply({ content: "missing location information :(", ephemeral: true });
			return;
		}
		
		let wsRegex = /^\s+|\s+$/g;
		for(let i = 0; i < args.length; i++){
			args[i] = args[i].replace(wsRegex, "");
		}
		await weather(args[0], args[1])
			.then(res => {
				let weatherEmbed = createWeatherEmbed(args[0], args[1], res);
				interaction.reply({ embeds: [weatherEmbed] });
			})
			.catch(err => {
				console.log(err);
				interaction.reply({ content: "there was a problem owo", ephemeral: true });
			});
	}		
}	