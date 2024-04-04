import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/attendees/:attendeeId/check-in", {
        schema: {
            summary: 'Realiza o check-in dos participantes do evento',
            tags: ['Participantes'],
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                201: z.null()
            }
        }
    }, async (request, reply) => {
        const { attendeeId } = request.params

        const attendeeCheckIn = await prisma.checkIn.findUnique({
            where: {
                attendeeId
            }
        })

        if(attendeeCheckIn !== null) {
            throw new BadRequest("O check in para este evento já foi realizado por este participante")
        }

        await prisma.checkIn.create({
            data: {
                attendeeId
            }
        })

        return reply.status(201).send()
    })
}