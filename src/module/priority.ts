import {devNull} from "os";

export enum Priority{
    Blocker = 0,
    High,
    Medium,
    Low
}

export function instanceOfPriority(object: any) : [boolean, string] {
    if (typeof object !== "number")
        return [false, 'Priority: value is not a number']

    if (object < Priority.Blocker || object > Priority.Low)
        return [false,  `Priority: value '${object}' is out of valid space '${Priority.Blocker} ... ${Priority.Low}'`]

    return [true, devNull]
}