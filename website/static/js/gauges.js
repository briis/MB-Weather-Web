
// *************************************
// DRAW SUN HORIZON CIRCLE
// *************************************
function drawSunHorizon(sunCanvas, sunrise, nextSunrise, sunset, anglePosition, isDay) {
    const canvas = document.getElementById(sunCanvas);
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const margin = 10;
    const baseHeight = canvas.height / 25;
    const centerRectWidth = canvas.width / 3;
    const centerRectHeight = baseHeight * 3;
    const sunRadius = centerX - margin * 2;

    // Draw the sun circle
    ctx.beginPath();
    ctx.fillStyle = cssVar("sun-arc-background");
    ctx.arc(centerX, centerY, sunRadius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 4;
    ctx.strokeStyle = cssVar("sun-arc-circle");
    ctx.fill();
    ctx.stroke();

    // Draw the horizon
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = cssVar("sun-arc-horizon-line");
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width / 2 - centerRectWidth / 2, centerY);
    ctx.moveTo(canvas.width / 2 + centerRectWidth / 2, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw the Center Rectangle
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = cssVar("color-white");
    ctx.strokeStyle = cssVar("sun-arc-horizon-line");
    ctx.roundRect(centerX - centerRectWidth / 2, centerY - centerRectHeight / 2, centerRectWidth, centerRectHeight, 5);
    ctx.fill();
    ctx.stroke();

    // Place Horizon text
    ctx.beginPath();
    ctx.font = 'normal 400 0.75em Roboto';
    ctx.fillStyle = cssVar("sun-arc-text");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('HORISONT', centerX, centerY);
    ctx.stroke();

    // Draw the Sunrise symbol
    ctx.beginPath();
    ctx.font = '1.2em Material Icons';
    ctx.fillStyle = cssVar("color-orange");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('wb_sunny', centerX, baseHeight * 4.5);
    ctx.stroke();

    // Place sunrise text
    ctx.beginPath();
    ctx.font = 'normal 400 0.95em Roboto';
    ctx.fillStyle = cssVar("sun-arc-text-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('Solopgang', centerX, baseHeight * 6.5);
    ctx.stroke();

    // Place sunrise text
    ctx.beginPath();
    ctx.font = 'normal 400 1.3em Roboto';
    ctx.fillStyle = cssVar("sun-arc-text");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    if (isDay) {
        ctx.fillText(sunrise, centerX, baseHeight * 9);
    } else {
        ctx.fillText(nextSunrise, centerX, baseHeight * 9);
    }
    ctx.stroke();

    // Draw the Sunset Symbol
    ctx.beginPath();
    ctx.font = '1.2em Material Icons';
    ctx.fillStyle = cssVar("sun-arc-text-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('nightlight_round', centerX, centerY + baseHeight * 3);
    ctx.stroke();


    // Place sunset text
    ctx.beginPath();
    ctx.font = 'normal 400 0.95em Roboto';
    ctx.fillStyle = cssVar("sun-arc-text-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('Solnedgang', centerX, centerY + baseHeight * 5.4);
    ctx.stroke();

    // Place sunset text
    ctx.beginPath();
    ctx.font = 'normal 400 1.3em Roboto';
    ctx.fillStyle = cssVar("sun-arc-text");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText(sunset, centerX, centerY + baseHeight * 7.8);
    ctx.stroke();

    // Draw the current position
    // ** Sun Up Start Angle: Math.PI and End Angle 2 * Math.PI, direction false
    // ** Sun Down Start Angle: 0 and End Angle Math.PI, direction false

    ctx.beginPath();
    ctx.lineWidth = 6;
    if (isDay) {
        ctx.strokeStyle = cssVar("sun-arc-sunup");
        ctx.arc(centerX, centerY, sunRadius, Math.PI, anglePosition * Math.PI, false);
    } else {
        ctx.strokeStyle = cssVar("sun-arc-sundown");
        ctx.arc(centerX, centerY, sunRadius, 0, anglePosition * Math.PI, false);
    }
    ctx.stroke();

    // Draw White Circle on Arc Position
    ctx.beginPath();
    ctx.fillStyle = cssVar("color-white");
    ctx.lineWidth = 1;
    ctx.strokeStyle = cssVar("color-grey-light");
    let angle = 180 * anglePosition;
    if (angle > 359) { angle = 0; }
    let rad = angle * Math.PI / 180;
    let x = centerX + sunRadius * Math.cos(rad);
    let y = centerY + sunRadius * Math.sin(rad);
    ctx.arc(x, y, 12, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.stroke();

    // Draw Symbol inside White Circle on Arc Position
    if (isDay) {
        ctx.beginPath();
        ctx.font = '0.8em Material Icons';
        ctx.fillStyle = cssVar("sun-arc-sunup");
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillText('light_mode', x, y);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.font = '0.8em Material Icons';
        ctx.fillStyle = cssVar("sun-arc-sundown");
        ctx.textAlign = 'center';
        ctx.textBaseline = "middle";
        ctx.fillText('nightlight_round', x, y);
        ctx.stroke();
    }

}


// *************************************
// DRAW WIND COMPASS
// *************************************
function drawWindCompass(bearing, windspeed) {
    const canvas = document.getElementById('valWindbearing');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const margin = 5;
    const insideMargin = 30;
    const circleBorderWidth = 8;
    const radius = centerX - margin * 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the compass circle
    ctx.beginPath();
    ctx.fillStyle = cssVar("color-white");
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = circleBorderWidth;
    ctx.strokeStyle = cssVar("color-grey-light");
    ctx.fill();
    ctx.stroke();

    // Draw the compass Letters
    ctx.beginPath();
    ctx.font = 'normal 400 10px Roboto';
    ctx.fillStyle = cssVar("color-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('N', centerX, margin + circleBorderWidth - 2);
    ctx.fillText('S', centerX, canvas.height - circleBorderWidth - 2);
    ctx.fillText('Ø', canvas.width - circleBorderWidth - 2, centerY);
    ctx.fillText('V', circleBorderWidth + 2, centerY);
    ctx.stroke();

    // Draw Minor Tickmarks
    minorTicks = 16;
    angleTicks = 360 / minorTicks;
    for (let i = 0; i < minorTicks; i++) {
        if (i == 0 || i == 4 || i == 8 || i == 12) { continue; }
        let x = radius * Math.cos(degrees_to_radians(i * angleTicks));
        let y = radius * Math.sin(degrees_to_radians(i * angleTicks));
        draw_rectangle(centerX + x, centerY + y, 1, circleBorderWidth, i * angleTicks, ctx);
    }

    // Draw the current position
    let anglePosition = 0;
    if (bearing > 180) {
        anglePosition = 1 + (bearing - 270) / 180;
    } else {
        anglePosition = (bearing / 180) - 0.5;
    }
    ctx.beginPath();
    ctx.fillStyle = cssVar("color-green");
    ctx.lineWidth = 1;
    ctx.strokeStyle = cssVar("color-grey-light");
    let angle = 180 * anglePosition;
    if (angle > 359) { angle = 0; }
    let rad = angle * Math.PI / 180;
    let x = centerX + radius * Math.cos(rad);
    let y = centerY + radius * Math.sin(rad);
    ctx.arc(x, y, 6, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.stroke();

    // Draw Text Inside
    const cardinal = windDegreeToCardinal(bearing);
    ctx.beginPath();
    ctx.font = 'normal 300 1.2em Roboto, sans-serif';
    ctx.fillStyle = cssVar("color-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText(cardinal, centerX, centerY - (insideMargin + margin));
    ctx.stroke();
    ctx.beginPath();
    ctx.font = 'normal 200 2.1em Roboto, sans-serif';
    ctx.fillStyle = cssVar("color-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText(windspeed, centerX, centerY);
    ctx.stroke();
    ctx.beginPath();
    ctx.font = 'normal 300 1em Roboto, sans-serif';
    ctx.fillStyle = cssVar("color-disabled");
    ctx.textAlign = 'center';
    ctx.textBaseline = "middle";
    ctx.fillText('m/s', centerX, centerY + margin * 4);
    ctx.stroke();

    function draw_rectangle(x, y, w, h, deg, ctx) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(degrees_to_radians(deg + 90));
        ctx.fillStyle = cssVar("color-grey");
        ctx.fillRect(-1 * (w / 2), -1 * (h / 2), w, h);
        ctx.restore();
    }
}
