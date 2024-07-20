function hookLibArt(){
    Java.perform(function(){

    var libArt = Process.getModuleByName("libart.so")

    if(libArt){
        console.log("libArt是存在的")
        var symbols = libArt.enumerateSymbols();

        for(var i=0;i<symbols.length;i++){
            var symbol =symbols[i];
            console.log(symbol.name);
    
        }
        
    }
})
}


function main(){
    hookLibArt();
}

setImmediate(main)