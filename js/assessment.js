/* ==========================================================================
   Praman — AI Compliance Assessment Wizard
   ========================================================================== */

(function() {
  'use strict';

  // ---- State ----
  let currentStep = 1;
  const totalSteps = 4;
  let currentQuestion = 0;

  const questions = [
    { q: "Does your organization have a designated Data Protection Officer (DPO)?", options: ["Yes, full-time", "Yes, part-time / shared", "No, but planning to", "No"] },
    { q: "How do you currently manage consent for personal data collection?", options: ["Automated consent management platform", "Manual process with documentation", "Basic cookie banner only", "No formal process"] },
    { q: "Do you maintain an up-to-date data inventory / Record of Processing Activities (ROPA)?", options: ["Yes, automated and current", "Yes, but manually maintained", "Partially documented", "No data inventory exists"] },
    { q: "How do you handle Data Subject Access Requests (DSARs)?", options: ["Automated workflow with SLA tracking", "Defined manual process", "Ad-hoc handling", "No formal process"] },
    { q: "Is there an incident response plan for data breaches?", options: ["Documented, tested, and rehearsed", "Documented but untested", "Informal / undocumented", "None exists"] },
    { q: "How often do you conduct privacy impact assessments?", options: ["For every new project/product", "Annually", "Occasionally", "Never"] },
    { q: "Do you have data processing agreements with all third-party vendors?", options: ["Yes, all vendors covered", "Most vendors covered", "Some vendors only", "No formal agreements"] },
    { q: "How is employee security awareness training conducted?", options: ["Regular, tracked with assessments", "Annual training program", "Occasional communications", "No formal training"] },
    { q: "Do you have automated continuous monitoring for compliance drift?", options: ["Real-time automated monitoring", "Periodic automated scans", "Manual periodic reviews", "No monitoring in place"] },
    { q: "How do you manage cross-border data transfers?", options: ["Formal transfer mechanisms (SCCs, adequacy)", "Documented but not fully compliant", "Aware but no formal process", "Not considered"] }
  ];

  // ---- DOM refs ----
  const landing = document.getElementById('assessLanding');
  const wizard = document.getElementById('assessWizard');
  const processing = document.getElementById('assessProcessing');
  const results = document.getElementById('assessResults');
  const sampleModal = document.getElementById('sampleModal');

  const progressBar = document.getElementById('wizardProgressBar');
  const btnNext = document.getElementById('btnNext');
  const btnPrev = document.getElementById('btnPrev');
  const btnStart = document.getElementById('btnStartAssessment');
  const btnSample = document.getElementById('btnSampleReport');
  const closeSample = document.getElementById('closeSampleModal');

  // ---- Init ----
  function init() {
    btnStart.addEventListener('click', startWizard);
    btnSample.addEventListener('click', () => sampleModal.style.display = 'flex');
    closeSample.addEventListener('click', () => sampleModal.style.display = 'none');
    sampleModal.addEventListener('click', (e) => { if (e.target === sampleModal) sampleModal.style.display = 'none'; });
    btnNext.addEventListener('click', nextStep);
    btnPrev.addEventListener('click', prevStep);

    // Download report button
    const btnDownload = document.getElementById('btnDownloadReport');
    if (btnDownload) {
      btnDownload.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Your Executive Summary PDF will be emailed to you shortly.');
      });
    }
  }

  function startWizard() {
    landing.style.display = 'none';
    wizard.style.display = 'block';
    wizard.classList.add('fade-in');
    updateProgress();
    renderQuestionnaire();
  }

  // ---- Navigation ----
  function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep === 4) {
      // Handle questionnaire navigation
      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderCurrentQuestion();
        updateQuestionProgress();
        return;
      } else {
        // Submit
        submitAssessment();
        return;
      }
    }

    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep++;
    document.getElementById('step' + currentStep).classList.add('active');
    updateProgress();
    updateNav();
  }

  function prevStep() {
    if (currentStep === 4 && currentQuestion > 0) {
      currentQuestion--;
      renderCurrentQuestion();
      updateQuestionProgress();
      return;
    }

    if (currentStep <= 1) return;
    document.getElementById('step' + currentStep).classList.remove('active');
    currentStep--;
    document.getElementById('step' + currentStep).classList.add('active');
    updateProgress();
    updateNav();
  }

  function updateProgress() {
    const pct = ((currentStep - 1) / totalSteps) * 100;
    progressBar.style.width = pct + '%';

    document.querySelectorAll('.step-dot').forEach(dot => {
      const s = parseInt(dot.dataset.step);
      dot.classList.toggle('active', s <= currentStep);
      dot.classList.toggle('completed', s < currentStep);
    });
  }

  function updateNav() {
    btnPrev.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    btnNext.textContent = currentStep === 4 ? 'Submit Assessment' : 'Continue →';
  }

  // ---- Validation ----
  function validateStep(step) {
    if (step === 1) {
      const name = document.getElementById('assess-name').value.trim();
      const email = document.getElementById('assess-email').value.trim();
      const company = document.getElementById('assess-company').value.trim();
      if (!name || !email || !company) {
        shakeStep(step);
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        shakeStep(step);
        return false;
      }
      return true;
    }
    if (step === 2) {
      const industry = document.getElementById('assess-industry').value;
      const employees = document.getElementById('assess-employees').value;
      const country = document.getElementById('assess-country').value;
      if (!industry || !employees || !country) {
        shakeStep(step);
        return false;
      }
      return true;
    }
    if (step === 3) {
      const checked = document.querySelectorAll('input[name="framework"]:checked');
      if (checked.length === 0) {
        shakeStep(step);
        return false;
      }
      return true;
    }
    if (step === 4) {
      const selected = document.querySelector('input[name="q' + currentQuestion + '"]:checked');
      if (!selected) {
        shakeStep(step);
        return false;
      }
      return true;
    }
    return true;
  }

  function shakeStep(step) {
    const el = document.getElementById('step' + step);
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }

  // ---- Questionnaire ----
  function renderQuestionnaire() {
    currentQuestion = 0;
    renderCurrentQuestion();
    updateQuestionProgress();
    updateNav();
  }

  function renderCurrentQuestion() {
    const container = document.getElementById('questionnaire');
    const q = questions[currentQuestion];
    container.innerHTML = `
      <div class="question-card fade-in">
        <p class="question-text">${q.q}</p>
        <div class="question-options">
          ${q.options.map((opt, i) => `
            <label class="question-option">
              <input type="radio" name="q${currentQuestion}" value="${i}">
              <span class="option-content">${opt}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  function updateQuestionProgress() {
    const bar = document.getElementById('questionProgressBar');
    const counter = document.getElementById('questionCounter');
    const pct = ((currentQuestion + 1) / questions.length) * 100;
    bar.style.width = pct + '%';
    counter.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;

    // Update main progress for step 4
    const basePct = (3 / totalSteps) * 100;
    const stepPct = ((currentQuestion + 1) / questions.length) * (100 / totalSteps);
    progressBar.style.width = (basePct + stepPct) + '%';

    btnNext.textContent = currentQuestion === questions.length - 1 ? 'Submit Assessment' : 'Continue →';
  }

  // ---- Submission & Results ----
  function submitAssessment() {
    wizard.style.display = 'none';
    processing.style.display = 'flex';
    processing.classList.add('fade-in');
    animateProcessing();
  }

  function animateProcessing() {
    const steps = document.querySelectorAll('#processingSteps .proc-step');
    let i = 0;
    const interval = setInterval(() => {
      if (i > 0) {
        steps[i - 1].classList.remove('active');
        steps[i - 1].classList.add('done');
        steps[i - 1].querySelector('.proc-icon').textContent = '✓';
      }
      if (i < steps.length) {
        steps[i].classList.add('active');
      } else {
        clearInterval(interval);
        setTimeout(showResults, 600);
      }
      i++;
    }, 900);
  }

  function showResults() {
    processing.style.display = 'none';
    results.style.display = 'block';
    results.classList.add('fade-in');

    // Populate
    const company = document.getElementById('assess-company').value;
    const email = document.getElementById('assess-email').value;
    document.getElementById('resultsCompany').textContent = 'Prepared for ' + company;
    document.getElementById('resultsEmail').textContent = email;

    // Calculate score based on answers
    const score = calculateScore();
    animateScore(score);
    generateMetrics(score);
  }

  function calculateScore() {
    let total = 0;
    for (let i = 0; i < questions.length; i++) {
      const selected = document.querySelector('input[name="q' + i + '"]:checked');
      if (selected) {
        // First option = best (3 pts), last = worst (0 pts)
        const val = parseInt(selected.value);
        total += (3 - val);
      }
    }
    // Normalize to percentage (max = 30)
    return Math.round((total / 30) * 100);
  }

  function animateScore(targetScore) {
    const scoreEl = document.getElementById('scoreNumber');
    const ringFill = document.querySelector('.score-ring-fill');
    const circumference = 2 * Math.PI * 85; // 534
    const offset = circumference - (targetScore / 100) * circumference;

    // Animate ring
    setTimeout(() => {
      ringFill.style.transition = 'stroke-dashoffset 1.5s var(--ease-out)';
      ringFill.style.strokeDashoffset = offset;
    }, 300);

    // Animate number
    let current = 0;
    const duration = 1500;
    const start = performance.now();
    function step(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      current = Math.round(progress * targetScore);
      scoreEl.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function generateMetrics(score) {
    // Generate realistic metrics based on score
    const critical = score >= 80 ? 1 : score >= 60 ? 2 : score >= 40 ? 4 : 6;
    const medium = score >= 80 ? 3 : score >= 60 ? 5 : score >= 40 ? 8 : 12;
    const controls = score >= 80 ? 4 : score >= 60 ? 8 : score >= 40 ? 14 : 20;
    const days = score >= 80 ? 12 : score >= 60 ? 18 : score >= 40 ? 30 : 45;

    document.getElementById('metricCritical').textContent = critical;
    document.getElementById('metricMedium').textContent = medium;
    document.getElementById('metricControls').textContent = controls;
    document.getElementById('metricDays').textContent = days;
  }

  // ---- Start ----
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
