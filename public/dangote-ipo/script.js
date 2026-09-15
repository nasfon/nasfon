/**
 * Dangote Refinery IPO Presentation
 * Sponsored by NasFon
 */

(function () {
    'use strict';

    // State
    let currentSlide = 1;
    const totalSlides = 17;
    let isAnimating = false;
    let isFullscreen = false;
    let notesVisible = false;

    // DOM Elements
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const progressFill = document.getElementById('progressFill');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const overviewBtn = document.getElementById('overviewBtn');
    const overviewModal = document.getElementById('overviewModal');
    const closeModal = document.getElementById('closeModal');
    const overviewGrid = document.getElementById('overviewGrid');
    const preloader = document.getElementById('preloader');
    const progressDots = document.getElementById('progressDots');
    const speakerNotes = document.getElementById('speakerNotes');
    const notesContent = document.getElementById('notesContent');
    const closeNotes = document.getElementById('closeNotes');

    // Slide titles for overview
    const slideTitles = [
        'Title',
        'About NasFon',
        'About This Session',
        'What You Will Learn',
        'What is an IPO?',
        'How IPOs Work',
        'Why IPOs Matter',
        'About Dangote Refinery',
        'Dangote IPO Details',
        'How to Invest (1-3)',
        'How to Invest (4-5)',
        'Risks: General',
        'Risks: IPO Specific',
        'Scam Red Flags',
        'How to Protect Yourself',
        'Key Takeaways',
        'Closing'
    ];

    // Speaker notes for each slide
    const speakerNotesData = [
        'Welcome everyone. Today we\'re here to learn about the stock market and the Dangote Refinery IPO. Remember — this is purely educational, not investment advice.',
        'NasFon is a software company, but we also care about financial literacy. We provide free education to help our community make informed decisions.',
        'This session is NOT sponsored by Dangote or any company. We do not receive any payment. Our only goal is to educate and protect you.',
        'Here\'s what we\'ll cover today: IPO basics, the Dangote Refinery IPO specifically, how to invest legally, and how to avoid scams.',
        'An IPO is when a private company sells shares to the public for the first time. Think of it as the company going from private to public ownership.',
        'The IPO process has 4 steps: company decides to go public, SEC reviews and approves, shares are offered to public, then trading begins on the exchange.',
        'Companies do IPOs to raise capital for growth. For you as an investor, IPOs offer a chance to own part of big companies — but they carry risks.',
        'Dangote Refinery cost $20 billion to build. It\'s the world\'s largest single-train refinery and processes 700,000 barrels per day.',
        'Key IPO details: Price is fixed at ₦525 per share. Minimum purchase is 10 shares (₦5,250). Offer period: September 14 to October 13, 2026.',
        'Step 1: Open a CSCS account. Step 2: Choose a licensed stockbroker (verify on sec.gov.ng). Step 3: Apply during the offer period.',
        'Step 4: Pay the full amount when applying. Step 5: Wait for allotment and listing on NGX. Never use unofficial channels!',
        'General investment risks: You can lose money, prices fluctuate daily, and dividends are never guaranteed. Always invest carefully.',
        'IPO-specific risks: No trading history makes prediction harder, hype can lead to bad decisions, and lock-up periods affect supply.',
        'SCAM RED FLAGS: Guaranteed returns, promises to double your money, pressure to act fast, and unlicensed operators are all warning signs.',
        'Protect yourself: Verify on sec.gov.ng, use official channels only, never share your PIN, get everything in writing, and report suspicious activity.',
        'Key takeaways: IPOs aren\'t guaranteed wins, do your research, only use licensed channels, invest only what you can afford to lose, and ask professionals.',
        'Thank you for attending! Remember to keep learning, find a licensed advisor, and stay safe from scams. Knowledge is your best investment.'
    ];

    // Initialize
    function init() {
        createOverviewGrid();
        createProgressDots();
        updateUI();
        bindEvents();
        startCountdown();

        // Hide preloader
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 800);
    }

    // Create overview grid items
    function createOverviewGrid() {
        for (let i = 1; i <= totalSlides; i++) {
            const item = document.createElement('div');
            item.className = `overview-item ${i === 1 ? 'active' : ''}`;
            item.textContent = `${i}. ${slideTitles[i - 1]}`;
            item.dataset.slide = i;
            item.addEventListener('click', () => {
                goToSlide(i);
                closeOverview();
            });
            overviewGrid.appendChild(item);
        }
    }

    // Create progress dots
    function createProgressDots() {
        for (let i = 1; i <= totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 1 ? 'active' : ''}`;
            dot.dataset.slide = i;
            dot.addEventListener('click', () => goToSlide(i));
            progressDots.appendChild(dot);
        }
    }

    // Navigate to slide
    function goToSlide(targetSlide) {
        if (isAnimating || targetSlide === currentSlide) return;
        if (targetSlide < 1 || targetSlide > totalSlides) return;

        isAnimating = true;

        const currentElement = slides[currentSlide - 1];
        const targetElement = slides[targetSlide - 1];
        const direction = targetSlide > currentSlide ? 'left' : 'right';

        // Exit current slide
        currentElement.classList.remove('active');
        currentElement.classList.add(direction === 'left' ? 'exit-left' : 'exit-right');

        // Enter target slide
        targetElement.classList.remove('exit-left', 'exit-right');
        targetElement.classList.add('active');

        currentSlide = targetSlide;
        updateUI();
        updateNotes();

        setTimeout(() => {
            currentElement.classList.remove('exit-left', 'exit-right');
            isAnimating = false;
        }, 500);
    }

    function nextSlide() {
        if (currentSlide < totalSlides) {
            goToSlide(currentSlide + 1);
        }
    }

    function prevSlide() {
        if (currentSlide > 1) {
            goToSlide(currentSlide - 1);
        }
    }

    // Update UI elements
    function updateUI() {
        slideCounter.textContent = `${currentSlide} / ${totalSlides}`;
        progressFill.style.width = `${(currentSlide / totalSlides) * 100}%`;

        // Update nav buttons
        prevBtn.style.opacity = currentSlide === 1 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentSlide === 1 ? 'none' : 'all';
        nextBtn.style.opacity = currentSlide === totalSlides ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentSlide === totalSlides ? 'none' : 'all';

        // Update overview items
        document.querySelectorAll('.overview-item').forEach((item, index) => {
            item.classList.toggle('active', index + 1 === currentSlide);
        });

        // Update progress dots
        document.querySelectorAll('.progress-dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === currentSlide);
        });
    }

    // Speaker notes
    function updateNotes() {
        notesContent.textContent = speakerNotesData[currentSlide - 1];
    }

    function toggleNotes() {
        notesVisible = !notesVisible;
        speakerNotes.classList.toggle('hidden', !notesVisible);
        if (notesVisible) updateNotes();
    }

    // Countdown timer
    function startCountdown() {
        const offerStart = new Date('2026-09-14T00:00:00');
        const offerEnd = new Date('2026-10-13T23:59:59');

        function update() {
            const now = new Date();
            let target, label;

            if (now < offerStart) {
                target = offerStart;
                label = 'Starts in';
            } else if (now <= offerEnd) {
                target = offerEnd;
                label = 'Ends in';
            } else {
                document.getElementById('cdDays').textContent = '0';
                document.getElementById('cdHours').textContent = '0';
                document.getElementById('cdMins').textContent = '0';
                document.getElementById('cdSecs').textContent = '0';
                return;
            }

            const diff = target - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('cdDays').textContent = days;
            document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
            document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
            document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
        }

        update();
        setInterval(update, 1000);
    }

    // Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                isFullscreen = true;
                updateFullscreenIcon();
            });
        } else {
            document.exitFullscreen().then(() => {
                isFullscreen = false;
                updateFullscreenIcon();
            });
        }
    }

    function updateFullscreenIcon() {
        const icon = fullscreenBtn.querySelector('svg');
        if (isFullscreen) {
            icon.innerHTML = '<path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/>';
        } else {
            icon.innerHTML = '<path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>';
        }
    }

    // Overview modal
    function openOverview() {
        overviewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeOverview() {
        overviewModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Touch support
    let touchStartX = 0;
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchEnd(e) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX < 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Wheel support
    let wheelTimeout = null;
    function handleWheel(e) {
        e.preventDefault();
        if (wheelTimeout) return;

        wheelTimeout = setTimeout(() => {
            wheelTimeout = null;
        }, 800);

        if (e.deltaY > 0 || e.deltaX > 0) {
            nextSlide();
        } else if (e.deltaY < 0 || e.deltaX < 0) {
            prevSlide();
        }
    }

    // Bind all events
    function bindEvents() {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeOverview();
                if (notesVisible) toggleNotes();
                return;
            }

            if (overviewModal.classList.contains('active')) return;

            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ':
                case 'PageDown':
                    e.preventDefault();
                    nextSlide();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    prevSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    goToSlide(1);
                    break;
                case 'End':
                    e.preventDefault();
                    goToSlide(totalSlides);
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
                case 'g':
                case 'G':
                    e.preventDefault();
                    openOverview();
                    break;
                case 'n':
                case 'N':
                    e.preventDefault();
                    toggleNotes();
                    break;
                case '1': case '2': case '3': case '4': case '5':
                case '6': case '7': case '8': case '9':
                    if (!e.ctrlKey && !e.metaKey) {
                        goToSlide(parseInt(e.key));
                    }
                    break;
                case '0':
                    goToSlide(10);
                    break;
            }
        });

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        document.addEventListener('wheel', handleWheel, { passive: false });

        fullscreenBtn.addEventListener('click', toggleFullscreen);
        overviewBtn.addEventListener('click', openOverview);
        closeModal.addEventListener('click', closeOverview);
        closeNotes.addEventListener('click', toggleNotes);
        overviewModal.addEventListener('click', (e) => {
            if (e.target === overviewModal) {
                closeOverview();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            isFullscreen = !!document.fullscreenElement;
            updateFullscreenIcon();
        });

        // Hide hints after first interaction
        let hintsHidden = false;
        function hideHints() {
            if (!hintsHidden) {
                const hints = document.getElementById('keyboardHints');
                if (hints) {
                    hints.style.opacity = '0';
                    setTimeout(() => {
                        hints.style.display = 'none';
                    }, 300);
                }
                hintsHidden = true;
            }
        }

        document.addEventListener('keydown', hideHints, { once: true });
        document.addEventListener('click', hideHints, { once: true });
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
