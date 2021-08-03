import {Priority} from "./priority";
import {Type} from "./type";

export interface ITicket {
    title: string
    description: string
    assignee: string
    reporter: string
    priority: Priority
    component: string
    type: Type
}

export class Ticket {
    readonly uuid: string = uuid()
    readonly date_creation: number = Date.now()
    public title: string
    public description: string
    public assignee: string
    public reporter: string
    public priority: Priority
    public component: string
    public type: Type
    public date_last_updated?: number
    public date_closed?: number
    public comments?: string []


    constructor(_ticket: ITicket) {
        this.title = _ticket.title
        this.description = _ticket.description
        this.assignee = _ticket.assignee
        this.reporter = _ticket.reporter
        this.priority = _ticket.priority
        this.component = _ticket.component
        this.type = _ticket.type

        this.setInitValues()
    }

    public setInitValues() {
        this.date_last_updated = this.date_creation
        this.date_closed = undefined
        this.comments = []
    }
}


export function instanceOfITicket(object: any): object is Ticket {
    return 'title' && 'description' && 'assignee' && 'reporter' && 'priority' && 'component' && 'type' in object;
}

const uuid = (): string => {
    return (
        Math.random()
            .toString(36)
            .substring(2, 15) +
        Math.random()
            .toString(36)
            .substring(2, 15)
    );
};
