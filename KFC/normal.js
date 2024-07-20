
// 使用脚本一把梭试试 , 尝试失败 
//frida 检测绕过
//查看哪些so文件创建了新线程
function hook_thread(){
    var interceptor = Interceptor.attach(Module.findExportByName(null, "pthread_create"),
    {
        onEnter: function (args) {
            var module = Process.findModuleByAddress(ptr(this.returnAddress))
            if (module != null) {
                console.log("[pthread_create] called from", module.name)
            }
            else {
                console.log("[pthread_create] called from", ptr(this.returnAddress))
            }
        },
    }
)
}

function replace_str() {
    var pt_strstr = Module.findExportByName("libc.so", 'strstr');
    var pt_strcmp = Module.findExportByName("libc.so", 'strcmp');
 
    Interceptor.attach(pt_strstr, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (
                str2.indexOf("REJECT") !== -1 ||
                str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("linjector") !== -1
            ) {
                console.log("strstr-->", str1, str2);
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    });
 
    Interceptor.attach(pt_strcmp, {
        onEnter: function (args) {
            var str1 = args[0].readCString();
            var str2 = args[1].readCString();
            if (
                str2.indexOf("REJECT") !== -1 ||
                str2.indexOf("tmp") !== -1 ||
                str2.indexOf("frida") !== -1 ||
                str2.indexOf("gum-js-loop") !== -1 ||
                str2.indexOf("gmain") !== -1 ||
                str2.indexOf("linjector") !== -1
            ) {
                //console.log("strcmp-->", str1, str2);
                this.hook = true;
            }
        }, onLeave: function (retval) {
            if (this.hook) {
                retval.replace(0);
            }
        }
    })
 
}


hook_thread()






