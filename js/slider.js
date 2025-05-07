class SnapCodexSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = [
            'scenario1.html',
            'scenario2.html',
            'scenario3.html',
            'scenario4.html',
            'scenario5.html',
            'scenario6.html',
            'summary.html'
        ];
        this.container = document.querySelector('.slide-container');
        this.dotsContainer = document.querySelector('.slide-dots');
        this.isAnimating = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }

    async init() {
        // popstate 이벤트 핸들러 등록
        window.addEventListener('popstate', (event) => {
            const path = window.location.pathname.replace('/', '');
            const slideIndex = this.slides.indexOf(path);
            if (slideIndex !== -1) {
                this.loadSlide(slideIndex, true);
            }
        });
        await this.loadSlide(this.currentSlide);
        this.setupEventListeners();
        this.createDots();
        this.setupAutoplay();
        this.updateDots();
    }

    async loadSlide(index, skipHistory = false) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        // 로딩 인디케이터 표시
        this.container.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100%;font-size:1.5rem;color:#9ca3af;">로딩 중...</div>';

        try {
            const response = await fetch('/' + this.slides[index]);
            if (!response.ok) throw new Error('슬라이드 파일을 불러올 수 없습니다.');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const content = doc.querySelector('.slide-content');

            if (content) {
                this.container.style.opacity = '0';
                await new Promise(resolve => setTimeout(resolve, 300));
                this.container.innerHTML = content.innerHTML;
                this.container.style.opacity = '1';
                this.currentSlide = index;
                this.updateDots();
                // 스크롤 위치 초기화 (slide-container)
                this.container.scrollTop = 0;
                // 내부 스크롤 영역이 있다면 추가로 보정
                setTimeout(() => {
                    this.container.scrollTop = 0;
                    const scrollable = this.container.querySelector('.scrollable');
                    if (scrollable) scrollable.scrollTop = 0;
                }, 50);
                if (!skipHistory) {
                    window.history.pushState({slide: index}, '', this.slides[index]);
                }
            } else {
                this.container.innerHTML = '<div style="color:#f87171;text-align:center;padding:2rem;">슬라이드 컨텐츠를 찾을 수 없습니다.</div>';
            }
        } catch (error) {
            this.container.innerHTML = `<div style="color:#f87171;text-align:center;padding:2rem;">슬라이드 로딩 오류: ${error.message}</div>`;
            console.error('Error loading slide:', error);
        } finally {
            this.isAnimating = false;
        }
    }

    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.prev-slide')?.addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-slide')?.addEventListener('click', () => this.nextSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
        });

        // Touch events
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }

    createDots() {
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slide-dot';
            dot.setAttribute('aria-label', `슬라이드 ${index + 1}로 이동`);
            dot.addEventListener('click', () => this.loadSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    updateDots() {
        const dots = this.dotsContainer.querySelectorAll('.slide-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    prevSlide() {
        const newIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.loadSlide(newIndex);
    }

    nextSlide() {
        const newIndex = (this.currentSlide + 1) % this.slides.length;
        this.loadSlide(newIndex);
    }

    setupAutoplay() {
        setInterval(() => {
            if (!document.hidden && !this.isAnimating) {
                this.nextSlide();
            }
        }, 10000); // 10초마다 자동 전환
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const slider = new SnapCodexSlider();
    slider.init();
}); 