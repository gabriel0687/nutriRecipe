module.exports = function(sequelize, DataTypes) {
	return sequelize.define('measure', {
		measureId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			field: 'measure_id'
		},
		measureName: {
			type: DataTypes.STRING(45),
			allowNull: false,
			unique: true,
			field: 'measure_name'
		}
	}, {
		tableName: 'measure'
	});
};
