document.addEventListener('DOMContentLoaded', () => {
    // Helper function for Intersection Observer callbacks
    const setupIntersectionObserver = (targetSelector, callback, options = { threshold: 0.1 }) => {
        const elements = document.querySelectorAll(targetSelector);
        if (elements.length === 0) return;

        const observer = new IntersectionObserver((entries, self) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    callback(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, options);

        elements.forEach(element => observer.observe(element));
    };

    // 1. Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('main-nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                }
            });
        });
    }

    // 2. Milestone Counter Animation (Used on About page)
    const animateMilestone = (milestoneElement) => {
        const numberElement = milestoneElement.querySelector('.milestone-number');
        if (!numberElement) return;

        const targetCount = parseInt(numberElement.getAttribute('data-count'));
        let currentCount = 0;
        const duration = 2000;
        let startTime = null;

        const updateCounter = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                currentCount = Math.round(progress * targetCount);
                numberElement.textContent = currentCount;
                requestAnimationFrame(updateCounter);
            } else {
                numberElement.textContent = targetCount;
            }
        };
        requestAnimationFrame(updateCounter);
    };
    setupIntersectionObserver('.milestone-item', animateMilestone, { threshold: 0.5 });


    // 3. Reveal on Scroll Animation (General Sections)
    const revealSectionCallback = (element) => {
        element.classList.add('is-visible');
        const title = element.querySelector('.section-title');
        if (title) {
            title.classList.add('is-visible');
        }
    };
    setupIntersectionObserver('.reveal-section', revealSectionCallback, { threshold: 0.1 });

    // Individual reveal for service cards (used on Home and Services pages)
    const serviceCards = document.querySelectorAll('.service-card.reveal-item');
    const revealCardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    serviceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        revealCardObserver.observe(card);
    });


    // 4. Testimonial Carousel (Used on About page)
    const carousel = document.getElementById('testimonial-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    if (carousel && dotsContainer) {
        const testimonials = Array.from(carousel.children);
        let currentIndex = 0;
        let autoSlideInterval;

        const showTestimonial = (index) => {
            testimonials.forEach((item, i) => {
                item.classList.remove('active', 'prev', 'next-slide');
                if (i === index) {
                    item.classList.add('active');
                } else if (i < index) {
                    item.classList.add('prev');
                } else {
                    item.classList.add('next-slide');
                }
            });

            Array.from(dotsContainer.children).forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const nextTestimonial = () => {
            currentIndex = (currentIndex + 1) % testimonials.length;
            showTestimonial(currentIndex);
        };

        const startAutoSlide = () => {
            autoSlideInterval = setInterval(nextTestimonial, 7000);
        };

        const resetAutoSlide = () => {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        };

        testimonials.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                showTestimonial(currentIndex);
                resetAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });

        showTestimonial(currentIndex);
        startAutoSlide();
    }

    // 5. Update Current Year in Footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Contact Form Validation and Submission Logic (ONLY for contact.html)
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let isValid = true;
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');
            formMessage.style.opacity = '0';
            formMessage.style.display = 'none';

            const requiredInputs = contactForm.querySelectorAll('input[required], textarea[required]');
            requiredInputs.forEach(input => {
                const formGroup = input.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');

                if (input.value.trim() === '') {
                    formGroup.classList.add('error');
                    errorMessage.textContent = `${input.previousElementSibling.textContent} is required.`;
                    isValid = false;
                } else {
                    formGroup.classList.remove('error');
                    errorMessage.textContent = '';
                }
            });

            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput && !emailRegex.test(emailInput.value.trim())) {
                const formGroup = emailInput.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');
                formGroup.classList.add('error');
                errorMessage.textContent = 'Please enter a valid email address.';
                isValid = false;
            }

            if (isValid) {
                console.log('Form data:', {
                    fullName: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value,
                });

                formMessage.textContent = 'Thank you for your message! We will get back to you shortly.';
                formMessage.classList.add('success');
                formMessage.style.display = 'block';
                setTimeout(() => { formMessage.style.opacity = '1'; }, 10);

                contactForm.reset();
            } else {
                formMessage.textContent = 'Please fix the errors in the form.';
                formMessage.classList.add('error');
                formMessage.style.display = 'block';
                setTimeout(() => { formMessage.style.opacity = '1'; }, 10);
            }
        });

        const allInputs = contactForm.querySelectorAll('input, textarea');
        allInputs.forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.closest('.form-group');
                const errorMessage = formGroup.querySelector('.error-message');
                if (input.value.trim() !== '') {
                    formGroup.classList.remove('error');
                    errorMessage.textContent = '';
                }
                if (input.id === 'email' && input.value.trim() !== '') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(input.value.trim())) {
                        formGroup.classList.remove('error');
                        errorMessage.textContent = '';
                    }
                }
            });
        });
    }
});
