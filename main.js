/* ==========================================
   AFRICAN GARDEN LODGE - COMPLETE JAVASCRIPT
   Save as: main.js
   ========================================== */

document.addEventListener('DOMContentLoaded', function() {
  
  // ========================================
  // 1. STICKY HEADER ON SCROLL
  // ========================================
  
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 100) {
        header.classList.add('sticked');
      } else {
        header.classList.remove('sticked');
      }
    });
  }
  
  // ========================================
  // 2. MOBILE MENU TOGGLE - FIXED VERSION
  // ========================================
  
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.navmenu');
  
  console.log('Mobile toggle element:', mobileToggle); // Debug log
  console.log('Nav menu element:', navMenu); // Debug log
  
  if (mobileToggle && navMenu) {
    // Toggle menu on click
    mobileToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Mobile toggle clicked!'); // Debug log
      
      navMenu.classList.toggle('mobile-nav-active');
      
      // Change icon
      if (this.classList.contains('bi-list')) {
        this.classList.remove('bi-list');
        this.classList.add('bi-x');
      } else {
        this.classList.remove('bi-x');
        this.classList.add('bi-list');
      }
    });
    
    // Close menu when clicking a link
    const menuLinks = navMenu.querySelectorAll('a');
    menuLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth < 992) {
          navMenu.classList.remove('mobile-nav-active');
          if (mobileToggle) {
            mobileToggle.classList.remove('bi-x');
            mobileToggle.classList.add('bi-list');
          }
        }
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('mobile-nav-active');
        if (mobileToggle.classList.contains('bi-x')) {
          mobileToggle.classList.remove('bi-x');
          mobileToggle.classList.add('bi-list');
        }
      }
    });
  } else {
    console.error('Mobile toggle or nav menu not found!'); // Debug log
  }
  
  // ========================================
  // 3. HERO CAROUSEL AUTO-ROTATION
  // ========================================
  
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-nav-dots .dot');
  let currentSlide = 0;
  const slideInterval = 5000; // 5 seconds
  
  if (slides.length > 0) {
    function showSlide(index) {
      // Remove active class from all
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      // Add active to current
      slides[index].classList.add('active');
      if (dots[index]) {
        dots[index].classList.add('active');
      }
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    // Auto-rotate
    let autoRotate = setInterval(nextSlide, slideInterval);
    
    // Manual navigation with dots
    dots.forEach(function(dot, index) {
      dot.addEventListener('click', function() {
        currentSlide = index;
        showSlide(currentSlide);
        
        // Reset timer
        clearInterval(autoRotate);
        autoRotate = setInterval(nextSlide, slideInterval);
      });
    });
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      heroSection.addEventListener('mouseenter', function() {
        clearInterval(autoRotate);
      });
      
      heroSection.addEventListener('mouseleave', function() {
        autoRotate = setInterval(nextSlide, slideInterval);
      });
    }
  }
  
  // ========================================
  // 4. SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = header ? header.offsetHeight : 80;
          const targetPosition = target.offsetTop - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // ========================================
  // 5. ACTIVE MENU HIGHLIGHTING ON SCROLL
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.offsetHeight;
      
      if (window.pageYOffset >= sectionTop && 
          window.pageYOffset < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });
  
  // ========================================
  // 6. FORM SUBMISSION HANDLING
  // ========================================
  
  const forms = document.querySelectorAll('form');
  
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const loadingEl = form.querySelector('.loading');
      const errorEl = form.querySelector('.error-message');
      const successEl = form.querySelector('.sent-message');
      const submitBtn = form.querySelector('.btn-submit');
      
      // Show loading
      if (loadingEl) loadingEl.classList.add('show');
      if (errorEl) errorEl.classList.remove('show');
      if (successEl) successEl.classList.remove('show');
      if (submitBtn) submitBtn.disabled = true;
      
      // Get form action (Formspree endpoint)
      const action = form.getAttribute('action');
      
      // Submit via fetch
      fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(function(response) {
        if (loadingEl) loadingEl.classList.remove('show');
        if (submitBtn) submitBtn.disabled = false;
        
        if (response.ok) {
          // Success
          if (successEl) {
            successEl.classList.add('show');
            successEl.textContent = 'Your message has been sent successfully! We\'ll get back to you soon.';
          }
          form.reset();
          
          // Hide after 5 seconds
          setTimeout(function() {
            if (successEl) successEl.classList.remove('show');
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(function(error) {
        if (loadingEl) loadingEl.classList.remove('show');
        if (submitBtn) submitBtn.disabled = false;
        
        if (errorEl) {
          errorEl.classList.add('show');
          errorEl.textContent = 'There was an error sending your message. Please try WhatsApp or call us directly.';
        }
      });
    });
  });
  
  // ========================================
  // 7. GALLERY LIGHTBOX (SIMPLE VERSION)
  // ========================================
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(function(item) {
    item.addEventListener('click', function() {
      const img = this.querySelector('img');
      if (img) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
          </div>
        `;
        
        // Add styles
        lightbox.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.9);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        `;
        
        const content = lightbox.querySelector('.lightbox-content');
        content.style.cssText = `
          position: relative;
          max-width: 90%;
          max-height: 90%;
        `;
        
        const close = lightbox.querySelector('.lightbox-close');
        close.style.cssText = `
          position: absolute;
          top: -40px;
          right: 0;
          color: white;
          font-size: 40px;
          font-weight: bold;
          cursor: pointer;
        `;
        
        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
          max-width: 100%;
          max-height: 100%;
          border-radius: 10px;
        `;
        
        document.body.appendChild(lightbox);
        
        // Close on click
        lightbox.addEventListener('click', function() {
          document.body.removeChild(lightbox);
        });
        
        close.addEventListener('click', function(e) {
          e.stopPropagation();
          document.body.removeChild(lightbox);
        });
      }
    });
  });
  
  // ========================================
  // 8. SCROLL ANIMATIONS (FADE IN ON SCROLL)
  // ========================================
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe sections
  document.querySelectorAll('.section').forEach(function(section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
  
  // Observe venue cards
  document.querySelectorAll('.venue-card').forEach(function(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
  });
  
  // ========================================
  // 9. FORCE SHOW MOBILE MENU ON RESIZE
  // ========================================
  
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
      // Desktop view - hide mobile menu
      if (navMenu) {
        navMenu.classList.remove('mobile-nav-active');
      }
      if (mobileToggle) {
        mobileToggle.classList.remove('bi-x');
        mobileToggle.classList.add('bi-list');
      }
    }
  });
  
  // ========================================
  // 10. INITIALIZE CONSOLE MESSAGE
  // ========================================
  
  console.log('%c✓ African Garden Lodge Website Loaded', 'color: #DAA520; font-size: 16px; font-weight: bold;');
  console.log('%cMobile menu ready!', 'color: #8B4513; font-size: 12px;');
  
});
