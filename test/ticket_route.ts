import app from '../src';
import chai from 'chai';
import 'mocha';
import {beforeEach} from "mocha";
import {instanceOfITicket, ITicket, Ticket} from "../src/model/ticket";
import {Type} from "../src/model/type";
import {Priority} from "../src/model/priority";
import chaiHttp = require('chai-http');
import {TicketList} from "../src/model/ticketList";

chai.use(chaiHttp);
const sampleITicket : ITicket = {
    title: 'Store tickets in MongoDB',
    description: 'All tickets should get stored in a mongoDb-container and deployed by the routers',
    type: Type.Feature,
    component: ['Ticket-API'],
    assignee: '123456-123456',
    reporter: '123456-123456',
    priority: Priority.High
}

let sampleTicket : Ticket = new Ticket(sampleITicket)

function normalizeJson(data: any) : string {
    return JSON.parse(JSON.stringify(data))
}

describe('Ticket-API Request', () => {
    beforeEach('Reset stored tickets', () => {
        TicketList.tickets = [sampleTicket]
    })

    //get
    it('get all tickets - no tickets', () => {
        TicketList.tickets = []
        return chai.request(app).get('/tickets')
            .then(res => {
                chai.expect(res.status).to.eql(200);
                chai.expect(res.body).is.eql([])
            })
    })

    it('get all tickets - only the sample ticket', () => {
        return chai.request(app).get('/tickets')
            .then(res => {
                chai.expect(res.status).to.eql(200);
                let tickets = normalizeJson([sampleTicket])
                chai.expect(res.body).to.eql(tickets)
            })
    })

    //get/{uuid}
    it('get ticket by id - get sample ticket', () => {
        return chai.request(app).get(`/tickets/${sampleTicket.uuid}`)
            .then(res => {
                chai.expect(res.status).to.eql(200)
                chai.expect(res.body).to.eql(normalizeJson(sampleTicket))
            })
    })

    it('get ticket by id - ticket not found', () => {
        return chai.request(app).get('/tickets/0')
            .then(res => {
                chai.expect(res.status).to.eql(404)
                chai.expect(res.body).to.eql({})
            })
    })

    it('post new ticket - created successfully', () => {
        return chai.request(app)
            .post('/tickets')
            .set('content-type', 'application/json')
            .send(JSON.stringify(sampleITicket))
            .then(res => {
                chai.expect(res.status).to.eql(201)
                let ticket = normalizeJson(res.body)
                let isInstance = instanceOfITicket(ticket)
                console.log(isInstance[1])
                chai.expect(isInstance[0]).to.eql(true)
            })
    })

    it('post new ticket - not an instance', () => {
        sampleITicket.type = 5
        return chai.request(app)
            .post('/tickets')
            .set('content-type', 'application/json')
            .send(JSON.stringify(sampleITicket))
            .then(res => {
                chai.expect(res.status).to.eql(400)
                let error = res.body
                chai.expect('description' in error).to.eql(true)
            })
    });
})