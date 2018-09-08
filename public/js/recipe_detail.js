var total_nutri = {
    'valueCalories': 0,
    'valueTotalFat': 0,
    'valueSatFat': 0,
    'valueCholesterol': 0,
    'valueSodium': 0,
    'valueTotalCarb': 0,
    'valueFibers': 0,
    'valueSugars': 0,
    'valueProteins': 0,

    'valueVitaminD': 0,
    'valueCalcium': 0,
    'valueIron': 0
};

$(document).ready(function () {
    $(document).find(".ingredient_desc").each(function () {
        IS.nutritionFacts($(this).text())
            .then(function (data) {
                total_nutri.valueCalories = parseFloat(total_nutri.valueCalories) + parseFloat(data.nf_calories);
                total_nutri.valueTotalFat = parseFloat(total_nutri.valueTotalFat) + parseFloat(data.nf_total_fat);
                total_nutri.valueSatFat = parseFloat(total_nutri.valueSatFat) + parseFloat(data.nf_saturated_fat);
                total_nutri.valueCholesterol = parseFloat(total_nutri.valueCholesterol) + parseFloat(data.nf_cholesterol);
                total_nutri.valueSodium = parseFloat(total_nutri.valueSodium) + parseFloat(data.nf_sodium);
                total_nutri.valueTotalCarb = parseFloat(total_nutri.valueTotalCarb) + parseFloat(data.nf_total_carbohydrate);
                total_nutri.valueFibers = parseFloat(total_nutri.valueFibers) + parseFloat(data.nf_dietary_fiber);
                total_nutri.valueSugars = parseFloat(total_nutri.valueSugars) + parseFloat(data.nf_sugars);
                total_nutri.valueProteins = parseFloat(total_nutri.valueProteins) + parseFloat(data.nf_protein);
                total_nutri.valueVitaminD = parseFloat(total_nutri.valueVitaminD) + parseFloat(data.full_nutrients[35].value);
                total_nutri.valueCalcium = parseFloat(total_nutri.valueCalcium) + parseFloat(data.full_nutrients[18].value);
                total_nutri.valueIron = parseFloat(total_nutri.valueIron) + parseFloat(data.full_nutrients[19].value);
            })
    });
});

$('#detail').on('click', function () {
    $('#nutrition').nutritionLabel({
        'showServingUnitQuantity': false,
        'showServingsPerContainer': false,
        'showIngredients': false,
        'showItemName': false,

        'showFibers': false,
        'showTransFat': false,
        'showPotassium_2018': false,

        'valueCalories': total_nutri.valueCalories,
        'valueTotalFat': total_nutri.valueTotalFat,
        'valueSatFat': total_nutri.valueSatFat,
        'valueCholesterol': total_nutri.valueCholesterol,
        'valueSodium': total_nutri.valueSodium,
        'valueTotalCarb': total_nutri.valueTotalCarb,
        'valueFibers': total_nutri.valueFibers,
        'valueSugars': total_nutri.valueSugars,
        'valueProteins': total_nutri.valueProteins,

        'valueVitaminD': total_nutri.valueVitaminD,
        'valueCalcium': total_nutri.valueCalcium,
        'valueIron': total_nutri.valueIron,

        'showLegacyVersion': false
    });
});

var IS = {
    nutritionFacts: function (query) {
        return $.ajax({
            url: "/api/nutrition_facts",
            method: "POST",
            data: { query: query },
            dataType: "json",
        });
    }
}