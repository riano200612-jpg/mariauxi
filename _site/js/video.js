function safePlay(vid) {
  if (!vid) return;

  vid.muted = true;
  vid.loop = true;

  const playAttempt = () => {
    const p = vid.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {});
    }
  };

  if (vid.readyState >= 2) {
    playAttempt();
  } else {
    vid.addEventListener('loadedmetadata', playAttempt, { once: true });
  }
}

document.querySelectorAll('#hero-video-bg video').forEach(v => safePlay(v));

const vidObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {

    const v = entry.target;

    if (entry.isIntersecting && entry.intersectionRatio > 0) {

      v.loop = true;
      v.muted = true;

      const playPromise = v.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }

      if (typeof trackEvent === 'function') {
        trackEvent('video_play', {
          video_name: v.querySelector('source')?.src.split('/').pop() || 'unknown',
          video_location: v.closest('section')?.id || 'unknown'
        });
      }

    } else {

      v.pause();

    }

  });

}, {
  threshold: [0,0.1],
  rootMargin: '0px 0px 100px 0px'
});

document
.querySelectorAll('video[preload="none"]')
.forEach(v => vidObs.observe(v));

const svgMuted='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';

const svgSound='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';

document.querySelectorAll('.video-phone').forEach(card => {

  const video=card.querySelector('video');
  const btn=card.querySelector('.video-sound-btn');

  if(!video||!btn)return;

  const paint=()=>{

    btn.innerHTML=video.muted?svgMuted:svgSound;

    btn.setAttribute('aria-pressed',String(!video.muted));

    btn.setAttribute('aria-label',
      video.muted?'Activar sonido':'Mute video');

  };

  paint();

  btn.addEventListener('click',()=>{

    video.muted=!video.muted;

    paint();

    if(!video.muted){

      const p=video.play();

      if(p&&typeof p.catch==='function'){

        p.catch(()=>{

          video.muted=true;

          paint();

        });

      }

    }

  });

});

document.addEventListener('visibilitychange',()=>{

  document.querySelectorAll('video').forEach(v=>{

    if(document.hidden){

      v.pause();

    }

  });

});
