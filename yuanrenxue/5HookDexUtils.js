
function main() {
    Java.perform(function () {
        // 加载 DexUtils 类
        var DexUtilsClass = Java.use("com.yuanrenxue.challenge.four.DexUtils");

        // 拦截 OooO0O0 方法
        DexUtilsClass.OooO0O0.implementation = function (a, b, c) {
            console.log("调用参数 a: " + a);

            // 获取 b 对象的类
            const obj_class = Java.cast(b.getClass(), Java.use("java.lang.Class"));

            // 获取类中的所有字段
            const fields = obj_class.getDeclaredFields();

            // 打印类名和字段信息
            console.log("Inspecting class: " + b.getClass().toString());
            console.log("\tFields:");

            // 遍历字段并打印每个字段的名称和值
            for (var i = 0; i < fields.length; i++) {
                fields[i].setAccessible(true); // 设置字段为可访问状态

                try {
                    var fieldName = fields[i].getName();
                    var fieldValue = fields[i].get(b); // 获取字段值
                    if (fieldName === "OooO0o0") {
                        console.log("------------------------------------------------------------------------------------------------------------------")
                        for (var numaa = 80; numaa < 101; numaa++) {
                            var IntegerClass = Java.use("java.lang.Integer");
                            var newValue = IntegerClass.$new(numaa);
                            fields[i].set(b, newValue);

                            var StringClass = Java.use("java.lang.String");
                            var currentTimestamp = new Date().getTime();
                            var timestampString = numaa + ":" + currentTimestamp;
                            var result2 =DexUtilsClass.OooO0O0.call(this, a, b, timestampString)
                            console.log("content:"+timestampString)
                            console.log("sign:"+result2)
                        }
                        console.log("---------------------------------------------------------------------------------------------------")
                         // 为字段赋值
                        fieldFound = true;
                        console.log("Field 'OooO0o0' found and set to 4.");
                    }
                    console.log("\t\t" + fields[i].toString() + " = " + fieldValue);
                } catch (e) {
                    console.log("\t\t" + fields[i].toString() + " = (error: " + e + ")");
                }
            }

            // 修改字段的值

            // 调用原始方法并打印结果
            
            var result = this.OooO0O0(a, b, c);
            console.log("result: " + result);
            return result;
        };
    });
}

setImmediate(main);
