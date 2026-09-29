import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory bookings store
const bookings = [
  {
    id: 1711700000001,
    name: 'Anisa & Dimas',
    phone: '081234567890',
    date: '2026-11-20',
    guests: '350',
    venue: 'Gedung Tri Dharma Temanggung',
    service: 'Signature',
    budget: 'Rp25–50 juta',
    notes: 'Ingin konsep modern klasik dipadu sentuhan adat Jawa minimalis.',
    status: 'Terkonfirmasi',
    createdAt: new Date().toISOString()
  },
  {
    id: 1711700000002,
    name: 'Ratih & Bagas',
    phone: '085678901234',
    date: '2026-12-12',
    guests: '500',
    venue: 'Grand Artos Hotel Magelang',
    service: 'Full Service',
    budget: 'Di atas Rp100 juta',
    notes: 'Perlu tim WO full day + dekorasi pelaminan 16m & prosesi siraman adat.',
    status: 'Pending',
    createdAt: new Date().toISOString()
  }
];

// API endpoints
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, data: bookings });
});

app.post('/api/bookings', (req, res) => {
  const newBooking = {
    id: Date.now(),
    name: req.body.name || 'Tamu',
    phone: req.body.phone || '',
    date: req.body.date || '',
    guests: req.body.guests || '',
    venue: req.body.venue || '',
    service: req.body.service || '',
    budget: req.body.budget || '',
    notes: req.body.notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString()
  };
  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.patch('/api/bookings/:id', (req, res) => {
  const bookingId = Number(req.params.id);
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking tidak ditemukan' });
  if (req.body.status) booking.status = req.body.status;
  res.json({ success: true, data: booking });
});

app.delete('/api/bookings/:id', (req, res) => {
  const bookingId = Number(req.params.id);
  const index = bookings.findIndex(b => b.id === bookingId);
  if (index !== -1) bookings.splice(index, 1);
  res.json({ success: true });
});

// Serve static assets and HTML files from root directory
app.use(express.static(__dirname));

// Route handlers for clean URLs if requested without .html
app.get('/:page', (req, res, next) => {
  const filePath = join(__dirname, `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
