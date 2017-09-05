var mysql = require("mysql");

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {

    router.get("/getWineById",function(req,res){
        var query = "SELECT wine.year, wine.name, wine.country, " +
                    "wine.color, wine.producer "+
                    "FROM wine WHERE winereview.id = ?; " +
                    "SELECT grapes.grape FROM grapes WHERE grape.fk_wine_id = ?; " +
                    "SELECT reviews.boughtfrom, reviews.price, reviews.reviewer, reviews.glass, "+
                    " reviews.score FROM reviews WHERE reviews.fk_wine_id = ?; "; 
        var params = [req.query.id, req.query.id, req.query.id];
        query = mysql.format(query, params);

        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else if(rows[0].length !== 0 || rows[1].length !== 0 || rows[2].length !== 0) {
                rows = rows[0];
                rows[0].reviews = rows[1];
                rows[0].grapes = rows[2];
                for(var key in rows) {
                    if(rows[key].length === 0) {
                        delete rows[key];
                    }
                }
                res.json({"Error" : false, "Message" : "Success", "data" : rows});
            } else {
                res.json({"Error" : false, "Message" : "Success", "data" : null});
            }
        });    
    });

    router.get("/getWineByForeignProperty",function(req,res){
        var query = "SELECT wine.id " +
                    "FROM wine, ?? WHERE ??.?? like ? " +
                    "AND wine.id = ??.fk_wine_id; "; 
        var params = [req.query.table, req.query.table, req.query.property, req.query.value, req.query.table];
        var query = mysql.format(query, params);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else if(rows.length === 0 || rows[0].length === 0) {
                res.json({"Error" : false, "Message" : "Success", "data" : null});
            } else {
                var values = [];
                for (var i = rows.length - 1; i >= 0; i--) {
                    values.push(rows[i].id);
                }
                queryserver(values, 0, {"wine":[], "grapes":[], "reviews":[]});
                function queryserver(values, index, result) {
                    if (values.length > index) {
                        var query = "SELECT wine.year, wine.name, wine.country, " +
                            "wine.color, wine.producer "+
                            "FROM wine WHERE wine.id = ? ; " +
                            "SELECT grapes.grape FROM grapes WHERE grapes.fk_wine_id = ? ; " +
                            "SELECT reviews.boughtfrom, reviews.price, reviews.reviewer, reviews.glass, "+
                            " reviews.score, reviews.comment FROM reviews WHERE reviews.fk_wine_id = ? ; ";
                        var params = [values[index], values[index], values[index]];
                        query = mysql.format(query, params);
                        connection.query(query, function(err, rows) {
                            if(err) {
                                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
                            } else if(rows.length && (rows[0].length !== 0 || rows[1].length !== 0 || rows[2].length !== 0)) {
                                result.wine[index] = rows[0];
                                result.grapes[index] = rows[1];
                                result.reviews[index] = rows[2];
                                queryserver(values, index + 1, result)
                            } else {
                                res.json({"Error" : false, "Message" : "I have no idea what just happened"});
                            }
                        });
                    } else {
                        res.json({"Error" : false, "Message" : "Success", data: result});
                    }
                }
                
            }
        });    
    });

    router.get("/getWineByProperty",function(req,res){
        var query = "SELECT wine.id " +
                    "FROM wine WHERE wine.?? like ?; "; 
        var params = [req.query.property, req.query.value];
        var query = mysql.format(query, params);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else if(rows.length === 0 || rows[0].length === 0) {
                res.json({"Error" : false, "Message" : "Success", "data" : null});
            } else {
                var values = [];
                for (var i = rows.length - 1; i >= 0; i--) {
                    values.push(rows[i].id);
                }
                queryserver(values, 0, {"wine":[], "grapes":[], "reviews":[]});
                function queryserver(values, index, result) {
                    if (values.length > index) {
                        var query = "SELECT wine.year, wine.name, wine.country, " +
                            "wine.color, wine.producer "+
                            "FROM wine WHERE wine.id = ? ; " +
                            "SELECT grapes.grape FROM grapes WHERE grapes.fk_wine_id = ? ; " +
                            "SELECT reviews.boughtfrom, reviews.price, reviews.reviewer, reviews.glass, "+
                            " reviews.score, reviews.comment FROM reviews WHERE reviews.fk_wine_id = ? ; ";
                        var params = [values[index], values[index], values[index]];
                        query = mysql.format(query, params);
                        connection.query(query, function(err, rows) {
                            if(err) {
                                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
                            } else if(rows.length && (rows[0].length !== 0 || rows[1].length !== 0 || rows[2].length !== 0)) {
                                result.wine[index] = rows[0];
                                result.grapes[index] = rows[1];
                                result.reviews[index] = rows[2];
                                queryserver(values, index + 1, result)
                            } else {
                                res.json({"Error" : false, "Message" : "I have no idea what just happened"});
                            }
                        });
                    } else {
                        res.json({"Error" : false, "Message" : "Success", data: result});
                    }
                }
            }
        });    
    });

    router.post("/insertWineReview",function(req,res) {
         var query = "INSERT INTO wine(year, name, country, color, producer) " +
                    "VALUES(?, ?, ?, ?, ?);";
         var table = [req.body.year, req.body.name, req.body.country, 
                    req.body.color, req.body.producer];
         query = mysql.format(query,table);
         connection.query(query, function(err,result){
             if (err) throw err;
             var values = [];
             for (var i = req.body.grapes.length - 1; i >= 0; i--) {
                 values.push([result.insertId, req.body.grapes[i]]);
             }
            var query = "INSERT INTO grapes (fk_wine_id, grape) VALUES ?;";
             connection.query(query, [values], function(err) {
                    if (err) throw err;
                    var query = "INSERT INTO reviews (fk_wine_id, boughtfrom, price, reviewer,  glass, comment, score) "+
                    "VALUES(?, ?, ?, ?, ?, ?, ?);";
                    var params = [result.insertId, req.body.boughtfrom, req.body.price,
                     req.body.reviewer, req.body.glass, req.body.comment, req.body.score];
                    query = mysql.format(query,params);
                    connection.query(query, function(err) {
                        if(err) {
                            res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
                        } else {
                            res.json({"Error" : false, "Message" : "Success"});
                        }
                });
            });
        });
     });



    router.get("/autocompleteSearch",function(req,res){
        var query = "SELECT distinct wine.year FROM wine WHERE wine.year like ?; " + 
                    "SELECT distinct wine.name FROM wine WHERE wine.name like ?; " +
                    "SELECT distinct wine.country FROM wine WHERE wine.country like ?; " + 
                    "SELECT distinct wine.color FROM wine WHERE wine.color like ?; " + 
                    "SELECT distinct wine.producer FROM winereview WHERE wine.producer like ?; ";
        var params = ['%'+req.query.startsWith+'%',
                    '%'+req.query.startsWith+'%',
                    '%'+req.query.startsWith+'%',
                    '%'+req.query.startsWith+'%',
                    '%'+req.query.startsWith+'%'];
        query = mysql.format(query, params);

        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query: "+ err});
            } else if(rows[0].length !== 0 || rows[1].length !== 0 || rows[2].length !== 0 || rows[3].length !== 0 || rows[4].length !== 0) {
                rows = {"År" : rows[0],"Namn" : rows[1],"Land" : rows[2],"Färg" : rows[3],"Producent" : rows[4]};
                for(var key in rows) {
                    if(rows[key].length === 0) {
                        delete rows[key];
                    }
                }
                res.json({"Error" : false, "Message" : "Success", "data" : rows});
            } else {
                res.json({"Error" : false, "Message" : "Success", "data" : null});
            }
        });    
    });
}

module.exports = REST_ROUTER;