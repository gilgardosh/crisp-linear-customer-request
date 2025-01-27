import { Crisp } from "crisp-api";
import { env } from "./env.js";

const { crisp } = env;

async function main() {
  const CrispClient = new Crisp();

  CrispClient.authenticateTier("plugin", crisp.identifier, crisp.key);

  // Notice: make sure to authenticate before listening for an event
  CrispClient.on("message:send", async (message: any) => {
    console.log("Received new message");
    if (!message.session_id) {
      return;
    }

    const messagesPromise = CrispClient.website.getMessagesInConversation(crisp.websiteId, message.session_id, message.timestamp);

    const metaDataPromise = CrispClient.website.getConversationMetas(
      crisp.websiteId,
      message.session_id
    );

    const [messages, meta] = await Promise.all([
      messagesPromise,
      metaDataPromise
    ])

    if (messages.length > 0) {
      console.log('Conversation not new', message.session_id);
      return;
    }
    if (!meta) {
      console.log('No meta data', message);
      return;
    }
    console.log("Meta:", meta);

    if (meta.email) {
      const domain = meta.email.split("@")[1];
      console.log("Domain:", domain);
    }
  })
    .then(() => {
      console.error("Requested to listen to sent messages");
    })
    .catch((error) => {
      console.error("Failed listening to sent messages:", error);
    });
}

main();
