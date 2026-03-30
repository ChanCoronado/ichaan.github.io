import { UI }       from './ui.js';
import { Game }     from './game.js';
import { Controls } from './controls.js';
import { Audio }    from './audio.js';


export const APP = {
  controlMethod: 'mouse',
  difficulty: 'normal',
  soundEnabled: true,
  score: 0,
  highScores: JSON.parse(localStorage.getItem('neonbreak_hi') || '[]'),
};

export function saveHighScore(score) {
  APP.highScores.push(score);
  APP.highScores.sort((a,b) => b - a);
  APP.highScores = APP.highScores.slice(0, 10);
  localStorage.setItem('neonbreak_hi', JSON.stringify(APP.highScores));
}


document.addEventListener('DOMContentLoaded', () => {
  const audio    = new Audio();
  const controls = new Controls();
  const game     = new Game(controls, audio);
  const ui       = new UI(game, audio);
  game.setUI(ui);   
  ui.init();
});