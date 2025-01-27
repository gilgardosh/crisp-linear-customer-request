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

      // figure out customer id out of domain

      // figure out project, team id out of content / segments

      // figure out issue status

      // wrap conversation content into a Linear customer need

      // send the Linear customer need

      /**
       * Documentation of the Linear part:
       * https://linear.app/docs/customer-requests?noRedirect=1&tabs=5bb93b53f1eb#integrations
       * 
       * Schema link:
       * https://studio.apollographql.com/public/Linear-API/variant/current/explorer?searchQuery=Mutation.customerNeedCreate
       * 
       * "input": {
       *   "attachmentId": null,
       *   attachmentUrl": null,
       *   body": null,
       *   bodyData": null,
       *   commentId": null,
       *   customerExternalId": null,
       *   customerId": null,
       *   id": null,
       *   issueId": null,
       *   priority": null,
       *   projectId": null
       * }
       *  */
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
