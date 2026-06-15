/* Praman — DPDP Readiness Score (front-end only) */
(function () {
  "use strict";

  var QUESTIONS = [
    { area: "Data mapping", weight: 1.2,
      q: "Do you have an up-to-date inventory of the personal data you collect and where it's stored?",
      rec: "Build a data inventory and flow map (RoPA) so you know exactly what personal data you hold and why." },
    { area: "Privacy notice", weight: 1.0,
      q: "Do you show a clear privacy notice before collecting personal data?",
      rec: "Publish a plain-language privacy notice that states what you collect, why, and the user's rights." },
    { area: "Consent", weight: 1.3,
      q: "Do you capture specific, informed consent (not pre-ticked boxes or bundled terms)?",
      rec: "Redesign consent capture so it's free, specific, informed, and unbundled — no pre-ticked boxes." },
    { area: "Consent", weight: 1.0,
      q: "Can users easily withdraw their consent at any time?",
      rec: "Add a simple, accessible way for users to withdraw consent — as easy as giving it." },
    { area: "User rights", weight: 1.2,
      q: "Do you have a process to handle access, correction, and erasure requests?",
      rec: "Set up a documented process to receive and fulfil data access, correction, and erasure requests on time." },
    { area: "Grievance", weight: 1.0,
      q: "Have you appointed someone responsible for privacy queries and grievances?",
      rec: "Name a contact (and, if required, a grievance officer) responsible for privacy queries." },
    { area: "Breach response", weight: 1.3,
      q: "Do you have a plan to detect a data breach and report it quickly?",
      rec: "Create a breach-response plan covering detection, containment, and notification timelines." },
    { area: "Retention", weight: 1.0,
      q: "Do you delete personal data once it's no longer needed for its purpose?",
      rec: "Define retention periods and routinely delete personal data that's no longer needed." },
    { area: "Vendors", weight: 1.0,
      q: "Do you have data-protection agreements with vendors who process data for you?",
      rec: "Put data-processing agreements in place with every third party that handles personal data for you." },
    { area: "Security", weight: 1.2,
      q: "Are basic security safeguards (access controls, encryption) in place?",
      rec: "Implement core safeguards — access controls, encryption, and logging — to protect personal data." },
    { area: "Children's data", weight: 1.0,
      q: "If you process children's data, do you obtain verifiable parental consent?",
      rec: "If you handle children's data, add verifiable parental consent and avoid behavioural tracking of minors.",
      options: [
        { label: "Yes", pts: 1 },
        { label: "No / Not sure", pts: 0 },
        { label: "We don't handle children's data", pts: 1 }
      ] },
    { area: "Training", weight: 0.8,
      q: "Do you train your team on handling personal data correctly?",
      rec: "Run short, role-specific training so your team handles personal data correctly day to day." }
  ];

  var DEFAULT_OPTIONS = [
    { label: "Yes, fully", pts: 1 },
    { label: "Partially", pts: 0.5 },
    { label: "No / Not sure", pts: 0 }
  ];

  var BANDS = [
    { min: 0,  label: "At risk", color: "#D64A5B",
      msg: "Significant gaps mean real exposure under the DPDP Act. The good news: a focused Readiness Assessment can map a clear path forward quickly." },
    { min: 40, label: "Developing", color: "#C98A3A",
      msg: "You've made a start, but important pieces are missing. Prioritising the areas below will move you toward compliance fast." },
    { min: 70, label: "On track", color: "#0E7C6B",
      msg: "You're in solid shape. A few targeted fixes in the areas below will get you to a defensible, demonstrable position." },
    { min: 90, label: "Strong", color: "#1F9D6B",
      msg: "Excellent — you're close to fully DPDP-ready. Tighten the remaining items and keep them under review as you grow." }
  ];

  var state = { current: 0, answers: [] };

  var introEl = document.getElementById("quizIntro");
  var quizEl = document.getElementById("quizCard");
  var resultEl = document.getElementById("quizResult");
  if (!introEl || !quizEl || !resultEl) return;

  var elCount = document.getElementById("qCount");
  var elArea = document.getElementById("qArea");
  var elBar = document.getElementById("qBar");
  var elQuestion = document.getElementById("qQuestion");
  var elOptions = document.getElementById("qOptions");
  var elBack = document.getElementById("qBack");

  document.getElementById("quizStart").addEventListener("click", function () {
    state.current = 0; state.answers = [];
    introEl.classList.add("is-hidden");
    resultEl.classList.add("is-hidden");
    quizEl.classList.remove("is-hidden");
    renderQuestion();
  });

  elBack.addEventListener("click", function () {
    if (state.current > 0) { state.current--; renderQuestion(); }
  });

  function renderQuestion() {
    var i = state.current, total = QUESTIONS.length, item = QUESTIONS[i];
    elCount.textContent = "Question " + (i + 1) + " of " + total;
    elArea.textContent = item.area;
    elBar.style.width = (i / total * 100) + "%";
    elQuestion.textContent = item.q;
    elBack.disabled = i === 0;

    var opts = item.options || DEFAULT_OPTIONS;
    elOptions.innerHTML = "";
    opts.forEach(function (opt, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-option" + (state.answers[i] && state.answers[i].label === opt.label ? " selected" : "");
      btn.innerHTML = '<span class="mark"></span><span>' + opt.label + "</span>";
      btn.addEventListener("click", function () {
        state.answers[i] = { pts: opt.pts, label: opt.label };
        Array.prototype.forEach.call(elOptions.children, function (c) { c.classList.remove("selected"); });
        btn.classList.add("selected");
        setTimeout(function () {
          if (state.current < total - 1) { state.current++; renderQuestion(); }
          else { showResult(); }
        }, 240);
      });
      elOptions.appendChild(btn);
    });
  }

  function showResult() {
    quizEl.classList.add("is-hidden");
    resultEl.classList.remove("is-hidden");

    var maxScore = 0, earned = 0;
    QUESTIONS.forEach(function (item, i) {
      maxScore += item.weight;
      earned += item.weight * (state.answers[i] ? state.answers[i].pts : 0);
    });
    var pct = Math.round(earned / maxScore * 100);

    var band = BANDS[0];
    BANDS.forEach(function (b) { if (pct >= b.min) band = b; });
    state.score = pct; state.band = band.label;

    // ring
    var r = 78, C = 2 * Math.PI * r;
    var prog = document.getElementById("ringProgress");
    prog.style.stroke = band.color;
    prog.style.strokeDasharray = C;
    prog.style.strokeDashoffset = C;
    requestAnimationFrame(function () {
      prog.style.transition = "stroke-dashoffset 1s ease";
      prog.style.strokeDashoffset = C * (1 - pct / 100);
    });

    // count up
    var numEl = document.getElementById("scoreNum");
    var start = null, dur = 1000;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      numEl.textContent = Math.round(t * pct);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);

    var lab = document.getElementById("bandLabel");
    lab.textContent = band.label;
    lab.style.color = band.color;
    document.getElementById("bandMsg").textContent = band.msg;

    // top gaps
    var gaps = QUESTIONS.map(function (item, i) {
      var pts = state.answers[i] ? state.answers[i].pts : 0;
      return { area: item.area, rec: item.rec, loss: item.weight * (1 - pts) };
    }).filter(function (g) { return g.loss > 0; })
      .sort(function (a, b) { return b.loss - a.loss; })
      .slice(0, 4);

    var gapsWrap = document.getElementById("gaps");
    if (gaps.length === 0) {
      gapsWrap.innerHTML = '<h3>No major gaps found</h3><p style="color:var(--ink-soft);font-size:14.5px">You answered "yes" across the board. Keep these practices documented and reviewed.</p>';
    } else {
      var html = "<h3>Your top priority areas</h3>";
      gaps.forEach(function (g) {
        html += '<div class="gap"><span class="ic">' +
          '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v6" stroke="#C98A3A" stroke-width="2" stroke-linecap="round"/><circle cx="8" cy="12" r="1.1" fill="#C98A3A"/></svg>' +
          '</span><div><div class="area-name">' + g.area + '</div><p>' + g.rec + '</p></div></div>';
      });
      gapsWrap.innerHTML = html;
    }
  }

  // email capture -> submits the lead (with score) via the shared form provider
  var form = document.getElementById("reportForm");
  if (form) {
    var note = document.getElementById("reportNote");
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("rf-name") || {}).value.trim();
      var email = (document.getElementById("rf-email") || {}).value.trim();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.className = "form-note err show";
        note.textContent = "Please add your name and a valid email so we can send your report.";
        return;
      }
      var answers = QUESTIONS.map(function (q, i) {
        return q.area + ": " + (state.answers[i] ? state.answers[i].label : "—");
      }).join("\n");
      var original = btn.textContent; btn.disabled = true; btn.textContent = "Sending…";
      var send = window.pramanSubmit
        ? window.pramanSubmit({
            subject: "New DPDP Readiness lead — " + state.score + "/100 (" + state.band + ")",
            from_name: name, email: email,
            score: state.score + "/100", band: state.band, answers: answers
          })
        : Promise.resolve("demo");
      send.then(function (res) {
        if (res === false) {
          note.className = "form-note err show";
          note.textContent = "Something went wrong. Please email us directly and we'll send your report.";
        } else {
          note.className = "form-note ok show";
          note.textContent = "Thanks, " + name.split(" ")[0] + " — your full DPDP report and action plan are on the way to " + email + ".";
          form.reset();
        }
      }).catch(function () {
        note.className = "form-note err show";
        note.textContent = "Network error — please email us directly.";
      }).then(function () { btn.disabled = false; btn.textContent = original; });
    });
  }
})();
