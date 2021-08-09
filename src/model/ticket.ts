import {IsArray, IsInt, IsString, Max, Min} from "class-validator";
import {Type} from "./type";
import {Priority} from "./priority";

export interface ITicket {
    title: string
    description: string
    assignee: string
    reporter: string
    priority: number
    component: string []
    type: number
}

export class BasicTicket {
    @IsString()
    public title: string
    @IsString()
    public description: string
    @IsString()
    public assignee: string
    @IsString()
    public reporter: string
    @IsInt()
    @Max(Priority.Low)
    @Min(Priority.Blocker)
    public priority: Priority
    public component: string []
    @IsInt()
    @Max(2)
    @Min(0)
    public type: Type


    constructor(_title:string, _description: string, _assignee: string, _reporter: string,
                _priority: number, _component: string[], _type: number) {

        this.title = _title
        this.description = _description
        this.assignee = _assignee
        this.reporter = _reporter
        this.priority = _priority
        this.component = _component
        this.type = _type
    }


}

export class Ticket extends BasicTicket{
    @IsString()
    readonly uuid: string = uuid()
    @IsInt()
    readonly date_creation: number = Date.now()
    @IsInt()
    public date_last_updated?: number
    @IsInt()
    public date_closed?: number
    @IsArray()
    public comments?: string []


    constructor(obj: ITicket, init: boolean = true) {
        super(obj.title, obj.description, obj.assignee, obj.reporter, obj.priority, obj.component, obj.type)
        if (init)
            this.setInitValues()
    }

    public setInitValues() {
        this.date_last_updated = this.date_creation
        this.date_closed = 0
        this.comments = []
    }
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
