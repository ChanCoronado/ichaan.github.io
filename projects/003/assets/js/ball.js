export class Ball {
  constructor(x, y, speed) {
    this.radius       = 7;
    this._trail       = [];
    this._trailMax    = 14;
    this.active       = true;
    this.stuck        = true;
    this._glowPhase   = 0;
    this.slowPowerup     = false;
    this.slowPowerupTime = 0;
    this._baseSpeed   = speed;
    this.x  = x;
    this.y  = y;
    const angle = (Math.random() * 60 - 30) * Math.PI / 180;
    this.vx = Math.sin(angle) * speed;
    this.vy = -Math.cos(angle) * speed;
  }

  launch() { this.stuck = false; }

  applySlow() {
    this.slowPowerup     = true;
    this.slowPowerupTime = 8000;
  }

  get speed() {
    return this.slowPowerup ? this._baseSpeed * 0.55 : this._baseSpeed;
  }

  _normalise() {
    const mag = Math.hypot(this.vx, this.vy);
    if (mag > 0) {
      this.vx = (this.vx / mag) * this._baseSpeed;
      this.vy = (this.vy / mag) * this._baseSpeed;
    }
  }

  update(dt, paddleX, paddleY, canvasW, canvasH, paddle) {
    this._glowPhase += dt * 0.006;

    if (this.slowPowerup) {
      this.slowPowerupTime -= dt;
      if (this.slowPowerupTime <= 0) {
        this.slowPowerup = false;
        this._normalise();
      }
    }

    if (this.stuck) {
      this.x = paddle.x + paddle.width / 2;
      this.y = paddle.y - this.radius - 1;
      return;
    }

    const steps = 2;
    const dx = this.vx * dt / 16 / steps;
    const dy = this.vy * dt / 16 / steps;

    for (let s = 0; s < steps; s++) {
      this.x += dx;
      this.y += dy;

      if (this.x - this.radius < 0) {
        this.x  = this.radius;
        this.vx = Math.abs(this.vx);
      }
      if (this.x + this.radius > canvasW) {
        this.x  = canvasW - this.radius;
        this.vx = -Math.abs(this.vx);
      }
      if (this.y - this.radius < 0) {
        this.y  = this.radius;
        this.vy = Math.abs(this.vy);
      }
    }

    this._trail.push({ x: this.x, y: this.y });
    if (this._trail.length > this._trailMax) this._trail.shift();
  }

  checkPaddle(paddle, audio) {
    if (this.stuck) return false;
    const px = paddle.x, py = paddle.y, pw = paddle.width, ph = paddle.height;
    if (this.x + this.radius > px && this.x - this.radius < px + pw &&
        this.y + this.radius > py && this.y - this.radius < py + ph &&
        this.vy > 0) {
      const frac  = paddle.getHitFraction(this.x);
      const angle = (frac - 0.5) * 150;
      const rad   = angle * Math.PI / 180;
      const sp    = this.speed;
      this.vx = Math.sin(rad) * sp;
      this.vy = -Math.abs(Math.cos(rad) * sp);
      this.y  = py - this.radius - 1;
      audio.play('bounce');
      return true;
    }
    return false;
  }

  isLost(canvasH) {
    return this.y - this.radius > canvasH;
  }

  draw(ctx) {
    
    for (let i = 0; i < this._trail.length; i++) {
      const t     = i / this._trail.length;
      const alpha = t * 0.5;
      const r     = this.radius * (0.3 + t * 0.5);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(this._trail[i].x, this._trail[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${185 + t * 30}, 100%, 70%)`;
      ctx.fill();
      ctx.restore();
    }

    const glow = Math.sin(this._glowPhase) * 0.3 + 0.7;

    ctx.save();
    ctx.shadowBlur  = 20 * glow;
    ctx.shadowColor = '#00f5ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius + 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,245,255,${0.2 * glow})`;
    ctx.fill();
    ctx.restore();

    const grad = ctx.createRadialGradient(
      this.x - this.radius * 0.3, this.y - this.radius * 0.3, 1,
      this.x, this.y, this.radius
    );
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.5, '#00f5ff');
    grad.addColorStop(1, '#005577');
    ctx.save();
    ctx.shadowBlur  = 12 * glow;
    ctx.shadowColor = '#00f5ff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}