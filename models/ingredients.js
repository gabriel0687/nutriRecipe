module.exports = function(sequelize, DataTypes) {
	return sequelize.define('ingredients', {
		ingredientId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'ingredient_id'
		},
		ingredientName: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			field: 'ingredient_name'
		},
		ingredientImg: {
			type: DataTypes.STRING(255),
			allowNull: true,
			field: 'ingredient_img'
		}
	}, {
		tableName: 'ingredients'
	});
};
