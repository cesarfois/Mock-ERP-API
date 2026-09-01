document.addEventListener("DOMContentLoaded", function() {
    // Create a custom header
    const header = document.createElement('div');
    header.className = 'custom-header';

    // Title area
    const titleArea = document.createElement('div');
    titleArea.className = 'custom-header-title';
    titleArea.innerHTML = '<h1>Mock ERP / Primavera</h1><p>Documentação Técnica da API</p>';

    // Back button
    const backBtn = document.createElement('a');
    backBtn.href = 'javascript:void(0)';
    backBtn.onclick = function() { window.location.href = window.location.pathname.replace(/\/docs\/?$/, '/'); };
    backBtn.className = 'custom-header-back-btn';
    backBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
        </svg>
        Voltar para o Painel
    `;

    header.appendChild(titleArea);
    header.appendChild(backBtn);

    // Insert the header at the very top of the body
    document.body.insertBefore(header, document.body.firstChild);
});
