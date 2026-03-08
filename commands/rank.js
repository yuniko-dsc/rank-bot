const { SlashCommandBuilder, PermissionsBitField, Client, Interaction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    name: "rank",
    description: "Gere le rank d'un utilisateur.",
    aliases: [],
    permissions: [PermissionsBitField.Flags.ViewChannel],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    hide: true,
    /**
     * @param {Client} client
     * @param {Interaction} interaction  
     */
    async executeSlash(client, interaction) {
        const user = interaction.options.getUser('user');
        if (!user) return interaction.reply({ content: 'Aucun utilisateur de trouve.', flags: 64 });

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: 'Membre introuvable dans ce serveur.', flags: 64 });

        const rankEmbed = new EmbedBuilder()
            .setColor(0x0000ff)
            .setDescription('Veuillez choisir un rank a modifier.');

        const rankRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('rank_select')
                .setMaxValues(1)
                .setOptions(client.config.roles.map((r, i) => ({
                    label: r.name,
                    value: String(i)
                })))
        );

        const message = await interaction.reply({ embeds: [rankEmbed], components: [rankRow], fetchReply: true });
        const collector = message.createMessageComponentCollector({ time: 5 * 60 * 1000 });

        collector.on('collect', async (i) => {
            if (i.user.id !== interaction.user.id)
                return i.reply({ content: 'Cette interaction ne vous appartient pas.', flags: 64 });

            if (i.customId === 'rank_select') {
                const rankIndex = parseInt(i.values[0]);
                const rankData = client.config.roles[rankIndex];

                if (!member.roles.cache.has(rankData.gs_role)) {
                    return i.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor(0xff4444)
                                .setDescription(`Cet utilisateur ne possede pas le role requis pour acceder au rank **${rankData.name}**.`)
                        ],
                        flags: 64
                    });
                }

                const roleOptions = await Promise.all(
                    rankData.roles.map(async (roleId) => {
                        const role = await interaction.guild.roles.fetch(roleId).catch(() => null);
                        return {
                            label: role ? role.name : roleId,
                            value: roleId,
                        };
                    })
                );

                const rolesEmbed = new EmbedBuilder()
                    .setColor(0x0000ff)
                    .setDescription(`Selectionnez les roles a modifier pour **${user}**.`);

                const rolesRow = new ActionRowBuilder().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`role_toggle_${rankIndex}`)
                        .setPlaceholder('Choisir les roles...')
                        .setMinValues(1)
                        .setMaxValues(rankData.roles.length)
                        .addOptions(roleOptions)
                );

                await i.update({ embeds: [rolesEmbed], components: [rolesRow] });
            }

            if (i.customId.startsWith('role_toggle_')) {
                const rankIndex = parseInt(i.customId.split('_')[2]);
                const rankData = client.config.roles[rankIndex];
                const selectedRoleIds = i.values;

                const added = [];
                const removed = [];

                for (const roleId of selectedRoleIds) {
                    if (!rankData.roles.includes(roleId)) continue;

                    const role = await interaction.guild.roles.fetch(roleId).catch(() => null);
                    if (!role) continue;

                    if (member.roles.cache.has(roleId)) {
                        await member.roles.remove(roleId).catch(() => null);
                        removed.push(role.name);
                    } else {
                        await member.roles.add(roleId).catch(() => null);
                        added.push(role.name);
                    }
                }

                let description = `Les roles de **${user}** ont bien ete modifies.`;

                if (added.length > 0)
                    description += `\n\n**Roles Ajoutes :**\n${added.map(r => `> ${r}`).join('\n')}`;

                if (removed.length > 0)
                    description += `\n\n**Roles Retires :**\n${removed.map(r => `> ${r}`).join('\n')}`;

                if (added.length === 0 && removed.length === 0)
                    description = 'Aucune modification effectuee.';

                const confirmEmbed = new EmbedBuilder()
                    .setColor(0x0000ff)
                    .setDescription(description)
                    .setTimestamp();

                await i.update({ embeds: [confirmEmbed], components: [] });
                collector.stop();
            }
        });

        collector.on('end', async (_, reason) => {
            if (reason === 'time')
                await interaction.editReply({ components: [] }).catch(() => {});
        });
    },

    get data() {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .addUserOption(o => o.setName('user').setDescription("L'utilisateur a qui modifier le rank").setRequired(true));
    }
};