window.addEventListener('DOMContentLoaded', function() {
  createSnowfall();
  
  var audio = document.getElementById('bg-audio');
  if (audio) {
    audio.volume = 0.3;
    
    function tryPlay() {
      audio.play().catch(function(){});
    }
    tryPlay();
 
    setTimeout(function() {
      if (audio.paused) {
        var resume = function() {
          tryPlay();
          window.removeEventListener('click', resume);
          window.removeEventListener('keydown', resume);
        };
        window.addEventListener('click', resume);
        window.addEventListener('keydown', resume);
      }
    }, 500);
  }
});

function createSnowfall() {
  const snowflakes = ['❄','✻','✼','❅','❆','❉'];
  const particles = document.getElementById('particles');
  if (!particles) return;


  const screenArea = window.innerWidth * window.innerHeight;
  const count = Math.floor(screenArea / 20000); 

  particles.innerHTML = ''; 

  for (let i = 0; i < count; i++) {
    const snow = document.createElement('span');
    snow.className = 'snowflake';
    snow.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];

    const size = Math.random() * 0.4 + 0.3;
    snow.style.fontSize = (size * 10 + 6) + 'px'; 
    snow.style.left = (Math.random() * 100) + '%';
    snow.style.opacity = (Math.random() * 0.4 + 0.6).toFixed(2);
    snow.style.animationDuration = (Math.random() * 3 + 6) + 's';
    snow.style.animationDelay = (Math.random() * 8) + 's';
    snow.style.filter = `blur(${Math.random() * 1.2}px)`;
    particles.appendChild(snow);
  }
}


window.addEventListener('resize', createSnowfall);
