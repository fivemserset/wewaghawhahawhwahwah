let overlayClicked = false;
const root = document.documentElement;
if (root) {
  root.style.setProperty('--accent-red', '#ff0000');
  root.style.setProperty('--background-black', '#000000');
}

function createParticles() {
  const particlesContainer = document.getElementById('particles');
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.bottom = '0'; // Start particles at the bottom
    particle.style.animation = `rise ${(Math.random() * 5 + 5)}s linear`; // Use a custom rise animation
    particlesContainer.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 10000);
  }
  
  setInterval(createParticle, 200);
}

// Add CSS for the rise animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes rise {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-100vh);
    }
  }
`;
document.head.appendChild(style);

function initTiltEffect() {
  const card = document.querySelector('.profile-card');
  const wrapper = document.querySelector('.tilt-wrapper');
  if (!card || !wrapper) {
    console.log('Tilt effect elements not found:', { card, wrapper });
    return;
  }
  console.log('Tilt effect initialized for:', { card, wrapper });
  wrapper.addEventListener('mousemove', function(e) {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -10;
    const rotateY = (x - centerX) / centerX * 10;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
  });
  wrapper.addEventListener('mouseenter', function() {
    card.style.transition = 'transform 0.2s ease-out, box-shadow 0.3s ease';
  });
  wrapper.addEventListener('mouseleave', function() {
    card.style.transition = 'transform 0.5s ease-out, box-shadow 0.3s ease';
    card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
}


function typeWriter(text, element, speed = 80, callback) {
  let i = 0;
  let isDeleting = false;
  let displayed = '';

  function type() {
    if (!isDeleting && i <= text.length) {
      displayed = text.substring(0, i);
      element.innerHTML = displayed.replace(/\n/g, '<br>');
      const lines = element.innerHTML.split('<br>');
      if (lines.length > 1) {
        element.style.borderRight = 'none'; 
      } else {
        element.style.borderRight = '2px solid var(--accent-red)';
      }
      i++;
      setTimeout(type, speed);
    } else if (!isDeleting && i > text.length) {
      setTimeout(() => {
        isDeleting = true;
        element.style.borderRight = 'none';
        setTimeout(type, 600);
      }, 1200);
    } else if (isDeleting && i >= 0) {
      displayed = text.substring(0, i);
      element.innerHTML = displayed.replace(/\n/g, '<br>');
      element.style.borderRight = 'none';
      i--;
      setTimeout(type, speed / 1.5);
    } else {
      element.innerHTML = '&nbsp;';
      setTimeout(() => {
        if (typeof callback === 'function' && !typeWriter._callbackFired) {
          callback();
          typeWriter._callbackFired = true;
        }
        isDeleting = false;
        i = 0;
        element.style.borderRight = '2px solid var(--accent-red)';
        setTimeout(type, 800);
      }, 600);
    }
  }
  element.innerHTML = '';
  element.style.borderRight = '2px solid var(--accent-red)';
  type();
}

const typewriterElement = document.getElementById('typewriter-text');
if (typewriterElement) {
  typewriterElement.style.overflow = 'visible';
  typewriterElement.style.textOverflow = 'unset';
}

function playMusicAndHideOverlay() {
  if (overlayClicked) return;
  overlayClicked = true;
  
  const overlay = document.getElementById('overlay');
  const video = document.getElementById('background-video');
  
  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
  }, 500);
  
  if (video) {
    video.style.display = 'block';
    video.style.opacity = '0';
    setTimeout(() => {
      video.style.opacity = '1';
    }, 500);
  }
  
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    setTimeout(() => {
      typeWriter('My hobby is eating different kinds of ramen and comparing them\njust take a guess', typewriterElement, 60);
    }, 1000);
  }
}


function startAnimations() {
  createParticles();
  setTimeout(() => {
    initTiltEffect();
    popSocials();
  }, 100);
}


function popSocials() {
  const socialContainer = document.getElementById('social-container');
  if (socialContainer) {
    socialContainer.style.opacity = '1';
    socialContainer.style.pointerEvents = 'auto';
  }
  const socials = document.querySelectorAll('.social-button');
  socials.forEach((btn) => {
    btn.classList.remove('animate');

    void btn.offsetWidth;
    btn.classList.add('animate');
  });
}

const originalPlayMusicAndHideOverlay = playMusicAndHideOverlay;
playMusicAndHideOverlay = function() {
  if (overlayClicked) return;
  overlayClicked = true;
  const overlay = document.getElementById('overlay');
  const video = document.getElementById('background-video');

  overlay.style.opacity = '0';
  setTimeout(() => {
    overlay.style.display = 'none';
    console.log('Overlay dismissed, starting animations...');
    startAnimations();
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
      setTimeout(() => {
        typeWriter._callbackFired = false;
        typeWriter('My hobby is eating different kinds of ramen and comparing them\njust take a guess', typewriterElement, 60);
      }, 1000);
    }
  }, 500);

  if (video) {
    video.style.display = 'block';
    video.style.opacity = '0';
    setTimeout(() => {
      video.style.opacity = '1';
      video.play().catch(e => console.error('Video play failed:', e));
    }, 500);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.addEventListener('click', function() {
      console.log('Overlay clicked');
      playMusicAndHideOverlay();
    });
  } else {
    console.error('Overlay element not found');
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      console.log('Overlay triggered by keyboard');
      playMusicAndHideOverlay();
    }
  });


  const video = document.getElementById('background-video');
  if (video) {
    video.style.position = 'fixed';
    video.style.top = '0';
    video.style.left = '0';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'contain';
    video.style.zIndex = '-1';
    video.style.opacity = '0.6';
  }
});
