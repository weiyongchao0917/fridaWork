
// function hookEasyHttp() {
//   Java.perform(function() {
//       var URLClass = Java.use("java.net.URL");
//       var HttpURLConnectionClass = Java.use("java.net.HttpURLConnection");

//       URLClass.$init.overload('java.lang.String').implementation = function(originalUrl) {
//           console.log("Original URL: " + originalUrl);


//           return this.$init(originalUrl);
//       };
//   });
// }


function hookEasyHttp() {
  Java.perform(function() {
      var RequestClass = Java.use("okhttp3.Request");
      var RequestBuilderClass = Java.use("okhttp3.Request$Builder");
      RequestBuilderClass.build.implementation = function() {
          var originalRequest = this.build();
          var originalUrl = originalRequest.url().toString();
          // 替换域名
          var newUrl = originalUrl.replace("https://servicepre.bazhongba.com", "https://servicetest.bazhongba.com");
          var newRequestBuilder = RequestBuilderClass.$new();
          newRequestBuilder.url(newUrl)
          newRequestBuilder.method(originalRequest.method(), originalRequest.body());
            // 复制 headers
            var headers = originalRequest.headers();
            for (var i = 0; i < headers.size(); i++) {
                var name = headers.name(i);
                var value = headers.value(i);
                newRequestBuilder.addHeader(name, value);
            }
                    return newRequestBuilder.build();
      };
  });
}


function hookAes(){
  Java.perform(function(){
    var StringClass = Java.use("java.lang.String");
    var SecretKeySpecClass = Java.use("javax.crypto.spec.SecretKeySpec")
    SecretKeySpecClass.$init.overload('[B', 'java.lang.String').implementation = function(a,b){
      var result = StringClass.$new(a, "UTF-8");

      console.log("key"+result)
      console.log("TYPE"+b)
      this.$init(a,b);
    }
  })
}

function main(){
  // hookAes();
  hookEasyHttp();
}



setImmediate(main);