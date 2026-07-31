// =====================================================
// FADE-IN DAS SEÇÕES (igual ao original)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const section_animados = document.querySelectorAll('.fade-section');

    const elementos_na_visao = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
            } else {
                entrada.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });
    section_animados.forEach(el => elementos_na_visao.observe(el));
});

// =====================================================
// BARRINHA DE CONHECIMENTO — "anda" até o nível quando o
// card fica visível na tela (estilo barra de vida enchendo).
// Cada .pixel recebe um índice (--i) usado pelo CSS como
// delay de transição, então eles acendem em sequência da
// esquerda pra direita até o nível definido em --conhecimento.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const cards_habilidade = document.querySelectorAll('.card-habilidade');

    cards_habilidade.forEach(card => {
        const pixels = card.querySelectorAll('.pixel');
        pixels.forEach((pixel, indice) => {
            pixel.style.setProperty('--i', indice);
        });
    });

    const observer_barrinhas = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            const barrinha = entrada.target.querySelector('.barrinha-conhecimento');
            if (!barrinha) return;

            if (entrada.isIntersecting) {
                barrinha.classList.add('barrinha-ativa');
            } else {
                // sai da tela: reseta pra animar de novo da próxima vez que aparecer
                barrinha.classList.remove('barrinha-ativa');
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -40px 0px'
    });

    cards_habilidade.forEach(card => observer_barrinhas.observe(card));
});

// =====================================================
// MODAL DE PROJETOS — clique num card de Hard-Skill abre um
// pop-up listando projetos feitos com aquela tecnologia.
//
// COMO ADICIONAR/EDITAR PROJETOS:
// Edite o objeto PROJETOS_POR_HABILIDADE abaixo. A chave tem
// que ser igual ao "id" do card no HTML (ex: id="python_card").
// Cada projeto aceita: nome, descricao, link (texto do botão
// e URL). Se um card não tiver projetos ainda, deixe a lista
// vazia [] — o modal mostra uma mensagem de "em breve".
// =====================================================
const PROJETOS_POR_HABILIDADE = {
    'python_card': [
        {
            nome: 'Nome do projeto em Python',
            descricao: 'Troque por uma descrição curta do que o projeto faz, quais bibliotecas usou e qual problema resolve.',
            linkTexto: 'Ver no GitHub',
            linkUrl: '#'
        }
    ],
    'card-cpp': [],
    'card-nocode': [],
    'card-html': [],
    'card-js': [],
    'card-git': [],
    'card-react': [],
    'card-supabase': [],
    'card-postgres': [],
    'card-c': [],
    'card-cloudflare': [],
    'card-csharp': []
};

document.addEventListener('DOMContentLoaded', () => {
    const cards_habilidade = document.querySelectorAll('.card-habilidade');

    // acessibilidade: cards viram "botões" navegáveis por teclado
    cards_habilidade.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const nomeTech = card.querySelector('h3')?.textContent || 'habilidade';
        card.setAttribute('aria-label', 'Ver projetos de ' + nomeTech);
    });

    function abrirModalProjetos(card) {
        const nomeTech = card.querySelector('h3')?.textContent || '';
        const icone = card.querySelector('.icone')?.textContent || '';
        const corTech = getComputedStyle(card).getPropertyValue('--marcha-cor');
        const projetos = PROJETOS_POR_HABILIDADE[card.id] || [];

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const caixa = document.createElement('div');
        caixa.className = 'modal-caixa pixel-frame';
        caixa.style.setProperty('--marcha-cor', corTech);

        let projetosHtml = '';
        if (projetos.length === 0) {
            projetosHtml = '<p class="modal-sem-projetos">Ainda não adicionei projetos aqui — em breve!</p>';
        } else {
            projetosHtml = projetos.map(p => `
                <div class="modal-projeto">
                    <p class="modal-projeto-nome">&gt; ${p.nome}</p>
                    <p class="modal-projeto-desc">${p.descricao}</p>
                    <a href="${p.linkUrl}" class="modal-projeto-link" target="_blank" rel="noopener noreferrer">${p.linkTexto} ↗</a>
                </div>
            `).join('');
        }

        caixa.innerHTML = `
            <button class="modal-fechar" aria-label="Fechar">X</button>
            <div class="modal-cabecalho">
                <span class="modal-icone">${icone}</span>
                <h3 class="modal-titulo">${nomeTech}</h3>
            </div>
            <p class="modal-subtitulo">Projetos feitos com essa tecnologia</p>
            ${projetosHtml}
        `;

        overlay.appendChild(caixa);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        function fecharModal() {
            overlay.remove();
            document.body.style.overflow = '';
            document.removeEventListener('keydown', aoApertarEsc);
            card.focus();
        }

        function aoApertarEsc(e) {
            if (e.key === 'Escape') fecharModal();
        }

        caixa.querySelector('.modal-fechar').addEventListener('click', fecharModal);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) fecharModal(); });
        document.addEventListener('keydown', aoApertarEsc);

        // foco vai pro botão de fechar, pra navegação por teclado começar num lugar previsível
        caixa.querySelector('.modal-fechar').focus();
    }

    cards_habilidade.forEach(card => {
        card.addEventListener('click', () => abrirModalProjetos(card));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                abrirModalProjetos(card);
            }
        });
    });
});

// =====================================================
// TEMA (escuro / retrô) — persiste em localStorage
// O <head> já aplica o tema salvo antes do CSS pintar
// (evita o "flash" do tema errado), aqui é só o toggle.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnTema = document.getElementById('btn-tema');
    const label = document.getElementById('tema-toggle-label');
    const html = document.documentElement;

    function atualizarLabel() {
        const atual = html.getAttribute('data-tema') || 'escuro';
        label.textContent = atual === 'escuro' ? 'CINZA' : 'ESCURO';
    }
    atualizarLabel();

    btnTema.addEventListener('click', () => {
        const atual = html.getAttribute('data-tema') || 'escuro';
        const novo = atual === 'escuro' ? 'retro' : 'escuro';
        html.setAttribute('data-tema', novo);
        try { localStorage.setItem('tema', novo); } catch (e) { /* modo privado, sem problema */ }
        atualizarLabel();
        if (window.__atualizarCoresParticulas) window.__atualizarCoresParticulas();
    });
});

// =====================================================
// BOTÃO DE FECHAR — easter egg (não fecha nada de verdade,
// navegador não deixa script fechar aba que ele não abriu,
// então a gente brinca com isso em vez de fingir que funciona)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const btnFechar = document.getElementById('btn-fechar');
    if (!btnFechar) return;

    btnFechar.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;font-family:"Space Mono",monospace;';

        const caixa = document.createElement('div');
        caixa.style.cssText = 'background:#1c1c1c;color:#e6e6e6;border:3px solid #000;box-shadow:5px 5px 0 #000;padding:1.5rem;max-width:280px;text-align:center;';
        caixa.innerHTML = '<p style="font-family:\'Silkscreen\',monospace;font-size:0.85rem;color:#FFD43B;margin-bottom:0.8rem;">&lt;system&gt;</p><p style="font-size:0.8rem;margin-bottom:1.2rem;">Esse botão é só decoração da janela retrô — mas já que clicou, que tal dar uma olhada no GitHub em vez de fechar?</p>';

        const botoes = document.createElement('div');
        botoes.style.cssText = 'display:flex;gap:0.6rem;justify-content:center;';

        const btnOk = document.createElement('button');
        btnOk.textContent = 'Beleza';
        btnOk.style.cssText = 'font-family:"Silkscreen",monospace;font-size:0.7rem;background:#FFD43B;color:#111;border:2px solid #000;padding:6px 12px;cursor:pointer;';
        btnOk.addEventListener('click', () => overlay.remove());

        botoes.appendChild(btnOk);
        caixa.appendChild(botoes);
        overlay.appendChild(caixa);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    });
});

// =====================================================
// BOOT SCREEN — só na primeira visita da sessão, pulável
// a qualquer momento com clique ou tecla, e desativado se
// a pessoa pediu "reduzir movimento" no sistema dela.
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let jaViu = false;
    try { jaViu = sessionStorage.getItem('boot_visto') === '1'; } catch (e) { jaViu = false; }

    if (reduzMovimento || jaViu) return;

    const linhas = [
        '&gt; carregando portfolio.py ...',
        '&gt; importando habilidades ...',
        '&gt; compilando personalidade ...',
        '&gt; boot concluido.'
    ];

    const boot = document.createElement('div');
    boot.id = 'boot-screen';

    linhas.forEach((texto, i) => {
        const p = document.createElement('p');
        p.className = 'boot-linha';
        p.style.animationDelay = (i * 0.35) + 's';
        p.innerHTML = texto;
        boot.appendChild(p);
    });

    const barraWrap = document.createElement('div');
    barraWrap.className = 'boot-barra-wrap';
    const barra = document.createElement('div');
    barra.className = 'boot-barra';
    barraWrap.appendChild(barra);
    boot.appendChild(barraWrap);

    const dica = document.createElement('p');
    dica.className = 'boot-dica';
    dica.textContent = 'clique ou aperte qualquer tecla pra pular';
    boot.appendChild(dica);

    document.body.appendChild(boot);

    function encerrarBoot() {
        if (!boot.isConnected) return;
        boot.classList.add('boot-saindo');
        try { sessionStorage.setItem('boot_visto', '1'); } catch (e) { /* sem problema */ }
        setTimeout(() => boot.remove(), 300);
        document.removeEventListener('keydown', encerrarBoot);
    }

    boot.addEventListener('click', encerrarBoot);
    document.addEventListener('keydown', encerrarBoot);
    setTimeout(encerrarBoot, 2400);
});

// =====================================================
// BACKGROUND DE PARTÍCULAS (igual ao original, mas as
// cores reagem à troca de tema em tempo real)
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    const paletas = {
        escuro: { pontos: ['#306998', '#FFD43B', '#9CA3AF'], linha: '#306998' },
        retro:  { pontos: ['#245880', '#8a6400', '#6b6d68'], linha: '#245880' }
    };

    const config = {
        count: Math.min(Math.floor(window.innerWidth / 10), 100),
        maxDist: 130,
        speed: 0.4,
        size: { min: 1, max: 2.5 },
        colors: paletas.escuro.pontos,
        linha: paletas.escuro.linha,
        opacity: 0.7
    };

    window.__atualizarCoresParticulas = function () {
        const atual = document.documentElement.getAttribute('data-tema') || 'escuro';
        const paleta = paletas[atual] || paletas.escuro;
        config.colors = paleta.pontos;
        config.linha = paleta.linha;
        particles.forEach(p => { p.color = config.colors[Math.floor(Math.random() * config.colors.length)]; });
    };
    window.__atualizarCoresParticulas();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.size = Math.random() * (config.size.max - config.size.min) + config.size.min;
            this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x <= 0 || this.x >= canvas.width) this.vx *= -1;
            if (this.y <= 0 || this.y >= canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = config.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < config.count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < config.maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = config.linha;
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = (1 - dist / config.maxDist) * 0.25;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    init();
    animate();
});