document.getElementById("btn").addEventListener("click", function() {
    var height = document.getElementById('height').value;
    var weight = document.getElementById('weight').value;
    var heightUnit = document.getElementById('height-unit').value;
    var weightUnit = document.getElementById('weight-unit').value;

    // Convert units to metric
    if (heightUnit === 'feet') {
        var parts = height.split('/');
        if (parts.length === 2) {
            var feet = parseInt(parts[0], 10);
            var inches = parseInt(parts[1], 10);
            height = (feet * 30.48) + (inches * 2.54);
        } else {
            alert("Please enter height in the format 'feet/inches', e.g., '5/8' for 5 feet 8 inches.");
            return;
        }
    }
    if (weightUnit === 'lb') {
        weight = weight * 0.453592;
    }

    var bmi = weight / ((height / 100) * (height / 100));
    var bmio = bmi.toFixed(2);

    document.getElementById("result").innerHTML = "Your BMI is " + bmio;

    var category = getBMICategory(bmio);
    document.getElementById("category").innerHTML = "BMI Category: " + category;

    var tips = getHealthTips(category);
    document.getElementById("tips").innerHTML = "Health Tips: " + tips;

    // Add BMI data to chart
    addBMIdata(bmio);
});

function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        return "Overweight";
    } else {
        return "Obesity";
    }
}

function getHealthTips(category) {
    switch (category) {
        case "Underweight":
            return "Consider eating more frequently, choose nutrient-rich foods, and try smoothies and shakes.";
        case "Normal weight":
            return "Maintain your current lifestyle and diet.";
        case "Overweight":
            return "Focus on a balanced diet and regular physical activity.";
        case "Obesity":
            return "Consult with a healthcare provider for personalized advice.";
        default:
            return "";
    }
}

// Initialize chart
var ctx = document.getElementById('bmiChart').getContext('2d');
var bmiChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'BMI Over Time',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function addBMIdata(bmi) {
    var date = new Date().toLocaleDateString();
    bmiChart.data.labels.push(date);
    bmiChart.data.datasets[0].data.push(bmi);
    bmiChart.update();
}
