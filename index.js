const {exec} = require("child_process");
const axios = require("axios");
const schedule = require("node-schedule");
const {BskyAgent} = require("@atproto/api");
require("dotenv").config();

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const BS_USER = process.env.BS_USER;
const BS_PASSWORD = process.env.BS_PASSWORD;
const DNS_SERVER_IP = process.env.DNS_SERVER_IP;

const offlineMessages = [
  "Xandão ainda não re-ativou o Twitter! 😔",
  "O Twitter ainda não foi reativado hoje 😕",
  "Ainda não é hoje que o Twitter/X Voltou 😢",
  "O Twitter ainda não foi reativado no Brasil 😞",
];

const agent = new BskyAgent({service: "https://bsky.social"});

let twitterStatus = false;

async function sendDiscordNotification(message) {
  try {
    await axios.post(DISCORD_WEBHOOK_URL, {content: message});
    console.log(`Mensagem enviada para o Discord: ${message}`);
  } catch (error) {
    console.error(
      "Erro ao enviar mensagem para o webhook do Discord:",
      error.message
    );
  }
}

async function postToBlueSky(message) {
  try {
    await agent.login({identifier: BS_USER, password: BS_PASSWORD});
    const response = await agent.post({
      text: message,
      createdAt: new Date().toISOString(),
    });
    console.log(`Postagem feita no BlueSky: ${response.uri}`);
  } catch (error) {
    console.error("Erro ao enviar mensagem para o BlueSky:", error.message);
  }
}

async function checkDNSWithDig(domain, dnsServerIp) {
  return new Promise((resolve, reject) => {
    exec(`dig @${dnsServerIp} ${domain}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar dig: ${stderr}`);
        return reject(error);
      }

      const aRecordMatch = stdout.match(/ANSWER SECTION:\n([\s\S]*?)\n\n/);
      const aRecords = aRecordMatch
        ? aRecordMatch[1].trim().split("\n").length
        : 0;

      resolve(aRecords);
    });
  });
}

async function checkTwitterStatus() {
  const twitterDomain = "x.com";
  const dnsServerIp = DNS_SERVER_IP;

  try {
    console.log("Iniciando verificação de status do Twitter...");

    const aRecords = await checkDNSWithDig(twitterDomain, dnsServerIp);
    const twitterIsUp = aRecords > 0;

    require("fs").writeFileSync(
      "twitter_status.json",
      JSON.stringify({twitterIsUp})
    );

    if (twitterIsUp) {
      if (!twitterStatus) {
        console.log("Twitter desbloqueado, verificando se já foi notificado.");
        notifyTwitterBack();
        twitterStatus = true;
      }
    } else {
      twitterStatus = false;
    }
  } catch (error) {
    console.error("Erro ao verificar o status do Twitter:", error.message);
    await sendDiscordNotification(
      "Erro desconhecido ao verificar o status do Twitter. 😕"
    );
  }
}

async function notifyTwitterBack() {
  const message = "O Twitter ACABOU DE VOLTAR! 🎉";
  await sendDiscordNotification(message);
  await postToBlueSky(message);
}

async function notifyOfflineStatus() {
  try {
    await checkTwitterStatus();

    if (twitterStatus === false) {
      const message =
        offlineMessages[Math.floor(Math.random() * offlineMessages.length)];
      await sendDiscordNotification(message);
      await postToBlueSky(message);
    } else {
      notifyTwitterBack();
    }
  } catch (error) {
    console.error("Erro ao notificar status offline:", error.message);
  }
}

setInterval(checkTwitterStatus, 2 * 60 * 1000);

schedule.scheduleJob("0 08 * * *", notifyOfflineStatus);
schedule.scheduleJob("0 12 * * *", notifyOfflineStatus);
schedule.scheduleJob("0 16 * * *", notifyOfflineStatus);
schedule.scheduleJob("0 20 * * *", notifyOfflineStatus);
