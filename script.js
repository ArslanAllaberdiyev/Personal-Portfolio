// Global University Database
const uniDatabase = {
    'uestc': { en: 'UESTC', cn: '电子科技大学' },
    'tsinghua': { en: 'Tsinghua University', cn: '清华大学' },
    'sjtu': { en: 'Shanghai Jiao Tong University', cn: '上海交通大学' },
    'zju': { en: 'Zhejiang University', cn: '浙江大学' },
    'xidian': { en: 'Xidian University', cn: '西安电子科技大学'},
    'dut': { en: 'Dalian University of Technology', cn: '大连理工大学'},
    'scut': { en: 'South China University of Technology', cn: '华南理工大学'}
};

function toggleLanguage() {
    const langBtn = document.getElementById('lang-text');
    if (!langBtn) return;

    const isCurrentlyEN = langBtn.innerText === "EN";
    const nextLang = isCurrentlyEN ? "中文" : "EN";
    const dataLang = isCurrentlyEN ? "cn" : "en";

    // Update button text
    langBtn.innerText = nextLang;

    // Update all translatable elements
    document.querySelectorAll('[data-en]').forEach(el => {
        const translation = el.getAttribute(`data-${dataLang}`);
        if (translation) {
            el.innerHTML = translation;
        }
    });

    // Save preference
    localStorage.setItem('userLanguage', nextLang);
}

function updateTime() {
    const timeDisplay = document.getElementById('local-time');
    if (!timeDisplay) return;
    const now = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
    timeDisplay.innerText = now;
}

function copyEmail() {
    const email = "allaberdiyew077@gmail.com";
    navigator.clipboard.writeText(email);
    const btn = document.querySelector('.contact-main .p-btn');
    const isCN = document.getElementById('lang-text').innerText === "中文";
    
    btn.innerText = isCN ? "已复制!" : "COPIED!";
    btn.style.background = "#4ade80";
    
    setTimeout(() => {
        btn.innerText = isCN ? btn.getAttribute('data-cn') : btn.getAttribute('data-en');
        btn.style.background = "#fff";
    }, 2000);
}

// Single Initialization Block
document.addEventListener('DOMContentLoaded', () => {
    // 1. Determine Language First
    const savedLang = localStorage.getItem('userLanguage') || "EN";
    const langBtn = document.getElementById('lang-text');
    
    // Set initial button state without triggering toggle yet
    if (langBtn) langBtn.innerText = savedLang;

    // 2. Handle University Logic (Persistence & URL)
    const urlParams = new URLSearchParams(window.location.search);
    let uniKey = urlParams.get('ref') || sessionStorage.getItem('active_uni');

    if (uniKey && uniDatabase[uniKey]) {
        sessionStorage.setItem('active_uni', uniKey);
        const selected = uniDatabase[uniKey];

        // Update university names based on current language
        document.querySelectorAll('.dynamic-uni').forEach(el => {
            el.innerText = (savedLang === "中文") ? selected.cn : selected.en;

            const parent = el.closest('[data-en]');
            if (parent) {
                const oldEn = parent.getAttribute('data-en');
                const oldCn = parent.getAttribute('data-cn');
                const enRegex = /UESTC|Tsinghua University|Shanghai Jiao Tong University|Zhejiang University|Xidian University|South China University of Technology|Dalian University of Technology/g;
                const cnRegex = /电子科技大学|清华大学|上海交通大学|浙江大学|华南理工大学|西安电子科技大学|大连理工大学/g;

                parent.setAttribute('data-en', oldEn.replace(enRegex, selected.en));
                parent.setAttribute('data-cn', oldCn.replace(cnRegex, selected.cn));
            }
        });

        // Add ref to all internal links
        document.querySelectorAll('a[href]').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.includes('.html') && !href.includes('?ref=')) {
                link.href = href.includes('?') ? `${href}&ref=${uniKey}` : `${href}?ref=${uniKey}`;
            }
        });
    }

    // 3. Apply Language Translations (If saved language is Chinese)
    if (savedLang === "中文") {
        document.querySelectorAll('[data-en]').forEach(el => {
            const translation = el.getAttribute('data-cn');
            if (translation) el.innerHTML = translation;
        });
    }

    // 4. Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bento-item, .profile-card, .info-card, .reason-box, .goal-card').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
        observer.observe(el);
    });

    // 5. Clock Setup
    updateTime();
    setInterval(updateTime, 1000);
});

// Helper style for animations
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(revealStyle);
