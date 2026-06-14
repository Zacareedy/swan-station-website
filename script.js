// ============================================
// DHARMA SWAN STATION TERMINAL SYSTEM
// ============================================

const CORRECT_NUMBERS = [4, 8, 15, 16, 23, 42];
const CRITICAL_TIME = 360; // 6 minutes
const WARNING_TIME = 600; // 10 minutes
const TIMER_INTERVAL = 60000; // 1 minute in milliseconds

let timerValue = 108 * 60; // 108 minutes in seconds
let timerInterval;
let numbersPushed = false;
let hieroglyphsShown = false;
let enteredNumbers = [];

const commandInput = document.getElementById('commandInput');
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const terminalContent = document.getElementById('terminalContent');
const hieroglyphDisplay = document.getElementById('hieroglyphDisplay');
const hieroglyphOverlay = document.getElementById('hieroglyphOverlay');

// Command database
const commands = {
    help: {
        description: 'Display available commands',
        execute: () => showHelp()
    },
    status: {
        description: 'Check system status',
        execute: () => showStatus()
    },
    manual: {
        description: 'Display station manual',
        execute: () => showManual()
    },
    logs: {
        description: 'Display system logs',
        execute: () => showLogs()
    },
    research: {
        description: 'Research documents database',
        execute: (args) => showResearch(args)
    },
    staff: {
        description: 'Staff directory',
        execute: () => showStaff()
    },
    incident: {
        description: 'Incident reports',
        execute: () => showIncidents()
    },
    timer: {
        description: 'Timer information',
        execute: () => showTimerInfo()
    },
    input: {
        description: 'Input the numbers',
        execute: (args) => inputNumbers(args)
    },
    clear: {
        description: 'Clear terminal',
        execute: () => clearTerminal()
    },
    about: {
        description: 'About DHARMA Initiative',
        execute: () => showAbout()
    },
    system: {
        description: 'Advanced system diagnostics',
        execute: (args) => systemDiagnostics(args)
    },
    decode: {
        description: 'Decode messages',
        execute: (args) => decodeMessage(args)
    },
    bird: {
        description: 'Easter egg - try it',
        execute: () => easterEgg('bird')
    }
};

// Hidden easter eggs and commands
const hiddenCommands = {
    'the hatch': () => easterEgg('hatch'),
    'hello world': () => easterEgg('hello'),
    'song': () => easterEgg('song'),
    'morse': () => easterEgg('morse'),
    'apply': () => easterEgg('apply'),
    'others': () => easterEgg('others'),
    'implosion': () => easterEgg('implosion')
};

// ============================================
// TIMER SYSTEM
// ============================================

function initializeTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timerValue -= 60; // Decrease by 1 minute
        
        if (timerValue < 0) {
            timerValue = 0;
            clearInterval(timerInterval);
            onTimerExpired();
            return;
        }
        
        updateTimerDisplay();
    }, TIMER_INTERVAL);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerValue / 60);
    const seconds = timerValue % 60;
    
    const displayText = `${String(minutes).padStart(3, '0')}:${String(seconds).padStart(2, '0')}`;
    timerDisplay.textContent = displayText;
    
    // Update color based on time remaining
    if (timerValue <= CRITICAL_TIME) {
        timerDisplay.classList.add('critical');
        timerDisplay.classList.remove('warning');
        timerStatus.classList.add('critical');
        timerStatus.classList.remove('warning');
        timerStatus.textContent = 'CRITICAL';
    } else if (timerValue <= WARNING_TIME) {
        timerDisplay.classList.add('warning');
        timerDisplay.classList.remove('critical');
        timerStatus.classList.add('warning');
        timerStatus.classList.remove('critical');
        timerStatus.textContent = 'WARNING';
    } else {
        timerDisplay.classList.remove('warning', 'critical');
        timerStatus.classList.remove('warning', 'critical');
        timerStatus.textContent = 'OPERATIONAL';
    }
}

function onTimerExpired() {
    addOutput('\n*** ALARM ACTIVATED ***');
    addOutput('Timer has expired. System entering failsafe mode.');
    addOutput('');
    
    // Show hieroglyphs
    hieroglyphDisplay.style.display = 'block';
    hieroglyphsShown = true;
    
    // Add warning message
    addOutput('WARNING: Hieroglyphic symbols have been activated.');
    addOutput('All systems failing. Sequence reinitiation required.');
}

// ============================================
// INPUT HANDLING
// ============================================

commandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const input = commandInput.value.trim();
        commandInput.value = '';
        
        if (input === '') return;
        
        processCommand(input);
    }
});

function processCommand(input) {
    // Display the command
    addCommandLine(input);
    
    // Check for hidden commands
    const lowerInput = input.toLowerCase();
    if (hiddenCommands[lowerInput]) {
        hiddenCommands[lowerInput]();
        return;
    }
    
    // Parse command and arguments
    const parts = input.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');
    
    // Execute command
    if (commands[cmd]) {
        commands[cmd].execute(args);
    } else {
        addOutput(`Command not found: ${cmd}`, 'error');
        addOutput('Type "help" for available commands.', 'error');
    }
}

// ============================================
// OUTPUT FUNCTIONS
// ============================================

function addCommandLine(command) {
    const div = document.createElement('div');
    div.className = 'command-line';
    div.innerHTML = `<span class="command-prompt">\>: </span><span class="command-text">${escapeHtml(command)}<\/span>`;
    terminalContent.appendChild(div);
    scrollToBottom();
}

function addOutput(text, type = 'normal') {
    const div = document.createElement('div');
    div.className = 'command-output';
    
    if (type === 'error') {
        div.innerHTML = `<span class="error-text">${escapeHtml(text)}<\/span>`;
    } else if (type === 'success') {
        div.innerHTML = `<span class="success-text">${escapeHtml(text)}<\/span>`;
    } else {
        div.innerHTML = `<span class="output-text">${escapeHtml(text)}<\/span>`;
    }
    
    terminalContent.appendChild(div);
    scrollToBottom();
}

function addMultilineOutput(lines, type = 'normal') {
    lines.forEach(line => addOutput(line, type));
}

function scrollToBottom() {
    terminalContent.scrollTop = terminalContent.scrollHeight;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// COMMAND IMPLEMENTATIONS
// ============================================

function showHelp() {
    addOutput('\n=== AVAILABLE COMMANDS ===');
    Object.keys(commands).forEach(cmd => {
        const desc = commands[cmd].description;
        addOutput(`${cmd.padEnd(15)} - ${desc}`);
    });
    addOutput('\nType a command for more information.\n');
}

function showStatus() {
    addOutput('\n=== SYSTEM STATUS ===');
    addOutput('Station: SWAN');
    addOutput('Location: ISLAND');
    addOutput('Status: OPERATIONAL');
    addOutput('Power: 100%');
    addOutput('Seals: INTACT');
    addOutput('Hatches: SEALED');
    addOutput('Last Check-in: 1977-03-14 09:30 UTC');
    addOutput('Personnel: ON SITE');
    addOutput('\nAll systems nominal.\n');
}

function showManual() {
    addOutput('\n=== SWAN STATION OPERATIONS MANUAL ===');
    addOutput('');
    addOutput('CRITICAL PROTOCOL:');
    addOutput('Every 108 minutes, the button in the computer must be pushed.');
    addOutput('');
    addOutput('FAILURE TO COMPLY:');
    addOutput('Sequence failure will result in catastrophic system collapse.');
    addOutput('The electromagnetic containment field will fail.');
    addOutput('');
    addOutput('PROCEDURE:');
    addOutput('1. Monitor countdown timer');
    addOutput('2. When timer reaches zero, input the sequence');
    addOutput('3. Press EXECUTE to reinitialize system');
    addOutput('');
    addOutput('WARNING: Do NOT attempt to leave station without proper authorization.');
    addOutput('\n');
}

function showLogs() {
    addOutput('\n=== SYSTEM LOGS ===');
    addOutput('');
    addOutput('[1977-03-14 08:00] Station initialized');
    addOutput('[1977-03-14 08:15] All systems nominal');
    addOutput('[1977-03-14 09:00] Routine maintenance complete');
    addOutput('[1977-03-14 09:30] Personnel check-in: 2 scientists on duty');
    addOutput('[1977-03-14 10:00] Sequence initiated - 108 minute countdown');
    addOutput('[1977-03-14 11:45] Power consumption: nominal');
    addOutput('[1977-03-14 12:00] Atmospheric readings: stable');
    addOutput('[1977-03-14 12:30] No anomalies detected');
    addOutput('[1977-03-14 13:00] Geological sensors: active');
    addOutput('[1977-03-14 14:00] All doors: sealed');
    addOutput('\n');
}

function showResearch(args) {
    if (!args) {
        addOutput('\n=== RESEARCH DATABASE ===');
        addOutput('Available research files:');
        addOutput('  - ELECTROMAGNETIC: Electromagnetic properties study');
        addOutput('  - ISLAND: Island geological survey');
        addOutput('  - PROTOCOL: Station protocols and procedures');
        addOutput('  - TIMETRAVEL: Temporal anomaly research');
        addOutput('');
        addOutput('Usage: research [FILENAME]\n');
        return;
    }
    
    const file = args.toUpperCase();
    
    switch(file) {
        case 'ELECTROMAGNETIC':
            addOutput('\n=== ELECTROMAGNETIC STUDY ===');
            addOutput('Subject: Electromagnetic anomaly containment');
            addOutput('Date: 1976');
            addOutput('');
            addOutput('The island possesses unique electromagnetic properties.');
            addOutput('The Swan Station has been constructed to contain and monitor');
            addOutput('these properties. The button acts as a fail-safe mechanism.');
            addOutput('\n');
            break;
        case 'ISLAND':
            addOutput('\n=== ISLAND GEOLOGICAL SURVEY ===');
            addOutput('Subject: Island geological composition');
            addOutput('Date: 1976');
            addOutput('');
            addOutput('The island is composed of unusual mineral deposits.');
            addOutput('Magnetic resonance readings are off all known scales.');
            addOutput('Recommend extreme caution with all electronic equipment.');
            addOutput('\n');
            break;
        case 'PROTOCOL':
            addOutput('\n=== STATION PROTOCOLS ===');
            addOutput('1. OBSERVATION: Monitor all systems continuously');
            addOutput('2. DOCUMENTATION: Log all anomalies');
            addOutput('3. EXECUTION: Press the button every 108 minutes');
            addOutput('4. COMMUNICATION: Maintain radio silence except emergencies');
            addOutput('5. CONTAINMENT: Never breach the perimeter');
            addOutput('\n');
            break;
        case 'TIMETRAVEL':
            addOutput('\n=== TEMPORAL ANOMALY RESEARCH ===');
            addOutput('CLASSIFIED');
            addOutput('');
            addOutput('Reports suggest temporal irregularities near the island.');
            addOutput('Recommend investigation before field expansion.');
            addOutput('Further study required. [Data partially corrupted]');
            addOutput('\n');
            break;
        default:
            addOutput(`Research file not found: ${file}`, 'error');
    }
}

function showStaff() {
    addOutput('\n=== STAFF DIRECTORY ===');
    addOutput('');
    addOutput('STATION COMMANDER:');
    addOutput('  Dr. Marvin Candle - Project Lead');
    addOutput('');
    addOutput('ACTIVE PERSONNEL:');
    addOutput('  [REDACTED] - Lead Researcher');
    addOutput('  [REDACTED] - Monitoring Specialist');
    addOutput('  [REDACTED] - Systems Engineer');
    addOutput('');
    addOutput('ROTATION SCHEDULE:');
    addOutput('  8-week assignments with 1-week overlap');
    addOutput('');
    addOutput('NOTE: All personnel identities classified.');
    addOutput('\n');
}

function showIncidents() {
    addOutput('\n=== INCIDENT REPORTS ===');
    addOutput('');
    addOutput('INCIDENT #1 - 1977-01-15');
    addOutput('Type: Power fluctuation');
    addOutput('Duration: 3 seconds');
    addOutput('Resolution: Fail-safe engaged, sequence reinitiated');
    addOutput('Status: RESOLVED');
    addOutput('');
    addOutput('INCIDENT #2 - 1977-02-22');
    addOutput('Type: Seismic activity detected');
    addOutput('Magnitude: 4.2');
    addOutput('Status: MONITORED');
    addOutput('');
    addOutput('INCIDENT #3 - 1977-03-10');
    addOutput('Type: Atmospheric anomaly');
    addOutput('Duration: 8 minutes');
    addOutput('Resolution: Ventilation systems engaged');
    addOutput('Status: RESOLVED');
    addOutput('\n');
}

function showTimerInfo() {
    addOutput('\n=== TIMER INFORMATION ===');
    addOutput('');
    addOutput('Cycle Duration: 108 minutes');
    addOutput('Current Time Remaining: ' + formatTime(timerValue));
    addOutput('');
    addOutput('CRITICAL INFORMATION:');
    addOutput('If timer reaches zero without sequence execution,');
    addOutput('the electromagnetic containment field will fail.');
    addOutput('');
    addOutput('Status:');
    if (timerValue <= CRITICAL_TIME) {
        addOutput('  [CRITICAL] Sequence required immediately!', 'error');
    } else if (timerValue <= WARNING_TIME) {
        addOutput('  [WARNING] Sequence required soon', 'error');
    } else {
        addOutput('  [OPERATIONAL] System stable', 'success');
    }
    addOutput('\n');
}

function inputNumbers(args) {
    if (!args) {
        addOutput('\n=== INPUT SEQUENCE ===');
        addOutput('Usage: input [number1] [number2] [number3] [number4] [number5] [number6]');
        addOutput('Example: input 4 8 15 16 23 42');
        addOutput('');
        addOutput('The sequence must be entered to prevent catastrophic failure.');
        addOutput('\n');
        return;
    }
    
    const input = args.split(/\s+/).map(n => parseInt(n)).filter(n => !isNaN(n));
    
    if (input.length !== 6) {
        addOutput('Invalid sequence length. Expected 6 numbers.', 'error');
        return;
    }
    
    if (JSON.stringify(input) === JSON.stringify(CORRECT_NUMBERS)) {
        addOutput('\n*** SEQUENCE ACCEPTED ***', 'success');
        addOutput('System reinitializing...', 'success');
        addOutput('');
        
        // Reset timer
        timerValue = 108 * 60;
        updateTimerDisplay();
        numbersPushed = true;
        enteredNumbers = [];
        
        addOutput('Countdown reset to: 108:00', 'success');
        addOutput('All systems operational.', 'success');
        addOutput('');
        
        // Hide hieroglyphs if shown
        if (hieroglyphDisplay.style.display === 'block') {
            hieroglyphDisplay.style.display = 'none';
        }
    } else {
        addOutput('\n*** SEQUENCE REJECTED ***', 'error');
        addOutput('Incorrect input. Try again.', 'error');
        addOutput('Remaining attempts: unlimited', 'error');
        addOutput('');
    }
}

function clearTerminal() {
    terminalContent.innerHTML = '';
    addOutput('Terminal cleared.');
    addOutput('');
}

function showAbout() {
    addOutput('\n=== DHARMA INITIATIVE ===');
    addOutput('');
    addOutput('DHARMA: Department of Heuristics And Research on Material Applications');
    addOutput('');
    addOutput('Founded: 1970');
    addOutput('Headquarters: [CLASSIFIED]');
    addOutput('Current Operations: [CLASSIFIED]');
    addOutput('');
    addOutput('The DHARMA Initiative conducts scientific research in exotic locations.');
    addOutput('All stations are self-contained and autonomous.');
    addOutput('');
    addOutput('Current Station: SWAN');
    addOutput('Purpose: Electromagnetic containment research');
    addOutput('\n');
}

function systemDiagnostics(args) {
    if (!args || args.toLowerCase() !== 'advanced') {
        addOutput('Usage: system advanced');
        return;
    }
    
    addOutput('\n=== ADVANCED SYSTEM DIAGNOSTICS ===');
    addOutput('[SCANNING...]');
    addOutput('');
    addOutput('Power Systems: ✓ OPERATIONAL');
    addOutput('Containment Field: ✓ ACTIVE');
    addOutput('Pressure Seals: ✓ INTACT');
    addOutput('Communication Array: ✓ ONLINE');
    addOutput('Backup Systems: ✓ READY');
    addOutput('Emergency Protocols: ✓ STANDBY');
    addOutput('');
    addOutput('Anomaly Detection: RUNNING');
    addOutput('  - Electromagnetic: MONITORED');
    addOutput('  - Seismic: MONITORED');
    addOutput('  - Atmospheric: MONITORED');
    addOutput('\n');
}

function decodeMessage(args) {
    if (!args) {
        addOutput('Usage: decode [message]');
        addOutput('Example: decode 75-72-71-78');
        return;
    }
    
    try {
        const parts = args.split('-');
        let result = '';
        
        parts.forEach(part => {
            const num = parseInt(part);
            if (!isNaN(num)) {
                result += String.fromCharCode(num);
            }
        });
        
        addOutput('\n=== DECODED MESSAGE ===');
        addOutput(result);
        addOutput('\n');
    } catch (e) {
        addOutput('Error decoding message.', 'error');
    }
}

// ============================================
// EASTER EGGS
// ============================================

function easterEgg(type) {
    switch(type) {
        case 'bird':
            addOutput('');
            addOutput('   ^__^');
            addOutput('   (oo)\\_______');
            addOutput('   (__)\\ )  )\\/\\\\');
            addOutput('       ||----w |');
            addOutput('       ||     ||');
            addOutput('');
            break;
        
        case 'hatch':
            addOutput('\n*** HATCH DETECTED ***');
            addOutput('You are inside the hatch.');
            addOutput('The blast doors are sealed.');
            addOutput('Outside: [UNKNOWN]');
            addOutput('\nHope someone finds this.');
            addOutput('');
            break;
        
        case 'hello':
            addOutput('\n01001000 01100101 01101100 01101100 01101111');
            addOutput('(Hello in binary)');
            addOutput('');
            break;
        
        case 'song':
            addOutput('\n[Loading audio file...]');
            addOutput('♪ ♪ ♫ ♪');
            addOutput('[Disk error: File corrupted]');
            addOutput('');
            break;
        
        case 'morse':
            addOutput('\n... --- ...');
            addOutput('(SOS in Morse Code)');
            addOutput('');
            break;
        
        case 'apply':
            addOutput('\nThank you for your interest in the DHARMA Initiative.');
            addOutput('Please send your resume to: careers@dharma.org');
            addOutput('[This email address does not exist]');
            addOutput('');
            break;
        
        case 'others':
            addOutput('\n...');
            addOutput('Are we the only ones here?');
            addOutput('...');
            addOutput('');
            break;
        
        case 'implosion':
            addOutput('\n*** CRITICAL SYSTEM FAILURE ***');
            addOutput('Electromagnetic containment field: FAILING');
            addOutput('Executing failsafe protocols...');
            addOutput('');
            break;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(3, '0')}:${String(secs).padStart(2, '0')}`;
}

// ============================================
// INITIALIZATION
// ============================================

window.addEventListener('load', () => {
    commandInput.focus();
    initializeTimer();
});