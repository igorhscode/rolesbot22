module.exports = {

	/**
	 * Instructions on how to get this: https://redd.it/40zgse
	 */
	yourID: "",

	setupCMD: "!rolereact",

	/**
	 * Delete the 'setupCMD' command after it is ran. Set to 'true' for the command message to be deleted
	 */
	deleteSetupCMD: false,

	initialMessage: `**Роли**`,
	
	embedMessage: `
	Нажав на реакцию ниже - вы получите игровую роль 
	♡ Нажав повторно вы её снимите с профиля.
	`,
	
	/**
	 * Must set this if "embed" is set to true
	 */
	embedFooter: "Role Reactions",
	
	roles: ["VimeWorld", "Cs-go", "Dota 2", "MineCraft", "Osu", "League of Legends"],

	/**
	 * For custom emojis, provide the name of the emoji
	 */
	reactions: ["vime_logo", "cs_logo", "dota_logo", "mine_logo", "osu", "lol"],

	/**
	 * Set to "true" if you want all roles to be in a single embed
	 */
	embed: true,

	/**
	 * Set the embed color if the "embed" variable is et to "true"
	 * Format:
	 * 
	 * #dd9323
	 */
	embedColor: "#dd9323",

	/**
	 * Set to "true" if you want to set a thumbnail in the embed
	 */
	embedThumbnail: false,

	/**
	 * The link for the embed thumbnail if "embedThumbnail" is set to true
	 */
	embedThumbnailLink: "",

	/**
	 * You"ll have to set this up yourself! Read more below:
	 * Please do not commit this token to the public if you contributed to this repository
	 * or host your code anywhere online. Giving someone your bot's token is the equivalent
	 * to giving someone the keys to your house and walking away!
	 * 
	 * https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token
	 */
	botToken: "NzA2MTk3NjM2OTg1NjUxMjcw.Xq2v0w.8AqsrTZJa15GZzNwYsIHlyQnuh4"
};
