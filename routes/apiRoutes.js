var db = require("../models");
var request = require("request");

module.exports = function (app) {
  // Get all recipes
  app.get("/api/all_recipes", function (req, res) {
    db.recipes.findAll().then(function (dbRecipe) {
      res.json(dbRecipe);
    });
  });

  // Get one recipe
  app.get("/api/recipes/:id", function (req, res) {
    db.recipes.findOne({ where: { id: req.params.id } }).then(function (dbRecipe) {
      res.json(dbRecipe);
    });
  });

  // Create a new recipe
  app.post("/api/recipes", function (req, res) {
    db.recipes.create(req.body)
      .then(function (dbRecipe) {
        res.json(dbRecipe);
      });
  });

  // Create a recipe ingredients
  app.post("/api/recipe_ingredients", function (req, res) {
    var temp = [];
    var array = JSON.parse(req.body.ingredients);

    array.forEach(element => {
      temp.push(element);
    });

//------------------------------------------------------------------------------------------------------------------------------
    db.recipeIngredientMeas.bulkCreate(temp)
      .then(function (dbRecipeIngredient) {
        res.json(dbRecipeIngredient);
      });
  });

  app.post("/api/nutrition_facts", function (req, res) {
    var options = {
      method: 'POST',
      url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
      headers:
      {
        'x-app-key': '9c7352952e4f2e99216dc39377db47d8',
        'x-app-id': '95128c41',
        'Content-Type': 'application/json'
      },
      body:
      {
        query: req.body.query,
        line_delimited: false,
        timezone: 'US/Eastern',
        use_raw_foods: false,
        use_branded_foods: false,
        locale: 'en_US'
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      res.json(body.foods[0]);
    })
  });


  // PUT route update a recipe
  app.put("/api/recipes", function (req, res) {
    db.recipes.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbRecipe) {
        res.json(dbRecipe);
      });
  });

  // Delete a recipe by id
  app.delete("/api/recipes/:id", function (req, res) {
    db.recipes.destroy({ where: { id: req.params.id } }).then(function (dbRecipe) {
      res.json(dbRecipe);
    });
  });


  // Create a new Ingredient
  app.post("/api/ingredient", function (req, res) {

    db.ingredients.findAll({
      where: {
        ingredientName: req.body.ingredientName
      }
    }).then(function (insertIngre) {
      if (insertIngre.length > 0) {
        //Do nothing ingredient exists
        res.json(insertIngre[0]);
      } else {
        //Add Ingredient
        db.ingredients.create(req.body).then(function (dbIngredient) {
          res.json(dbIngredient);
        });
      }
    })
  });


  // Get ingredients
  app.post("/api/ingredientsList", function (req, res) {

    var options = {
      method: 'GET',
      url: 'https://trackapi.nutritionix.com/v2/search/instant',
      qs: { query: req.body.term, branded: 'false', locale: 'en_US' },
      headers:
      {
        'x-app-key': '9c7352952e4f2e99216dc39377db47d8',
        'x-app-id': '95128c41'
      }
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      var matchIngredients = [];

      JSON.parse(body).common.forEach(element => {
        var ingredient = {
          food_name: element.food_name,
          photo: element.photo.thumb !== null ? element.photo.thumb : "http://placehold.it/50x50"
        }
        matchIngredients.push(ingredient);
      });

      res.jsonp(matchIngredients);
    });
  });

  // Get meas. avaliables
  app.post("/api/measures", function (req, res) {

    var options = {
      method: 'POST',
      url: 'https://trackapi.nutritionix.com/v2/natural/nutrients',
      headers:
      {
        'x-app-key': '9c7352952e4f2e99216dc39377db47d8',
        'x-app-id': '95128c41',
        'Content-Type': 'application/json'
      },
      body:
      {
        query: req.body.food_name,
        line_delimited: false,
        timezone: 'US/Eastern',
        use_raw_foods: false,
        use_branded_foods: false,
        locale: 'en_US'
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      var avaliableMeas = [];
      var meas = [];

      body.foods[0].alt_measures.forEach(element => {
        //avoid duplicates checking if the value exists
        if (meas.indexOf(element.measure) < 0) {
          avaliableMeas.push({
            measureName: element.measure
          });
          meas.push(element.measure);
        }
      });

      db.measure.findAll({
        where: {
          measure_name: {
            $in: meas
          }
        }
      }).then(function (insertMeas) {
        if (insertMeas.length < avaliableMeas.length) {
          var temp = [];

          meas.forEach(element => {
            temp.push(element);
          });

          for (let index = 0; index < insertMeas.length; index++) {
            var name = insertMeas[index].dataValues.measureName;
            var existing = temp.indexOf(name);
            temp.splice(existing, 1)
            avaliableMeas.splice(existing, 1)
          }

          db.measure.bulkCreate(avaliableMeas)
            .then(function (measIn) {
              db.measure.findAll({
                where: {
                  measure_name: {
                    $in: meas
                  }
                }
              }).then(function (result) {
                var finalArray = [];

                result.forEach(element => {
                  finalArray.push({
                    measureId: element.dataValues.measureId,
                    measureName: element.dataValues.measureName
                  });
                });
                res.jsonp(finalArray);
              })
            });
        } else {
          var finalArray = [];

          insertMeas.forEach(element => {
            finalArray.push({
              measureId: element.dataValues.measureId,
              measureName: element.dataValues.measureName
            });
          });
          res.jsonp(finalArray);
        }
      })
    });
  });
};