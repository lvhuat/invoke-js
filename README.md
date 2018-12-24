方便的api测试工具
------------
目的在于参考API文档快速的构建测试程序，告别命令行，写个小WEB界面，点点点，验证验证功能，好美。

用法
-------
```
invoke = new Invoker();
invoke.addr("127.0.0.1").
    post("/api/v1/users/{user}").
    route("user","jack").
    query("timestamp",(new Date()).valueOf()).
    header("X-API-TOKEN","HDOG6H2JIT1REJ3NHJK6").
    json({name:"jack","birthday":"1990-03-08","email":"demo@gmail.com"}).
    sucessCallback(function(data){
        console.log("data:",data);
    }).
    failedCallback(function(err){
        console.log("failed,err:",err);
    }).dorequest();
```