

function main(){
    
    Java.perform(function(){
        var hookClass ;
        Java.enumerateClassLoaders({
            onMatch: function(loader){
                // console.log(loader)
                try{
                    if(loader.loadClass("com.yuanrenxue.challenge.five.Sign")){
                        Java.classFactory.loader = loader;
                        var hookClass = Java.use("com.yuanrenxue.challenge.five.Sign");
                        var stringClass = Java.use("java.lang.String");
                        hookClass.sign.implementation =function(s){

                            var str2 = stringClass.$new(s)
                            console.log('s:'+s);
                            var result2 = this.sign('1:1720592910269')
                            
                            var result = this.sign(s)
                            console.log("result  " +result)
                            console.log("result2  " +result2)
                            return result;
                        }
                        console.log("success hook it :", hookClass);
                    }
                }catch(error){
                    //pass
                }

            
            },
            onComplete : function(){

            }
        })

    })
}

setImmediate(main)