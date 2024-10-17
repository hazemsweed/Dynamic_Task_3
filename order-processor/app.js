const amqp = require("amqplib");
const mongoose = require("mongoose");
const Order = require("./modules/Order");

async function connectMongoDB() {
  try {
    await mongoose.connect("mongodb://localhost:27017/orders", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
}

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://localhost"); // RabbitMQ URL that running in Docker
    const channel = await connection.createChannel();
    await channel.assertQueue("ordersChannel");
    console.log("Connected, Waiting for messages");
    channel.consume("ordersChannel", async (msg) => {
      if (msg) {
        const order = JSON.parse(msg.content.toString());
        await Order.create(order);
        channel.ack(msg);
        console.log("Order processed and saved to MongoDB");
      }
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ", error);
  }
}

connectMongoDB().then(connectRabbitMQ);
