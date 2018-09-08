module.exports = function(sequelize, DataTypes) {
	return sequelize.define('recipes', {
		recipeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'recipe_id'
		},
		recipeName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			field: 'recipe_name'
		},
		recipeDescription: {
			type: DataTypes.TEXT,
			allowNull: true,
			field: 'recipe_description'
		}
	}, {
		tableName: 'recipes'
	});
};
