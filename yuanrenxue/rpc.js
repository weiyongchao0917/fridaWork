Java.perform(function () {
    var DexUtilsClass = Java.use('com.yuanrenxue.challenge.four.DexUtils');

    DexUtilsClass.OooO0O0.implementation = function (a, b, c) {
        console.log("Original parameters - a: " + a + ", b: " + b + ", c: " + c);
        
        // Call the original method with modified parameters
        var result = this.OooO0O0(a, b, globalC);
        console.log("Modified result: " + result);

        return result;
    };

    // Export the function to call it from outside
    rpc.exports = {
        setglobalc: function(newC) {
            globalC = newC;
        },
        callooo: function(a, b, c) {
            var result = DexUtilsClass.OooO0O0(a, b, c);
            return result;
        }
    };
});

// Initialize the globalC variable
var globalC = "";
