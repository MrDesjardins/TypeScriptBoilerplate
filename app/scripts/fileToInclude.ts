import { ClassB } from "folder1/file2";
//import * as moment from 'moment';

export class ClassA {
    public method1(): void {
        console.log("ClassA>method1");
        //const c = moment().format("MMMM Do YYYY, h:mm:ss a");
        const c = "tempo";
        const div = $("<div>");
        div.html("From JQuery : " + c);
        $("body").append(div);
        const b = new ClassB();
        b.method1();
    }
}