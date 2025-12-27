(function(){
  const screenEl = document.getElementById('screen');
  const keys = document.querySelectorAll('.keys button');
  let expr = '';
  let lastWasResult = false;

  function update(){
    screenEl.textContent = expr || '0';
  }

  function append(ch){
    if(expr.length > 200) return;
    const isDigitOrDot = /^[0-9.]$/.test(ch);
    const isOperator = /[+\-*/%×÷]/.test(ch);
    if(lastWasResult){
      if(isDigitOrDot || expr === 'Error'){
        expr = '';
      }
      lastWasResult = false;
    }
    expr += ch;
    update();
  }

  function clearAll(){ expr = ''; lastWasResult = false; update(); }
  function back(){ expr = expr.slice(0, -1); update(); }

  function compute(){
    if(!expr.trim()) return;
    const raw = expr.replace(/×/g, '*').replace(/÷/g, '/');
    try{
      const result = Function('return (' + raw + ')')();
      expr = String(result);
      lastWasResult = true;
    }catch(e){
      expr = 'Error';
    }
    update();
  }

  keys.forEach(btn=>{
    const action = btn.dataset.action;
    const val = btn.dataset.value;
    btn.addEventListener('click', ()=>{
      if(action === 'clear') clearAll();
      else if(action === 'back') back();
      else if(action === 'equal') compute();
      else if(val) append(val);
    });
  });

  document.addEventListener('keydown', (e)=>{
    const {key} = e;
    if((/^[0-9]$/).test(key)){
      append(key); return;
    }
    if(key === 'Enter' || key === '='){ e.preventDefault(); compute(); return; }
    if(key === 'Backspace'){ back(); return; }
    if(key === 'Escape'){ clearAll(); return; }
    if(key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%' || key === '(' || key === ')'){
      append(key);
      return;
    }
  });

  update();
})();
