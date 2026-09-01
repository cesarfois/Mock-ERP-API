document.addEventListener("DOMContentLoaded", function() {
    // Polling because swagger ui might take a moment to render the topbar
    const checkExist = setInterval(function() {
        const topbar = document.querySelector('.topbar-wrapper');
        if (topbar) {
            clearInterval(checkExist);
            
            const btn = document.createElement('a');
            btn.href = '/';
            btn.innerHTML = '← Voltar para Aplicação';
            btn.style.color = '#fff';
            btn.style.textDecoration = 'none';
            btn.style.padding = '8px 16px';
            btn.style.backgroundColor = '#2563eb';
            btn.style.borderRadius = '4px';
            btn.style.fontWeight = 'bold';
            btn.style.fontFamily = 'sans-serif';
            btn.style.marginLeft = '20px';
            btn.style.display = 'inline-block';
            btn.style.transition = 'background-color 0.2s';
            
            btn.onmouseover = function() {
                this.style.backgroundColor = '#1d4ed8';
            };
            btn.onmouseout = function() {
                this.style.backgroundColor = '#2563eb';
            };
            
            topbar.appendChild(btn);
        }
    }, 100);
});
