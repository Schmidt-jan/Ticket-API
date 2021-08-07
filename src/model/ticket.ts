import {instanceOfPriority, Priority} from "./priority";
import {instanceOfType, Type} from "./type";
import {devNull} from "os";

export interface ITicket {
    title: string
    description: string
    assignee: string
    reporter: string
    priority: Priority
    component: string []
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
    public component: string []
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
        this.date_closed = 0
        this.comments = []
    }
}


export function instanceOfITicket(object: any): [boolean, string] {
    let hasAllVariables = 'title' && 'description' && 'assignee' && 'reporter' && 'priority' && 'component' && 'type' in object;
    if (!hasAllVariables)
        return [false, 'Ticket: has not all needed variables to create a ITicket instance']

    let instanceChecked = variablesCorrectInstantiated(object)
    if (!instanceChecked[0])
        return instanceChecked

    return [true, devNull]

}

function variablesCorrectInstantiated(object: any) : [boolean, string] {
    let priorityCorrect = instanceOfPriority(object.priority)
    let typeCorrect = instanceOfType(object.type)

    if (!priorityCorrect[0] || !typeCorrect[0]) {
        let error = priorityCorrect[1]
        if (error !== devNull ) {
            error += '\n' + typeCorrect[1]
        } else {
            error = typeCorrect[1]
        }
        return [false, error]
    }

    return [true,  devNull]
}

export function instanceOfFunction(object: any): object is Ticket {
    let isITicket = instanceOfITicket(object)
    let isTicket = 'uuid' && 'date_creation' && 'date_last_update' && 'date_closed' && 'comments' in object
    return isITicket && isTicket
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
