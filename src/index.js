require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const mataKuliah = JSON.parse(fs.readFileSync("./mata-kuliah.json"));

const commands = [
  new SlashCommandBuilder()
    .setName("mata-kuliah")
    .setDescription("Daftar mata kuliah setiap semester")
    .addNumberOption((option) =>
      option
        .setName("semester")
        .setDescription("semester ke")
        .setMinValue(
          (() => {
            for (const key in mataKuliah) {
              return Number(key);
            }
          })()
        )
        .setMaxValue(
          (() => {
            const keys = Object.keys(mataKuliah);

            return Number(keys[keys.length - 1]);
          })()
        )
        .setRequired(true)
    ),
].map((command) => command.toJSON());

new REST({ version: "9" })
  .setToken(token)
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })
  .catch(console.error);

// Bot event handling
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "mata-kuliah") {
    const semester = interaction.options.getNumber("semester").toString();
    await interaction.reply(
      `Mata kuliah semester ${1}:\n` +
        mataKuliah[semester]
          .reduce((list, matkul, index) => {
            return list + `\n${index + 1}. ${matkul}`;
          }, "")
          .substring(1)
    );
  }
});

client.login(token);
