// Lea Verou polyfill
var gradient = new ConicGradient({
    stops: "red, magenta, blue, cyan, lime, yellow, red"
  });

  if (!CSS.supports('background', 'paint(id, foo)')) {
    el.style.background = 'url(' + gradient.dataURL + ')'
  }

  registerPaint('checkbox', class {
    static get inputProperties() {
        return ['--checkbox-color', '--checkbox-radius','--checkbox-status'];
    }
    paint(ctx, geom, properties) {
        // get css vars
        let statusProp = properties.get('--checkbox-status');
        let colorProp = properties.get('--checkbox-color');
        let radiusProp = properties.get('--checkbox-radius');

        // convert them
        const status = statusProp ? statusProp.cssText.trim() === 'true' : false;
        const color = colorProp ? colorProp.cssText : 'gray';
        const radiusPercentage = radiusProp ? radiusProp.cssText : 25;

        // box config
        this.boxColor = color;
        this.shadowOffset = 2;
        this.shadowPadding = this.shadowOffset * 2;
        this.x = 0 + this.shadowOffset;
        this.y = 0 + this.shadowOffset;
        this.size = Math.min(geom.width, geom.height) - this.shadowPadding;
        this.radiusSize = this.size / 100 * radiusPercentage;

        this.roundedRect(ctx, this.x, this.y, this.size, this.size, this.radiusSize);

        if (status) {
            this.tick(ctx, this.x, this.y);
        }
    }

    roundedRect(ctx, x, y, width, height, radius) {
        ctx.fillStyle = this.boxColor;

        ctx.shadowOffsetX = this.shadowOffset;
        ctx.shadowOffsetY = this.shadowOffset;
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';

        ctx.beginPath();
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.arcTo(x, y + height, x + radius, y + height, radius);
        ctx.lineTo(x + width - radius, y + height);
        ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
        ctx.lineTo(x + width, y + radius);
        ctx.arcTo(x + width, y, x + width - radius, y, radius);
        ctx.lineTo(x + radius, y);
        ctx.arcTo(x, y, x, y + radius, radius);
        ctx.fill();

        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
    }

    tick(ctx, x, y) {
        ctx.lineWidth = this.calcTickLineThickness();

        ctx.beginPath();
        ctx.moveTo(x + this.perc(23), y + this.perc(42));
        ctx.lineTo(x + this.perc(48), y + this.perc(66));
        ctx.lineTo(x + this.perc(71), y + this.perc(24));

        ctx.strokeStyle = "white";
        ctx.stroke();
    }

    perc(percentage) {
        let proportion = this.size / 100;

        return proportion * percentage;
    }

    calcTickLineThickness() {
        let maxThick = 7;
        let maxSize = 75;

        if (this.size >= maxSize) {
            let fixThickness = maxThick;
            return fixThickness;
        }
        else {
            let proportinateThickness = maxThick * this.size / maxSize;
            return proportinateThickness < 1 ? 1 : proportinateThickness;
        }
    }
});