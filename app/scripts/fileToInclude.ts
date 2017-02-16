import { ClassB } from "folder1/file2";
export class ClassA {
    public method1(): void
    {
        console.log("ClassA>method1");
        let div = $("<div>");
        div.html("From JQuery");
        $("body").append(div);
        const b = new ClassB();
        b.method1();
    }
}