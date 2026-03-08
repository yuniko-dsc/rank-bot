const { Client, Interaction } = require('discord.js')

module.exports = {
    name: "interactionCreate",
    /**
     * @param {Client} client
     * @param {Interaction} interaction 
    */
    async execute(client, interaction) {
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            const gsRoles = [...new Set(client.config.roles.map(r => r.gs_role))];

            const hasRole = gsRoles.some(roleId => interaction.member.roles.cache.has(roleId));

            if (!hasRole) 
                return interaction.reply({ content: "Tu n'as pas les permissions necessaires pour utiliser cette commande.", flags: 64 });

            command.executeSlash(client, interaction);
            console.log("[CMD-S]", interaction.guild ? `${interaction.guild.name} | ${interaction.channel.name}` : `DM`, `| ${interaction.user.username} | ${command.name}`);
        };
    }
}