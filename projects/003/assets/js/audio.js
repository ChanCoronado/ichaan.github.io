export class Audio {
  constructor() {
    this._enabled = true;
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
      this._ctx = null;
    }
  }

  setEnabled(v) { this._enabled = v; }

  play(type) {
    if (!this._enabled || !this._ctx) return;
    
    if (this._ctx.state === 'suspended') this._ctx.resume();

    switch(type) {
      case 'bounce':    this._tone(440, 0.06, 'square',   0.04); break;
      case 'brick':     this._tone(200, 0.12, 'sawtooth', 0.08); break;
      case 'strong':    this._tone(280, 0.15, 'sawtooth', 0.10); break;
      case 'explode':   this._noise(0.18, 0.25); break;
      case 'powerup':   this._arpeggio([523,659,784,1047], 0.07, 0.08); break;
      case 'death':     this._tone(120, 0.4, 'sawtooth', 0.3, true); break;
      case 'levelup':   this._arpeggio([523,659,784,1047,1319], 0.1, 0.1); break;
      case 'click':     this._tone(600, 0.04, 'square', 0.03); break;
      case 'gameover':  this._arpeggio([400,350,300,200], 0.15, 0.18); break;
      case 'victory':   this._arpeggio([523,659,784,1047,784,1047,1319], 0.09, 0.12); break;
    }
  }

  _tone(freq, dur, type='sine', vol=0.1, pitchDown=false) {
    const ctx  = this._ctx;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (pitchDown) osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + dur);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    osc.start(); osc.stop(ctx.currentTime + dur);
  }

  _noise(vol, dur) {
    const ctx    = this._ctx;
    const size   = ctx.sampleRate * dur;
    const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data   = buffer.getChannelData(0);
    for (let i=0; i<size; i++) data[i] = Math.random()*2-1;
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buffer;
    src.connect(gain); gain.connect(ctx.destination);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.start(); src.stop(ctx.currentTime + dur);
  }

  _arpeggio(freqs, vol, noteDur) {
    freqs.forEach((f, i) => {
      setTimeout(() => this._tone(f, noteDur, 'square', vol), i * noteDur * 800);
    });
  }
}