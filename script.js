
function toggleLanguage() {
    const langBtn = document.getElementById('lang-text');
    const isEnglish = langBtn.innerText === "EN";
    const nextLang = isEnglish ? "中文" : "EN";
    const dataLang = isEnglish ? "cn" : "en";

    langBtn.innerText = nextLang;

    // Use innerHTML instead of innerText to keep the <span> and <br> tags
    document.querySelectorAll('[data-en]').forEach(el => {
        const translation = el.getAttribute(`data-${dataLang}`);
        if (translation) {
            el.innerHTML = translation;
        }
    });

    localStorage.setItem('userLanguage', isEnglish ? "中文" : "EN");
}


// Initialization & Persistence
document.addEventListener('DOMContentLoaded', () => {
    // Check saved language
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang === "中文") {
        const langBtn = document.getElementById('lang-text');
        langBtn.innerText = "EN"; // Prep for toggle
        toggleLanguage();
    }

    // Scroll Animations
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

    // Real-time Clock
    updateTime();
    setInterval(updateTime, 1000);
});

// Helper style for animations
const revealStyle = document.createElement('style');
revealStyle.innerHTML = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(revealStyle);

// Contact Functions
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

function updateTime() {
    const timeDisplay = document.getElementById('local-time');
    if (!timeDisplay) return;
    const now = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
    timeDisplay.innerText = now;
}
