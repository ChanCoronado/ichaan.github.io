export class Paddle {
  constructor(canvasW, canvasH) {
    this.cW     = canvasW;
    this.cH     = canvasH;
    this.height = 12;
    this.y      = canvasH - 30;
    this.reset(canvasW, 100, 7);
    this._glowPhase = 0;
    
    this.widePowerup    = false;
    this.widePowerupTime= 0;
  }

  reset(canvasW, width, speed) {
    this.cW    = canvasW;
    this.width = width;
    this.speed = speed;
    this.x     = canvasW / 2 - width / 2;
  }

  applyWide() {
    this.widePowerup = true;
    this.widePowerupTime = 10000; 
    this._origWidth = this.width;
    this.width = Math.min(this.cW * 0.6, this.width * 1.65);
    
    if (this.x + this.width > this.cW) this.x = this.cW - this.width;
  }

  update(dt, controls) {
    
    if (this.widePowerup) {
      this.widePowerupTime -= dt;
      if (this.widePowerupTime <= 0) {
        this.widePowerup = false;
        this.width = this._origWidth;
      }
    }

    
    const posX = controls.getPositionX();
    if (posX !== null) {
      this.x = posX - this.width / 2;
    } else {
      
      if (controls.isLeft())  this.x -= this.speed * (dt / 16);
      if (controls.isRight()) this.x += this.speed * (dt / 16);
    }
    
    this.x = Math.max(0, Math.min(this.cW - this.width, this.x));
    this._glowPhase += dt * 0.004;
  }

  draw(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const glow = Math.sin(this._glowPhase) * 0.3 + 0.7; 

    
    ctx.save();
    ctx.shadowBlur  = 24 * glow;
    ctx.shadowColor = '#00f5ff';
    ctx.beginPath();
    this._roundRect(ctx, this.x, this.y, this.width, this.height, 6);
    ctx.fillStyle = `rgba(0,245,255,${0.18 * glow})`;
    ctx.fill();
    ctx.restore();

    
    const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#00f5ff');
    grad.addColorStop(1, '#0088aa');
    ctx.save();
    ctx.shadowBlur  = 16 * glow;
    ctx.shadowColor = '#00f5ff';
    ctx.beginPath();
    this._roundRect(ctx, this.x, this.y, this.width, this.height, 6);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    this._roundRect(ctx, this.x + 4, this.y + 2, this.width - 8, 3, 2);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fill();
    ctx.restore();
  }

  
  getHitFraction(ballX) {
    return (ballX - this.x) / this.width;
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}