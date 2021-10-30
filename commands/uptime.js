const chalk = require('chalk');


exports.run = async (target, context, msg, self, args, uptime) => {
  try{
		time = performance.now() - uptime
		let seconds = Math.floor(time/1000);
		let minutes = Math.floor(seconds/60);
		let hours = Math.floor(minutes/60);
		let days = Math.floor(hours/24);

		console.log(chalk.magenta(`I've been online for ${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`));
}
  catch(err){
    console.error(chalk.bgRed(`Error in upTime : `),err)
  }
};
