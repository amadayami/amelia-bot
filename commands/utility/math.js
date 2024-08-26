const { SlashCommandBuilder } = require('discord.js');
	
function stringToSolution(eq){
	return helper(Array.from(eq), 0);
}

function helper(s, index){
	let stack = [];
	let sign = '+';
	let num = 0;
	for(let i = index; i < s.length; i++){
		let c = s[i];
		if(c >= '0' && c <= '9'){
			//converts the string value of the numbers into int
			num = num * 10 + (c - '0');
		}
		if(!(c >= '0' && c <= '9') || i === s.length-1){
			if(c === '('){
				num = helper(s, i+1);
				let l = 1, r = 0;
				for(let j = i+1; j < s.length; j++){
					if(s[j] === ')'){
						r++;
						if(r === l){
							i=j;
							break;
						}
					}
					else if(s[j] === '(') l++;
				}
			}
			let pre = -1;
			switch(sign){
				case '+':
					stack.push(num);
					break;
				case '-':
					stack.push(num*-1);
					break;
				case '*':
					pre = stack.pop();
					stack.push(pre*num);
					break;
				case '/':
					pre = stack.pop();
					stack.push(pre/num);
					break;
			}
			sign = c;
			num = 0;
			if(c === ')') break;
		}
	}
	let acc = 0;
	while(stack.length > 0){
		acc += stack.pop();
	}
	return acc;
}
	
module.exports = {
	data: new SlashCommandBuilder()
	.setName('math')
	.setDescription('doing math for you')
	.addStringOption(option => 
		option
			.setName('equation')
			.setDescription('provided equation')
			.setRequired(true)
		),
			
	async execute(interaction) {
		const equation = interaction.options.getString('equation').replace(/\s/g, '');
		let filter = new RegExp('^[\\d\\*\\+\\-\\(\\)\\/]*$') 
		if(filter.test(equation)){
			let resp = `${equation} is ${stringToSolution(equation)} <3`;
			await interaction.reply({ content: resp, ephemeral: true });
		}
		else{
			await interaction.reply({ content: "invalid character :(", ephemeral: true });
		}
	}		
}