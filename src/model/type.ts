import {devNull} from "os";

export enum Type{
    Bug,
    Feature,
    Issue
}

export function instanceOfType(object: any) : [boolean, string] {
    if (typeof object !== "number")
        return [false, 'Type: value is not a number']

    if (object < Type.Bug || object > Type.Issue) {
        return [false,  `Type: value '${object}' is out of valid space '${Type.Bug} ... ${Type.Issue}'`]
    }

    return [true, devNull]
}