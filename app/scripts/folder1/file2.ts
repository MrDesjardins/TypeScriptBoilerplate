import foo = require("folder1/fileToLazyLoad");
export class ClassB {
    public method1(): void {
        console.log("ClassB->method1");
        setTimeout(() => {
            requirejs(["folder1/fileToLazyLoad"], (c: typeof foo) => {
                const co = new c.ClassC();
                co.method1();
            });
        }, 2000);
    }
}