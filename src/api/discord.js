const { createHmac } = require("crypto");

export const mataKuliah = {
  2: [
    "Kewarganegaraan",
    "Bahasa Inggris",
    "Statistika Bisnis",
    "Akuntansi Biaya",
    "Psikologi Industri Organisasi",
    "Pengantar Bisnis",
    "Etika Bisnis",
  ],
  3: [
    "Pendidikan Bela Negara",
    "Komunikasi Bisnis",
    "Manajemen Pemasaran",
    "Manajemen Keuangan",
    "Manajemen SDM",
    "Manajemen Operasional",
    "Kepemimpinan",
    "Ekonomi Manajerial",
  ],
  4: [
    "Bahasa Indonesia",
    "Kewirausahaan",
    "Manajemen Pemasaran Jasa",
    "Manajemen Keuangan Lanjutan",
    "Budaya Organisasi Lintas Negara",
    "Perilaku Organisasi",
    "Manajemen Kuantitatif",
    "Strategi Operasi",
  ],
  5: [
    "Sistem Informasi Manajemen",
    "Bisnis Internasional",
    "Penganggaran Perusahaan",
    "Manajemen Keuangan Syari'ah",
    "Studi Kelayakan Bisnis",
    "Aplikasi Manajemen Terpadu",
  ],
  6: [
    "Akuntansi Manajemen",
    "Metodologi Penelitian Bisnis",
    "Manajemen Strategi",
    "Manajemen Ritel",
    "Analisis Multivariat",
    "Digital Business",
  ],
};

function verifyDiscordRequest(req) {
  const signature = req.headers["x-signature-ed25519"];
  const timestamp = req.headers["x-signature-timestamp"];
  const body = JSON.stringify(req.body);

  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  const hmac = createHmac("sha256", publicKey);
  hmac.update(timestamp + body);

  const expectedSignature = hmac.digest("hex");
  return signature === expectedSignature;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end();
  } else if (!verifyDiscordRequest(req)) {
    return res.status(401).send("Unauthorized");
  }

  const interaction = req.body;

  if (interaction.type === 1) {
    return res.status(200).json({ type: 1 });
  }

  if (interaction.type === 2 && interaction.data.name === "mata-kuliah") {
    const semester = interaction.options.getNumber("semester").toString();
    const message =
      `Mata kuliah semester ${1}:\n` +
      mataKuliah[semester]
        .reduce((list, matkul, index) => {
          return list + `\n${index + 1}. ${matkul}`;
        }, "")
        .substring(1);

    return res.status(200).json({
      type: 4,
      data: {
        content: message,
      },
    });
  }

  return res.status(200).json({ type: 1 });
};
