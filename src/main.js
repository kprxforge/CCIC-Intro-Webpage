// main logic
function init() {
    const idleState = document.getElementById('idle-state');
    const curtains = document.getElementById('curtains');
    const leftCurtain = curtains.querySelector('.left');
    const rightCurtain = curtains.querySelector('.right');
    const countdownContainer = document.getElementById('countdown-container');
    const countdownNumber = document.getElementById('countdown-number');
    const bokehScene = document.getElementById('bokeh-scene');
    const phase3 = document.getElementById('phase3');
    const phase4 = document.getElementById('phase4');
    const phase5 = document.getElementById('phase5');

    const bgMusic = new Audio('https://drive.google.com/uc?export=download&id=139MsZrBYEoBJxIWzYLgkshyfaJPiIkmV');
    bgMusic.loop = true;
    bgMusic.volume = 0.6;

    let audioCtx;

    function playTick(isFinal = false) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'sine';
        if (isFinal) {
            osc.frequency.setValueAtTime(800, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.8);
        } else {
            osc.frequency.setValueAtTime(1000, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.1);
        }
    }

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    function createBokeh() {
        const orbsContainer = document.getElementById('orbs-container');
        const particlesContainer = document.getElementById('particles-container');
        const colors = ['#fefdfb', '#d4af37', '#0a0f2e', '#111b47']; // white, gold, navy, lighter navy
        
        for (let i = 0; i < 14; i++) {
            const orb = document.createElement('div');
            orb.className = 'orb';
            orb.style.width = Math.random() * 200 + 100 + 'px';
            orb.style.height = orb.style.width;
            orb.style.left = Math.random() * 100 + 'vw';
            orb.style.top = Math.random() * 100 + 'vh';
            orb.style.background = colors[Math.floor(Math.random() * colors.length)];
            orb.style.animationDuration = (Math.random() * 10 + 10) + 's';
            orb.style.animationDelay = '-' + (Math.random() * 10) + 's';
            orbsContainer.appendChild(orb);
        }

        for (let i = 0; i < 20; i++) {
            const pt = document.createElement('div');
            pt.className = 'particle';
            pt.style.left = Math.random() * 100 + 'vw';
            pt.style.bottom = '-' + (Math.random() * 20 + 10) + 'px';
            pt.style.color = Math.random() > 0.5 ? '#fefdfb' : '#d4af37';
            pt.style.backgroundColor = 'currentColor';
            pt.style.animationDuration = (Math.random() * 5 + 5) + 's';
            pt.style.animationDelay = (Math.random() * 5) + 's';
            particlesContainer.appendChild(pt);
        }
    }

    idleState.addEventListener('click', async () => {
        // init audio strictly on user interaction
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        bgMusic.play().catch(e => console.log('Audio play failed:', e));

        idleState.style.opacity = '0';
        await sleep(1000);
        idleState.classList.add('hidden');

        countdownContainer.classList.remove('hidden');

        // Phase 1: Countdown
        for (let i = 10; i >= 1; i--) {
            countdownNumber.textContent = i;
            
            // Re-trigger animation
            countdownNumber.style.animation = 'none';
            void countdownNumber.offsetWidth; 
            countdownNumber.style.animation = 'number-pop 1s ease-in-out forwards';

            playTick(i === 1);
            await sleep(1000);
        }

        // Phase 2: Curtains Open
        countdownContainer.classList.add('hidden');
        leftCurtain.classList.add('open');
        rightCurtain.classList.add('open');
        
        createBokeh();
        bokehScene.classList.remove('hidden');
        // trigger fade in
        setTimeout(() => bokehScene.classList.add('visible'), 100);

        await sleep(2800); // Wait for curtains to open
        curtains.classList.add('hidden');

        // Phase 3: Department Name (Updated Stagger)
        phase3.classList.remove('hidden');
        const staggers = phase3.querySelectorAll('.stagger-line');
        for (let i = 0; i < staggers.length; i++) {
            await sleep(400);
            staggers[i].classList.add('visible');
        }
        await sleep(3000); // hold
        phase3.style.transition = 'opacity 1s';
        phase3.style.opacity = '0';
        await sleep(1000);
        phase3.classList.add('hidden');

        // Phase 4: Proudly Presents
        phase4.classList.remove('hidden');
        setTimeout(() => phase4.classList.add('visible'), 50);
        await sleep(2800); // hold
        phase4.style.transition = 'opacity 1s';
        phase4.style.opacity = '0';
        await sleep(1000);
        phase4.classList.add('hidden');

        // Phase 5: Logo Reveal
        phase5.classList.remove('hidden');
        setTimeout(() => phase5.classList.add('visible'), 50);

        const logo = document.getElementById('ccic-logo');
        const stars = document.querySelectorAll('.starburst');

        // 1. Logo scales in
        logo.classList.add('logo-reveal-anim');
        
        // Custom CCIC Text Reveals
        setTimeout(async () => {
             const ccicText = document.getElementById('ccic-text');
             if(ccicText) ccicText.style.opacity = '1';
             
             await sleep(800);
             const ccicLine = document.getElementById('ccic-divider');
             if(ccicLine) ccicLine.style.width = '120px';
             
             const ccicSub = document.getElementById('ccic-subtitle');
             if(ccicSub) ccicSub.style.opacity = '1';
        }, 1200); // Trigger when logo scale-in finishes
        
        // 3. Stars pulse
        stars.forEach((s, idx) => {
            setTimeout(() => s.classList.add('star-pulse'), idx * 500);
        });

        // 4. Logo glow + rotate continuous
        await sleep(2000); // after ring draws
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
        logo.classList.remove('logo-reveal-anim');
        logo.style.animation = 'logo-glow 4s infinite alternate ease-in-out';
    });
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
