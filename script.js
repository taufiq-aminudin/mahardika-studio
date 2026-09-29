/**
 * Mahardika Wedding Planner & Studio
 * Interactive Scripts: Navigation, Filtering, Price Estimator Tool, Lightbox, Booking, and Admin
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

// 4. Interactive Price Estimator Tool (in Packages section)
function initPriceEstimator() {
  const calcForm = document.getElementById('weddingCalculator');
  if (!calcForm) return;

  const packageSelect = document.getElementById('calcPackage');
  const pkgCards = document.querySelectorAll('.calc-pkg-card');
  const selectedPkgBadge = document.getElementById('selectedPkgBadge');
  const guestsInput = document.getElementById('calcGuests');
  const guestsVal = document.getElementById('calcGuestsVal');
  const presetBtns = document.querySelectorAll('.calc-preset-btn');
  const addonItems = document.querySelectorAll('.calc-addon-item');
  const addonCheckboxes = document.querySelectorAll('.calc-addon');
  const addonCountBadge = document.getElementById('addonCountBadge');
  const receiptPkgName = document.getElementById('receiptPkgName');
  const receiptPkgBase = document.getElementById('receiptPkgBase');
  const receiptGuestScale = document.getElementById('receiptGuestScale');
  const receiptAddonCount = document.getElementById('receiptAddonCount');
  const receiptAddonsSubtotal = document.getElementById('receiptAddonsSubtotal');
  const activeAddonsWrap = document.getElementById('activeAddonsWrap');
  const activeAddonsTags = document.getElementById('activeAddonsTags');
  const estTotalEl = document.getElementById('estTotal');
  const estRangeEl = document.getElementById('estRange');
  const calcBookBtn = document.getElementById('calcBookBtn');
  const calcWaBtn = document.getElementById('calcWaBtn');
  const calcResetBtn = document.getElementById('calcResetBtn');

  // Base Package configurations
  const basePackages = {
    'essential': {
      name: 'Paket Essential',
      badgeText: 'Essential (Rp15 Jt)',
      price: 15000000,
      includedGuests: 200,
      guestRate: 20000,
      minPrice: 14000000
    },
    'signature': {
      name: 'Paket Signature',
      badgeText: 'Signature (Rp35 Jt)',
      price: 35000000,
      includedGuests: 300,
      guestRate: 25000,
      minPrice: 33000000
    },
    'full': {
      name: 'Mahardika Full Service',
      badgeText: 'Full Service (Rp65 Jt)',
      price: 65000000,
      includedGuests: 400,
      guestRate: 35000,
      minPrice: 60000000
    },
    'wo_only': {
      name: 'Day-of Coordination WO Saja',
      badgeText: 'WO Hari H (Rp8,5 Jt)',
      price: 8500000,
      includedGuests: 300,
      guestRate: 15000,
      minPrice: 8000000
    }
  };

  // Currency Formatter
  function formatIDR(amount) {
    return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
  }

  function getSelectedPackageKey() {
    const checkedRadio = document.querySelector('input[name="pkgOption"]:checked');
    if (checkedRadio) return checkedRadio.value;
    return packageSelect ? packageSelect.value : 'signature';
  }

  function setSelectedPackage(key) {
    if (!basePackages[key]) key = 'signature';

    // Sync radio
    const targetRadio = document.querySelector(`input[name="pkgOption"][value="${key}"]`);
    if (targetRadio) targetRadio.checked = true;

    // Sync hidden select if present
    if (packageSelect) packageSelect.value = key;

    // Update card styling
    pkgCards.forEach(card => {
      const isSelected = card.dataset.pkgVal === key;
      card.classList.toggle('selected', isSelected);
    });

    updateCalculation();
  }

  // Handle Radio card clicks
  pkgCards.forEach(card => {
    card.addEventListener('click', (e) => {
      const key = card.dataset.pkgVal;
      if (key) setSelectedPackage(key);
    });
  });

  // Handle "Simulasikan di Estimator" buttons from package cards at top
  const pickButtons = document.querySelectorAll('.btn-calc-pick');
  pickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.package;
      if (key) {
        setSelectedPackage(key);
        const calcEl = document.getElementById('calculator');
        if (calcEl) {
          calcEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Handle Guest Slider & Presets
  function setGuests(val) {
    const num = parseInt(val, 10) || 300;
    if (guestsInput) guestsInput.value = num;
    if (guestsVal) guestsVal.textContent = num.toLocaleString('id-ID');

    presetBtns.forEach(b => {
      const bVal = parseInt(b.dataset.guests, 10);
      b.classList.toggle('active', bVal === num);
    });

    updateCalculation();
  }

  guestsInput?.addEventListener('input', (e) => {
    setGuests(e.target.value);
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setGuests(btn.dataset.guests);
    });
  });

  // Handle Addon Selection
  addonItems.forEach(item => {
    const cb = item.querySelector('input[type="checkbox"]');
    if (!cb) return;

    // Sync item click (unless target is the checkbox itself)
    item.addEventListener('click', (e) => {
      if (e.target !== cb) {
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
      }
    });

    cb.addEventListener('change', () => {
      item.classList.toggle('selected', cb.checked);
      updateCalculation();
    });
  });

  // Reset Button
  calcResetBtn?.addEventListener('click', () => {
    // Uncheck all add-ons
    addonCheckboxes.forEach(cb => {
      cb.checked = false;
      const parent = cb.closest('.calc-addon-item');
      if (parent) parent.classList.remove('selected');
    });

    // Reset guests to 300
    setGuests(300);

    // Keep or reset to signature
    setSelectedPackage('signature');
  });

  // Calculation Core Logic
  function updateCalculation() {
    const pkgKey = getSelectedPackageKey();
    const pkg = basePackages[pkgKey] || basePackages.signature;
    const guests = parseInt(guestsInput?.value || '300', 10);

    if (guestsVal) guestsVal.textContent = guests.toLocaleString('id-ID');
    if (selectedPkgBadge) selectedPkgBadge.textContent = pkg.badgeText;

    // 1. Guest Scale Nominal Adjustment (extra logistics if over base included threshold)
    let guestAdjustment = 0;
    if (guests > pkg.includedGuests) {
      guestAdjustment = (guests - pkg.includedGuests) * pkg.guestRate;
    }

    // 2. Add-ons Total & Breakdown
    let addonsTotal = 0;
    const selectedAddons = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        const price = parseInt(cb.value, 10) || 0;
        const name = cb.dataset.name || cb.closest('.calc-addon-item')?.querySelector('strong')?.textContent.trim() || 'Layanan Tambahan';
        addonsTotal += price;
        selectedAddons.push({ name, price, checkbox: cb });
      }
    });

    // 3. Total Calculation
    const totalCost = pkg.price + guestAdjustment + addonsTotal;
    const rangeMin = Math.round(totalCost * 0.95 / 1000000) * 1000000;
    const rangeMax = Math.round(totalCost * 1.15 / 1000000) * 1000000;

    // 4. Update Receipt Elements
    if (receiptPkgName) receiptPkgName.textContent = pkg.name;
    if (receiptPkgBase) receiptPkgBase.textContent = formatIDR(pkg.price);

    if (receiptGuestScale) {
      if (guestAdjustment > 0) {
        receiptGuestScale.textContent = `${guests} Tamu (+${formatIDR(guestAdjustment)})`;
      } else {
        receiptGuestScale.textContent = `${guests} Tamu (Standar included)`;
      }
    }

    if (receiptAddonCount) receiptAddonCount.textContent = selectedAddons.length;
    if (receiptAddonsSubtotal) receiptAddonsSubtotal.textContent = (addonsTotal > 0 ? '+' : '') + formatIDR(addonsTotal);

    if (addonCountBadge) {
      addonCountBadge.textContent = selectedAddons.length > 0
        ? `${selectedAddons.length} Layanan Terpilih (+${formatIDR(addonsTotal)})`
        : 'Pilih layanan yang dibutuhkan';
    }

    // 5. Render Active Addons Tag Pills
    if (activeAddonsWrap && activeAddonsTags) {
      if (selectedAddons.length > 0) {
        activeAddonsWrap.style.display = 'block';
        activeAddonsTags.innerHTML = selectedAddons.map((item, idx) => `
          <span class="addon-tag">
            ${escapeHtml(item.name)}
            <button type="button" aria-label="Hapus ${escapeHtml(item.name)}" data-addon-idx="${idx}">×</button>
          </span>
        `).join('');

        // Attach tag removal events
        activeAddonsTags.querySelectorAll('button[data-addon-idx]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.addonIdx, 10);
            if (selectedAddons[idx] && selectedAddons[idx].checkbox) {
              selectedAddons[idx].checkbox.checked = false;
              selectedAddons[idx].checkbox.dispatchEvent(new Event('change'));
            }
          });
        });
      } else {
        activeAddonsWrap.style.display = 'none';
        activeAddonsTags.innerHTML = '';
      }
    }

    // 6. Update Total Display
    if (estTotalEl) {
      estTotalEl.textContent = formatIDR(totalCost);
    }
    if (estRangeEl) {
      const minJt = (rangeMin / 1000000).toFixed(0);
      const maxJt = (rangeMax / 1000000).toFixed(0);
      estRangeEl.textContent = `Estimasi kisaran: Rp ${minJt} Jt – Rp ${maxJt} Jt (disesuaikan lokasi & kustomisasi)`;
    }

    // 7. Update Action URLs
    const budgetCategory = totalCost < 25000000
      ? 'Di bawah Rp25 juta'
      : (totalCost <= 50000000 ? 'Rp25–50 juta' : (totalCost <= 100000000 ? 'Rp50–100 juta' : 'Di atas Rp100 juta'));

    const addonNamesList = selectedAddons.map(a => a.name);
    const formattedTotal = formatIDR(totalCost);

    // Booking Button URL
    if (calcBookBtn) {
      const bookParams = new URLSearchParams();
      bookParams.set('package', pkg.name);
      bookParams.set('guests', guests.toString());
      bookParams.set('budget', budgetCategory);
      if (addonNamesList.length > 0) {
        bookParams.set('addons', addonNamesList.join(', '));
      }
      bookParams.set('total', formattedTotal);
      calcBookBtn.href = `booking.html?${bookParams.toString()}`;
    }

    // WhatsApp Message URL
    if (calcWaBtn) {
      let waText = `Halo Tim Mahardika Wedding Planner & Studio,%0A%0A` +
        `Saya mencoba *Simulasi Price Estimator* di website:%0A` +
        `• *Paket Dasar:* ${encodeURIComponent(pkg.name)} (${formatIDR(pkg.price)})%0A` +
        `• *Perkiraan Tamu:* ${guests} orang%0A`;

      if (addonNamesList.length > 0) {
        waText += `• *Layanan Tambahan (Add-ons):*%0A`;
        selectedAddons.forEach(a => {
          waText += `  - ${encodeURIComponent(a.name)} (+${formatIDR(a.price)})%0A`;
        });
        waText += `• *Subtotal Add-ons:* +${formatIDR(addonsTotal)}%0A`;
      } else {
        waText += `• *Layanan Tambahan:* (Belum memilih add-on)%0A`;
      }

      waText += `• *TOTAL ESTIMASI BIAYA:* *${encodeURIComponent(formattedTotal)}*%0A%0A` +
        `Apakah tanggal pernikahan kami masih tersedia untuk konsultasi lebih lanjut?`;

      calcWaBtn.href = `https://wa.me/6285727732902?text=${waText}`;
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
  }

  // Initial calculation
  updateCalculation();
}

// 5. Booking Form Handling & URL Prefill (on booking.html)
const form = document.getElementById('bookingForm');
if (form) {
  const urlParams = new URLSearchParams(window.location.search);
  const paramService = urlParams.get('service') || urlParams.get('package');
  const paramGuests = urlParams.get('guests');
  const paramBudget = urlParams.get('budget');
  const paramAddons = urlParams.get('addons');
  const paramTotal = urlParams.get('total');
  const paramNotes = urlParams.get('notes');
  const paramConcept = urlParams.get('concept');

  // Prefill Service
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

  // Prefill Guests
  if (paramGuests) {
    const guestsField = form.querySelector('[name="guests"]');
    if (guestsField) guestsField.value = paramGuests;
  }

  // Prefill Budget
  if (paramBudget) {
    const budgetSelect = form.querySelector('[name="budget"]');
    if (budgetSelect) {
      for (const opt of budgetSelect.options) {
        if (opt.value === paramBudget) opt.selected = true;
      }
    }
  }

  // Prefill Notes with Estimator Result if available
  const notesField = form.querySelector('[name="notes"]');
  if (notesField) {
    const noteLines = [];
    if (paramTotal || paramAddons) {
      noteLines.push(`[Hasil Simulasi Price Estimator Website]:`);
      if (paramService) noteLines.push(`• Paket Dasar: ${paramService}`);
      if (paramTotal) noteLines.push(`• Total Estimasi Biaya: ${paramTotal}`);
      if (paramAddons) noteLines.push(`• Layanan Tambahan (Add-ons): ${paramAddons}`);
      noteLines.push(``);
    }
    if (paramConcept) noteLines.push(`Konsep Pilihan: ${paramConcept}`);
    if (paramNotes) noteLines.push(paramNotes);

    if (noteLines.length > 0) {
      notesField.value = noteLines.join('\n');
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
      `*Catatan Khusus / Estimasi Add-ons:* ${encodeURIComponent(b.notes || '-')}`;

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

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initPriceEstimator();
});
