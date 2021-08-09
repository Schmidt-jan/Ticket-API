import Mongoose from "mongoose";


let database: Mongoose.Connection;
export const connectToDb = () => {  // add your own uri below
    const uri: string = "mongodb://localhost:27017";
    if (database) {
        return;
    }
    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });
    database = Mongoose.connection;
    database.once("open", async () => {
        console.log("Connected to database");
    });
    database.on("error", () => {
        console.log("Error connecting to database");
    });
};
export const disconnectFromDb = () => {
    if (!database) {
        return;
    }
    Mongoose.disconnect();
};