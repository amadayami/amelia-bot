const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const natlanTimestamp = 1724814000;
const twentyonedays = 86400*21;
const fortytwodays = 86400*42;
const { versionNum, patchNum, currentPatch } = require('../../resources/genshindata.json');

const characterImages = [
	"https://static.wikia.nocookie.net/gensin-impact/images/7/7e/Icon_Emoji_Paimon%27s_Paintings_31_Rosaria_1.png/revision/latest?cb=20240412042827",
	"https://static.wikia.nocookie.net/gensin-impact/images/9/97/Icon_Emoji_Paimon%27s_Paintings_34_Navia_1.png/revision/latest?cb=20240807091817",
	"https://static.wikia.nocookie.net/gensin-impact/images/c/c9/Icon_Emoji_Paimon%27s_Paintings_04_Albedo_1.png/revision/latest?cb=20210906044019",
	"https://static.wikia.nocookie.net/gensin-impact/images/e/e4/Icon_Emoji_Paimon%27s_Paintings_19_Nahida_3.png/revision/latest?cb=20221124043005",
	"https://static.wikia.nocookie.net/gensin-impact/images/d/d2/Icon_Emoji_Paimon%27s_Paintings_27_Wriothesley_2.png/revision/latest?cb=20231030092655",
	"https://static.wikia.nocookie.net/gensin-impact/images/a/a8/Icon_Emoji_Paimon%27s_Paintings_09_Raiden_Shogun_3.png/revision/latest?cb=20211118214341",
	"https://static.wikia.nocookie.net/gensin-impact/images/6/6e/Icon_Emoji_Paimon%27s_Paintings_08_Yoimiya_1.png/revision/latest?cb=20220311062318",
	"https://static.wikia.nocookie.net/gensin-impact/images/9/9e/Icon_Emoji_Paimon%27s_Paintings_26_Neuvillette_1.png/revision/latest?cb=20230824043610",
	"https://static.wikia.nocookie.net/gensin-impact/images/5/55/Icon_Emoji_Paimon%27s_Paintings_30_Gaming_3.png/revision/latest?cb=20240207044114",
	"https://static.wikia.nocookie.net/gensin-impact/images/f/f3/Icon_Emoji_Paimon%27s_Paintings_21_Alhaitham_1.png/revision/latest?cb=20230120043201",
	"https://static.wikia.nocookie.net/gensin-impact/images/2/2e/Icon_Emoji_Paimon%27s_Paintings_21_Alhaitham_4.png/revision/latest?cb=20230120043157"
]
function createEmbed(currentTimestamp){
	let [v,p,c] = getGenshinPatch(currentTimestamp);
	let half = getHalf(currentTimestamp, c);
	if(half === 1) half = "1st";
	else half = "2nd";
	let pNext = p + 1;
	let vNext = v;
	if(pNext > 8){
		pNext =- 9;
		vNext++;
	}
	let nextPatchTimestamp = (c+fortytwodays) + addOffset(c+fortytwodays);
	let timeUntil = unixToRelative(nextPatchTimestamp, currentTimestamp);
	const genshEmbed = new EmbedBuilder()
		.setTitle(`time until ${vNext}.${pNext}: ${timeUntil}`)
		.setThumbnail(characterImages[Math.floor(Math.random()*characterImages.length)])
		.addFields(
			{ name: "Current banner", value: `v${v}.${p} ${half} half` },
			{ name: "Next patch", value: `<t:${nextPatchTimestamp}:F>` }
		);
	
	return genshEmbed;
}

function unixToRelative(timestamp, currentTimestamp){
	let timeUntil = timestamp - currentTimestamp;
	const timeLimits = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];
	const rtf = new Intl.RelativeTimeFormat('en', { style: 'long', numeric: 'auto' });
	const timeUnits = ["second", "minute", "hour", "day", "week", "month", "year"];
	let unitIndex = timeLimits.findIndex((e) => e > Math.abs(timeUntil));
	let divisor = unitIndex ? timeLimits[unitIndex - 1] : 1;
	return rtf.format(Math.floor(timeUntil/divisor), timeUnits[unitIndex]);
}

function addOffset(timestamp){
	let date = new Date(timestamp*1000);
	if(date.isDstObserved()){
		return 0;
	}
	else return 3600;
}

Date.prototype.stdTimezoneOffset = function() {
	let jan = new Date(this.getFullYear(), 0, 1);
	let jul = new Date(this.getFullYear(), 6, 1);
	return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.isDstObserved = function() {
	return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

function getHalf(currentTimestamp, currentPatch){
	let timeSince = currentTimestamp - currentPatch;
	if(timeSince > twentyonedays){
		return 2;
	}
	else return 1;
}

function getGenshinPatch(currentTimestamp){
	let p = patchNum;
	let v = versionNum;
	let c = currentPatch;
	let timeSince = currentTimestamp - c;
	let inc = 0;
	if(timeSince > fortytwodays){
		console.log("time greater");
		while(timeSince > fortytwodays){
			inc++;
			timeSince -= fortytwodays;
		}
		p += inc;
		if(p > 8){
			while(p > 8){
				v++;
				p =- 9;
			}
		}
		c += (fortytwodays * inc);
		updateCurrentPatch(v, p, c);
	}
	return [v, p, c];
}

function updateCurrentPatch(v, p, timestamp){
	let rawdata = fs.readFileSync('./commands/utility/resources/genshindata.json');
	let genshindata = JSON.parse(rawdata);
	genshindata.versionNum = v;
	genshindata.patchNum = p;
	genshindata.currentPatch = timestamp;
	let updata = JSON.stringify(genshindata);
	fs.writeFileSync('./commands/utility/resources/genshindata.json', updata);
}
			
module.exports = {
	data: new SlashCommandBuilder()
	.setName('genshin')
	.setDescription('time until the next patch')
	.setDMPermission(true),
			
	async execute(interaction) {
		const currentTimestamp = Math.floor((Date.now())/1000);
		console.log([versionNum, patchNum, currentPatch]);
		(getGenshinPatch(currentTimestamp));
		await interaction.reply({ embeds: [createEmbed(currentTimestamp)] });
	}		
}	