function trackEvent(eventName, params = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params
  });
}

document.querySelectorAll('[data-track]').forEach(el => {
  el.addEventListener('click', function() {
    trackEvent(this.getAttribute('data-track'), {
      project: this.getAttribute('data-project') || '',
      element_text: this.textContent.trim().substring(0, 50)
    });
  });
});

document.querySelectorAll('a[href*="wa.me"]').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('whatsapp_click', {
      project: btn.getAttribute('data-project') || 'general'
    });
  });
});

document.querySelectorAll('a[href^="tel:"]').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('phone_click', {
      phone_number: btn.href.replace('tel:', '')
    });
  });
});

document.querySelectorAll('a[href^="mailto:"]').forEach(btn => {
  btn.addEventListener('click', () => {
    trackEvent('email_click', {
      email_address: btn.href.replace('mailto:', '')
    });
  });
});

const leadForm = document.getElementById('lead-form');

if (leadForm) {
  leadForm.addEventListener('submit', function() {
    trackEvent('generate_lead', {
      form_type: 'contacto',
      project: this.proyecto.value,
      interes: this.interes.value
    });
  });
}
