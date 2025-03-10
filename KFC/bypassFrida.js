function anti_svc(){  
    let target_code_hex;  // 用于搜索特定汇编指令序列的十六进制字符串  
    let call_number_openat;  // 系统调用号对应的数值，openat  
    let arch = Process.arch;  // 获取当前进程的架构  
  
    if ("arm" === arch){  // 如果架构是ARM  
        target_code_hex = "00 00 00 EF";  // ARM架构下svc指令的十六进制表示  
        call_number_openat = 322;  // openat在ARM架构中的系统调用号  
    }else if("arm64" === arch){  // 如果架构是ARM64  
        target_code_hex = "01 00 00 D4";  // ARM64架构下svc指令的十六进制表示  
        call_number_openat = 56;  // openat在ARM64架构中的系统调用号  
    }else {  
        console.log("arch not support!");  // 如果架构不支持，打印错误信息  
    }  
  
    if (arch){  // 如果成功获取了架构信息  
        console.log("\nthe_arch = " + arch);  // 打印当前架构  
        // 枚举进程的内存范围，寻找只读内存段  
        Process.enumerateRanges('r--').forEach(function (range) {  
            if(!range.file || !range.file.path){  // 如果内存段没有文件路径，跳过  
                return;  
            }  
            let path = range.file.path;  // 获取内存段的文件路径  
            // 如果文件路径不是以"/data/app/"开头或不以".so"结尾，跳过  
            if ((!path.startsWith("/data/app/")) || (!path.endsWith(".so"))){  
                return;  
            }  
            let baseAddress = Module.getBaseAddress(path);  // 获取so库的基址  
            let soNameList = path.split("/");  // 通过路径分割获取so库的名称  
            let soName = soNameList[soNameList.length - 1];  // 获取so库的名称  
            console.log("\npath = " + path + " , baseAddress = " + baseAddress +  
                        " , rangeAddress = " + range.base + " , size = " + range.size);  
            // 在so库的内存范围内搜索target_code_hex对应的指令序列  
            Memory.scan(range.base, range.size, target_code_hex, {  
                onMatch: function (match){  
                    let code_address = match;  // 获取匹配到的指令地址  
                    let code_address_str = code_address.toString();  // 转换为字符串  
                    // 如果地址的最低位是0, 4, 8, c中的任意一个，说明可能是svc指令  
                    if (code_address_str.endsWith("0") || code_address_str.endsWith("4") ||  
                        code_address_str.endsWith("8") || code_address_str.endsWith("c")){  
                        console.log("--------------------------");  
                        let call_number = 0;  // 初始化系统调用号  
                        if ("arm" === arch){  
                            // 获取svc指令后面的立即数，作为系统调用号  
                            call_number = (code_address.sub(0x4).readS32()) & 0xFFF;  
                        }else if("arm64" === arch){  
                            call_number = (code_address.sub(0x4).readS32() >> 5) & 0xFFFF;  
                        }else {  
                            console.log("the arch get call_number not support!");  // 如果架构不支持，打印错误信息  
                        }  
                        console.log("find svc : so_name = " + soName + " , address = " + code_address +  
                                    " , call_number = " + call_number + " , offset = " + code_address.sub(baseAddress));  
                        // 如果匹配到的系统调用号是openat，挂钩该地址  
                        if (call_number_openat === call_number){  
                            let target_hook_addr = code_address;  
                            let target_hook_addr_offset = target_hook_addr.sub(baseAddress);  
                            console.log("find svc openat , start inlinehook by frida!");  
                            Interceptor.attach(target_hook_addr, {  
                                onEnter: function (args){  // 当进入挂钩函数时  
                                    console.log("\nonEnter_" + target_hook_addr_offset + " , __NR_openat , args[1] = " +  
                                                  args[1].readCString());  
                                    // 修改openat的第一个参数为指定路径  
                                    this.new_addr = Memory.allocUtf8String("/data/user/0/com.zj.wuaipojie/maps");  
                                    args[1] = this.new_addr;  
                                    console.log("onEnter_" + target_hook_addr_offset + " , __NR_openat , args[1] = " +  
                                                  args[1].readCString());  
                                },  
                                onLeave: function (retval){  // 当离开挂钩函数时  
                                    console.log("onLeave_" + target_hook_addr_offset + " , __NR_openat , retval = " + retval)  
                                }  
                            });  
                        }  
                    }  
                },  
                onComplete: function () {}  // 搜索完成后的回调函数  
            });  
        });  
    }  
}  

//定位 加载so的初始位置, 在init_array之前
function locate_init() {
    let secmodule = null
    Interceptor.attach(Module.findExportByName(null, "__system_property_get"),
        {
            // _system_property_get("ro.build.version.sdk", v1);
            onEnter: function (args) {
                // secmodule = Process.findModuleByName("libaswso.so")
                //确定so文件位置之后, 可以确认何时将对应的
                // var symbols = secmodule.enumerateSymbols;
                // console.log(secmodule)
                // for(var index =0; index<symbols.length; index++){
                //     var symbol = symbols[index];
                //     console.log(symbol.name)

                // }

                var name = args[0];
                if (name !== undefined && name != null) {
                    name = ptr(name).readCString();
                    if (name.indexOf("ro.build.version.sdk") >= 0) {
                        // 这是.init_proc刚开始执行的地方，是一个比较早的时机点
                        // do something
                        hook_pthread_create()
                        // bypass()
                    }
                }
            }
        }
    );
}



//返回地址
// Module.findExportByName(null, "android_dlopen_ext")
function hook_dlopen(soName = '') {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
        {
            onEnter: function (args) {
                var pathptr = args[0];
                if (pathptr !== undefined && pathptr != null) {
                    var path = ptr(pathptr).readCString();
                    if (path.indexOf(soName) >= 0) {
                        locate_init()
                    }
                }
            }
        }
    );
}

function hook_pthread_create(){
    console.log("libaswso.so --- " + Process.findModuleByName("libaswso.so").base)
    Interceptor.attach(Module.findExportByName("libc.so", "pthread_create"),{
        onEnter(args){
            let func_addr = args[2]
            console.log("The thread function address is " + func_addr)
        }
    })
}

function nop(addr) {
    Memory.patchCode(ptr(addr), 4,
            code=>  {
        const cw = new Arm64Writer(code, { pc: ptr(addr) });
        // const cw = new ThumbWriter(code, { pc: ptr(addr) });
        cw.putNop();
        cw.putNop();
        cw.putNop();
        cw.putNop();
        cw.flush();
    });
}



function bypass(){
    let module = Process.findModuleByName("libaswso.so")

    nop(module.base.add(0x9B360));
    nop(module.base.add(0x9C248));
    nop(module.base.add(0x76684));
    console.log("置空成功")
}
 

 
setImmediate(hook_dlopen, "libaswso.so")


