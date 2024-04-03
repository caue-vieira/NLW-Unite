import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/events/:eventId", {
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                200: {
                    event: z.object({
                        title: z.string(),
                        details: z.string().nullable(),
                        maxAttendees: z.number().int().nullable(),
                        attendeesAmoun: z.number().int()
                    })
                }
            }
        }
    }, async (request, reply) => {
        const {eventId} = request.params

        const event = await prisma.event.findUnique({
            select: {
                title: true,
                details: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        attendees: true
                    }
                }
            },
            where: {
                id: eventId
            }
        })

        if(event === null) {
            throw new Error("Evento não encontrado")
        }
        return reply.status(200).send({ 
            event: {
                title: event.title,
                details: event.details,
                maxAttendees: event.maximumAttendees,
                attendeesAmount: event._count.attendees
            }
        })
    }) 
}