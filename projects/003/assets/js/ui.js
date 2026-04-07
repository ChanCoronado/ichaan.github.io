import { APP, saveHighScore } from './main.js';

export class UI {
  constructor(game, audio) {
    this.game  = game;
    this.audio = audio;
    
    this.$screens = {
      start:    document.getElementById('screen-start'),
      settings: document.getElementById('screen-settings'),
      hiscores: document.getElementById('screen-hiscores'),
      game:     document.getElementById('screen-game'),
      gameover: document.getElementById('screen-gameover'),
      victory:  document.getElementById('screen-victory'),
    };
    this.$pause = document.getElementById('screen-pause');
    
    this.$score  = document.getElementById('hud-score');
    this.$level  = document.getElementById('hud-level');
    this.$lives  = document.getElementById('hud-lives');
    this.$pwrInd = document.getElementById('powerup-indicator');
    
    this.$overlay     = document.getElementById('canvas-overlay');
    this.$overlayTitle= document.getElementById('overlay-title');
    this.$overlaySub  = document.getElementById('overlay-sub');
    this.$overlayBtn  = document.getElementById('overlay-btn');
  }

  init() {
    this._bindMenuButtons();
    this._bindPauseButtons();
    this._bindEndButtons();
    this._bindSettings();
    this.showScreen('start');
  }

  
  showScreen(name) {
    Object.values(this.$screens).forEach(s => s.classList.remove('active'));
    const s = this.$screens[name];
    if (s) { s.classList.add('active'); }
  }

  
  _bindMenuButtons() {
    document.getElementById('btn-start').addEventListener('click', () => {
      this.audio.play('click');
      this.startGame();
    });
    document.getElementById('btn-settings').addEventListener('click', () => {
      this.audio.play('click');
      this.showScreen('settings');
    });
    document.getElementById('btn-hiscores').addEventListener('click', () => {
      this.audio.play('click');
      this._renderHiScores();
      this.showScreen('hiscores');
    });
    document.getElementById('btn-settings-back').addEventListener('click', () => {
      this.audio.play('click');
      this.showScreen('start');
    });
    document.getElementById('btn-hiscores-back').addEventListener('click', () => {
      this.audio.play('click');
      this.showScreen('start');
    });
  }

  _bindPauseButtons() {
    document.getElementById('btn-resume').addEventListener('click', () => {
      this.hidePause();
      this.game.resume();
    });
    document.getElementById('btn-restart').addEventListener('click', () => {
      this.hidePause();
      this.startGame();
    });
    document.getElementById('btn-exit-pause').addEventListener('click', () => {
      this.hidePause();
      this.game.stop();
      this.showScreen('start');
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (this.$screens.game.classList.contains('active')) {
          if (this.$pause.classList.contains('hidden')) {
            this.showPause();
            this.game.pause();
          } else {
            this.hidePause();
            this.game.resume();
          }
        }
      }
    });
  }

  _bindEndButtons() {
    document.getElementById('btn-go-restart').addEventListener('click', () => {
      this.audio.play('click');
      this.startGame();
    });
    document.getElementById('btn-go-menu').addEventListener('click', () => {
      this.audio.play('click');
      this.showScreen('start');
    });
    document.getElementById('btn-vic-restart').addEventListener('click', () => {
      this.audio.play('click');
      this.startGame();
    });
    document.getElementById('btn-vic-menu').addEventListener('click', () => {
      this.audio.play('click');
      this.showScreen('start');
    });
  }

  _bindSettings() {
    document.querySelectorAll('input[name=ctrl]').forEach(r => {
      r.addEventListener('change', () => { APP.controlMethod = r.value; });
    });
    document.querySelectorAll('input[name=diff]').forEach(r => {
      r.addEventListener('change', () => { APP.difficulty = r.value; });
    });
    const soundToggle = document.getElementById('sound-toggle');
    soundToggle.addEventListener('change', () => {
      APP.soundEnabled = soundToggle.checked;
      this.audio.setEnabled(APP.soundEnabled);
    });
  }

  
  startGame() {
    this.showScreen('game');
    this.hideOverlay();
    this.$pause.classList.add('hidden');
    this.game.start();
  }

  showPause()  { this.$pause.classList.remove('hidden'); }
  hidePause()  { this.$pause.classList.add('hidden'); }

  
  updateHUD(score, lives, level, speedMult) {
    this.$score.textContent = score;
    this.$level.textContent = level + (speedMult && speedMult > 1 ? ` ×${speedMult}` : '');
    this.$lives.textContent = '❤ '.repeat(lives).trim() || '☠';
  }

  showPowerupIndicator(text) {
    this.$pwrInd.textContent = text;
    this.$pwrInd.classList.remove('hidden');
  }
  hidePowerupIndicator() {
    this.$pwrInd.classList.add('hidden');
  }

  
  showOverlay(title, sub, btnLabel, btnCb) {
    this.$overlayTitle.textContent = title;
    this.$overlaySub.textContent = sub;
    this.$overlayBtn.textContent = btnLabel;
    this.$overlayBtn.style.display = btnLabel ? '' : 'none';
    this.$overlay.classList.remove('hidden');
    this._overlayBtnCb = btnCb;
    this.$overlayBtn.onclick = () => { if(this._overlayBtnCb) this._overlayBtnCb(); };
  }
  hideOverlay() {
    this.$overlay.classList.add('hidden');
  }

  
  showGameOver(score) {
    saveHighScore(score);
    document.getElementById('go-score').textContent = score;
    const best = APP.highScores[0] || 0;
    document.getElementById('go-hi').textContent = score >= best ? '★ NEW HIGH SCORE!' : `BEST: ${best}`;
    this.showScreen('gameover');
  }

  showVictory(score) {
    saveHighScore(score);
    document.getElementById('vic-score').textContent = score;
    const best = APP.highScores[0] || 0;
    document.getElementById('vic-hi').textContent = score >= best ? '★ NEW HIGH SCORE!' : `BEST: ${best}`;
    this.showScreen('victory');
  }

  _renderHiScores() {
    const el = document.getElementById('hiscore-list');
    if (!APP.highScores.length) {
      el.innerHTML = '<div class="hiscore-empty">NO SCORES YET</div>';
      return;
    }
    el.innerHTML = APP.highScores.slice(0,10).map((s,i) =>
      `<div class="hiscore-row">
        <span class="hs-rank">#${i+1}</span>
        <span class="hs-score">${s}</span>
      </div>`
    ).join('');
  }
}