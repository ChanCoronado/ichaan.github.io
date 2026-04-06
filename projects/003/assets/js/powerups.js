import { Ball } from './ball.js';

const POWERUP_TYPES = [
  { id: 'wide',  color: '#00ff88', glow: '#00ff88' },
  { id: 'slow',  color: '#00aaff', glow: '#00aaff' },
  { id: 'multi', color: '#ff00cc', glow: '#ff00cc' },
  { id: 'laser', color: '#ffee00', glow: '#ffee00' },
  { id: 'life',  color: '#ff4444', glow: '#ff4444' },
];

export class Powerups {
  constructor() {
    this.drops         = [];
    this.lasers        = [];
    this.laserActive   = false;
    this.laserTime     = 0;
    this._fireInterval = null;
    this._size         = 30;
    this._speed        = 1.8;
  }

  spawn(brickCx, brickCy, chance) {
    if (Math.random() > chance) return;
    const def = POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)];
    this.drops.push({
      x: brickCx, y: brickCy,
      type:  def.id,
      color: def.color,
      glow:  def.glow,
      phase: Math.random() * Math.PI * 2,
    });
  }

  fireLasers(paddle) {
    this.lasers.push({ x: paddle.x + 6,                y: paddle.y, vy: -12 });
    this.lasers.push({ x: paddle.x + paddle.width - 6, y: paddle.y, vy: -12 });
  }

  applyLaser(paddle) {
    this.laserActive = true;
    this.laserTime   = 7000;
    if (this._fireInterval) clearInterval(this._fireInterval);
    this._fireInterval = setInterval(() => {
      if (this.laserActive) this.fireLasers(paddle);
    }, 350);
  }

  stopLaser() {
    this.laserActive = false;
    clearInterval(this._fireInterval);
    this._fireInterval = null;
  }

  update(dt, paddle, balls, audio, ui, onExtraLife, canvasH) {
    const s   = this._size;
    const spd = this._speed * (dt / 16);

    // Laser timer
    if (this.laserActive) {
      this.laserTime -= dt;
      if (this.laserTime <= 0) this.stopLaser();
    }

    for (const l of this.lasers) l.y += l.vy * (dt / 16);
    this.lasers = this.lasers.filter(l => l.y > -30);

    // Move drops
    for (const d of this.drops) {
      d.y    += spd;
      d.phase += 0.04;
    }

    // Paddle collision 
    const collected = [];
    for (const d of this.drops) {
      const withinX = d.x > paddle.x - s / 2 && d.x < paddle.x + paddle.width + s / 2;
      const withinY = d.y + s / 2 > paddle.y  && d.y - s / 2 < paddle.y + paddle.height;
      if (withinX && withinY) {
        collected.push(d);
        audio.play('powerup');
        this._apply(d.type, paddle, balls, ui, onExtraLife);
      }
    }

    const maxY = (canvasH || 900) + s + 10;
    this.drops = this.drops.filter(d => !collected.includes(d) && d.y < maxY);
  }

  _apply(type, paddle, balls, ui, onExtraLife) {
    switch (type) {
      case 'wide':
        paddle.applyWide();
        if (ui) { ui.showPowerupIndicator('↔ WIDE PADDLE'); setTimeout(() => ui.hidePowerupIndicator(), 10000); }
        break;
      case 'slow':
        for (const b of balls) b.applySlow();
        if (ui) { ui.showPowerupIndicator('❄ SLOW BALL'); setTimeout(() => ui.hidePowerupIndicator(), 8000); }
        break;
      case 'multi': {
        const src = balls.find(b => !b.stuck);
        if (src) {
          for (let i = 0; i < 2; i++) {
            const nb  = new Ball(src.x, src.y, src._baseSpeed);
            nb.stuck  = false;
            const ang = (Math.random() * 120 - 60) * Math.PI / 180;
            nb.vx     = Math.sin(ang) * src._baseSpeed;
            nb.vy     = -Math.abs(Math.cos(ang) * src._baseSpeed);
            balls.push(nb);
          }
        }
        if (ui) { ui.showPowerupIndicator('⊕ MULTI-BALL'); setTimeout(() => ui.hidePowerupIndicator(), 2500); }
        break;
      }
      case 'laser':
        this.applyLaser(paddle);
        if (ui) { ui.showPowerupIndicator('⚡ LASER PADDLE'); setTimeout(() => ui.hidePowerupIndicator(), 7000); }
        break;
      case 'life':
        if (onExtraLife) onExtraLife();
        if (ui) { ui.showPowerupIndicator('♥ EXTRA LIFE!'); setTimeout(() => ui.hidePowerupIndicator(), 2500); }
        break;
    }
  }

  checkLasers(bricks, audio) {
    let scored = 0;
    for (const laser of this.lasers) {
      for (const brick of bricks.bricks) {
        if (!brick.alive) continue;
        if (laser.x > brick.x && laser.x < brick.x + brick.w &&
            laser.y > brick.y && laser.y < brick.y + brick.h) {
          brick.hp--;
          if (brick.hp <= 0) {
            brick.alive = false;
            bricks.spawnParticles(brick);
            scored += { 1: 10, 2: 20, 3: 30 }[brick.type] || 0;
            audio.play('brick');
          }
          laser.y = -100;
          break;
        }
      }
    }
    return scored;
  }

  draw(ctx) {
    const s = this._size;

    for (const d of this.drops) {
      const bob = Math.sin(d.phase) * 3;
      const cx  = d.x;
      const cy  = d.y + bob;

      ctx.save();
      ctx.shadowBlur  = 20;
      ctx.shadowColor = d.glow;

      // Border box
      ctx.strokeStyle = d.color;
      ctx.lineWidth   = 2;
      ctx.beginPath();
      ctx.roundRect(cx - s / 2, cy - s / 2, s, s, 5);
      ctx.stroke();

      // Fill
      ctx.globalAlpha = 0.22;
      ctx.fillStyle   = d.color;
      ctx.fill();
      ctx.globalAlpha = 1;

      // Icon
      ctx.fillStyle  = d.color;
      ctx.strokeStyle= d.color;
      ctx.lineWidth  = 2;
      ctx.lineCap    = 'round';
      ctx.lineJoin   = 'round';

      switch (d.type) {

        case 'wide': {
        
          const aw = 9, ah = 3.5;
          ctx.beginPath();
         
          ctx.moveTo(cx - 2, cy); ctx.lineTo(cx - aw, cy);
          
          ctx.moveTo(cx - aw + 3, cy - ah); ctx.lineTo(cx - aw, cy); ctx.lineTo(cx - aw + 3, cy + ah);
          
          ctx.moveTo(cx + 2, cy); ctx.lineTo(cx + aw, cy);
         
          ctx.moveTo(cx + aw - 3, cy - ah); ctx.lineTo(cx + aw, cy); ctx.lineTo(cx + aw - 3, cy + ah);
          ctx.stroke();
          break;
        }

        case 'slow': {
          // Snowflake — 6 spokes with cross ticks
          const r1 = 9, r2 = 4.5;
          for (let i = 0; i < 6; i++) {
            const a = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
            ctx.stroke();
            const mx = cx + Math.cos(a) * r2;
            const my = cy + Math.sin(a) * r2;
            const pa = a + Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(mx + Math.cos(pa) * 2.5, my + Math.sin(pa) * 2.5);
            ctx.lineTo(mx - Math.cos(pa) * 2.5, my - Math.sin(pa) * 2.5);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(cx, cy, 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'multi': {
          // Three circles in a triangle
          const positions = [
            { x: cx,     y: cy - 6.5 },
            { x: cx - 6, y: cy + 4   },
            { x: cx + 6, y: cy + 4   },
          ];
          for (const p of positions) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
            ctx.globalAlpha = 0.45;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.stroke();
          }
          break;
        }

        case 'laser': {
          // Lightning bolt, centred
          ctx.beginPath();
          ctx.moveTo(cx + 3,  cy - 9);
          ctx.lineTo(cx - 2,  cy - 1);
          ctx.lineTo(cx + 2,  cy - 1);
          ctx.lineTo(cx - 3,  cy + 9);
          ctx.lineTo(cx + 1,  cy + 1);
          ctx.lineTo(cx - 2,  cy + 1);
          ctx.closePath();
          ctx.globalAlpha = 0.5;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.stroke();
          break;
        }

        case 'life': {
          // Heart — properly centred in the box
          const hw   = 7;
          const hOff = hw * 0.55; 
          const hx   = cx;
          const hy   = cy - hOff;

          ctx.beginPath();
          ctx.moveTo(hx, hy + hw * 0.35);
          ctx.bezierCurveTo(hx,        hy - hw * 0.25, hx - hw, hy - hw * 0.25, hx - hw, hy + hw * 0.2);
          ctx.bezierCurveTo(hx - hw,   hy + hw * 0.75, hx,      hy + hw * 1.05, hx,      hy + hw * 1.35);
          ctx.bezierCurveTo(hx,        hy + hw * 1.05, hx + hw, hy + hw * 0.75, hx + hw, hy + hw * 0.2);
          ctx.bezierCurveTo(hx + hw,   hy - hw * 0.25, hx,      hy - hw * 0.25, hx,      hy + hw * 0.35);
          ctx.closePath();
          ctx.globalAlpha = 0.55;
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.stroke();
          break;
        }
      }

      ctx.restore();
    }

    // Laser bolts
    for (const l of this.lasers) {
      ctx.save();
      ctx.shadowBlur  = 14;
      ctx.shadowColor = '#ffee00';
      ctx.strokeStyle = '#ffee00';
      ctx.lineWidth   = 3;
      ctx.beginPath();
      ctx.moveTo(l.x, l.y);
      ctx.lineTo(l.x, l.y + 18);
      ctx.stroke();
      ctx.restore();
    }
  }
}