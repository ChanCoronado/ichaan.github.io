import { APP } from './main.js';

export class Controls {
  constructor() {
    this._mouseX = 0;
    this._left   = false;
    this._right  = false;
    this._touch  = 0;
    this._canvas = null;
    this._active = false;

    
    document.addEventListener('mousemove', e => {
      if (!this._active || APP.controlMethod !== 'mouse') return;
      const rect = this._canvas?.getBoundingClientRect();
      if (rect) this._mouseX = e.clientX - rect.left;
    });

    
    document.addEventListener('keydown', e => {
      if (!this._active) return;
      if (APP.controlMethod === 'keys') {
        if (e.key === 'ArrowLeft')  this._left  = true;
        if (e.key === 'ArrowRight') this._right = true;
      }
      if (APP.controlMethod === 'ad') {
        if (e.key === 'a' || e.key === 'A') this._left  = true;
        if (e.key === 'd' || e.key === 'D') this._right = true;
      }
    });

    
    document.addEventListener('keyup', e => {
      if (e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') this._left  = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this._right = false;
    });

    
    document.addEventListener('touchmove', e => {
      if (!this._active || APP.controlMethod !== 'touch') return;
      const rect = this._canvas?.getBoundingClientRect();
      if (rect) this._touch = e.touches[0].clientX - rect.left;
      e.preventDefault();
    }, { passive: false });

    
    document.addEventListener('touchstart', e => {
      if (!this._active || APP.controlMethod !== 'touch') return;
      const rect = this._canvas?.getBoundingClientRect();
      if (rect) this._touch = e.touches[0].clientX - rect.left;
    }, { passive: true });
  }

  attach(canvas) {
    this._canvas = canvas;
    this._active = true;
    
    this._left  = false;
    this._right = false;
  }

  detach() {
    this._active = false;
    
    this._left  = false;
    this._right = false;
  }

  getPositionX() {
    if (APP.controlMethod === 'mouse') return this._mouseX;
    if (APP.controlMethod === 'touch') return this._touch;
    return null;
  }

  isLeft()  { return this._left; }
  isRight() { return this._right; }
}