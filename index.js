const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Diameter & Velocity Calculation
app.post('/calculate/diameter-velocity', (req, res) => {
    const { diameter, velocity, diameterUnit, velocityUnit } = req.body;

    console.log('Received inputs:', { diameter, velocity, diameterUnit, velocityUnit });

    // Convert units to meters and meters/second
    let diameterInMeters = convertToMeters(diameter, diameterUnit);
    let velocityInMetersPerSecond = convertToMetersPerSecond(velocity, velocityUnit);

    console.log('Converted values:', { diameterInMeters, velocityInMetersPerSecond });

    if (isNaN(diameterInMeters) || isNaN(velocityInMetersPerSecond)) {
        return res.status(400).json({ error: 'Invalid input values' });
    }

    const flowRateCubicMetersPerSecond = Math.PI * Math.pow(diameterInMeters / 2, 2) * velocityInMetersPerSecond;

    console.log('Flow rate (cubic meters per second):', flowRateCubicMetersPerSecond);

    // Return results in JSON format
    res.json({
        ft3_sec: flowRateCubicMetersPerSecond * 35.3147,
        gal_sec: flowRateCubicMetersPerSecond * 264.172,
        ft3_min: flowRateCubicMetersPerSecond * 35.3147 * 60,
        gal_min: flowRateCubicMetersPerSecond * 264.172 * 60,
        ft3_hr: flowRateCubicMetersPerSecond * 35.3147 * 3600,
        gal_hr: flowRateCubicMetersPerSecond * 264.172 * 3600,
        m3_sec: flowRateCubicMetersPerSecond,
        l_sec: flowRateCubicMetersPerSecond * 1000,
        m3_min: flowRateCubicMetersPerSecond * 60,
        l_min: flowRateCubicMetersPerSecond * 1000 * 60,
        m3_hr: flowRateCubicMetersPerSecond * 3600,
        l_hr: flowRateCubicMetersPerSecond * 1000 * 3600,
    });
});

// Utility functions for unit conversion
function convertToMeters(value, unit) {
    switch (unit) {
        case 'inches': return value * 0.0254;
        case 'feet': return value * 0.3048;
        case 'yards': return value * 0.9144;
        case 'millimeters': return value * 0.001;
        case 'centimeters': return value * 0.01;
        case 'meters': return value;
        default: return NaN;
    }
}

function convertToMetersPerSecond(value, unit) {
    return unit === 'ft/s' ? value * 0.3048 : value;
}

app.listen(3000, () => {
    console.log('API server running on port 3000');
});
