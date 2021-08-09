import express from "express"
import morgan from "morgan"
import swaggerJSDoc from "swagger-jsdoc"
import swaggerUI from "swagger-ui-express"
import ticket_routes from "./routes/ticket_routes";
import { connectToDb} from "./Utils";

const port = process.env.PORT || 4000
const app = express()
app.set("port", port)
app.use(morgan("dev"))

const swagger_options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ticket API",
            version: "1.0.0",
            description: "An API for a Ticket-Management"
        },

        servers: [
            {
                url: `http://localhost${port}`,
                descrtiption: "Documentation of the Ticket-API"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const specs = swaggerJSDoc(swagger_options)
app.use("/docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use("/tickets", ticket_routes)

connectToDb()

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`)
})

export default app