// Mini-game HTML templates for 100 playable showcase games
// Each template is a self-contained HTML document with embedded CSS/JS

type Config = { title: string; color: string; bg: string; speed?: number; size?: number };

const c = (h: string, s: string, l: string) => `hsl(${h},${s}%,${l}%)`;

const configs: Record<string, Config> = {};
const gameNames: Record<string, string> = {
  "sc-001": "Neon Racer X", "sc-002": "Pixel Dungeon Quest", "sc-003": "Galaxy Defender 3000",
  "sc-004": "Chess AI Master", "sc-005": "Block Blast Mania", "sc-006": "Zombie Survival Arena",
  "sc-007": "Flappy Rocket", "sc-008": "Tower Defense Pro", "sc-009": "Ninja Runner",
  "sc-010": "Color Match Frenzy", "sc-011": "Cyber Tanks", "sc-012": "Word Wizard",
  "sc-013": "Drift Kings", "sc-014": "Space Colony Tycoon", "sc-015": "Bouncy Ball Adventure",
  "sc-016": "Retro Invaders", "sc-017": "Puzzle Kingdoms", "sc-018": "Asteroid Miner",
  "sc-019": "Shadow Knight RPG", "sc-020": "Bubble Pop Saga", "sc-021": "Mech Arena Battle",
  "sc-022": "Sudoku Master AI", "sc-023": "Turbo Kart GP", "sc-024": "Idle Empire Builder",
  "sc-025": "Lava Escape", "sc-026": "Pirate Treasure Hunt", "sc-027": "Snake Ultra",
  "sc-028": "Memory Card Master", "sc-029": "Sky Diver", "sc-030": "Battle Royale Mini",
  "sc-031": "Crypto Clicker", "sc-032": "Dungeon Cards", "sc-033": "Formula Fury",
  "sc-034": "Tetris Neon", "sc-035": "Planet Conqueror", "sc-036": "Fruit Ninja HD",
  "sc-037": "Zombie Road", "sc-038": "Crossword AI", "sc-039": "Robot Factory",
  "sc-040": "Archer Legend", "sc-041": "Pinball Wizard", "sc-042": "Dragon Quest Idle",
  "sc-043": "Maze Runner 3D", "sc-044": "Stickman Fighter", "sc-045": "Cat Café Tycoon",
  "sc-046": "Pong Championship", "sc-047": "Kingdom Wars", "sc-048": "Neon Breakout",
  "sc-049": "Wizard Duel Online", "sc-050": "Highway Overtake", "sc-051": "Gem Collector",
  "sc-052": "Sniper Elite 2D", "sc-053": "Jigsaw Universe", "sc-054": "Farm Simulator AI",
  "sc-055": "Galactic Commander", "sc-056": "Pac-Man Reloaded", "sc-057": "Vampire Survivors HD",
  "sc-058": "Math Blaster", "sc-059": "Monster Tamer", "sc-060": "Bike Stunt Mania",
  "sc-061": "Tap Tap Hero", "sc-062": "Warzone Tactics", "sc-063": "Frogger Remix",
  "sc-064": "Solitaire Royale", "sc-065": "Samurai Slash", "sc-066": "Rocket League Mini",
  "sc-067": "Potion Craft", "sc-068": "Stack Tower", "sc-069": "Cannon Blast",
  "sc-070": "Checkers Champion", "sc-071": "Gravity Flip", "sc-072": "Nonogram Pro",
  "sc-073": "Off-Road Rally", "sc-074": "Alchemy Lab", "sc-075": "Pixel Warriors",
  "sc-076": "Ice Cream Tycoon", "sc-077": "Space Tetris", "sc-078": "Elemental Clash",
  "sc-079": "Siege Master", "sc-080": "Jetpack Joyride HD", "sc-081": "Whack-a-Mole Pro",
  "sc-082": "Heist Escape", "sc-083": "Slide Puzzle Deluxe", "sc-084": "Drag Racer",
  "sc-085": "Necromancer Rising", "sc-086": "Civilization Lite", "sc-087": "Paper Plane Glider",
  "sc-088": "Centipede Reborn", "sc-089": "Shadow Assassin", "sc-090": "Trivia Blitz",
  "sc-091": "Night Racer", "sc-092": "Summoner's Gate", "sc-093": "Ant Colony",
  "sc-094": "Balloon Pop Party", "sc-095": "Galaga Remix", "sc-096": "Kung Fu Master",
  "sc-097": "2048 Infinity", "sc-098": "Sprint Masters", "sc-099": "Goblin King RPG",
  "sc-100": "Fortress Builder",
};

// ── TEMPLATE 1: Snake ──
function snakeGame(title: string, color: string, bg: string, speed: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="300"></canvas><div id="s">Score: 0</div><div id="msg">Arrow keys or WASD to move</div><script>const c=document.getElementById('c'),x=c.getContext('2d'),G=15,W=c.width/G;let s=[{x:10,y:10}],d={x:1,y:0},f={x:5,y:5},sc=0,run=1;function rF(){f={x:Math.floor(Math.random()*W),y:Math.floor(Math.random()*W)}}function draw(){if(!run)return;x.fillStyle='${bg}';x.fillRect(0,0,c.width,c.height);x.fillStyle='${color}';s.forEach(p=>x.fillRect(p.x*G,p.y*G,G-1,G-1));x.fillStyle='#ff4444';x.fillRect(f.x*G,f.y*G,G-1,G-1);const h={x:s[0].x+d.x,y:s[0].y+d.y};if(h.x<0||h.x>=W||h.y<0||h.y>=W||s.some(p=>p.x===h.x&&p.y===h.y)){run=0;document.getElementById('msg').textContent='Game Over! Click to restart';return}s.unshift(h);if(h.x===f.x&&h.y===f.y){sc+=10;document.getElementById('s').textContent='Score: '+sc;rF()}else s.pop()}document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if((k==='arrowleft'||k==='a')&&d.x!==1)d={x:-1,y:0};if((k==='arrowright'||k==='d')&&d.x!==-1)d={x:1,y:0};if((k==='arrowup'||k==='w')&&d.y!==1)d={x:0,y:-1};if((k==='arrowdown'||k==='s')&&d.y!==-1)d={x:0,y:1};e.preventDefault()});c.addEventListener('click',()=>{if(!run){s=[{x:10,y:10}];d={x:1,y:0};sc=0;run=1;rF();document.getElementById('s').textContent='Score: 0';document.getElementById('msg').textContent='Arrow keys or WASD'}});setInterval(draw,${speed})</script></body></html>`;
}

// ── TEMPLATE 2: Breakout ──
function breakoutGame(title: string, color: string, bg: string, rows: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="400" height="300"></canvas><div id="s">Score: 0</div><div id="msg">Move mouse to play</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=175,bx=200,by=280,dx=2.5,dy=-2.5,sc=0,lives=3,run=1;const bricks=[];const cols=['#ff4444','#ff8844','#ffcc44','#44ff44','#4488ff','#cc44ff'];for(let r=0;r<${rows};r++)for(let i=0;i<8;i++)bricks.push({x:i*50+2,y:r*20+30,w:46,h:16,c:cols[r%cols.length],alive:1});c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();px=e.clientX-r.left-25});function draw(){if(!run)return;x.fillStyle='${bg}';x.fillRect(0,0,400,300);x.fillStyle='${color}';x.fillRect(px,290,50,8);x.fillStyle='#fff';x.beginPath();x.arc(bx,by,5,0,Math.PI*2);x.fill();bricks.forEach(b=>{if(b.alive){x.fillStyle=b.c;x.fillRect(b.x,b.y,b.w,b.h)}});bx+=dx;by+=dy;if(bx<5||bx>395)dx=-dx;if(by<5)dy=-dy;if(by>285&&bx>px&&bx<px+50){dy=-dy;dx+=(bx-(px+25))*0.1}if(by>305){lives--;if(lives<=0){run=0;document.getElementById('msg').textContent='Game Over! Score: '+sc}else{bx=200;by=280;dy=-2.5}}bricks.forEach(b=>{if(b.alive&&bx>b.x&&bx<b.x+b.w&&by>b.y&&by<b.y+b.h){b.alive=0;dy=-dy;sc+=10;document.getElementById('s').textContent='Score: '+sc}});if(bricks.every(b=>!b.alive)){run=0;document.getElementById('msg').textContent='You Win! Score: '+sc}}setInterval(draw,16)</script></body></html>`;
}

// ── TEMPLATE 3: Space Shooter ──
function spaceShooter(title: string, color: string, bg: string, enemySpeed: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="400"></canvas><div id="s">Score: 0</div><div id="msg">Mouse to move, Click to shoot</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=140,bullets=[],enemies=[],sc=0,run=1,fr=0;c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();px=e.clientX-r.left-10});c.addEventListener('click',()=>{if(run)bullets.push({x:px+8,y:370})});function spawn(){if(Math.random()<0.03+fr*0.0001)enemies.push({x:Math.random()*280,y:-20,s:${enemySpeed}+Math.random()*1.5})}function draw(){if(!run)return;fr++;x.fillStyle='${bg}';x.fillRect(0,0,300,400);for(let i=0;i<30;i++){x.fillStyle='rgba(255,255,255,'+(0.1+Math.random()*0.3)+')';x.fillRect(Math.random()*300,(i*13+fr)%400,1,1)}x.fillStyle='${color}';x.fillRect(px,375,20,15);x.fillRect(px+7,365,6,10);bullets=bullets.filter(b=>{b.y-=6;x.fillStyle='#ff4444';x.fillRect(b.x,b.y,4,10);return b.y>0});spawn();enemies=enemies.filter(e=>{e.y+=e.s;x.fillStyle='#ff6644';x.fillRect(e.x,e.y,20,20);x.fillStyle='#ffaa44';x.fillRect(e.x+5,e.y+5,10,10);if(e.y>400)return false;if(e.y>360&&e.x>px-10&&e.x<px+30){run=0;document.getElementById('msg').textContent='Game Over! Score: '+sc;return false}let hit=false;bullets=bullets.filter(b=>{if(b.x>e.x-4&&b.x<e.x+20&&b.y>e.y&&b.y<e.y+20){hit=true;sc+=10;document.getElementById('s').textContent='Score: '+sc;return false}return true});return!hit});requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 4: Dodge Game ──
function dodgeGame(title: string, color: string, bg: string, obstacleSpeed: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="400"></canvas><div id="s">Score: 0</div><div id="msg">Move mouse to dodge!</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=140,obs=[],sc=0,run=1,fr=0;c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();px=e.clientX-r.left-15});function draw(){if(!run)return;fr++;sc=Math.floor(fr/10);document.getElementById('s').textContent='Score: '+sc;x.fillStyle='${bg}';x.fillRect(0,0,300,400);x.fillStyle='${color}';x.beginPath();x.arc(px+15,370,15,0,Math.PI*2);x.fill();if(Math.random()<0.04+fr*0.00005)obs.push({x:Math.random()*280,y:-20,w:15+Math.random()*30,s:${obstacleSpeed}+Math.random()*2});obs=obs.filter(o=>{o.y+=o.s;x.fillStyle='#ff4444';x.fillRect(o.x,o.y,o.w,15);if(o.y>355&&o.y<385&&o.x<px+30&&o.x+o.w>px){run=0;document.getElementById('msg').textContent='Game Over! Score: '+sc}return o.y<420});requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 5: Clicker/Idle ──
function clickerGame(title: string, color: string, bg: string, emoji: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden;user-select:none}.btn{font-size:60px;cursor:pointer;transition:transform .1s;padding:20px;border-radius:20px;background:rgba(255,255,255,0.05);border:2px solid ${color}33}.btn:active{transform:scale(0.9)}.btn:hover{background:rgba(255,255,255,0.1)}h2{font-size:14px;margin-bottom:8px}#s{font-size:24px;font-weight:bold;margin:10px}#u{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;justify-content:center}.ub{padding:6px 12px;background:${color}22;border:1px solid ${color}44;border-radius:8px;cursor:pointer;font-family:monospace;color:${color};font-size:11px}.ub:hover{background:${color}44}.ub:disabled{opacity:.4;cursor:default}#ps{font-size:11px;opacity:.7;margin-top:6px}</style></head><body><h2>${title}</h2><div id="s">0</div><div class="btn" id="b">${emoji}</div><div id="ps">+1 per click | +0/s</div><div id="u"></div><script>let coins=0,cpc=1,cps=0,ups=[{n:'Auto Clicker',c:10,v:1,t:'ps'},{n:'Double Click',c:50,v:1,t:'pc'},{n:'Mega Click',c:200,v:5,t:'pc'},{n:'Robot Worker',c:100,v:5,t:'ps'},{n:'Factory',c:500,v:25,t:'ps'},{n:'Quantum Core',c:2000,v:100,t:'ps'}];document.getElementById('b').onclick=()=>{coins+=cpc;upd()};function upd(){document.getElementById('s').textContent=Math.floor(coins).toLocaleString();document.getElementById('ps').textContent='+'+cpc+' per click | +'+cps+'/s';renderUps()}function renderUps(){const d=document.getElementById('u');d.innerHTML='';ups.forEach((u,i)=>{const b=document.createElement('button');b.className='ub';b.textContent=u.n+' ('+u.c+')';b.disabled=coins<u.c;b.onclick=()=>{if(coins>=u.c){coins-=u.c;if(u.t==='ps')cps+=u.v;else cpc+=u.v;u.c=Math.floor(u.c*1.5);upd()}};d.appendChild(b)})}setInterval(()=>{coins+=cps/10;upd()},100);upd()</script></body></html>`;
}

// ── TEMPLATE 6: Memory Match ──
function memoryGame(title: string, color: string, bg: string, pairs: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}h2{font-size:14px;margin-bottom:8px}#g{display:grid;grid-template-columns:repeat(4,60px);gap:6px}#s{font-size:12px;margin-top:8px}.card{width:60px;height:60px;background:${color}22;border:2px solid ${color}44;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;cursor:pointer;transition:all .3s}.card.flip{background:${color}44;border-color:${color}}.card.done{background:#44ff4433;border-color:#44ff44}</style></head><body><h2>${title}</h2><div id="g"></div><div id="s">Moves: 0 | Pairs: 0/${pairs}</div><script>const emojis=['🎮','🎯','🎨','🎵','🏆','⚡','🔥','💎','🌟','🎪','🎭','🎲'];const sel=emojis.slice(0,${pairs});let cards=[...sel,...sel].sort(()=>Math.random()-0.5);let flipped=[],matched=0,moves=0,lock=false;const g=document.getElementById('g');cards.forEach((e,i)=>{const d=document.createElement('div');d.className='card';d.dataset.i=i;d.textContent='?';d.onclick=()=>flip(d,i);g.appendChild(d)});function flip(d,i){if(lock||d.classList.contains('flip')||d.classList.contains('done'))return;d.textContent=cards[i];d.classList.add('flip');flipped.push({el:d,i});if(flipped.length===2){moves++;lock=true;const[a,b]=flipped;if(cards[a.i]===cards[b.i]){a.el.classList.add('done');b.el.classList.add('done');matched++;flipped=[];lock=false}else{setTimeout(()=>{a.el.classList.remove('flip');a.el.textContent='?';b.el.classList.remove('flip');b.el.textContent='?';flipped=[];lock=false},800)}document.getElementById('s').textContent='Moves: '+moves+' | Pairs: '+matched+'/${pairs}';if(matched===${pairs})document.getElementById('s').textContent='🎉 You Won in '+moves+' moves!'}}</script></body></html>`;
}

// ── TEMPLATE 7: Catch Falling Items ──
function catchGame(title: string, color: string, bg: string, emoji: string, badEmoji: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="400"></canvas><div id="s">Score: 0 | Lives: 3</div><div id="msg">Move mouse to catch ${emoji}</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=130,items=[],sc=0,lives=3,fr=0,run=1;c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();px=e.clientX-r.left-20});function draw(){if(!run)return;fr++;x.fillStyle='${bg}';x.fillRect(0,0,300,400);x.fillStyle='${color}';x.fillRect(px,375,40,20);x.font='14px monospace';x.fillText('___',px+5,388);if(Math.random()<0.03)items.push({x:Math.random()*270,y:-20,bad:Math.random()<0.25,s:2+Math.random()*2});items=items.filter(it=>{it.y+=it.s;x.font='20px serif';x.fillText(it.bad?'${badEmoji}':'${emoji}',it.x,it.y);if(it.y>370&&it.x>px-10&&it.x<px+40){if(it.bad){lives--;if(lives<=0){run=0;document.getElementById('msg').textContent='Game Over!'}}else{sc+=10}document.getElementById('s').textContent='Score: '+sc+' | Lives: '+lives;return false}return it.y<420});requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 8: Pong ──
function pongGame(title: string, color: string, bg: string, aiSpeed: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="400"></canvas><div id="s">You: 0 | AI: 0</div><div id="msg">Move mouse to play</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let py=180,ay=180,bx=150,by=200,dx=3,dy=2.5,ps=0,as=0;c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();py=e.clientY-r.top-25});function draw(){x.fillStyle='${bg}';x.fillRect(0,0,300,400);x.setLineDash([5,5]);x.strokeStyle='${color}33';x.beginPath();x.moveTo(150,0);x.lineTo(150,400);x.stroke();x.setLineDash([]);x.fillStyle='${color}';x.fillRect(10,py,8,50);x.fillRect(282,ay,8,50);x.fillStyle='#fff';x.beginPath();x.arc(bx,by,6,0,Math.PI*2);x.fill();bx+=dx;by+=dy;if(by<6||by>394)dy=-dy;if(bx<22&&by>py&&by<py+50){dx=-dx;dy+=(by-(py+25))*0.1}if(bx>278&&by>ay&&by<ay+50){dx=-dx;dy+=(by-(ay+25))*0.1}if(bx<0){as++;bx=150;by=200;dx=3;dy=2.5}if(bx>300){ps++;bx=150;by=200;dx=-3;dy=2.5}const t=by-(ay+25);ay+=Math.sign(t)*Math.min(Math.abs(t),${aiSpeed});ay=Math.max(0,Math.min(350,ay));document.getElementById('s').textContent='You: '+ps+' | AI: '+as;x.font='20px monospace';x.fillStyle='${color}44';x.fillText(ps,100,50);x.fillText(as,180,50);requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 9: Reaction / Tap Game ──
function reactionGame(title: string, color: string, bg: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden;user-select:none}h2{font-size:14px;margin-bottom:12px}#area{width:300px;height:300px;border:2px solid ${color}44;border-radius:12px;position:relative;overflow:hidden;cursor:pointer}#s{font-size:12px;margin-top:8px}.target{position:absolute;border-radius:50%;cursor:pointer;transition:transform .1s;animation:pop .3s ease-out}.target:hover{transform:scale(1.1)}@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><div id="area"></div><div id="s">Score: 0 | Time: 30s</div><div id="msg">Click the targets!</div><script>const area=document.getElementById('area');let sc=0,time=30,run=0,timer;function spawn(){if(!run)return;const d=document.createElement('div');d.className='target';const sz=20+Math.random()*30;d.style.width=sz+'px';d.style.height=sz+'px';d.style.left=Math.random()*(280-sz)+'px';d.style.top=Math.random()*(280-sz)+'px';d.style.background='hsl('+(Math.random()*360)+',70%,50%)';d.onclick=(e)=>{e.stopPropagation();sc+=Math.round(50/sz*20);d.remove();document.getElementById('s').textContent='Score: '+sc+' | Time: '+time+'s';spawn()};area.appendChild(d);setTimeout(()=>{if(d.parentNode)d.remove()},2000-Math.min(time*30,1500))}function start(){sc=0;time=30;run=1;area.innerHTML='';document.getElementById('msg').textContent='Click the targets!';for(let i=0;i<3;i++)setTimeout(spawn,i*300);timer=setInterval(()=>{time--;document.getElementById('s').textContent='Score: '+sc+' | Time: '+time+'s';if(Math.random()<0.4)spawn();if(time<=0){run=0;clearInterval(timer);area.innerHTML='<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:18px;flex-direction:column"><div>🎉 Final Score</div><div style=font-size:36px;margin:10px>'+sc+'</div><div style=font-size:11px;opacity:.7>Click to replay</div></div>';document.getElementById('msg').textContent='Game Over! Click area to replay'}},1000)}area.onclick=()=>{if(!run)start()};start()</script></body></html>`;
}

// ── TEMPLATE 10: Flappy Style ──
function flappyGame(title: string, color: string, bg: string, gap: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="300" height="400"></canvas><div id="s">Score: 0</div><div id="msg">Click or Space to flap!</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let by=200,v=0,pipes=[],sc=0,run=0,fr=0;function tap(){if(!run){run=1;by=200;v=0;pipes=[];sc=0;fr=0;document.getElementById('s').textContent='Score: 0'}v=-6}c.addEventListener('click',tap);document.addEventListener('keydown',e=>{if(e.code==='Space'){tap();e.preventDefault()}});function draw(){x.fillStyle='${bg}';x.fillRect(0,0,300,400);if(!run){x.fillStyle='${color}';x.font='16px monospace';x.fillText('Click to Start',90,200);requestAnimationFrame(draw);return}fr++;v+=0.3;by+=v;x.fillStyle='${color}';x.beginPath();x.arc(60,by,12,0,Math.PI*2);x.fill();if(fr%90===0)pipes.push({x:310,gap:50+Math.random()*(300-${gap}),scored:false});pipes=pipes.filter(p=>{p.x-=2.5;x.fillStyle='${color}66';x.fillRect(p.x,0,40,p.gap);x.fillRect(p.x,p.gap+${gap},40,400);if(!p.scored&&p.x<50){p.scored=true;sc++;document.getElementById('s').textContent='Score: '+sc}if((60>p.x&&60<p.x+40)&&(by<p.gap+12||by>p.gap+${gap}-12)){run=0;document.getElementById('msg').textContent='Game Over! Score: '+sc+' — Click to retry'}return p.x>-50});if(by>400||by<0){run=0;document.getElementById('msg').textContent='Game Over! Score: '+sc+' — Click to retry'}requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 11: Racing (top-down) ──
function racingGame(title: string, color: string, bg: string, speed: number) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="250" height="400"></canvas><div id="s">Score: 0</div><div id="msg">← → or A/D to steer</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=110,obs=[],sc=0,run=1,fr=0,spd=${speed},keys={};document.addEventListener('keydown',e=>keys[e.key.toLowerCase()]=1);document.addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();px=e.clientX-r.left-15});function draw(){if(!run)return;fr++;sc=Math.floor(fr/5);spd=${speed}+fr*0.002;x.fillStyle='${bg}';x.fillRect(0,0,250,400);x.strokeStyle='${color}22';for(let i=0;i<10;i++){const y=(i*50+fr*spd)%400;x.setLineDash([20,15]);x.beginPath();x.moveTo(125,y);x.lineTo(125,y+20);x.stroke()}x.setLineDash([]);x.fillStyle='${color}11';x.fillRect(0,0,30,400);x.fillRect(220,0,30,400);if(keys['arrowleft']||keys['a'])px-=4;if(keys['arrowright']||keys['d'])px+=4;px=Math.max(30,Math.min(200,px));x.fillStyle='${color}';x.fillRect(px,350,30,50);x.fillStyle='${color}88';x.fillRect(px+5,355,20,15);x.fillRect(px+10,340,10,15);if(Math.random()<0.02+fr*0.00003)obs.push({x:30+Math.random()*170,y:-40,w:30,h:50});obs=obs.filter(o=>{o.y+=spd;x.fillStyle='#ff444488';x.fillRect(o.x,o.y,o.w,o.h);x.fillStyle='#ff666688';x.fillRect(o.x+5,o.y+5,o.w-10,15);if(o.y>340&&o.y<400&&o.x<px+30&&o.x+o.w>px){run=0;document.getElementById('msg').textContent='Crashed! Score: '+sc}return o.y<420});document.getElementById('s').textContent='Score: '+sc;requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 12: Tic-Tac-Toe ──
function ticTacToe(title: string, color: string, bg: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}h2{font-size:14px;margin-bottom:12px}#g{display:grid;grid-template-columns:repeat(3,70px);gap:4px}.cell{width:70px;height:70px;background:${color}15;border:2px solid ${color}33;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;cursor:pointer;transition:all .2s}.cell:hover{background:${color}25;border-color:${color}66}#s{font-size:12px;margin-top:12px}#msg{font-size:11px;margin-top:4px;opacity:.7;cursor:pointer}</style></head><body><h2>${title}</h2><div id="g"></div><div id="s">Your turn (X)</div><div id="msg"></div><script>let b=Array(9).fill(''),turn='X',over=false;const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,2,8],[2,4,6]];const g=document.getElementById('g');for(let i=0;i<9;i++){const d=document.createElement('div');d.className='cell';d.onclick=()=>play(i);g.appendChild(d)}function render(){const cells=g.children;for(let i=0;i<9;i++)cells[i].textContent=b[i]}function check(p){return wins.some(w=>w.every(i=>b[i]===p))}function play(i){if(b[i]||over||turn!=='X')return;b[i]='X';render();if(check('X')){document.getElementById('s').textContent='🎉 You win!';over=true;document.getElementById('msg').textContent='Click to replay';return}if(b.every(c=>c)){document.getElementById('s').textContent='Draw!';over=true;document.getElementById('msg').textContent='Click to replay';return}turn='O';document.getElementById('s').textContent='AI thinking...';setTimeout(ai,400)}function ai(){let move=-1;for(let i=0;i<9;i++){if(!b[i]){b[i]='O';if(check('O'))move=i;b[i]=''}}if(move===-1)for(let i=0;i<9;i++){if(!b[i]){b[i]='X';if(check('X'))move=i;b[i]=''}}if(move===-1){if(!b[4])move=4;else{const corners=[0,2,6,8].filter(i=>!b[i]);if(corners.length)move=corners[Math.floor(Math.random()*corners.length)];else move=b.indexOf('')}}b[move]='O';render();if(check('O')){document.getElementById('s').textContent='AI wins!';over=true;document.getElementById('msg').textContent='Click to replay';return}if(b.every(c=>c)){document.getElementById('s').textContent='Draw!';over=true;document.getElementById('msg').textContent='Click to replay';return}turn='X';document.getElementById('s').textContent='Your turn (X)'}document.getElementById('msg').onclick=()=>{if(over){b=Array(9).fill('');turn='X';over=false;render();document.getElementById('s').textContent='Your turn (X)';document.getElementById('msg').textContent=''}};render()</script></body></html>`;
}

// ── TEMPLATE 13: Platformer ──
function platformerGame(title: string, color: string, bg: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}canvas{border:2px solid ${color};border-radius:4px}h2{font-size:14px;margin-bottom:8px}#s{font-size:12px;margin-top:6px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><canvas id="c" width="400" height="300"></canvas><div id="s">Score: 0</div><div id="msg">← → to move, ↑ or Space to jump</div><script>const c=document.getElementById('c'),x=c.getContext('2d');let px=50,py=250,vy=0,onG=false,sc=0,camX=0,keys={};const plats=[{x:0,y:280,w:100},{x:120,y:260,w:80},{x:230,y:240,w:80},{x:340,y:220,w:80},{x:450,y:250,w:80},{x:560,y:230,w:80},{x:670,y:210,w:100},{x:800,y:240,w:80},{x:920,y:220,w:80},{x:1050,y:260,w:80},{x:1170,y:230,w:100},{x:1300,y:210,w:80},{x:1420,y:250,w:80},{x:1550,y:220,w:80},{x:1680,y:240,w:100}];const coins=plats.map(p=>({x:p.x+p.w/2-5,y:p.y-30,got:false}));document.addEventListener('keydown',e=>{keys[e.key]=1;e.preventDefault()});document.addEventListener('keyup',e=>keys[e.key]=0);function draw(){x.fillStyle='${bg}';x.fillRect(0,0,400,300);camX+=(px-180-camX)*0.1;if(keys['ArrowLeft']||keys['a'])px-=4;if(keys['ArrowRight']||keys['d'])px+=4;if((keys['ArrowUp']||keys[' ']||keys['w'])&&onG){vy=-10;onG=false}vy+=0.5;py+=vy;onG=false;plats.forEach(p=>{if(px+15>p.x&&px<p.x+p.w&&py+20>p.y&&py+20<p.y+10&&vy>=0){py=p.y-20;vy=0;onG=true}});if(py>320){py=250;px=50;vy=0;camX=0;coins.forEach(c=>c.got=false);sc=0}coins.forEach(co=>{if(!co.got&&Math.abs(px+7-co.x-5)<15&&Math.abs(py+10-co.y-5)<15){co.got=true;sc+=10}});document.getElementById('s').textContent='Score: '+sc;plats.forEach(p=>{x.fillStyle='${color}88';x.fillRect(p.x-camX,p.y,p.w,10)});coins.forEach(co=>{if(!co.got){x.fillStyle='#ffcc00';x.beginPath();x.arc(co.x+5-camX,co.y+5,6,0,Math.PI*2);x.fill()}});x.fillStyle='${color}';x.fillRect(px-camX,py,15,20);requestAnimationFrame(draw)}draw()</script></body></html>`;
}

// ── TEMPLATE 14: 2048 Style ──
function game2048(title: string, color: string, bg: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden}h2{font-size:14px;margin-bottom:8px}#g{display:grid;grid-template-columns:repeat(4,60px);gap:4px;background:${color}22;padding:6px;border-radius:8px}.cell{width:60px;height:60px;display:flex;align-items:center;justify-content:center;border-radius:6px;font-weight:bold;font-size:16px;transition:all .1s}#s{font-size:12px;margin-top:8px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><div id="g"></div><div id="s">Score: 0</div><div id="msg">Arrow keys to play</div><script>let grid=Array(16).fill(0),sc=0;const colors={0:'${color}11',2:'${color}22',4:'${color}33',8:'#f59e0b55',16:'#f97316aa',32:'#ef4444aa',64:'#ef4444',128:'#eab308',256:'#eab308',512:'#eab308',1024:'#eab308',2048:'#22c55e'};function addTile(){const empty=[];grid.forEach((v,i)=>{if(!v)empty.push(i)});if(empty.length){grid[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<0.9?2:4}}function render(){const g=document.getElementById('g');g.innerHTML='';grid.forEach(v=>{const d=document.createElement('div');d.className='cell';d.style.background=colors[v]||'#22c55e';d.textContent=v||'';d.style.color=v>4?'#fff':'${color}';d.style.fontSize=v>=1024?'12px':v>=128?'14px':'16px';g.appendChild(d)});document.getElementById('s').textContent='Score: '+sc}function slide(row){let f=row.filter(v=>v);for(let i=0;i<f.length-1;i++){if(f[i]===f[i+1]){f[i]*=2;sc+=f[i];f.splice(i+1,1)}}while(f.length<4)f.push(0);return f}function move(dir){let moved=false;const g=[...grid];if(dir==='left')for(let r=0;r<4;r++){const row=slide(grid.slice(r*4,r*4+4));for(let i=0;i<4;i++)grid[r*4+i]=row[i]}if(dir==='right')for(let r=0;r<4;r++){const row=slide(grid.slice(r*4,r*4+4).reverse()).reverse();for(let i=0;i<4;i++)grid[r*4+i]=row[i]}if(dir==='up')for(let c=0;c<4;c++){const col=slide([grid[c],grid[c+4],grid[c+8],grid[c+12]]);for(let r=0;r<4;r++)grid[r*4+c]=col[r]}if(dir==='down')for(let c=0;c<4;c++){const col=slide([grid[c],grid[c+4],grid[c+8],grid[c+12]].reverse()).reverse();for(let r=0;r<4;r++)grid[r*4+c]=col[r]}if(g.some((v,i)=>v!==grid[i])){addTile();moved=true}render();return moved}document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')move('left');if(e.key==='ArrowRight')move('right');if(e.key==='ArrowUp')move('up');if(e.key==='ArrowDown')move('down');e.preventDefault()});addTile();addTile();render()</script></body></html>`;
}

// ── TEMPLATE 15: Whack-a-mole ──
function whackGame(title: string, color: string, bg: string, emoji: string) {
  return `<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}body{background:${bg};display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:monospace;color:${color};overflow:hidden;user-select:none}h2{font-size:14px;margin-bottom:8px}#g{display:grid;grid-template-columns:repeat(3,80px);gap:8px}.hole{width:80px;height:80px;background:${color}15;border:2px solid ${color}33;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:36px;cursor:pointer;transition:all .15s}.hole:active{transform:scale(.9)}.hole.active{background:${color}33;border-color:${color};animation:shake .1s}.hole.hit{background:#44ff4433}@keyframes shake{0%,100%{transform:rotate(0)}50%{transform:rotate(5deg)}}#s{font-size:12px;margin-top:8px}#msg{font-size:11px;margin-top:4px;opacity:.7}</style></head><body><h2>${title}</h2><div id="g"></div><div id="s">Score: 0 | Time: 30s</div><div id="msg">Click the ${emoji} when they appear!</div><script>const g=document.getElementById('g');let sc=0,time=30,active=-1,timer,gameTimer;for(let i=0;i<9;i++){const d=document.createElement('div');d.className='hole';d.dataset.i=i;d.onclick=()=>{if(parseInt(d.dataset.i)===active){sc+=10;d.classList.add('hit');setTimeout(()=>d.classList.remove('hit'),200);document.getElementById('s').textContent='Score: '+sc+' | Time: '+time+'s';clearTimeout(timer);pop()}};g.appendChild(d)}function pop(){g.querySelectorAll('.hole').forEach(h=>{h.classList.remove('active');h.textContent=''});if(time<=0)return;active=Math.floor(Math.random()*9);const hole=g.children[active];hole.classList.add('active');hole.textContent='${emoji}';timer=setTimeout(()=>{hole.classList.remove('active');hole.textContent='';pop()},800-Math.min(time*15,500))}function start(){sc=0;time=30;document.getElementById('s').textContent='Score: 0 | Time: 30s';pop();gameTimer=setInterval(()=>{time--;document.getElementById('s').textContent='Score: '+sc+' | Time: '+time+'s';if(time<=0){clearInterval(gameTimer);clearTimeout(timer);g.querySelectorAll('.hole').forEach(h=>{h.classList.remove('active');h.textContent=''});document.getElementById('msg').textContent='Game Over! Score: '+sc+' — Refresh to replay'}},1000)}start()</script></body></html>`;
}

// ── Map all 100 games to templates ──
const templateMap: Record<string, () => string> = {
  // Racing (11 games)
  "sc-001": () => racingGame("Neon Racer X", "#00ffcc", "#0a0a1a", 3),
  "sc-013": () => racingGame("Drift Kings", "#ff8844", "#1a0a0a", 3.5),
  "sc-023": () => racingGame("Turbo Kart GP", "#44aaff", "#0a0a1a", 4),
  "sc-033": () => racingGame("Formula Fury", "#ff4444", "#0a0a0a", 4.5),
  "sc-037": () => racingGame("Zombie Road", "#88ff44", "#0a1a0a", 3),
  "sc-050": () => racingGame("Highway Overtake", "#ffcc44", "#1a1a0a", 3.5),
  "sc-060": () => racingGame("Bike Stunt Mania", "#ff44ff", "#1a0a1a", 4),
  "sc-066": () => racingGame("Rocket League Mini", "#4488ff", "#0a0a2a", 3),
  "sc-073": () => racingGame("Off-Road Rally", "#cc8844", "#1a1408", 3.5),
  "sc-084": () => racingGame("Drag Racer", "#ff6644", "#1a0a08", 5),
  "sc-091": () => racingGame("Night Racer", "#aa44ff", "#08081a", 3.5),
  "sc-098": () => racingGame("Sprint Masters", "#44ffaa", "#0a1a14", 4),

  // RPG - Click Combat (10 games)
  "sc-002": () => clickerGame("Pixel Dungeon Quest", "#aa88ff", "#0e0a1a", "⚔️"),
  "sc-019": () => clickerGame("Shadow Knight RPG", "#8844ff", "#0a0a14", "🗡️"),
  "sc-026": () => clickerGame("Pirate Treasure Hunt", "#ffcc44", "#1a1408", "🏴‍☠️"),
  "sc-032": () => clickerGame("Dungeon Cards", "#ff8844", "#1a0e08", "🃏"),
  "sc-042": () => clickerGame("Dragon Quest Idle", "#ff4488", "#1a0a10", "🐉"),
  "sc-049": () => clickerGame("Wizard Duel Online", "#44aaff", "#0a0e1a", "🧙"),
  "sc-059": () => clickerGame("Monster Tamer", "#44ff88", "#0a1a10", "👾"),
  "sc-078": () => clickerGame("Elemental Clash", "#ff6644", "#1a0e08", "🔮"),
  "sc-085": () => clickerGame("Necromancer Rising", "#aa44ff", "#10081a", "💀"),
  "sc-092": () => clickerGame("Summoner's Gate", "#4488ff", "#080a1a", "⭐"),
  "sc-099": () => clickerGame("Goblin King RPG", "#88cc44", "#0e1a08", "👑"),
  "sc-067": () => clickerGame("Potion Craft", "#cc44ff", "#140a1a", "🧪"),

  // Arcade - Space Shooter (8 games)
  "sc-003": () => spaceShooter("Galaxy Defender 3000", "#44ccff", "#050510", 2),
  "sc-016": () => spaceShooter("Retro Invaders", "#00ff88", "#080808", 1.5),
  "sc-018": () => spaceShooter("Asteroid Miner", "#ffaa44", "#0a0808", 2.5),
  "sc-055": () => spaceShooter("Galactic Commander", "#8888ff", "#08081a", 2),
  "sc-088": () => spaceShooter("Centipede Reborn", "#44ff44", "#080a08", 2),
  "sc-095": () => spaceShooter("Galaga Remix", "#ff44ff", "#0a080a", 2.5),

  // Arcade - Snake (4 games)
  "sc-027": () => snakeGame("Snake Ultra", "#00ffaa", "#0a0a14", 100),
  "sc-056": () => snakeGame("Pac-Man Reloaded", "#ffff44", "#0a0a0a", 120),
  "sc-063": () => snakeGame("Frogger Remix", "#44ff44", "#081008", 130),
  "sc-077": () => snakeGame("Space Tetris", "#4488ff", "#0a0a1a", 110),

  // Arcade - Breakout (5 games)
  "sc-034": () => breakoutGame("Tetris Neon", "#ff44ff", "#0a0810", 5),
  "sc-041": () => breakoutGame("Pinball Wizard", "#ffaa44", "#100a08", 4),
  "sc-046": () => pongGame("Pong Championship", "#44ffaa", "#0a0a0a", 3.5),
  "sc-048": () => breakoutGame("Neon Breakout", "#00ffff", "#080a0a", 5),
  "sc-069": () => breakoutGame("Cannon Blast", "#ff6644", "#100808", 4),
  "sc-081": () => whackGame("Whack-a-Mole Pro", "#ff8844", "#1a1008", "🐹"),

  // Puzzle - Memory (6 games)
  "sc-005": () => memoryGame("Block Blast Mania", "#ff4488", "#0a0810", 8),
  "sc-012": () => memoryGame("Word Wizard", "#aa88ff", "#0e0a14", 6),
  "sc-017": () => memoryGame("Puzzle Kingdoms", "#ff8844", "#140a08", 8),
  "sc-028": () => memoryGame("Memory Card Master", "#44aaff", "#080a14", 8),
  "sc-053": () => memoryGame("Jigsaw Universe", "#ff44aa", "#140810", 6),
  "sc-072": () => memoryGame("Nonogram Pro", "#88aaff", "#0a0a14", 8),
  "sc-083": () => memoryGame("Slide Puzzle Deluxe", "#44ffcc", "#0a140e", 6),

  // Puzzle - 2048 (4 games)
  "sc-022": () => game2048("Sudoku Master AI", "#ffcc44", "#14100a", ),
  "sc-038": () => game2048("Crossword AI", "#44aaff", "#0a0a14"),
  "sc-064": () => game2048("Solitaire Royale", "#44ff88", "#0a140a"),
  "sc-074": () => game2048("Alchemy Lab", "#ffaa44", "#14100a"),
  "sc-097": () => game2048("2048 Infinity", "#ff8844", "#1a0e08"),

  // Puzzle - Math/Trivia reaction
  "sc-058": () => reactionGame("Math Blaster", "#44ff88", "#0a140a"),
  "sc-090": () => reactionGame("Trivia Blitz", "#ff4488", "#140810"),

  // Action - Dodge (8 games)
  "sc-006": () => dodgeGame("Zombie Survival Arena", "#88ff44", "#0a100a", 3),
  "sc-009": () => dodgeGame("Ninja Runner", "#ff4444", "#140808", 3.5),
  "sc-011": () => dodgeGame("Cyber Tanks", "#44ccff", "#080a10", 3),
  "sc-021": () => dodgeGame("Mech Arena Battle", "#ff8844", "#140a08", 3.5),
  "sc-025": () => dodgeGame("Lava Escape", "#ff4444", "#1a0808", 4),
  "sc-030": () => dodgeGame("Battle Royale Mini", "#44ff44", "#081008", 3),
  "sc-044": () => platformerGame("Stickman Fighter", "#ffcc44", "#14100a"),
  "sc-052": () => dodgeGame("Sniper Elite 2D", "#88aaff", "#0a0a14", 2.5),
  "sc-057": () => dodgeGame("Vampire Survivors HD", "#ff44aa", "#140810", 3.5),
  "sc-065": () => dodgeGame("Samurai Slash", "#ff8844", "#1a0e08", 3),
  "sc-071": () => platformerGame("Gravity Flip", "#44ffaa", "#0a1410"),
  "sc-075": () => platformerGame("Pixel Warriors", "#ff6644", "#140808"),
  "sc-082": () => dodgeGame("Heist Escape", "#ffcc44", "#141008", 3.5),
  "sc-089": () => dodgeGame("Shadow Assassin", "#8844ff", "#0a0814", 3),
  "sc-096": () => platformerGame("Kung Fu Master", "#ff4444", "#140808"),
  "sc-040": () => spaceShooter("Archer Legend", "#44ff88", "#081408", 2),

  // Casual - Catch/Flappy/Tap (remaining)
  "sc-007": () => flappyGame("Flappy Rocket", "#ff6644", "#0a0808", 120),
  "sc-010": () => catchGame("Color Match Frenzy", "#ff44ff", "#0a080a", "🌈", "💣"),
  "sc-015": () => flappyGame("Bouncy Ball Adventure", "#44aaff", "#080a14", 130),
  "sc-020": () => catchGame("Bubble Pop Saga", "#ff88cc", "#140a10", "🫧", "💥"),
  "sc-029": () => flappyGame("Sky Diver", "#44ccff", "#08081a", 110),
  "sc-031": () => clickerGame("Crypto Clicker", "#ffcc44", "#141008", "💰"),
  "sc-036": () => catchGame("Fruit Ninja HD", "#88ff44", "#0a1408", "🍎", "💣"),
  "sc-045": () => clickerGame("Cat Café Tycoon", "#ff88aa", "#140a0e", "🐱"),
  "sc-051": () => catchGame("Gem Collector", "#44ffcc", "#0a1410", "💎", "🪨"),
  "sc-054": () => clickerGame("Farm Simulator AI", "#88cc44", "#0e1408", "🌾"),
  "sc-061": () => whackGame("Tap Tap Hero", "#ff44aa", "#140810", "🎵"),
  "sc-068": () => reactionGame("Stack Tower", "#ffaa44", "#14100a"),
  "sc-076": () => clickerGame("Ice Cream Tycoon", "#ff88cc", "#140a10", "🍦"),
  "sc-080": () => flappyGame("Jetpack Joyride HD", "#ffcc44", "#141008", 115),
  "sc-087": () => flappyGame("Paper Plane Glider", "#88ccff", "#080a14", 135),
  "sc-094": () => whackGame("Balloon Pop Party", "#ff4488", "#140810", "🎈"),

  // Strategy (remaining)
  "sc-004": () => ticTacToe("Chess AI Master", "#44aaff", "#080a14"),
  "sc-008": () => ticTacToe("Tower Defense Pro", "#ff8844", "#140a08"),
  "sc-014": () => clickerGame("Space Colony Tycoon", "#4488ff", "#080a1a", "🚀"),
  "sc-024": () => clickerGame("Idle Empire Builder", "#ffcc44", "#14100a", "🏰"),
  "sc-035": () => ticTacToe("Planet Conqueror", "#44ff88", "#0a140a"),
  "sc-039": () => clickerGame("Robot Factory", "#88aaff", "#0a0a14", "🤖"),
  "sc-047": () => ticTacToe("Kingdom Wars", "#ff6644", "#140808"),
  "sc-062": () => ticTacToe("Warzone Tactics", "#88aaff", "#0a0a14"),
  "sc-079": () => ticTacToe("Siege Master", "#ff8844", "#140a08"),
  "sc-086": () => clickerGame("Civilization Lite", "#44ccaa", "#0a1410", "🏛️"),
  "sc-093": () => clickerGame("Ant Colony", "#cc8844", "#140e08", "🐜"),
  "sc-100": () => clickerGame("Fortress Builder", "#8888ff", "#0a0a14", "🏰"),

  // Remaining arcade
  "sc-043": () => memoryGame("Maze Runner 3D", "#44aaff", "#080a14", 8),
  "sc-070": () => ticTacToe("Checkers Champion", "#ff8844", "#140a08"),
};

export function getGameHtml(id: string): string | null {
  const factory = templateMap[id];
  return factory ? factory() : null;
}
