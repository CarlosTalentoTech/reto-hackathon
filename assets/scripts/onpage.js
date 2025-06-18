// Animate hero section on scroll (fadeInUp)
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero-section');
    if (hero) {
      setTimeout(() => hero.classList.add('visible'), 250);
    }
  });

  const form = document.getElementById('calcForm');
  const resultBox = document.getElementById('resultBox');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Retrieve inputs
    const usage = parseFloat(document.getElementById('monthlyUsage').value);
    const rate = parseFloat(document.getElementById('electricityRate').value);
    const size = parseFloat(document.getElementById('systemSize').value);
    const sunHours = parseFloat(document.getElementById('sunHours').value);

    // Validate inputs
    if (isNaN(usage) || isNaN(rate) || isNaN(size) || isNaN(sunHours)) {
      resultBox.textContent = "Por favor, completa todos los campos correctamente.";
      resultBox.classList.add('error');
      return;
    }

    if (usage <= 0 || rate <= 0 || size <= 0 || sunHours <= 0) {
      resultBox.textContent = "Todos los valores deben ser mayores que cero.";
      resultBox.classList.add('error');
      return;
    }

    // Clear error style if previously added
    resultBox.classList.remove('error');

    /*
      Estimation Logic:
      - Energy produced monthly = systemSize(kW) * sunHours * 30 (days)
      - Monthly savings = min(energy produced, usage) * rate
      - Limit savings to usage*rate in case production > consumption
    */
    const monthlyProduction = size * sunHours * 30;
    const effectiveProduction = Math.min(monthlyProduction, usage);
    const savings = effectiveProduction * rate;

    // Format as localized currency (USD)
    const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD'});
    const savingsStr = formatter.format(savings);

    resultBox.textContent = `Se estima un ahorro mensual aproximado de ${savingsStr}.`;
  });