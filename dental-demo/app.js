// ── DentaFlow PMS — Mock Data & Interactivity ──

// ── Date Display ──
const today = new Date();
document.getElementById('pageDate').textContent = today.toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
});

// ── Mock Data ──

const patients = [
  { id: '10042', name: 'Marcus Rivera', dob: '03/15/1985', phone: '(512) 555-0147', insurance: 'Delta Dental PPO', lastVisit: '01/10/2026', balance: 245, status: 'active', initials: 'MR', color: '#818cf8' },
  { id: '10089', name: 'Priya Sharma', dob: '07/22/1992', phone: '(512) 555-0283', insurance: 'Cigna DHMO', lastVisit: '03/28/2026', balance: 0, status: 'active', initials: 'PS', color: '#3ecfb4' },
  { id: '10103', name: 'James Whitfield', dob: '11/03/1978', phone: '(512) 555-0391', insurance: 'MetLife PDP', lastVisit: '02/14/2026', balance: 890, status: 'overdue', initials: 'JW', color: '#f87171' },
  { id: '10117', name: 'Aisha Johnson', dob: '05/18/1995', phone: '(512) 555-0455', insurance: 'Guardian', lastVisit: '04/02/2026', balance: 0, status: 'active', initials: 'AJ', color: '#fbbf24' },
  { id: '10134', name: 'Robert Chen', dob: '09/27/1968', phone: '(512) 555-0512', insurance: 'Aetna DMO', lastVisit: '12/05/2025', balance: 1250, status: 'overdue', initials: 'RC', color: '#fb923c' },
  { id: '10156', name: 'Elena Vasquez', dob: '01/14/2001', phone: '(512) 555-0628', insurance: 'Delta Dental PPO', lastVisit: '03/15/2026', balance: 75, status: 'active', initials: 'EV', color: '#60a5fa' },
  { id: '10171', name: 'David Okonkwo', dob: '08/30/1988', phone: '(512) 555-0734', insurance: 'BCBS', lastVisit: '11/20/2025', balance: 0, status: 'inactive', initials: 'DO', color: '#a78bfa' },
  { id: '10185', name: 'Sarah Kim', dob: '12/09/1975', phone: '(512) 555-0841', insurance: 'United Concordia', lastVisit: '04/05/2026', balance: 320, status: 'active', initials: 'SK', color: '#34d399' },
];

const appointments = [
  // Op 1 — Hygiene
  { patient: patients[1], op: 0, startHour: 8, startMin: 0, duration: 60, type: 'hygiene', procedure: 'D1110 — Prophylaxis', status: 'confirmed',
    procedures: ['D0120 — Periodic Oral Exam', 'D1110 — Adult Prophylaxis', 'D0274 — Bitewings (4 films)'],
    alerts: [{ type: 'info', text: 'Due for full mouth X-rays' }] },
  { patient: patients[5], op: 0, startHour: 9, startMin: 30, duration: 60, type: 'hygiene', procedure: 'D1110 — Prophylaxis', status: 'unconfirmed',
    procedures: ['D0120 — Periodic Oral Exam', 'D1110 — Adult Prophylaxis'],
    alerts: [] },
  { patient: patients[7], op: 0, startHour: 11, startMin: 0, duration: 45, type: 'exam', procedure: 'D0150 — Comp Oral Exam', status: 'confirmed',
    procedures: ['D0150 — Comprehensive Oral Evaluation'],
    alerts: [{ type: 'warning', text: 'Penicillin allergy' }] },
  { patient: patients[6], op: 0, startHour: 13, startMin: 0, duration: 60, type: 'hygiene', procedure: 'D4341 — SRP', status: 'confirmed',
    procedures: ['D4341 — Scaling & Root Planing (per quadrant)', 'D4381 — Localized Antimicrobial'],
    alerts: [{ type: 'warning', text: 'Requires pre-med (heart valve)' }] },

  // Op 2 — Hygiene
  { patient: patients[3], op: 1, startHour: 8, startMin: 30, duration: 60, type: 'hygiene', procedure: 'D1110 — Prophylaxis', status: 'checked-in',
    procedures: ['D0120 — Periodic Oral Exam', 'D1110 — Adult Prophylaxis', 'D1206 — Fluoride Varnish'],
    alerts: [] },
  { patient: patients[4], op: 1, startHour: 10, startMin: 0, duration: 90, type: 'exam', procedure: 'D0150 — New Patient Exam', status: 'confirmed',
    procedures: ['D0150 — Comprehensive Oral Evaluation', 'D0210 — Full Mouth X-rays', 'D0431 — Adjunctive pre-diagnostic test'],
    alerts: [{ type: 'warning', text: 'Diabetes — check blood sugar' }, { type: 'info', text: 'New patient — needs full records' }] },

  // Op 3 — Restorative
  { patient: patients[0], op: 2, startHour: 9, startMin: 0, duration: 90, type: 'restorative', procedure: 'D2740 — Crown Prep #14', status: 'in-progress',
    procedures: ['D2740 — Crown — Porcelain/Ceramic', 'D2950 — Core Buildup'],
    alerts: [{ type: 'warning', text: 'Latex allergy' }] },
  { patient: patients[2], op: 2, startHour: 11, startMin: 0, duration: 60, type: 'restorative', procedure: 'D2391 — Composite #19', status: 'confirmed',
    procedures: ['D2391 — Resin Composite — 1 surface, posterior', 'D2392 — Resin Composite — 2 surfaces, posterior'],
    alerts: [{ type: 'warning', text: 'Outstanding balance: $890' }] },
  { patient: patients[5], op: 2, startHour: 14, startMin: 0, duration: 60, type: 'restorative', procedure: 'D2391 — Composite #30', status: 'confirmed',
    procedures: ['D2391 — Resin Composite — 1 surface, posterior'],
    alerts: [] },

  // Op 4 — Restorative
  { patient: patients[7], op: 3, startHour: 8, startMin: 0, duration: 120, type: 'surgery', procedure: 'D7210 — Surgical Ext #17', status: 'confirmed',
    procedures: ['D7210 — Surgical Extraction', 'D9230 — Analgesia'],
    alerts: [{ type: 'warning', text: 'Blood thinner — verify INR' }, { type: 'info', text: 'Escort required post-op' }] },
  { patient: patients[3], op: 3, startHour: 13, startMin: 0, duration: 60, type: 'emergency', procedure: 'D0140 — Emergency Exam', status: 'unconfirmed',
    procedures: ['D0140 — Limited Oral Evaluation — Problem Focused', 'D0220 — Periapical X-ray'],
    alerts: [{ type: 'warning', text: 'Reports severe pain #30' }] },
];

const toothConditions = {
  upper: {
    1: 'healthy', 2: 'healthy', 3: 'healthy', 4: 'filling', 5: 'healthy',
    6: 'healthy', 7: 'crown', 8: 'healthy', 9: 'healthy', 10: 'healthy',
    11: 'healthy', 12: 'decay', 13: 'healthy', 14: 'crown', 15: 'filling',
    16: 'missing'
  },
  lower: {
    17: 'missing', 18: 'healthy', 19: 'decay', 20: 'filling', 21: 'healthy',
    22: 'healthy', 23: 'healthy', 24: 'healthy', 25: 'healthy', 26: 'healthy',
    27: 'healthy', 28: 'healthy', 29: 'filling', 30: 'decay', 31: 'healthy',
    32: 'missing'
  }
};

const treatmentPhases = [
  {
    title: 'Phase 1 — Urgent Care',
    subtitle: 'Address active decay and pain',
    total: '$1,680.00',
    procedures: [
      { code: 'D2740', tooth: '#14', desc: 'Crown — Porcelain/Ceramic', fee: '$1,200.00', ins: '$720.00', patient: '$480.00' },
      { code: 'D2950', tooth: '#14', desc: 'Core Buildup incl. pins', fee: '$280.00', ins: '$168.00', patient: '$112.00' },
      { code: 'D2391', tooth: '#19', desc: 'Resin Composite — 1 surface', fee: '$200.00', ins: '$120.00', patient: '$80.00' },
    ]
  },
  {
    title: 'Phase 2 — Restorative',
    subtitle: 'Complete remaining fillings',
    total: '$600.00',
    procedures: [
      { code: 'D2391', tooth: '#30', desc: 'Resin Composite — 1 surface', fee: '$200.00', ins: '$120.00', patient: '$80.00' },
      { code: 'D2392', tooth: '#12', desc: 'Resin Composite — 2 surfaces', fee: '$280.00', ins: '$168.00', patient: '$112.00' },
      { code: 'D2140', tooth: '#20', desc: 'Amalgam — 1 surface', fee: '$120.00', ins: '$72.00', patient: '$48.00' },
    ]
  },
  {
    title: 'Phase 3 — Prosthetic',
    subtitle: 'Replace missing teeth',
    total: '$2,000.00',
    procedures: [
      { code: 'D6010', tooth: '#16', desc: 'Endosteal Implant', fee: '$2,000.00', ins: '$1,200.00', patient: '$800.00' },
    ]
  }
];

const billingTransactions = [
  { date: '04/08/2026', patient: 'Priya Sharma', procedure: 'Prophylaxis', code: 'D1110', billed: '$165.00', insurance: '$132.00', owed: '$33.00', status: 'paid' },
  { date: '04/08/2026', patient: 'Marcus Rivera', procedure: 'Crown Prep #14', code: 'D2740', billed: '$1,200.00', insurance: '$720.00', owed: '$480.00', status: 'submitted' },
  { date: '04/07/2026', patient: 'Elena Vasquez', procedure: 'Composite #30', code: 'D2391', billed: '$200.00', insurance: '$120.00', owed: '$80.00', status: 'pending' },
  { date: '04/07/2026', patient: 'James Whitfield', procedure: 'SRP — UR Quad', code: 'D4341', billed: '$280.00', insurance: '$0.00', owed: '$280.00', status: 'denied' },
  { date: '04/05/2026', patient: 'Sarah Kim', procedure: 'Comp Oral Eval', code: 'D0150', billed: '$95.00', insurance: '$95.00', owed: '$0.00', status: 'paid' },
  { date: '04/05/2026', patient: 'Aisha Johnson', procedure: 'Fluoride Varnish', code: 'D1206', billed: '$45.00', insurance: '$45.00', owed: '$0.00', status: 'paid' },
  { date: '04/04/2026', patient: 'Robert Chen', procedure: 'Full Mouth X-rays', code: 'D0210', billed: '$150.00', insurance: '$120.00', owed: '$30.00', status: 'submitted' },
  { date: '04/03/2026', patient: 'David Okonkwo', procedure: 'Extraction #17', code: 'D7210', billed: '$350.00', insurance: '$245.00', owed: '$105.00', status: 'paid' },
];


// ── Schedule Rendering ──

function renderSchedule() {
  const startHour = 7;
  const endHour = 17;
  const timeGutter = document.getElementById('timeGutter');
  const opColumns = document.getElementById('operatoryColumns');

  // Time labels
  for (let h = startHour; h <= endHour; h++) {
    const label = document.createElement('div');
    label.className = 'time-slot-label';
    const hour12 = h > 12 ? h - 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    label.textContent = `${hour12}:00 ${ampm}`;
    timeGutter.appendChild(label);
  }

  // 4 operatory columns
  for (let op = 0; op < 4; op++) {
    const col = document.createElement('div');
    col.className = 'operatory-column';

    // Grid lines
    for (let h = startHour; h <= endHour; h++) {
      const line = document.createElement('div');
      line.className = 'time-gridline';
      col.appendChild(line);
    }

    // Appointments
    const opAppts = appointments.filter(a => a.op === op);
    opAppts.forEach((appt, i) => {
      const block = document.createElement('div');
      block.className = `appointment-block type-${appt.type}`;
      block.style.animationDelay = `${i * 0.06}s`;

      const topOffset = (appt.startHour - startHour) * 60 + appt.startMin;
      block.style.top = `${topOffset}px`;
      block.style.height = `${appt.duration - 2}px`;

      const timeStr = formatTime(appt.startHour, appt.startMin);
      const endMin = appt.startMin + appt.duration;
      const endHr = appt.startHour + Math.floor(endMin / 60);
      const endMinR = endMin % 60;
      const endTimeStr = formatTime(endHr, endMinR);

      block.innerHTML = `
        <div class="appt-status ${appt.status}"></div>
        <div class="appt-name">${appt.patient.name}</div>
        <div class="appt-procedure">${appt.procedure}</div>
        <div class="appt-time">${timeStr} — ${endTimeStr}</div>
      `;

      block.addEventListener('click', () => selectAppointment(appt, block));
      col.appendChild(block);
    });

    opColumns.appendChild(col);
  }

  // Scroll to 8 AM
  const scrollTarget = (8 - startHour) * 60 - 20;
  document.getElementById('scheduleBody').scrollTop = scrollTarget;
}

function formatTime(h, m) {
  const hour12 = h > 12 ? h - 12 : h;
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function selectAppointment(appt, blockEl) {
  document.querySelectorAll('.appointment-block').forEach(b => b.classList.remove('selected'));
  blockEl.classList.add('selected');

  document.querySelector('.quick-panel-empty').style.display = 'none';
  const content = document.getElementById('quickPanelContent');
  content.style.display = 'block';

  document.getElementById('qpName').textContent = appt.patient.name;
  document.getElementById('qpId').textContent = `ID #${appt.patient.id}`;
  document.getElementById('qpDob').textContent = appt.patient.dob;
  document.getElementById('qpPhone').textContent = appt.patient.phone;
  document.getElementById('qpInsurance').textContent = appt.patient.insurance;
  document.getElementById('qpLastVisit').textContent = appt.patient.lastVisit;

  const procContainer = document.getElementById('qpProcedures');
  procContainer.innerHTML = appt.procedures.map(p => {
    const [code, ...desc] = p.split(' — ');
    return `<div class="qp-procedure-item"><span class="qp-procedure-code">${code}</span> — ${desc.join(' — ')}</div>`;
  }).join('');

  const alertContainer = document.getElementById('qpAlerts');
  if (appt.alerts.length === 0) {
    alertContainer.innerHTML = '<div style="font-size:12px;color:var(--text-muted);">No active alerts</div>';
  } else {
    alertContainer.innerHTML = appt.alerts.map(a =>
      `<div class="qp-alert alert-${a.type}">⚠ ${a.text}</div>`
    ).join('');
  }
}


// ── Patients Table ──

function renderPatients() {
  const tbody = document.getElementById('patientsTableBody');
  tbody.innerHTML = patients.map(p => `
    <tr>
      <td>
        <div class="patient-name-cell">
          <div class="patient-avatar-small" style="background:${p.color}">${p.initials}</div>
          <span class="patient-name-text">${p.name}</span>
        </div>
      </td>
      <td class="patient-id-cell">#${p.id}</td>
      <td>${p.dob}</td>
      <td>${p.phone}</td>
      <td>${p.insurance}</td>
      <td>${p.lastVisit}</td>
      <td><span class="${p.balance > 0 ? 'balance-positive' : 'balance-zero'}">$${p.balance.toLocaleString()}</span></td>
      <td><span class="status-badge status-${p.status}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
    </tr>
  `).join('');
}


// ── Odontogram ──

function renderOdontogram() {
  const upperTeeth = document.getElementById('upperTeeth');
  const lowerTeeth = document.getElementById('lowerTeeth');

  const conditionLabels = {
    healthy: '', decay: 'D', filling: 'F', crown: 'C', missing: 'X'
  };

  // Upper: 1-16 (right to left in dental notation, but we display L-R)
  for (let i = 1; i <= 16; i++) {
    const condition = toothConditions.upper[i];
    upperTeeth.appendChild(createToothEl(i, condition, conditionLabels[condition]));
  }

  // Lower: 32-17 (displayed L-R)
  for (let i = 32; i >= 17; i--) {
    const condition = toothConditions.lower[i];
    lowerTeeth.appendChild(createToothEl(i, condition, conditionLabels[condition]));
  }
}

function createToothEl(number, condition, label) {
  const tooth = document.createElement('div');
  tooth.className = 'tooth';
  tooth.innerHTML = `
    <span class="tooth-number">${number}</span>
    <div class="tooth-shape ${condition}">${label}</div>
  `;
  return tooth;
}


// ── Treatment Plan ──

function renderTreatmentPlan() {
  const container = document.getElementById('treatmentPhases');
  container.innerHTML = treatmentPhases.map(phase => `
    <div class="treatment-phase">
      <div class="phase-header">
        <div>
          <div class="phase-title">${phase.title}</div>
          <div class="phase-subtitle">${phase.subtitle}</div>
        </div>
        <div class="phase-total">${phase.total}</div>
      </div>
      <div class="phase-procedures">
        <div class="procedure-row" style="background:var(--bg-elevated);border-bottom:1px solid var(--border);">
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Code</span>
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Tooth</span>
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;">Description</span>
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;text-align:right;">Fee</span>
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;text-align:right;">Insurance</span>
          <span style="font-size:10px;font-family:var(--font-mono);color:var(--text-muted);text-transform:uppercase;letter-spacing:0.06em;text-align:right;">Patient</span>
        </div>
        ${phase.procedures.map(p => `
          <div class="procedure-row">
            <span class="proc-code">${p.code}</span>
            <span class="proc-tooth">${p.tooth}</span>
            <span class="proc-desc">${p.desc}</span>
            <span class="proc-fee">${p.fee}</span>
            <span class="proc-ins">-${p.ins}</span>
            <span class="proc-patient">${p.patient}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}


// ── Billing ──

function renderBilling() {
  const tbody = document.getElementById('billingTableBody');
  tbody.innerHTML = billingTransactions.map(t => `
    <tr>
      <td style="font-family:var(--font-mono);font-size:12px;">${t.date}</td>
      <td><span class="patient-name-text">${t.patient}</span></td>
      <td>${t.procedure}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--accent);">${t.code}</td>
      <td style="font-family:var(--font-mono);font-size:12px;">${t.billed}</td>
      <td style="font-family:var(--font-mono);font-size:12px;color:var(--success);">-${t.insurance}</td>
      <td style="font-family:var(--font-mono);font-size:12px;font-weight:500;">${t.owed}</td>
      <td><span class="billing-status ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span></td>
    </tr>
  `).join('');
}


// ── Navigation ──

const viewTitles = {
  schedule: "Today's Schedule",
  patients: 'Patient Directory',
  charting: 'Dental Charting',
  treatment: 'Treatment Plans',
  billing: 'Billing & Claims'
};

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const view = item.dataset.view;

    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    item.classList.add('active');

    document.querySelectorAll('.view-container').forEach(v => v.classList.add('hidden'));
    document.getElementById(`${view}View`).classList.remove('hidden');

    document.getElementById('pageTitle').textContent = viewTitles[view];
  });
});


// ── Modal ──

document.getElementById('newAppointmentBtn').addEventListener('click', () => {
  document.getElementById('appointmentModal').classList.add('active');
});

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('appointmentModal').classList.remove('active');
});

document.getElementById('modalCancel').addEventListener('click', () => {
  document.getElementById('appointmentModal').classList.remove('active');
});

document.getElementById('appointmentModal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.remove('active');
  }
});


// ── Init ──

renderSchedule();
renderPatients();
renderOdontogram();
renderTreatmentPlan();
renderBilling();
