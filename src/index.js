import { SlashCommandBuilder, SlashCommandNumberOption } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("mata-kuliah")
    .setDescription("mata kuliah semester sekian")
    .addNumberOption(
      new SlashCommandNumberOption().setMinValue(1).setMaxValue(8)
    ),

  async execute(interaction) {
    await interaction.reply("tes");
  },
};
