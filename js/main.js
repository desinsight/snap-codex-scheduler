// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
    // Initialize any global functionality here
    console.log('Main script loaded');
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href === '/#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission handling
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // Here you would typically send the data to your backend
                console.log('Form submitted:', data);
                alert('문의가 접수되었습니다. 곧 연락드리겠습니다.');
                contactForm.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                alert('문의 접수 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    }
}); 