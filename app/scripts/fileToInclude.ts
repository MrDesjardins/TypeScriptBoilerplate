import { ClassB } from "folder1/file2";
import * as _ from "lodash";
export class ClassA {
    public method1(): void {
        console.log("ClassA>method1");

        const text = _.padStart("Hello TypeScript!", 20, " ");
        const div = $("<div>");
        div.html("JQuery: " + text);
        $("body").append(div);
        const b = new ClassB();
        b.method1();
    }
}