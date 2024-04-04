import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getEvent(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get("/events/:eventId", {
        schema: {
            summary: 'Retorna um evento',
            tags: ['Eventos'],
            params: z.object({
                eventId: z.string().uuid()
            }),
            response: {
                200: z.object({
                    event: z.object({
                        title: z.string(),
                        details: z.string().nullable(),
                        maxAttendees: z.number().int().nullable(),
                        attendeesAmount: z.number().int()
                    })
                })
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
            throw new BadRequest("Evento não encontrado")
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