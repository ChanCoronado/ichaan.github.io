export const BRICK_NORMAL    = 1;
export const BRICK_STRONG    = 2;
export const BRICK_EXPLOSIVE = 3;

const BRICK_COLORS = {
  1: ['#00f5ff', '#0088aa'],
  2: ['#ff6600', '#882200'],
  3: ['#ff00cc', '#880066'],
};


export const BRICK_POINTS = { 1: 10, 2: 20, 3: 30 };
export const BRICK_HP     = { 1: 1,  2: 2,  3: 1  };

export class Bricks {
  constructor(canvasW, canvasH) {
    this.cW        = canvasW;
    this.cH        = canvasH;
    this.cols      = 10;
    this.padding   = 6;
    this.topOffset = 55;
    this.bricks    = [];
    this.particles = [];
    this.shakeTime = 0;
    this.shakeAmt  = 0;
  }

  init(pattern) {
    const rows   = pattern.length;
    const brickW = (this.cW - this.padding * (this.cols + 1)) / this.cols;
    const brickH = 18;
    this.brickW  = brickW;
    this.brickH  = brickH;
    this.bricks  = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const type = pattern[r][c];
        if (!type) continue;
        this.bricks.push({
          x:     this.padding + c * (brickW + this.padding),
          y:     this.topOffset + r * (brickH + this.padding),
          w:     brickW,
          h:     brickH,
          type,
          hp:    BRICK_HP[type],
          alive: true,
          hit:   0,
        });
      }
    }
  }

  remaining() { return this.bricks.filter(b => b.alive).length; }

  spawnParticles(brick) { this._spawnParticles(brick); }
  checkBalls(balls, audio, onExplosion) {
    let scored = 0;

    for (const ball of balls) {
      if (ball.stuck) continue;

      for (const brick of this.bricks) {
        if (!brick.alive) continue;
        if (!this._overlap(ball, brick)) continue;

        this._bounceOff(ball, brick);
        brick.hp--;
        brick.hit = 200;

        if (brick.hp <= 0) {
          brick.alive = false;
          scored += BRICK_POINTS[brick.type];
          this._spawnParticles(brick);
          audio.play(brick.type === BRICK_EXPLOSIVE ? 'explode'
                   : brick.type === BRICK_STRONG    ? 'strong'
                   : 'brick');

          if (brick.type === BRICK_EXPLOSIVE) {
            scored += this._explode(brick);
            this.shakeTime = 400;
            this.shakeAmt  = 6;
            if (onExplosion) onExplosion(brick);
          }
        }

        break; 
      }
    }

    return scored;
  }

  _overlap(ball, brick) {
    return ball.x + ball.radius > brick.x &&
           ball.x - ball.radius < brick.x + brick.w &&
           ball.y + ball.radius > brick.y &&
           ball.y - ball.radius < brick.y + brick.h;
  }

  _bounceOff(ball, brick) {
    const overlapLeft   = (ball.x + ball.radius) - brick.x;
    const overlapRight  = (brick.x + brick.w) - (ball.x - ball.radius);
    const overlapTop    = (ball.y + ball.radius) - brick.y;
    const overlapBottom = (brick.y + brick.h) - (ball.y - ball.radius);
    const minH = Math.min(overlapLeft, overlapRight);
    const minV = Math.min(overlapTop,  overlapBottom);
    if (minH < minV) {
      ball.vx = overlapLeft < overlapRight ? -Math.abs(ball.vx) : Math.abs(ball.vx);
    } else {
      ball.vy = overlapTop  < overlapBottom? -Math.abs(ball.vy) : Math.abs(ball.vy);
    }
  }

  _explode(srcBrick) {
    let extraScore = 0;
    const tolerance = this.brickW + this.brickH;
    for (const b of this.bricks) {
      if (!b.alive || b === srcBrick) continue;
      const dx = Math.abs((b.x + b.w / 2) - (srcBrick.x + srcBrick.w / 2));
      const dy = Math.abs((b.y + b.h / 2) - (srcBrick.y + srcBrick.h / 2));
      if (dx < tolerance && dy < tolerance) {
        b.alive = false;
        this._spawnParticles(b);
        extraScore += BRICK_POINTS[b.type] || 0;
      }
    }
    return extraScore;
  }

  _spawnParticles(brick) {
    const cx     = brick.x + brick.w / 2;
    const cy     = brick.y + brick.h / 2;
    const colors = BRICK_COLORS[brick.type];
    const count  = brick.type === BRICK_EXPLOSIVE ? 24 : 12;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4;
      this.particles.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life:  1,
        decay: 0.018 + Math.random() * 0.025,
        size:  2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  update(dt) {
    if (this.shakeTime > 0) { this.shakeTime -= dt; }
    else                    { this.shakeAmt   = 0;  }

    for (const b of this.bricks) {
      if (b.hit > 0) b.hit -= dt;
    }

    for (const p of this.particles) {
      p.x    += p.vx;
      p.y    += p.vy;
      p.vy   += 0.12;
      p.life -= p.decay;
    }
    this.particles = this.particles.filter(p => p.life > 0);
  }

  getShakeOffset() {
    if (this.shakeAmt <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeAmt * 2,
      y: (Math.random() - 0.5) * this.shakeAmt * 2,
    };
  }

  draw(ctx) {
    for (const brick of this.bricks) {
      if (!brick.alive) continue;
      const colors = BRICK_COLORS[brick.type];
      const flash  = brick.hit > 0 ? Math.sin(brick.hit * 0.08) * 0.5 + 0.5 : 0;

      ctx.save();
      ctx.shadowBlur  = flash > 0 ? 20 : 8;
      ctx.shadowColor = flash > 0 ? '#ffffff' : colors[0];

      const grad = ctx.createLinearGradient(brick.x, brick.y, brick.x, brick.y + brick.h);
      grad.addColorStop(0, flash > 0.5 ? '#ffffff' : colors[0]);
      grad.addColorStop(1, colors[1]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      this._roundRect(ctx, brick.x, brick.y, brick.w, brick.h, 4);
      ctx.fill();

      ctx.globalAlpha = 0.35;
      ctx.fillStyle   = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      this._roundRect(ctx, brick.x + 3, brick.y + 2, brick.w - 6, 4, 2);
      ctx.fill();

      if (brick.type === BRICK_STRONG && brick.hp === 2) {
        ctx.globalAlpha = 1;
        ctx.fillStyle   = 'rgba(255,255,255,0.7)';
        ctx.font        = '9px monospace';
        ctx.textAlign   = 'center';
        ctx.fillText('II', brick.x + brick.w / 2, brick.y + brick.h - 4);
      }

      ctx.restore();
    }

    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = p.color;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  _roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y,     x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h,     x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y,         x + r, y);
    ctx.closePath();
  }
}