(function(){
  const systemColorControl = document.getElementById('system-color');
  const audienceDesignerControl = document.getElementById('audience-designer');
  const audienceEngineerControl = document.getElementById('audience-engineer');

  const codeHighlightStylesLight = document.getElementById('hljs-light');
  const codeHighlightStylesDark = document.getElementById('hljs-dark');

  function toggleCodeHighlight() {
    const body = window.getComputedStyle(document.body);
    const color = body.getPropertyValue('background-color');
    const average = color.replace(/rgba?\(([^\)]+)\)/gm, '$1').split(',').slice(0, 3).reduce((sum, val) => sum + Number(val), 0) / 3;
    const scale = Math.round(average / 255); // 0 === dark, 1 === light
    if (Boolean(scale)) {
      codeHighlightStylesDark.setAttribute('disabled', '');
      codeHighlightStylesLight.removeAttribute('disabled');
    } else {
      codeHighlightStylesLight.setAttribute('disabled', '');
      codeHighlightStylesDark.removeAttribute('disabled');
    }
  }

  function setSystemColor(bool) {
    if (bool) {
      document.documentElement.removeAttribute('theme');
      localStorage.removeItem('theme');
    } else {
      document.documentElement.setAttribute('theme', 'inverse');
      localStorage.setItem('theme', 'inverse');
    }
    window.setTimeout(toggleCodeHighlight, 0);
  }

  function setAudienceVisibility(type, bool) {
    const audienceSummary = document.querySelectorAll(`select-summary.audience-${type}`);
    [...audienceSummary].forEach((summary) => summary.open = bool);
    if (bool) {
      document.documentElement.removeAttribute(`hide-${type}`);
      localStorage.removeItem(type);
    } else {
      document.documentElement.setAttribute(`hide-${type}`, '');
      localStorage.setItem(type, 'hide');
    }
  }

  systemColorControl.addEventListener('change', (ev) => setSystemColor(ev.detail.chosen));
  audienceDesignerControl.addEventListener('change', (ev) => setAudienceVisibility('designer', ev.detail.chosen));
  audienceEngineerControl.addEventListener('change', (ev) => setAudienceVisibility('engineer', ev.detail.chosen));

  systemColorControl.chosen = !localStorage.getItem('theme');
  audienceDesignerControl.chosen = !localStorage.getItem('designer');
  audienceEngineerControl.chosen = !localStorage.getItem('engineer');

  window.setTimeout(() => { 
    toggleCodeHighlight();
    document.body.style.removeProperty('opacity');
  }, 0);
})();