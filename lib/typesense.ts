import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "",
      port: Number(process.env.TYPESENSE_PORT) || 8108,
      protocol: "https",
    },
  ],
  apiKey: process.env.TYPESENSE_API_KEY || "",
  connectionTimeoutSeconds: 2,
});

export default client;
