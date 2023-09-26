import Fastify from "fastify"
import { z } from "zod"


const server = Fastify()

const userSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50)
})

type User = z.infer <typeof userSchema>
const users: User[] = []

server.post("/users", (request, reply) => {
    try {
      const user = userSchema.parse(request.body)
      users.push(user)
      return user
    } catch (error) {
      const errorJson = JSON.stringify(error)
        if (error instanceof z.ZodError)
          return reply.status(400).send(errorJson)
        else 
          return reply.status(500).send(errorJson)
    }
  })

  server.get("/", (request, reply) => {
    reply.send("Hello Marcos")
  });
  
  server.get("/users", () => users)



  server.listen({ port: 3000 }, (err, address) => {
    if (err) {
    console.error(err)
    process.exit(1)
    }
    console.log(`Server listening at ${address}`)
    })