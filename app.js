// =========================================
// Portfolio Interactivity & Theme Controller
// =========================================

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initTerminal();
  initSkillsAnimation();
  initProjectFilters();
  initContactForm();
  initScrollAnimations();
  initSpotlightEffect();
  initScrollTracking();
  initMagneticButtons();
});

// --- Theme Management ---
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme') || 'dark';
  
  // Set initial theme
  document.documentElement.setAttribute('data-theme', storedTheme);
  updateThemeIcon(storedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Re-trigger icon updates (e.g. lucide) if needed
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}

function updateThemeIcon(theme) {
  const button = document.getElementById('theme-toggle');
  if (theme === 'dark') {
    button.innerHTML = `<i data-lucide="sun"></i>`;
  } else {
    button.innerHTML = `<i data-lucide="moon"></i>`;
  }
}

// --- Navbar & Hamburger Menu ---
function initNavbar() {
  const header = document.querySelector('header');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Nav menu link clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Scroll Spy: highlight active menu item
  const sections = document.querySelectorAll('section');
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 120; // offset for sticky header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// --- Interactive Terminal Simulation ---
function initTerminal() {
  const consoleBody = document.getElementById('console-body');
  if (!consoleBody) return;

  const bootLines = [
    { text: 'Initializing IT Infrastructure Core...', delay: 100 },
    { text: 'Loading DevOps Orchestrator v4.2.1...', delay: 400 },
    { text: 'Enforcing Security Scans (SAST, DAST, SCA)... OK', delay: 700 },
    { text: 'ISO 27001 Standards Status... COMPLIANT', delay: 1000 },
    { text: 'Vibe coding runtime environment... ACTIVE', delay: 1300 },
    { text: 'System ready. Type "help" or "pipeline".', delay: 1600 }
  ];

  // Run boot sequence
  bootLines.forEach(line => {
    setTimeout(() => {
      printTerminalLine(line.text);
    }, line.delay);
  });

  // Add interactive command handler
  setTimeout(() => {
    createCommandInput();
  }, 1800);
}

function printTerminalLine(text, isInput = false, color = '') {
  const consoleBody = document.getElementById('console-body');
  if (!consoleBody) return;

  const lineEl = document.createElement('div');
  lineEl.className = 'console-line';
  if (color) lineEl.style.color = color;

  if (isInput) {
    lineEl.innerHTML = `<span class="console-prompt">&gt;</span> <span class="console-text">${text}</span>`;
  } else {
    lineEl.innerHTML = `<span class="console-text">${text}</span>`;
  }

  // Remove existing input field if present to append text, then put input back at the bottom
  const existingInput = document.getElementById('active-terminal-input-wrapper');
  if (existingInput) {
    consoleBody.insertBefore(lineEl, existingInput);
  } else {
    consoleBody.appendChild(lineEl);
  }

  consoleBody.scrollTop = consoleBody.scrollHeight;
}

function createCommandInput() {
  const consoleBody = document.getElementById('console-body');
  if (!consoleBody) return;

  // Check if wrapper already exists
  if (document.getElementById('active-terminal-input-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'active-terminal-input-wrapper';
  wrapper.className = 'console-line';
  wrapper.innerHTML = `
    <span class="console-prompt">&gt;</span>
    <input type="text" id="terminal-input" aria-label="Terminal Command Input" autocomplete="off" spellcheck="false" style="
      background: transparent;
      border: none;
      color: var(--color-text-primary);
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.85rem;
      flex-grow: 1;
      outline: none;
    " />
  `;

  consoleBody.appendChild(wrapper);
  consoleBody.scrollTop = consoleBody.scrollHeight;

  const input = document.getElementById('terminal-input');
  input.focus();

  // Re-focus on terminal body click
  consoleBody.addEventListener('click', () => input.focus());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = input.value.trim().toLowerCase();
      handleTerminalCommand(command);
      input.value = '';
    }
  });
}

function handleTerminalCommand(cmd) {
  if (!cmd) return;

  printTerminalLine(cmd, true);

  const consoleBody = document.getElementById('console-body');

  switch (cmd) {
    case 'help':
      printTerminalLine('Available Commands:', false, 'var(--color-secondary)');
      printTerminalLine('  about      - Display Shridhar\'s profile summary');
      printTerminalLine('  skills     - List core technological areas');
      printTerminalLine('  pipeline   - Run a simulated secure CI/CD build');
      printTerminalLine('  clear      - Clear the console logs');
      printTerminalLine('  help       - Show this command list');
      break;

    case 'about':
      printTerminalLine('Shridhar Sabat', false, 'var(--color-accent)');
      printTerminalLine('Role: Head - IT Infrastructure & Solutions Expert');
      printTerminalLine('Vibe: Solutions Architect leveraging AI agents and automated workflows.');
      printTerminalLine('Experience: Hybrid Cloud orchestration, compliance standards (ISO), and secure software delivery.');
      break;

    case 'skills':
      printTerminalLine('Skills Dashboard:', false, 'var(--color-secondary)');
      printTerminalLine('  - IT Infra & Cloud Architecture');
      printTerminalLine('  - DevOps & Azure CI/CD Pipelines');
      printTerminalLine('  - Security Scans (SAST, DAST, SCA)');
      printTerminalLine('  - ISO Standards Compliance Audit');
      printTerminalLine('  - AI-assisted Code & Solutions Delivery');
      break;

    case 'clear':
      // Clear all lines except active input
      const lines = consoleBody.querySelectorAll('.console-line');
      lines.forEach(line => {
        if (line.id !== 'active-terminal-input-wrapper') {
          line.remove();
        }
      });
      break;

    case 'pipeline':
      runSimulatedPipeline();
      break;

    default:
      printTerminalLine(`command not found: ${cmd}. Type "help" for a list of commands.`, false, '#ff5f56');
  }

  consoleBody.scrollTop = consoleBody.scrollHeight;
}

function runSimulatedPipeline() {
  const steps = [
    { text: '🚀 Triggering Secure Azure Pipeline...', color: '#a5f3fc', delay: 100 },
    { text: '🔍 Fetching latest commit & validating env secrets...', color: '#a5f3fc', delay: 400 },
    { text: '⚙️ Running SonarScan (SAST)... 0 critical bugs found.', color: '#27c93f', delay: 800 },
    { text: '📦 Performing Software Composition Analysis (SCA)... Done.', color: '#27c93f', delay: 1200 },
    { text: '🛡️ Running Dynamic Application Security Test (DAST)... OK', color: '#27c93f', delay: 1600 },
    { text: '🚦 Checking quality gates... PASS ✅', color: '#27c93f', delay: 2000 },
    { text: '🚢 Deploying artifact to Azure Cloud... SUCCESS 🚀', color: '#8a2be2', delay: 2400 }
  ];

  // Disable terminal input during simulation
  const input = document.getElementById('terminal-input');
  if (input) input.disabled = true;

  steps.forEach(step => {
    setTimeout(() => {
      printTerminalLine(step.text, false, step.color);
    }, step.delay);
  });

  setTimeout(() => {
    if (input) {
      input.disabled = false;
      input.focus();
    }
  }, 2600);
}

// --- Skills Section Visual Fill ---
function initSkillsAnimation() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const progressBars = document.querySelectorAll('.skill-level-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        progressBars.forEach(bar => {
          const targetVal = bar.getAttribute('data-level') || '0%';
          bar.style.width = targetVal;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsSection);
}

// --- Projects Filtering Logic ---
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active button styling
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// --- Contact Form Submission Handling ---
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Visual button loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="console-blink">Connecting...</span>`;

    // Extract values
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const message = document.getElementById('form-message').value;

    // Simulate server side processing with security filter checks
    setTimeout(() => {
      submitBtn.innerHTML = `Success!`;
      showToast(`Thank you, ${name}! Your secure message has been dispatched.`);
      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 2000);
    }, 1500);
  });
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast glass';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i data-lucide="check-circle" style="color: var(--color-secondary)"></i> <span>${message}</span>`;
  
  if (window.lucide) {
    window.lucide.createIcons();
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// --- Scroll & Page Animations ---
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animateElements.forEach(el => observer.observe(el));
}

// --- Cursor Spotlight Glow Effect ---
function initSpotlightEffect() {
  const cards = document.querySelectorAll('.glass-hover');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// --- Scroll Progress & Orb Drift Parallax ---
function initScrollTracking() {
  const progressBar = document.getElementById('scroll-progress');
  const backToTop = document.getElementById('back-to-top');
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    if (backToTop) {
      if (winScroll > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Passive drifting of ambient background orbs on scroll
    const driftY = winScroll * 0.12;
    const driftX = winScroll * 0.04;
    
    if (orb1) orb1.style.transform = `translate(${driftX}px, ${driftY}px)`;
    if (orb2) orb2.style.transform = `translate(${-driftX}px, ${-driftY}px)`;
    if (orb3) orb3.style.transform = `translate(${-driftX * 0.5}px, ${driftY * 0.6}px)`;
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// --- Magnetic Interactive Elements ---
function initMagneticButtons() {
  const magnetTargets = document.querySelectorAll('.btn, .social-link, .theme-toggle-btn');
  
  magnetTargets.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      // Pull button slightly towards mouse
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

