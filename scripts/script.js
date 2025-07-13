document.addEventListener('DOMContentLoaded', () => {
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                isDarkMode: false,
                email: '',
                formSubmitted: false,
                formMessage: ''
            };
        },
        watch: {
            isDarkMode(newVal) {
                document.documentElement.classList.toggle('dark-mode', newVal);
                localStorage.setItem('solvrTheme', newVal ? 'dark' : 'light');
            }
        },
        methods: {
            toggleTheme() {
                this.isDarkMode = !this.isDarkMode;
            },
            joinWaitlist() {
                if (!this.validateEmail(this.email)) {
                    alert('Please enter a valid email address.');
                    return;
                }
                
                const encode = (data) => {
                    return Object.keys(data)
                        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
                        .join("&");
                }

                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encode({
                        "form-name": "waitlist",
                        "email": this.email
                    })
                })
                .then(() => {
                    this.formSubmitted = true;
                    this.formMessage = "You're on the list! 🎉";
                    this.email = '';
                })
                .catch(error => {
                    alert("Sorry, there was an issue submitting your request. Please try again later.");
                    console.error(error);
                });
            },
            validateEmail(email) {
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(email).toLowerCase());
            },
            initTestimonialCarousel() {
                const track = document.querySelector('.testimonial-track');
                if (!track) return;

                const slides = Array.from(track.children);
                const nav = document.querySelector('.testimonial-nav');
                let currentIndex = 0;
                let autoPlayInterval;

                slides.forEach(slide => {
                    const clone = slide.cloneNode(true);
                    track.appendChild(clone);
                });

                slides.forEach((slide, index) => {
                    const dotButton = document.createElement('button');
                    dotButton.classList.add('dot');
                    if (index === 0) dotButton.classList.add('active');
                    
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('viewBox', '0 0 12 12');
                    
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', '6');
                    circle.setAttribute('cy', '6');
                    circle.setAttribute('r', '5');

                    svg.appendChild(circle);
                    dotButton.appendChild(svg);

                    dotButton.addEventListener('click', () => {
                        moveToSlide(index);
                        resetAutoPlay();
                    });
                    nav.appendChild(dotButton);
                });
                
                const dots = Array.from(nav.children);

                const moveToSlide = (index) => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    track.style.transform = `translateX(-${100 * index}%)`;
                    
                    const activeIndex = index % slides.length;
                    dots.forEach(dot => dot.classList.remove('active'));
                    dots[activeIndex].classList.add('active');
                    currentIndex = index;
                };

                const nextSlide = () => {
                    currentIndex++;
                    moveToSlide(currentIndex);

                    if (currentIndex >= slides.length) {
                        setTimeout(() => {
                           track.style.transition = 'none';
                           currentIndex = 0;
                           track.style.transform = `translateX(0)`;
                           void track.offsetWidth;
                           track.style.transition = 'transform 0.5s ease-in-out';
                        }, 500);
                    }
                };

                const startAutoPlay = () => {
                    autoPlayInterval = setInterval(nextSlide, 5000);
                };
                
                const resetAutoPlay = () => {
                    clearInterval(autoPlayInterval);
                    startAutoPlay();
                };

                startAutoPlay();
            },
            initAnimations() {
                gsap.registerPlugin(ScrollTrigger);
                
                const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1 } });

                tl.from('.main-header', { y: -100, opacity: 0, duration: 1.2 });
                tl.from('.creator-badge', { y: 20, opacity: 0, duration: 1 }, "-=1");
                tl.from('.hero-headline .line-1', { y: 40, opacity: 0, duration: 1 }, "-=0.8");
                tl.from('.hero-headline .line-2', { opacity: 0, scale: 1.2, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, "-=0.6");
                tl.from('.hero-subheadline', { y: 20, opacity: 0, duration: 1 }, "-=0.8");
                
                gsap.from('.why-solvr-text > *', {
                    scrollTrigger: { trigger: '#why-solvr', start: 'top 75%' },
                    opacity: 0, y: 40, stagger: 0.2, duration: 1
                });
                
                const illustrationPath = document.querySelector('.why-solvr-illustration .clear-path');
                if(illustrationPath) {
                    const length = illustrationPath.getTotalLength();
                    gsap.set(illustrationPath, {strokeDasharray: length, strokeDashoffset: length});
                    gsap.to(illustrationPath, {
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: 'power2.inOut',
                        scrollTrigger: {
                            trigger: '.why-solvr-illustration',
                            start: 'top 70%',
                            end: 'bottom 80%',
                            scrub: 1.5
                        }
                    });
                }

                gsap.from('#features .section-title', {
                    scrollTrigger: { trigger: '#features', start: 'top 80%' },
                    opacity: 0, y: 40, duration: 1
                });
                
                gsap.from('.feature-card', {
                    scrollTrigger: { trigger: '.feature-grid', start: 'top 80%' },
                    opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: 'power3.out'
                });
                
                gsap.from('#testimonials .section-title', {
                    scrollTrigger: { trigger: '#testimonials', start: 'top 80%' },
                    opacity: 0, y: 40, duration: 1
                });

                gsap.from('.testimonial-carousel-wrapper', {
                    scrollTrigger: { trigger: '#testimonials', start: 'top 70%' },
                    opacity: 0, y: 50, duration: 1, ease: 'expo.out'
                });

                gsap.from('.waitlist-container > *', {
                    scrollTrigger: { trigger: '#waitlist', start: 'top 70%' },
                    opacity: 0, y: 40, stagger: 0.2, duration: 1.2, ease: 'expo.out'
                });
                
                gsap.from('.main-footer', {
                    scrollTrigger: { trigger: '.main-footer', start: 'top 95%' },
                    opacity: 0, y: 20, duration: 1
                });
            }
        },
        mounted() {
            const savedTheme = localStorage.getItem('solvrTheme');
            if (savedTheme) {
                this.isDarkMode = savedTheme === 'dark';
            } else {
                this.isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            this.initTestimonialCarousel();
            this.initAnimations();
        }
    }).mount('#app');
});