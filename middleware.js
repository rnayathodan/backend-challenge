var http = require('http');
exports.createServer = function () {
        var routes=[];
        var stackctr=-1;

        var app=http.createServer(function(req, res){
          stackctr=0;
          processRoute(req, res);
        });

        this.listen=function(port, fnCallback){
                if(typeof fnCallback =="function"){
                  fnCallback();
                }
                return app.listen(port);
                
        };
        app.use=function(route, fnCallback){
                if(typeof route=="function"){
                        fnCallback=route;
                        route="/";
                }
                routes.push({route: route, fn: fnCallback});
                return this;

        }
        processRoute=function(req, res){
                function next(err){
                        if(err){
                                if(res.headerSent){
                                  return req.socket.destroy();
                                }
                                res.statusCode = 500;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end("Error in Document");
                                return;
                        }
                        if(++stackctr<routes.length){
                                processRoute(req, res);
                        }
                        else{
                                res.end();
                        }
                        
                        return;

                }
                
                if(stackctr<routes.length){
                        var route=routes[stackctr];
                        if(route.route=="/" || route.route==req.url){
                                if(typeof route.fn=="function"){
                                        route.fn(req, res, next);
                                        return;
                                }
                        }
                        else{
                                next();
                        }
                }
                else{
                        res.end();

                }
        }


        return app;
};
