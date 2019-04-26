const { ServiceBroker } = require("moleculer");

const broker = new ServiceBroker(
{
    namespace: 'arge',
    nodeID: "node-25",
    logLevel: "info",
    transporter: "nats://localhost:4222",
});
broker.loadServices(folder = "./services", fileMask = "**/*.service.js");
broker.start();