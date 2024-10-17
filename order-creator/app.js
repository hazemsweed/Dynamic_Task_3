const express = require("express");
const amqp = require("amqplib");

const app = express();
app.use(express.json());

let channel, connection;

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://localhost"); // RabbitMQ URL that running in Docker
    channel = await connection.createChannel();
    await channel.assertQueue("ordersChannel");
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
}

app.post("/order", async (req, res) => {
  const order = req.body;
  try {
    await channel.sendToQueue("ordersChannel", Buffer.from(JSON.stringify(order)));
    console.log("Order sent to queue", order);
    res.status(200).send("Order received");
  } catch (error) {
    console.error("Error sending message to queue", error);
    res.status(500).send("Error processing order");
  }
});

app.listen(3000, () => {
  console.log("Order Creator Service running on port 3000");
  connectRabbitMQ();
});
