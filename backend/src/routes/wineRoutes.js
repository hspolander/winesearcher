import { query, SQL } from '../util/db';
var bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
import _ from 'lodash';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

import {
  getUserById,
  getWineById,
  getUuidByUser,
  getUuidByUuid,
  getGrapesByWine,
  getReviewsByWine,
  getUserByUsername,
  getWineByProperty,
  getWineByForeignProperty,
  getHashByUsername,
  getAllNotCellarWines,
  getAllCellarWines,
  getDistinctFromWine,
  getDistinctFromGrapes,
  getSystembolagWines,
  getAutocompleteResponse,
  insertReview,
  insertWine,
  insertGrape,
  insertUser,
  insertUuid,
  updateUuid,
  updateUuidTtl,
  setUuidExpired,
  setWineNotInCellar,
} from '../controller/queries'

export default (server) => {

    server.get("/api/getAllById", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        let wine = await getWineById(req.query.id);
        let grapes = await getGrapesByWine(wine.id);
        let reviews = await getReviewsByWine(wine.id);
        res.json({
          "error" : false, 
          "Message" : "Success", 
          "data" : {
            "grapes" : grapes,
            "reviews" : reviews,
          }
        });
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true,
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });

    server.get("/api/getWineByForeignProperty", async (req,res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const query = req.query;
        wines = await getWineByForeignProperty(query.table, query.property, query.value);
        var result = [];
        for (var i = 0; i < wines.length; i++) {
          let wine = await getWineById(wines[i].id);
          let grapes = await getGrapesByWine(wines[i].id);
          let reviews = await getReviewsByWine(wines[i].id);
          result.push({
            "wine" : wine
          });
          result[i].wine.grapes = grapes;
          result[i].wine.reviews = reviews;
        }
        if (query.orderedProp) {
            if (query.orderedProp === 'year' || query.orderedProp === 'score') {
              result.sort(function(a, b) {
                return a.wine[query.orderedProp] - b.wine[query.orderedProp];
              });
            } else {
              result.sort(function(a, b) {
                var nameA = a.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                var nameB = b.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            }
        }
        res.json({
          "error" : false, 
          "message" : "Success", 
          "data" : result
        });
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });

    server.get("/api/getAllReviews", async (req,res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const query = req.query;
        let wines = await getAllNotCellarWines();
        var result = [];
        for (var i = 0; i < wines.length; i++) {

          let wine = await getWineById(wines[i].id);
          let grapes = await getGrapesByWine(wines[i].id);
          let reviews = await getReviewsByWine(wines[i].id);
          if (reviews[0]) {
            wine.grapes = grapes;
            wine.reviews = reviews;
            result.push({
              "wine" : wine
            });
          }
        }
        if (query.orderedProp) {
            if (query.orderedProp === 'year') {
              result.sort(function(a, b) {
                return b.wine[query.orderedProp] - a.wine[query.orderedProp];
              });
            } else if(query.orderedProp === 'price') {
              result.sort(function(a, b) {
                return parseInt(a.wine[query.orderedProp].replace(" kr", "")) - parseInt(b.wine[query.orderedProp].replace(" kr", ""));
              });
            } else if (query.orderedProp === 'score') {
              result.sort(function(a, b) {
                return b.wine.reviews[0][query.orderedProp] - a.wine.reviews[0][query.orderedProp];
              });
            } else {
              result.sort(function(a, b) {
                var nameA = a.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                var nameB = b.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            }
        }
        res.json({
          "error" : false, 
          "message" : "Success", 
          "data" : result
        });
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });


    server.get("/api/getAllCellar", async (req,res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const query = req.query;
        let wines = await getAllCellarWines();
        var result = [];
        for (var i = 0; i < wines.length; i++) {
          let wine = await getWineById(wines[i].id);
          let grapes = await getGrapesByWine(wines[i].id);
          result.push({
            "wine" : wine
          });
          result[i].wine.grapes = grapes;
        }
        if (query.orderedProp) {
            if (query.orderedProp === 'year' || query.orderedProp === 'score') {
              result.sort(function(a, b) {
                return a.wine[query.orderedProp] - b.wine[query.orderedProp];
              });
            } else {
              result.sort(function(a, b) {
                var nameA = a.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                var nameB = b.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            }
        }
        res.json({
          "error" : false, 
          "message" : "Success", 
          "data" : result
        });
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });

    server.get("/api/getWineByProperty", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const query = req.query;
        wines = await getWineByProperty(query.property, query.value);
        var result = [];
        for (var i = 0; i < wines.length; i++) {
          let wine = await getWineById(wines[i].id);
          let grapes = await getGrapesByWine(wines[i].id);
          let reviews = await getReviewsByWine(wines[i].id);
          result.push({
            "wine" : wine
          });
          result[i].wine.grapes = grapes;
          result[i].wine.reviews = reviews;
        }
        if (query.orderedProp) {
            if (query.orderedProp === 'year' || query.orderedProp === 'score') {
              result.sort(function(a, b) {
                return a.wine[query.orderedProp] - b.wine[query.orderedProp];
              });
            } else {
              result.sort(function(a, b) {
                var nameA = a.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                var nameB = b.wine[query.orderedProp].toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
            }
        }
        res.json({
          "error" : false, 
          "message" : "Success", 
          "data" : result
        });
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });

    server.post("/api/insertWineReview", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const body = req.body;
        const wineId = await insertWine(body.year, body.name, body.boughtFrom, body.price, body.glass, body.country, body.color, body.producerbody, 0, body.sizeml, body.systembolagetartnr);
        let user = await getUserByUsername(cookies.username);
        await insertReview(wineId, user.name, body.comment, body.score);
        if (body.grapes) {
          for (var i = 0; i < body.grapes.length; i++) {
            insertGrape(wineId, body.grapes[i]);
          }
        }
        res.json({"error" : false, "message" : "Allt väl", "data" : null});
      }  else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosession", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
     });

    server.get("/api/removeFromCellar", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const id = req.query.id;
        await setWineNotInCellar(id);
        res.json({"error" : false, "message" : "Allt väl", "data" : null});
      }  else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
     });

    server.post("/api/getAdditionalSysInfo", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const url = req.body.url;
        let allrows;
        let body = await fetch(url);
        body = await body.text();
        let page = cheerio.load(body);
        let listprops = page('#destopview ul li');
        for (var j = 0; j < listprops.length; j++) {
        let liItem = page(listprops[j]);
          if (liItem.find('h3').text().indexOf('Råvaror') > -1) {
            allrows = liItem.find('p');
            liItem.find('div').remove();
            allrows = liItem.html().replace(/<\/button>|samt |och |, |\d% |\d\d% |\d\d\d% |<p>/g, "");

            allrows = allrows.split(/\r\n|<\/button>|<button /);
            for (var i = 0; i < allrows.length; i++) {
              allrows[i] = allrows[i].trim();
              if (allrows[i] && allrows[i].startsWith("class")) {
                allrows.splice(i, 1);
                i = i - 1;
              }
              if (allrows[i] && allrows[i].startsWith("<h3")) {
                allrows.splice(i, 1);
                i = i - 1;
              }
              if (allrows[i] && allrows[i].startsWith("R&#xE5;varor")) {
                allrows.splice(i, 1);
                i = i - 1;
              }
              if (allrows[i] && allrows[i].endsWith("</p>")) {
                allrows.splice(i, 1);
                i = i - 1;
              }
              if (allrows[i] !== undefined && allrows[i].length < 2) {
                allrows.splice(i, 1);
                i = i - 1;
              }
            }
          }
        }
        if (!allrows) {
          allrows = [];
        }
        res.json({"error" : false, "message" : "Allt väl", "data" : allrows});
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
     });

    server.post("/api/insertWineToCellar", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const body = req.body;
        const wineId = await insertWine(
          body.year,
          body.name,
          body.boughtFrom,
          body.price,
          body.container,
          body.country,
          body.color,
          body.producer,
          1,
          body.sizeml,
          body.systembolagetartnr
        );
        let user = await getUserByUsername(cookies.username);
        if (body.grapes) {
          for (var i = 0; i < body.grapes.length; i++) {
            insertGrape(wineId, body.grapes[i]);
          }
        }
        res.json({"error" : false, "message" : "Allt väl", "data" : null});
      }  else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosession", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
     });

    server.post("/api/createUser", (req, res, next) => {
        let user = req.body;
        if (validateLoginObject(user)) {
            bcrypt.hash(user.password, 11, function(err, hash) {
              insertUser(user.username, hash, user.name);
              res.json({"error" : true, "message" : `Användare ${user.name} tillagd!` , "data" : null});
            });
        } else {
            res.json({"error" : true, "message" : "Something went wrong", "data" : null});
        }
     });


    server.post("/api/login", async (req, res, next) => {
        let login = req.body;
        res.clearCookie('WINE_UUID');
        if (validateLoginObject(login)) {
            let hash = await getHashByUsername(login.username);
            if (hash) {
              bcrypt.compare(login.password, hash).then(function(response) {
                  if (response) {
                    var uuid = uuidv4(); 
                    res.setCookie('WINE_UUID', uuid, { maxAge: 28800000 });
                    res.json({"error" : false, "message" : "Login successful", "data" : {'UUID': uuid, 'login': login}});
                    writeUuidToDatabase(uuid, login.username);
                  } else {
                    res.json({"error" : true, "message" : "Login unsuccessful", "session" : "nosession", "data" : null}); 
                  }
              }).catch(function(e) {
                console.log(e);
              });
            } else {
              res.json({"error" : true, "message" : "Login unsuccessful", "session" : "nosession", "data" : null}); 
            }
        }
     });

    server.get("/api/keepalive", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        res.json({"error" : false, "message" : `Poked session for user ${cookies.username}.`, "data" : null});
      } else {
        res.clearCookie("WINE_UUID");
        res.json({"error" : false, "message" : `No live session for user. Please login again`, "session" : "nosession", "data" : null});
      }
    });

    server.get("/api/killSession", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        await setUuidExpired(cookies.WINE_UUID);
      }
        res.clearCookie("WINE_UUID");
        res.json({"error" : false, "message" : `Session killed or missing`, "session" : "nosessionRedirect", "data" : null});
     });

    const validateSession = async (wine_uuid) => {
      const time = getMsTime();    
      const uuid_ttl = getUuidTtl();    
      const uuid = await getUuidByUuid(wine_uuid);
      if (uuid && time < uuid.ttl) {
        await updateUuidTtl(uuid.id, uuid_ttl);
        console.log(`Poked session for user id ${uuid.fk_user_id}.`);
        return true;
      } else {
        console.log(`Session for user id ${uuid.fk_user_id} has expired.`);
        return false;
      }
    }

    const getUuidTtl = () => {
      let date = new Date();
      let ms = date.getTime();
      return ms + 7200000;
    }

    const getUuidTtlMax = () => {
      let date = new Date();
      let ms = date.getTime();
      return ms + 28800000;
    }

    const getMsTime = () => {
      let date = new Date();
      return date.getTime();
    }

    const writeUuidToDatabase = async (uuid, username) => {
      const user = await getUserByUsername(username);
      const uuid_ttl = getUuidTtl();
      const uuid_ttl_max = getUuidTtlMax();
      const user_uuid = await getUuidByUser(user.id);
      if (user_uuid) {
        updateUuid(user.id, uuid, uuid_ttl, uuid_ttl_max);
      } else {
        insertUuid(user.id, uuid, uuid_ttl, uuid_ttl_max);
      }
    }

    const validateLoginObject = (login) => {
        if (!login) {
            return false;
        }
        if (!login.username) {
            return false;
        }
        if (!login.password) {
            return false;
        }
        return true;
    }

    server.get("/api/autocompleteSearch", async (req, res, next) => {
      const cookies = req.cookies;
      const associativeArray = {};
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const autocompleteResponse = await getAutocompleteResponse('%'+req.query.startsWith+'%');

        for (var i = 0; i < autocompleteResponse.length; i++) {
          if (autocompleteResponse[i] !== null) {
            for (var responsetype in autocompleteResponse[i]) {
              associativeArray[responsetype] = autocompleteResponse[i][responsetype];
            }
          }
        }
        res.json({"error" : false, "message" : `Success`, "data" : associativeArray});
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosession", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });


    server.get("/api/getSysWines", async (req, res, next) => {
      const cookies = req.cookies;
      const associativeArray = {};
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        const query = req.query;
        let systembolagetWines = await getSystembolagWines(query.name, query.color, query.year, query.systembolagetartnr, query.price);
        systembolagetWines = _.union(systembolagetWines[0], systembolagetWines[1]);
        for (var i = 0; i < systembolagetWines.length; i++) {
          switch(systembolagetWines[i].sizeml) {
            case "750.00":
                systembolagetWines[i].container = "Helflaska";
                break;
            case "375.00":
                systembolagetWines[i].container = "Halvflaska";
                break;
            case "1000.00":
                if (systembolagetWines[i].Forpackning === "Flaska") {
                  systembolagetWines[i].container = "Flaska";
                } else {
                  systembolagetWines[i].container = "Tetra";
                }
                break;
            case "1500.00":
                if (systembolagetWines[i].Forpackning === "Flaska") {
                  systembolagetWines[i].container = "Magnum";
                } else {
                  systembolagetWines[i].container = " Liten box";
                }
                break;
            case "3000.00":
            case "2250.00":
            case "12000.00":
            case "10000.00":
            case "15000.00":
            case "5000.00":
            case "6000.00":
            case "9000.00":
                if (systembolagetWines[i].Forpackning === "Flaska") {
                  systembolagetWines[i].container = "Stor flaska";
                } else {
                  systembolagetWines[i].container = "Box";
                }
                break;
            case "250.00":
            case "200.00":
            case "187.00":
                systembolagetWines[i].container = "Liten flaska";
                break;
            default:
                systembolagetWines[i].container = "Annan";
          }
          let tempname = _.deburr(systembolagetWines[i].Namn).replace(/ /g, "-");
          switch(systembolagetWines[i].color) {
            case "Rött":
                systembolagetWines[i].url = `https://www.systembolaget.se/dryck/roda-viner/${tempname}-${systembolagetWines[i].nr}`;
                break;
            case "Vitt":
                systembolagetWines[i].url = `https://www.systembolaget.se/dryck/vita-viner/${tempname}-${systembolagetWines[i].nr}`;
                break;
            case "Mousserande vin":
                systembolagetWines[i].url = `https://www.systembolaget.se/dryck/mousserande-viner/${tempname}-${systembolagetWines[i].nr}`;
                break;
            case "Rosé":
                systembolagetWines[i].url = `https://www.systembolaget.se/dryck/roseviner/${tempname}-${systembolagetWines[i].nr}`;
                break;
            default:
                systembolagetWines[i].url = "";
          }
          if (systembolagetWines[i].Namn2 === null) {
            systembolagetWines[i].name = systembolagetWines[i].Namn;
          } else if (systembolagetWines[i].Namn2 === null) {
            systembolagetWines[i].name = systembolagetWines[i].Namn2;  
          } else {
            systembolagetWines[i].name = `${systembolagetWines[i].Namn}, ${systembolagetWines[i].Namn2}`;
          }
          
          delete systembolagetWines[i].Namn;
          delete systembolagetWines[i].Namn2;
          systembolagetWines[i].price = systembolagetWines[i].price.slice(0, -3) + " kr";
          systembolagetWines[i].sizeml = systembolagetWines[i].sizeml.slice(0, -3) + " ml";
        }
        res.json({"error" : false, "message" : `Success`, "data" : systembolagetWines});
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosessionRedirect", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });

    server.get("/api/autocompleteAddWine", async (req, res, next) => {
      const cookies = req.cookies;
      if (cookies && cookies.WINE_UUID && await validateSession(cookies.WINE_UUID)) {
        let autocompleteAddWine = '';
        const responseArray = [];
        if (req.query.prop) {
          autocompleteAddWine = await getDistinctFromWine(req.query.prop, '%'+req.query.startsWith+'%');
        } else {
          req.query.prop = "grape";
          autocompleteAddWine = await getDistinctFromGrapes('%'+req.query.startsWith+'%'); 
        }
        if (autocompleteAddWine) { 
          for (var i = 0; i < autocompleteAddWine.length; i++) {
            responseArray.push(autocompleteAddWine[i][req.query.prop]);
          }
          res.json({"error" : false, "message" : `Success`, "data" : {[req.query.prop]:responseArray}});
        } else {
          res.json({"error" : false, "message" : `Success`, "data" : null});
        }
      
      } else {
        res.clearCookie("WINE_UUID");
        res.json({
          "error" : true, 
          "session" : "nosession", 
          "message" : "Session expired/invalid", 
          "data" : null
        });
      }
    });
}