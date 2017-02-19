define(["require", "exports", "folder1/file2", "lodash"], function (require, exports, file2_1, _) {
    "use strict";
    class ClassA {
        method1() {
            const text = _.padStart("Hello TypeScript!!!", 20, "_");
            const div = $("<div>");
            div.html("JQuery: " + text);
            $("body").append(div);
            const b = new file2_1.ClassB();
            b.method1();
        }
    }
    exports.ClassA = ClassA;
});

//# sourceMappingURL=fileToInclude.js.map
