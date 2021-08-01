import express from "express"

const ticket_router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: "The title of the ticket"
 *       example:
 *         title: Use swagger for the documentation
 */

/**
 * @swagger
 * tags:
 *   name: Tickets
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
    console.log('called')
    res.send("No data stored")
})

export default module.exports = ticket_router