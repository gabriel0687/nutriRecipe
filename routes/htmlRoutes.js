var db = require("../models");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    db.recipes.findAll().then(function (dbRecipe) {
      res.render("index", {
        recipes: dbRecipe
      });
    });
  });

  // Load add recipe page
  app.get("/recipe", function (req, res) {
    res.render("recipe");
  });

  // Load recipe page and pass in a recipe by id
  app.get("/recipe/:id", function (req, res) {
    var result = {
      recipeName: null,
      recipeDescription: null,
      ingredients: []
    }

    var ingredients = [];
    var measures = [];
    try {
      db.recipes.findOne({ where: { recipeId: req.params.id } }).then(function (dbRecipe) {
        //Getting recipe name and description
        result.recipeName = dbRecipe.recipeName;
        result.recipeDescription = dbRecipe.recipeDescription;

        db.recipeIngredientMeas.findAll({ where: { recipesRecipeId: dbRecipe.recipeId } }).then(function (dbRecipeIngredientMeas) {
          //Creating ingredients objects
          dbRecipeIngredientMeas.forEach(element => {
            result.ingredients.push({
              quantity: element.dataValues.quantity,
              ingredient: {
                ingredient_id: element.dataValues.ingredientsIngredientId,
                ingredient_name: "",
                ingredient_img: ""
              },
              measure: {
                measure_id: element.dataValues.measureMeasureId,
                measure_name: ""
              }
            });
            ingredients.push(element.dataValues.ingredientsIngredientId);
            measures.push(element.dataValues.measureMeasureId);
          });

          db.measure.findAll({ where: { measure_id: { $in: measures } } }).then(function (matchMeas) {
            //Getting the meas name
            result.ingredients.forEach(element => {
              matchMeas.forEach(local => {
                if (element.measure.measure_id === local.measureId) {
                  element.measure.measure_name = local.measureName;
                }
              });
            });

            db.ingredients.findAll({ where: { ingredient_id: { $in: ingredients } } }).then(function (matchIngredients) {
              //Getting the mingredient name and img
              result.ingredients.forEach(element => {
                matchIngredients.forEach(local => {
                  if (element.ingredient.ingredient_id === local.ingredientId) {
                    element.ingredient.ingredient_name = local.ingredientName,
                      element.ingredient.ingredient_img = local.ingredientImg
                  }
                });
              });

              res.render("detailed_recipe", {
                recipe: result
              });
            });
          });
        });
      });
    } catch (error) {
      console.log(error);
    }

  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
