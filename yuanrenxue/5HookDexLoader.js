Java.perform(function(){
    var hookClass = undefined;
    var ClassUse = Java.use("java.lang.Class");
    var objectclass= Java.use("java.lang.Object");
    var param= Java.use("java.lang.Object");
    var dexclassLoader = Java.use("dalvik.system.DexClassLoader");
    var Integerclass = Java.use("java.lang.Integer");
    var paramObj = param.$new()


    dexclassLoader.loadClass.overload('java.lang.String').implementation = function(name){
        var hookname = "com.yuanrenxue.challenge.five.Sign";
        var result = this.loadClass(name,false);
        if(name == hookname){
            // var hookClass = result;
            // var hookClassCast = Java.cast(hookClass,ClassUse);
            // console.log("-----------------------------GET Constructor-------------------------------------");
            // var ConstructorParam =Java.array('Ljava.lang.Object;',[objectclass.class]);
            // var Constructor = hookClassCast.getDeclaredConstructor(ConstructorParam);
            // console.log("Constructor:"+Constructor);
            // var instance = Constructor.newInstance([paramObj])
            // console.log("-----------------------------GET Methods-------------------------------------");
            // var func = hookClassCast.getDeclaredMethods();
            // console.log(func);

            // console.log("instance"+instance)
            // var signmethod = func[7]
            // var s = "1:"+ new Date().getTime()
            // var rtn = signmethod.invoke(instance,["1:1720582245311"]);
            // console.log("rtn"+rtn)
            // return result;
            var hookCLass = Java.use(hookname);
            hookCLass.sign.implementation = function(a){
                console.log("a"+a)
                var result = this.sign(a);
                console.log("result"+result)
                return result;

            }

        }
        return result;
    }
});