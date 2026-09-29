/**
 * Mahardika Wedding Planner & Studio
 * Interactive Scripts: Navigation, Filtering, Calculator, Lightbox, Booking, and Admin
 */

// 1. Mobile Menu Navigation
const hamb = document.querySelector('.hamb');
const links = document.querySelector('.links');

if (hamb && links) {
  hamb.addEventListener('click', () => {
    const isOpen = links.classList.toggle('mobile-open');
    hamb.setAttribute('aria-expanded', String(isOpen));
    hamb.innerHTML = isOpen ? '✕' : '☰';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamb.contains(e.target) && !links.contains(e.target) && links.classList.contains('mobile-open')) {
      links.classList.remove('mobile-open');
      hamb.setAttribute('aria-expanded', 'false');
      hamb.innerHTML = '☰';
    }
  });
}

// 2. Dynamic Year
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

// 3. Portfolio Filtering & Lightbox
const filterButtons = document.querySelectorAll('[data-filter]');
const workItems = document.querySelectorAll('.work');

if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      workItems.forEach(w => {
        if (filter === 'all' || w.classList.contains(filter)) {
          w.style.display = 'block';
          w.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          w.style.display = 'none';
        }
      });
    });
  });
}

// Portfolio Lightbox modal
const lightbox = document.getElementById('portfolioLightbox');
if (lightbox) {
  const lbImg = document.getElementById('lightboxImg');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbCategory = document.getElementById('lightboxCategory');
  const lbDesc = document.getElementById('lightboxDesc');
  const lbCta = document.getElementById('lightboxCta');
  const lbClose = document.getElementById('lightboxClose');

  workItems.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const title = card.querySelector('h3')?.textContent || 'Wedding Concept';
      const category = card.querySelector('.work-meta span')?.textContent || 'Mahardika Story';
      const desc = card.querySelector('.work-meta p')?.textContent || '';

      if (lbImg) lbImg.src = img?.src || '';
      if (lbImg) lbImg.alt = title;
      if (lbTitle) lbTitle.textContent = title;
      if (lbCategory) lbCategory.textContent = category;
      if (lbDesc) lbDesc.textContent = desc;
      if (lbCta) {
        lbCta.href = `booking.html?concept=${encodeURIComponent(title)}&notes=${encodeURIComponent('Tertarik dengan referensi portofolio: ' + title + ' (' + desc + ')')}`;
      }
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
}

// 4. Interactive Wedding Cost Calculator (on packages.html)
const calcForm = document.getElementById('weddingCalculator');
if (calcForm) {
  const packageSelect = document.getElementById('calcPackage');
  const guestsInput = document.getElementById('calcGuests');
  const guestsVal = document.getElementById('calcGuestsVal');
  const addonCheckboxes = document.querySelectorAll('.calc-addon');
  const estTotalEl = document.getElementById('estTotal');
  const estRangeEl = document.getElementById('estRange');
  const calcWaBtn = document.getElementById('calcWaBtn');
  const calcBookBtn = document.getElementById('calcBookBtn');

  const basePrices = {
    'essential': { base: 15000000, perGuest: 20000, name: 'Essential (Mulai Rp15 Juta)' },
    'signature': { base: 35000000, perGuest: 35000, name: 'Signature (Mulai Rp35 Juta)' },
    'full': { base: 65000000, perGuest: 50000, name: 'Mahardika Full Service (Custom)' }
  };

  function updateCalculation() {
    const pkgKey = packageSelect?.value || 'signature';
    const guests = parseInt(guestsInput?.value || '300', 10);
    if (guestsVal) guestsVal.textContent = guests.toLocaleString('id-ID');

    const pkgData = basePrices[pkgKey] || basePrices.signature;
    let addonsTotal = 0;
    const selectedAddonNames = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsTotal += parseInt(cb.value, 10);
        selectedAddonNames.push(cb.dataset.name || cb.parentElement.textContent.trim());
      }
    });

    const estBase = pkgData.base + (guests * pkgData.perGuest) + addonsTotal;
    const estMin = Math.round(estBase * 0.95 / 1000000) * 1000000;
    const estMax = Math.round(estBase * 1.15 / 1000000) * 1000000;

    if (estTotalEl) {
      estTotalEl.textContent = `Rp ${Math.round(estBase / 1000000)} Juta`;
    }
    if (estRangeEl) {
      estRangeEl.textContent = `Estimasi kisaran: Rp ${(estMin / 1000000).toFixed(0)} Jt – Rp ${(estMax / 1000000).toFixed(0)} Jt (tergantung venue & vendor)`;
    }

    const waText = `Halo Mahardika Wedding Planner & Studio,%0A%0ASaya mencoba Simulasi Estimasi Biaya di website:%0A- Paket: ${encodeURIComponent(pkgData.name)}%0A- Estimasi Tamu: ${guests} orang%0A- Tambahan Layanan: ${encodeURIComponent(selectedAddonNames.join(', ') || 'Standar')}%0A- Estimasi Simulasi: Rp ${Math.round(estBase / 1000000)} Juta%0A%0AMohon info ketersediaan tanggal dan konsultasi lebih lanjut.`;
    
    if (calcWaBtn) {
      calcWaBtn.href = `https://wa.me/6285727732902?text=${waText}`;
    }
    if (calcBookBtn) {
      const budgetOption = estBase < 25000000 ? 'Di bawah Rp25 juta' : (estBase <= 50000000 ? 'Rp25–50 juta' : (estBase <= 100000000 ? 'Rp50–100 juta' : 'Di atas Rp100 juta'));
      calcBookBtn.href = `booking.html?package=${encodeURIComponent(pkgData.name)}&guests=${guests}&budget=${encodeURIComponent(budgetOption)}&notes=${encodeURIComponent('Hasil simulasi kalkulator website: ' + selectedAddonNames.join(', '))}`;
    }
  }

  packageSelect?.addEventListener('change', updateCalculation);
  guestsInput?.addEventListener('input', updateCalculation);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculation));
  updateCalculation();
}

// 5. Booking Form Handling & URL Prefill (on booking.html)
const form = document.getElementById('bookingForm');
if (form) {
  // Prefill from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const paramService = urlParams.get('service') || urlParams.get('package');
  const paramGuests = urlParams.get('guests');
  const paramBudget = urlParams.get('budget');
  const paramNotes = urlParams.get('notes');
  const paramConcept = urlParams.get('concept');

  if (paramService) {
    const serviceSelect = form.querySelector('[name="service"]');
    if (serviceSelect) {
      for (const opt of serviceSelect.options) {
        if (opt.text.toLowerCase().includes(paramService.toLowerCase()) || paramService.toLowerCase().includes(opt.text.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }
  if (paramGuests) {
    const guestsField = form.querySelector('[name="guests"]');
    if (guestsField) guestsField.value = paramGuests;
  }
  if (paramBudget) {
    const budgetSelect = form.querySelector('[name="budget"]');
    if (budgetSelect) {
      for (const opt of budgetSelect.options) {
        if (opt.value === paramBudget) opt.selected = true;
      }
    }
  }
  if (paramNotes || paramConcept) {
    const notesField = form.querySelector('[name="notes"]');
    if (notesField) {
      notesField.value = [paramConcept ? `Konsep: ${paramConcept}` : '', paramNotes || ''].filter(Boolean).join('\n');
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Menyimpan...';
    }

    const b = Object.fromEntries(new FormData(form));
    b.id = Date.now();
    b.status = 'Pending';
    b.createdAt = new Date().toISOString();

    // Store in localStorage as instant offline backup
    try {
      const localData = JSON.parse(localStorage.getItem('mahardikaBookings') || '[]');
      localData.unshift(b);
      localStorage.setItem('mahardikaBookings', JSON.stringify(localData));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Try posting to /api/bookings
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(b)
      });
    } catch (err) {
      console.log('Saved locally (network offline)');
    }

    // Prepare WhatsApp Message
    const text = `Halo Mahardika Wedding Planner & Studio,%0A%0ASaya ingin konsultasi/booking acara pernikahan.%0A%0A` +
      `*Nama:* ${encodeURIComponent(b.name)}%0A` +
      `*No. WhatsApp:* ${encodeURIComponent(b.phone)}%0A` +
      `*Tanggal Rencana:* ${encodeURIComponent(b.date)}%0A` +
      `*Jumlah Tamu:* ${encodeURIComponent(b.guests || '-')} orang%0A` +
      `*Lokasi / Venue:* ${encodeURIComponent(b.venue || '-')}%0A` +
      `*Pilihan Layanan:* ${encodeURIComponent(b.service)}%0A` +
      `*Estimasi Alokasi Dana:* ${encodeURIComponent(b.budget || '-')}%0A` +
      `*Catatan Khusus / Konsep:* ${encodeURIComponent(b.notes || '-')}`;

    const wa = document.getElementById('waBooking');
    if (wa) {
      wa.href = `https://wa.me/6285727732902?text=${text}`;
    }

    const successEl = document.getElementById('success');
    if (successEl) {
      successEl.hidden = false;
      successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Permintaan Terkirim ✓';
    }
  });
}
