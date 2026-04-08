import { APP }      from './main.js';
import { Paddle }   from './paddle.js';
import { Ball }     from './ball.js';
import { Bricks }   from './bricks.js';
import { Powerups } from './powerups.js';
import { LEVELS, TOTAL_LEVELS } from './levels.js';

const LIVES_START = 3;



const DIFF = {
  easy: {
    lives:          4,       
    speedMult:      0.72,    
    paddleMult:     1.30,    
    powerupMult:    1.8,     
    accelInterval:  22000,   
    accelStep:      0.4,     
    accelMax:       2.5,     
    patternKey:     'easy',
  },
  normal: {
    lives:          3,
    speedMult:      1.00,
    paddleMult:     1.00,
    powerupMult:    1.0,
    accelInterval:  15000,   
    accelStep:      0.5,
    accelMax:       4.0,
    patternKey:     'normal',
  },
  hard: {
    lives:          2,       
    speedMult:      1.35,    
    paddleMult:     0.72,    
    powerupMult:    0.55,    
    accelInterval:  10000,   
    accelStep:      0.6,     
    accelMax:       5.0,     
    patternKey:     'hard',
  },
};

export class Game {
  constructor(controls, audio) {
    this.controls  = controls;
    this.audio     = audio;
    this.ui        = null;
    this.canvas    = document.getElementById('gameCanvas');
    this.ctx       = this.canvas.getContext('2d');
    this._raf      = null;
    this._running  = false;
    this._paused   = false;
    this._lastTime = 0;
    this._state    = 'idle';
    this._stars    = [];
    this._initStars(120);
  }

  setUI(ui) { this.ui = ui; }

  
  start() {
    this._resize();
    this.level = 1;
    this.score = 0;
    
    const diff = DIFF[APP.difficulty] || DIFF.normal;
    this.lives = diff.lives;
    this._loadLevel(this.level);
    this.controls.attach(this.canvas);
    this._running  = true;
    this._paused   = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    this._lastTime = performance.now();
    this._raf = requestAnimationFrame(t => this._loop(t));

    this._launchHandler = () => this._launchBall();
    this.canvas.addEventListener('click', this._launchHandler);
    this.canvas.addEventListener('touchstart', this._launchHandler, { passive: true });

    this._resizeHandler = () => {
      
      this._resize();
      if (this._state === 'playing') this._rebuildLayout();
    };
    window.addEventListener('resize', this._resizeHandler);
  }

  stop() {
    this._running = false;
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
    this.controls.detach();
    this._removeLaunchListeners();
    if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
  }

  pause()  { this._paused = true; }
  resume() { this._paused = false; this._lastTime = performance.now(); }

  
  _resize() {
    const hudH = document.getElementById('game-hud').offsetHeight + 28;
    const maxW = Math.min(640, window.innerWidth - 16);
    const maxH = Math.min(window.innerHeight - hudH - 8, maxW * 1.4);
    this.canvas.width  = Math.floor(maxW);
    this.canvas.height = Math.floor(maxH);
    this._initStars(120);
  }

  
  _rebuildLayout() {
    const W    = this.canvas.width;
    const H    = this.canvas.height;
    const diff = DIFF[APP.difficulty] || DIFF.normal;
    if (this.paddle) {
      this.paddle.cW = W;
      this.paddle.y  = H - 30;
      this.paddle.x  = Math.min(this.paddle.x, W - this.paddle.width);
    }
    if (this.bricksMgr) {
      this.bricksMgr.cW = W;
      this.bricksMgr.cH = H;
      const cfg     = LEVELS[this.level - 1];
      const pattern = cfg.patterns[diff.patternKey] || cfg.patterns.normal;
      this.bricksMgr.init(pattern);
    }
  }

  
  _loadLevel(lvl) {
    const cfg  = LEVELS[lvl - 1];
    const diff = DIFF[APP.difficulty] || DIFF.normal;
    const W    = this.canvas.width;
    const H    = this.canvas.height;

    this.paddle = new Paddle(W, H);
    this.paddle.reset(W, cfg.paddleWidth * diff.paddleMult, cfg.paddleSpeed);

    this._baseSpeed    = cfg.ballSpeed * diff.speedMult;
    this._speedMult    = 1.0;
    this._accelTimer   = 0;
    this._accelInterval= diff.accelInterval;
    this._accelStep    = diff.accelStep;
    this._accelMax     = diff.accelMax;
    this._powerupMult  = diff.powerupMult;

    this.balls = [new Ball(W / 2, this.paddle.y - 10, this._baseSpeed)];

    
    const pattern = cfg.patterns[diff.patternKey] || cfg.patterns.normal;
    this.bricksMgr  = new Bricks(W, H);
    this.bricksMgr.init(pattern);

    this.powerupMgr      = new Powerups();
    this._currentCfg     = cfg;
    this._levelStartTime = performance.now();

    this._setState('playing');
    if (this.ui) {
      this.ui.hideOverlay();
      this.ui.updateHUD(this.score, this.lives, this.level, this._speedMult);
      this.ui.showOverlay(`LEVEL ${lvl}`, cfg.name + ' — CLICK TO LAUNCH', '', null);
      setTimeout(() => { if (this.ui) this.ui.hideOverlay(); }, 2200);
    }
  }

  _launchBall() {
    for (const b of this.balls) {
      if (b.stuck) { b.launch(); break; }
    }
  }

  _removeLaunchListeners() {
    if (this._launchHandler) {
      this.canvas.removeEventListener('click', this._launchHandler);
      this.canvas.removeEventListener('touchstart', this._launchHandler);
    }
  }

  _setState(s) { this._state = s; }

  
  _loop(timestamp) {
    if (!this._running) return;
    const dt = Math.min(timestamp - this._lastTime, 50);
    this._lastTime = timestamp;
    if (!this._paused) {
      this._update(dt);
      this._render();
    }
    this._raf = requestAnimationFrame(t => this._loop(t));
  }

  
  _update(dt) {
    if (this._state !== 'playing') return;

    const W = this.canvas.width;
    const H = this.canvas.height;

    
    this._accelTimer += dt;
    if (this._accelTimer >= this._accelInterval) {
      this._accelTimer -= this._accelInterval;
      this._speedMult   = Math.min(this._speedMult + this._accelStep, this._accelMax);
      for (const b of this.balls) {
        b._baseSpeed = this._baseSpeed * this._speedMult;
        b._normalise();
      }
      if (this.ui && this._speedMult > 1) {
        this.ui.showPowerupIndicator(`🔥 SPEED ${this._speedMult.toFixed(1)}x`);
        setTimeout(() => { if (this.ui) this.ui.hidePowerupIndicator(); }, 2000);
      }
    }

    
    this.paddle.update(dt, this.controls);

    
    for (const ball of this.balls) {
      ball.update(dt, 0, 0, W, H, this.paddle);
      ball.checkPaddle(this.paddle, this.audio);
    }

    
    const aliveBalls = this.balls.filter(b => !b.isLost(H));
    if (aliveBalls.length === 0) {
      this._onDeath();
      return;
    }
    this.balls = aliveBalls;

    
    const brickScore = this.bricksMgr.checkBalls(this.balls, this.audio, brick => {
      this.powerupMgr.spawn(
        brick.x + brick.w / 2,
        brick.y + brick.h / 2,
        this._currentCfg.powerupChance * this._powerupMult * 1.5
      );
    });

    if (brickScore > 0) {
      this.score += brickScore;
      const dead = this.bricksMgr.bricks.find(b => !b.alive && !b._spawned);
      if (dead && Math.random() < this._currentCfg.powerupChance * this._powerupMult) {
        dead._spawned = true;
        this.powerupMgr.spawn(dead.x + dead.w / 2, dead.y + dead.h / 2, 1);
      }
    }

    
    this.powerupMgr.update(dt, this.paddle, this.balls, this.audio, this.ui, () => {
      this.lives = Math.min(this.lives + 1, 5);
      if (this.ui) this.ui.updateHUD(this.score, this.lives, this.level, this._speedMult);
    }, H);

    this.score += this.powerupMgr.checkLasers(this.bricksMgr, this.audio);

    
    this.bricksMgr.update(dt);

    
    if (this.ui) this.ui.updateHUD(this.score, this.lives, this.level, this._speedMult);

    
    if (this.bricksMgr.remaining() === 0) this._onLevelClear();
  }

  _onDeath() {
    this.lives--;
    this.audio.play('death');
    if (this.lives <= 0) {
      this._onGameOver();
    } else {
      if (this.ui) this.ui.updateHUD(this.score, this.lives, this.level, this._speedMult);
      
      const respawnSpeed = this._baseSpeed * this._speedMult;
      this.balls = [new Ball(
        this.paddle.x + this.paddle.width / 2,
        this.paddle.y - 10,
        respawnSpeed
      )];
      if (this.ui) this.ui.showOverlay(
        'BALL LOST',
        `${this.lives} LIVE${this.lives !== 1 ? 'S' : ''} REMAINING — CLICK TO LAUNCH`,
        '', null
      );
      setTimeout(() => { if (this.ui) this.ui.hideOverlay(); }, 1800);
    }
  }

  _onLevelClear() {
    const elapsed = (performance.now() - this._levelStartTime) / 1000;
    const bonus   = Math.max(0, Math.floor((60 - elapsed) * 10));
    this.score   += bonus;
    this.audio.play('levelup');
    this._setState('levelup');

    if (this.level >= TOTAL_LEVELS) {
      setTimeout(() => this._onVictory(), 1200);
    } else {
      if (this.ui) this.ui.showOverlay('LEVEL CLEAR!', `BONUS +${bonus} — LOADING NEXT SECTOR...`, '', null);
      setTimeout(() => { this.level++; this._loadLevel(this.level); }, 2200);
    }
  }

  _onGameOver() {
    this._setState('gameover');
    this.audio.play('gameover');
    this.stop();
    setTimeout(() => { if (this.ui) this.ui.showGameOver(this.score); }, 600);
  }

  _onVictory() {
    this._setState('victory');
    this.audio.play('victory');
    this.stop();
    setTimeout(() => { if (this.ui) this.ui.showVictory(this.score); }, 800);
  }

  
  _render() {
    const ctx   = this.ctx;
    const W     = this.canvas.width;
    const H     = this.canvas.height;
    const shake = this.bricksMgr ? this.bricksMgr.getShakeOffset() : { x: 0, y: 0 };

    ctx.save();
    ctx.translate(shake.x, shake.y);

    ctx.fillStyle = '#050510';
    ctx.fillRect(-2, -2, W + 4, H + 4);

    this._drawStars(ctx);
    this._drawGrid(ctx, W, H);

    if (this.bricksMgr)  this.bricksMgr.draw(ctx);
    if (this.powerupMgr) this.powerupMgr.draw(ctx);
    for (const b of this.balls) b.draw(ctx);
    if (this.paddle) this.paddle.draw(ctx);

    
    ctx.save();
    ctx.strokeStyle = 'rgba(0,245,255,0.15)';
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(0, H - 2); ctx.lineTo(W, H - 2);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  _drawGrid(ctx, W, H) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth   = 1;
    for (let x = 0; x <= W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  _initStars(n) {
    this._stars = [];
    const W = this.canvas.width;
    const H = this.canvas.height;
    for (let i = 0; i < n; i++) {
      this._stars.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.2,
        a:     Math.random(),
        phase: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
      });
    }
  }

  _drawStars(ctx) {
    for (const s of this._stars) {
      s.phase += s.speed;
      ctx.save();
      ctx.globalAlpha = (Math.sin(s.phase) * 0.4 + 0.6) * s.a * 0.5;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}