function hook_dlopen(){
    var interceptor = Interceptor.attach(Module.findExportByName(null, "android_dlopen_ext"),
    {
        onEnter: function (args) {
            var pathptr = args[0];
            if (pathptr !== undefined && pathptr != null) {
                var path = ptr(pathptr).readCString();
                console.log("[LOAD]", path)
            }
        },
    }
)
}



// Start by hooking dlopen
hook_dlopen();
