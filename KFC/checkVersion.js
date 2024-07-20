

//先查看hook version 能否让我正常使用此包
// 包名  com.yek.android.kfc.activitys
//frida 检测 



function hook_dlopen() {
    Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"), {
        onEnter: function (args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = Memory.readCString(ptr(pathptr));
                console.log("Loading .so file at address: " + pathptr + ", path: " + path);
            }
        }
    });
}






 


  /**
   * 对于版本限制升级才能使用的, hook查看版本方法,返回需要的版本
   */
  
function hookVersion(){
    Java.perform(function(){
      var deviceClass = Java.use("com.yumc.android.common2.device.DeviceUtils");
      deviceClass.getVersionName.implementation =function(a){
        var result = this.getVersionName(a)
        console.log('result'+result)
        return "6.12.0";
      }
    })
  }
  
  
function main() {
    hook_dlopen();
    // replace_str();
    // hook_thread()
    // hookAes();
    // justtruseMe()
    // hookVpn()
    // hookVersion();
}
  
  
  
  setImmediate(main);