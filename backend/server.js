import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import agendaRoutes from "./routes/agendas.js"
import aspirasiRoutes from "./routes/aspirasis.js"
import resourceRoutes from "./routes/resources.js"
import addressRoutes from "./routes/addresses.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 8000

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "SiJempol Humanis backend is running." })
})

app.use("/api/auth", authRoutes)
app.use("/api/agendas", agendaRoutes)
app.use("/api/aspirasis", aspirasiRoutes)
app.use("/api/addresses", addressRoutes)
app.use("/api/id-cards", resourceRoutes("id_cards"))
app.use("/api/births", resourceRoutes("births"))
app.use("/api/deaths", resourceRoutes("deaths"))
app.use("/api/marriages", resourceRoutes("marriages"))
app.use("/api/moves", resourceRoutes("moves"))
app.use("/api/family-cards", resourceRoutes("family_cards"))

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
