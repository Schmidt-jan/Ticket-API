import express from "express"
import bodyParser from "body-parser"
import {BasicTicket, Ticket} from "../model/ticket";
import {TicketList} from "../model/ticketList";
import {plainToClass} from "class-transformer";
import {validate, ValidationError} from "class-validator";

const ticket_router = express.Router();
ticket_router.use(bodyParser.json())
ticket_router.use(bodyParser.urlencoded({extended: true}))

/**
 * @swagger
 * components:
 *   schemas:
 *     Priority:
 *       description: "Priority order: Blocker = 1, High = 2, Medium = 3, Low = 4"
 *       type: string
 *       enum: [Blocker, High, Medium, Low]
 *
 *     Type:
 *       description: "Priority order: Bug = 0, Feature = 1, Issue = 2"
 *       type: string
 *       enum: [Bug, Feature, Issue]
 *
 *     Component:
 *       type: object
 *       required: description
 *       properties:
 *         description:
 *           type: string
 *           description: "Which part of the project does this ticket belong to"
 *
 *     Comment:
 *       description: The schema of a ticket. The 'uuid' and 'date_creation' values are readonly and can't get changed
 *       type: object
 *       required: description
 *       properties:
 *         description:
 *           type: string
 *           description: "The comment"
 *
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - assignee
 *         - reporter
 *         - priority
 *         - component
 *         - type
 *       properties:
 *         title:
 *           type: string
 *           description: "The title of the ticket"
 *         description:
 *           type: string
 *           description: "Explain what should get done"
 *         assignee:
 *           type: string
 *           description: "The uuid of the assignee"
 *         reporter:
 *           type: string
 *           description: "The uuid of the reporter"
 *         priority:
 *           type: object
 *           $ref: '#/components/schemas/Priority'
 *         component:
 *           type: array
 *           items:
 *             type: string
 *         type:
 *           type: object
 *           $ref: '#/components/schemas/Type'
 *         uuid:
 *           type: string
 *           description: The uuid will get generated automatically when creating a new ticket
 *         date_creating:
 *           type: number
 *           description: "The date will get generated automatically when creating a new ticket. The value is the number of milliseconds elapsed since January 1, 1970"
 *         date_last_updated:
 *           type: number
 *           description: "The date will get generated automatically when creating a new ticket (same as 'date_creating'). The value is the number of milliseconds elapsed since January 1, 1970"
 *         date_closed:
 *           type: number
 *           description: "This value is undefined until the ticket gets closed. The value is the number of milliseconds elapsed since January 1, 1970"
 *         comment:
 *           type: array
 *           items:
 *             type: string
 *       example:
 *         title: Some title
 *         description: some description
 *         assignee: 123
 *         reporter: 123
 *         priority: HIGH
 *         component: [TicketApi]
 *         type: Bug
 *         uuid: 123456-789123
 *         date_creating: 123456789
 *         date_last_updated: 123456789
 *         date_closed: 0
 *         comment: [Well done]
 */

/**
 * @swagger
 * tags:
 *   - name: Tickets
 */

/**
 * @swagger
 * /tickets:
 *   get:
 *     summary: Return all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: All stored tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
ticket_router.get("", (req, res) => {
    res.json(TicketList.tickets)
})

/**
 * @swagger
 * /tickets/{uuid}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The tickets uuid
 *     summary: Get a ticket by it's uuid
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Return ticket with uuid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 *
 */
ticket_router.get("/:uuid", (req, res) => {
    let _uuid = req.params.uuid
    let _ticket = TicketList.tickets.find(e => e.uuid === _uuid)

    if (!_ticket) {
        return res.status(404).send()
    }
    res.json(_ticket)
})

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new Ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     responses:
 *      201:
 *        description: New ticket got created
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Ticket'
 *      400:
 *        description: Some values are missing to create a new ticket. Take a look which variables are required.
 *      500:
 *        description: Internal server error, please report the entered request
 */
ticket_router.post("", async (req, res) => {
    let ticket = await checkAndGetInputOfTicket(req.body)
    if (ticket instanceof Ticket) {
        TicketList.tickets.push(ticket)
        return res.status(201).json(ticket)
    }

    return res.status(400).json(ticket)
})

async function checkAndGetInputOfTicket(obj: any): Promise<Ticket | {}> {
    let _basicTicket: BasicTicket = plainToClass(BasicTicket, obj as Object)
    let _validationError: Array<ValidationError> = await validate(_basicTicket)

    if (_validationError.length > 0) {
        console.log(_validationError)
        return {description: _validationError[0].constraints}
    }

    return new Ticket(_basicTicket)
}


/**
 * @swagger
 * /tickets:
 *   put:
 *     parameters:
 *       - in: path
 *         name: uuid
 *         schema:
 *           type: string
 *         required: true
 *         description: The tickets uuid
 *     requestBody:
 *       description: The 'uuid' and 'date_creation' can't get changed
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ticket'
 *     summary: Update a ticket by it's uuid
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Ok, returns the old value
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Some values are missing to create a new ticket. Take a look which variables are required.
 *       404:
 *         description: Ticket not found
 *       500:
 *         description: Internal server error, please report the entered request
 *
 */
ticket_router.put("/:uuid", async (req, res) => {
    let _uuid = req.params.uuid
    let _index = TicketList.tickets.findIndex(e => e.uuid === _uuid)
    if (_index == -1)
        return res.status(404).send()

    let _ticket: Ticket = Object.assign({}, TicketList.tickets[_index])
    let _updatedTicket = updateObject(_ticket, req.body)

    if (Array.isArray(_updatedTicket))
        return res.status(400).json(_updatedTicket[0])

    TicketList.tickets[_index] = _updatedTicket
    return res.json(_updatedTicket)
})

function updateObject<Type>(oldData: Type, newData: any): Type | [{}] {
    for (let i in newData) {
        // @ts-ignore
        let varFromTicket = oldData[`${i}`]
        // @ts-ignore
        let typeOfVarFromClass = typeof oldData[`${i}`]
        let typeOfVarFromJson = typeof newData[`${i}`]
        if (varFromTicket && typeOfVarFromJson === typeOfVarFromClass) {
            // @ts-ignore
            oldData[`${i}`] = newData[`${i}`]
        } else {
            return [{description: `type of '${i}' cannot get changed from '${typeOfVarFromClass}' to '${typeOfVarFromJson}'`}]
        }
    }
    console.log(typeof oldData)
    return oldData
}


/**
 * @swagger
 * /tickets/{uuid}:
 *   delete:
 *     parameters:
 *     - in: path
 *       name: uuid
 *       schema:
 *         type: string
 *       required: true
 *       description: The tickets uuid
 *     summary: Delete a ticket by it's uuid
 *     tags: [Tickets]
 *     responses:
 *       204:
 *         description: Ticket was deleted
 *       404:
 *         description: Ticket not found
 *
 */
ticket_router.delete("/:uuid", (req, res) => {
    let _uuid = req.params.uuid
    let _index = TicketList.tickets.findIndex(e => e.uuid === _uuid)
    if (_index == -1)
        return res.status(404).send()

    TicketList.tickets.splice(_index, 1)
    res.status(204).send()

})

export default module.exports = ticket_router