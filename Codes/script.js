let selectedCaseIndex = 0;
let runningStrikes = 0;
let activeDayNumber = 1;
let currentQuestionIndex = 0;
let deadSuspectsList = [];

const incidentRepo = [
    {
        title: "Case 1: The Server Room Outage Trace",
        narrative: "A sudden high-voltage line drop occurred somewhere within the secure facility core, plunging localized storage nodes into darkness. Conan has isolated the interface gateway, but the structural scene data is completely hidden behind encrypted network partitions.",
        kId: 1, // Developer David
        suspects: [
            { name: "Manager Mark", assignment: "Scheduling Office", alibi: "I don't deal with physical hardware. I was editing standard budget templates at my cubicle." },
            { name: "Developer David", assignment: "Backend Systems", alibi: "I was structural testing database entities at my local terminal box all afternoon." },
            { name: "Designer Dale", assignment: "Graphics & UI", alibi: "I don't write compiled codes, I configure layout UI mockups. I left the floor before 3:00 PM." },
            { name: "Analyst Alice", assignment: "Business Ops", alibi: "I only hold cloud metric read access parameters. I don't handle hardware clusters." },
            { name: "Engineer Ethan", assignment: "Hardware Main", alibi: "I wasn't assigned to this building zone today. Check my physical logs." },
            { name: "Clerk Clara", assignment: "Data Entry Desk", alibi: "I don't have authorization cards to bypass the localized floor gateway." }
        ],
        puzzles: [
            {
                text: "QUESTION 1 (BINARY TRACE): If an 8-bit binary pattern block translates directly to a base-10 integer value of 68, what must that raw 8-bit binary sequence be?",
                choices: ["00100010", "01000100", "01001000", "00010100"],
                ansCheck: "01000100",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Scene Narrative Uncovered]</span> At 3:15 PM, the main power rails of Server Bay 4 were sliced cleanly. Right beside the server chassis, an 8-bit binary pattern was found carved onto a spare backing panel: <strong>01000100</strong>."
            },
            {
                text: "QUESTION 2 (OOP ALLOCATION): A tracking script invokes the 'new' keyword twice to initialize two independent object items with identical string fields. Do these separate variables share the exact same location reference on the system Heap?",
                choices: ["YES", "NO"],
                ansCheck: "NO",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Weapon Trace]</span> A pair of heavy insulated physical fiber-line cutters was found hidden inside a trash bin near the server racks. Maintenance ledger logs show this specific tool belongs strictly to the Backend Development toolkit storage cabinet."
            },
            {
                text: "QUESTION 3 (C# PRINCIPLES): Which of the 'Four Pillars' of Object-Oriented Programming handles hiding inner data fields from direct external manipulation, forcing interaction through safe public options?",
                choices: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
                ansCheck: "Encapsulation",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Conan's Synthesis]</span> Forensic system checkpoints confirmed that a user profile matching the character initial 'D' (ASCII 68) completed a structural diagnostic injection script at exactly 3:10 PM from an active development station."
            }
        ]
    },
    {
        title: "Case 2: The Trunk Switch Breakdown",
        narrative: "Just before midnight, the primary localized backbone network switch dropped offline. A scratchpad scrap sitting on the technician console holds a scribbled sequence: <strong>01010000</strong>.",
        kId: 1, // Programmer Pete
        suspects: [
            { name: "Supervisor Samuel", assignment: "Operations Management", alibi: "I balance performance rosters from the administration front room. I don't configure hardware routing devices." },
            { name: "Programmer Pete", assignment: "C# Core Dev", alibi: "My method templates maintain clear boundaries! I use standard public options and I didn't touch the switch arrays." },
            { name: "Technician Todd", assignment: "Infrastructure Maintenance", alibi: "I was verifying external cooling valve mechanics out on the building roof loop when the drop occurred." },
            { name: "Auditor Audrey", assignment: "Compliance Check", alibi: "I don't hold console execution profile keys. I simply evaluate finalized compliance sheets." },
            { name: "Specialist Scott", assignment: "Routing Deployments", alibi: "I was entirely off-shift. Check the central transit records for my authorization card." },
            { name: "Secretary Susan", assignment: "Front Desk Registry", alibi: "I am completely unfamiliar with system execution paths or scripting protocols." }
        ],
        puzzles: [
            {
                text: "QUESTION 1 (BINARY DECRYPTION): Decrypt the diagnostic payload byte (01010000) into its base-10 decimal format. What integer is this?",
                choices: ["64", "80", "82", "96"],
                ansCheck: "80",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Item Discovered]</span> An embedded logic emulation microchip loaded with custom low-level override configurations was found left inside the switch portal container. The serial code traces to an order placed by the core application scripting team."
            },
            {
                text: "QUESTION 2 (REFERENCE COPY): If 'objectA' is instantiated as a reference type, and we declare 'objectB = objectA', will changing a field value via 'objectB' automatically modify that field value when read from 'objectA'?",
                choices: ["YES", "NO"],
                ansCheck: "YES",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Operational Tracking]</span> Gateway tracking monitors noted that an authorized core programming terminal was left signed in on the local node network until exactly 11:58 PM."
            },
            {
                choices: ["3", "4", "5", "6"],
                ansCheck: "4",
                clueGranted: "📂 CASE LOG SECURE UNLOCKED: <span class='evidence'>[Conan's Synthesis]</span> The decimal signature 80 represents the ASCII character identifier 'P'. Isolating the profile with this matching signature reveals the exact origin point of the exploit."
            }
        ]
    }
];

function startInvestigation() {
    document.getElementById('screen-intro').classList.remove('active');
    document.getElementById('screen-main').classList.add('active');
    selectedCaseIndex = 0;
    runningStrikes = 0;
    loadIncidentFile(selectedCaseIndex);
}

function loadIncidentFile(idx) {
    const data = incidentRepo[idx];
    if (!data) {
        renderFinalGameResolution();
        return;
    }

    currentQuestionIndex = 0;
    deadSuspectsList = [];
    activeDayNumber = 1;

    document.getElementById('case-number').textContent = `Incident File ${idx + 1} / ${incidentRepo.length}`;
    document.getElementById('strike-counter').textContent = 3 - runningStrikes;
    document.getElementById('day-counter').textContent = `Day ${activeDayNumber}`;
    document.getElementById('story-narrative').innerHTML = data.narrative;

    renderSuspectInterface();
    renderQuestionWorkspace();

    document.getElementById('terminal-stream').innerHTML = `
                <div class="log-box">
                    <div class="kogoro">System Terminal Log:</div>
                    "System initialized. Solve terminal questions to retrieve specific case data logs, or make an immediate arrest via the indictment terminal."
                </div>
            `;
}

function renderSuspectInterface() {
    const data = incidentRepo[selectedCaseIndex];

    const rosterContainer = document.getElementById('roster-summary');
    rosterContainer.innerHTML = '';
    data.suspects.forEach(s => {
        let node = document.createElement('div');
        const isDead = deadSuspectsList.includes(s.name);
        node.className = `profile-node ${isDead ? 'dead-node' : ''}`;
        node.innerHTML = `<strong>👤 ${s.name}</strong><br><span style="color:#8b949e; font-size:0.7rem;">${s.assignment}</span> ${isDead ? '<br><b style="color:#ff7b72;">❌ OFFLINE</b>' : ''}`;
        rosterContainer.appendChild(node);
    });

    const interrogateContainer = document.getElementById('interrogate-buttons-container');
    interrogateContainer.innerHTML = '';
    data.suspects.forEach(s => {
        let b = document.createElement('button');
        b.className = "action-list-btn";
        const isDead = deadSuspectsList.includes(s.name);
        b.textContent = isDead ? `❌ [Offline] ${s.name}` : `🗣️ Read Alibi: ${s.name}`;
        b.disabled = isDead;
        b.onclick = () => talkToSuspectNPC(s.name, s.alibi);
        interrogateContainer.appendChild(b);
    });

    const pointingContainer = document.getElementById('pointing-buttons-area');
    pointingContainer.innerHTML = '';
    data.suspects.forEach((s, sIdx) => {
        let ab = document.createElement('button');
        ab.className = "btn btn-danger";
        ab.style.fontSize = "0.75rem";
        ab.style.padding = "8px";
        const isDead = deadSuspectsList.includes(s.name);
        ab.textContent = `Accuse ${s.name}`;
        ab.disabled = isDead;
        ab.onclick = () => freeAccuseSuspect(s.name, sIdx);
        pointingContainer.appendChild(ab);
    });
}

function talkToSuspectNPC(name, alibi) {
    const stream = document.getElementById('terminal-stream');
    stream.innerHTML += `
                <div class="log-box" style="border-left: 3px solid #ff7b72;">
                    * <span class="suspect-name">${name}:</span> "${alibi}"
                </div>
            `;
    stream.scrollTop = stream.scrollHeight;
}

function renderQuestionWorkspace() {
    const data = incidentRepo[selectedCaseIndex];

    document.getElementById('hints-counter').textContent = currentQuestionIndex;

    if (currentQuestionIndex >= 3) {
        document.getElementById('step-id').textContent = "✅ TRACK BLOCK SOLVED";
        document.getElementById('step-id').style.color = "#56d364";
        document.getElementById('step-question').textContent = "All logic layers verified. Review the unlocked database segments in the terminal above to lock down your target indictment.";
        document.getElementById('clue-canvas').innerHTML = '';
        document.getElementById('interactive-input-area').innerHTML = '';
        return;
    }

    const currentQ = data.puzzles[currentQuestionIndex];
    document.getElementById('step-id').textContent = `💡 DATA GATEWAY QUESTION: ${currentQuestionIndex + 1} / 3`;
    document.getElementById('step-id').style.color = "#58a6ff";
    document.getElementById('step-question').textContent = currentQ.text;
    document.getElementById('clue-canvas').innerHTML = '';

    let inputContainer = document.getElementById('interactive-input-area');
    inputContainer.innerHTML = '';

    let wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.gap = "10px";
    wrapper.style.marginTop = "10px";

    currentQ.choices.forEach(choice => {
        let choiceBtn = document.createElement('button');
        choiceBtn.className = "btn btn-choice";
        choiceBtn.textContent = choice;
        choiceBtn.onclick = () => evaluatePuzzleInput(choice);
        wrapper.appendChild(choiceBtn);
    });

    inputContainer.appendChild(wrapper);
}

function evaluatePuzzleInput(userInput) {
    const data = incidentRepo[selectedCaseIndex];
    const currentQ = data.puzzles[currentQuestionIndex];

    if (String(userInput).trim().toUpperCase() === String(currentQ.ansCheck).trim().toUpperCase()) {
        const stream = document.getElementById('terminal-stream');
        stream.innerHTML += `
                    <div class="log-box" style="border-left: 3px solid #56d364; background: #0c1c12;">
                        ${currentQ.clueGranted}
                    </div>
                `;
        currentQuestionIndex++;
        renderQuestionWorkspace();
        stream.scrollTop = stream.scrollHeight;
    } else {
        triggerOvernightMurder(`Logic Exception: Analytical track dropped at Question ${currentQuestionIndex + 1}.`);
    }
}

function freeAccuseSuspect(targetName, targetIdx) {
    const data = incidentRepo[selectedCaseIndex];
    const stream = document.getElementById('terminal-stream');

    stream.innerHTML += `
                <div class="log-box">
                    * Authorization Request: Evaluating warrant configurations for ${targetName}...
                </div>
            `;

    if (targetIdx === data.kId) {
        executeCaseSuccessResolution(targetName);
    } else {
        stream.innerHTML += `
                    <div class="log-box" style="border-left: 3px solid #ff7b72;">
                        * Alert Mismatch: Warrant dropped. Internal profiles isolate ${targetName} outside the trace footprint.
                    </div>
                `;
        triggerOvernightMurder(`Incorrect Identification: Security tokens clear ${targetName} of structural access anomalies.`);
    }
}

function triggerOvernightMurder(contextReason) {
    runningStrikes++;
    activeDayNumber++;
    const data = incidentRepo[selectedCaseIndex];

    const livingInnocents = data.suspects.filter((s, idx) => idx !== data.kId && !deadSuspectsList.includes(s.name));
    let victimName = "An auxiliary storage array node";

    if (livingInnocents.length > 0) {
        const targetVictim = livingInnocents[Math.floor(Math.random() * livingInnocents.length)];
        victimName = targetVictim.name;
        deadSuspectsList.push(victimName);
    }

    const overlay = document.getElementById('blood-overlay');
    const details = document.getElementById('blood-details');

    details.innerHTML = `
                * <strong>Exception Context:</strong> ${contextReason}<br><br>
                <span style="font-size: 1.4rem; color: #ff5555; font-weight: bold;">🚨 OVERNIGHT SYSTEM UPDATE 🚨</span><br>
                * <strong>${victimName.toUpperCase()} HAS BEEN DROPPED FROM THE WORKSPACE MATRIX.</strong><br><br>
                <em>Strikes remaining: ${3 - runningStrikes} / 3<br>
                Timeline status: Day ${activeDayNumber} of 3</em>
            `;

    overlay.style.display = 'flex';
}

function dismissBloodSplash() {
    document.getElementById('blood-overlay').style.display = 'none';
    document.getElementById('strike-counter').textContent = 3 - runningStrikes;

    if (activeDayNumber > 3 || runningStrikes >= 3) {
        renderTotalDefeatScreen();
        return;
    }

    document.getElementById('day-counter').textContent = `Day ${activeDayNumber}`;
    renderSuspectInterface();
    renderQuestionWorkspace();

    const stream = document.getElementById('terminal-stream');
    stream.innerHTML += `
                <div class="log-box" style="background: #221212; border-left: 3px solid #ff7b72;">
                    * System Notice: Timeline shifted to Day ${activeDayNumber}. Main components remain vulnerable.
                </div>
            `;
    stream.scrollTop = stream.scrollHeight;
}

function executeCaseSuccessResolution(killerName) {
    document.getElementById('screen-main').classList.remove('active');
    document.getElementById('screen-end').classList.add('active');

    const graphicContainer = document.getElementById('end-graphic-container');
    graphicContainer.innerHTML = `<div class="case-closed-stamp">CASE CLOSED</div>`;

    document.getElementById('end-header').textContent = "TARGET CONTAINED";
    document.getElementById('end-header').style.color = "#56d364";
    document.getElementById('end-text').innerHTML = `
                * Verification complete. <strong>${killerName}</strong> was accurately isolated from the network exploit segment and taken into federal containment blocks.
            `;
    document.getElementById('end-action-trigger').textContent = "Load Next Memory Block";
    document.getElementById('end-action-trigger').onclick = () => advanceNextCase();
}

function advanceNextCase() {
    selectedCaseIndex++;
    document.getElementById('screen-end').classList.remove('active');

    if (selectedCaseIndex < incidentRepo.length) {
        document.getElementById('screen-main').classList.add('active');
        loadIncidentFile(selectedCaseIndex);
    } else {
        renderFinalGameResolution();
    }
}

function renderTotalDefeatScreen() {
    document.getElementById('screen-main').classList.remove('active');
    document.getElementById('screen-end').classList.add('active');

    const graphicContainer = document.getElementById('end-graphic-container');
    graphicContainer.innerHTML = `<div class="case-closed-stamp" style="border-color:#ff7b72; color:#ff7b72;">MATRIX FAILURE</div>`;

    document.getElementById('end-header').textContent = "SESSION TERMINATED";
    document.getElementById('end-header').style.color = "#ff7b72";

    let boundaryReason = "* System integrity limits exceeded or operational time threshold crossed.";
    if (activeDayNumber > 3) {
        boundaryReason = "* The 3-day time window expired before key tracing arrays resolved the exploit.";
    } else if (runningStrikes >= 3) {
        boundaryReason = "* Integrity drops reached 3 units. Access tokens cleared due to instability.";
    }

    document.getElementById('end-text').textContent = boundaryReason;
    document.getElementById('end-action-trigger').textContent = "Reinitialize Matrix";
    document.getElementById('end-action-trigger').onclick = () => {
        location.reload();
    };
}

function renderFinalGameResolution() {
    document.getElementById('screen-main').classList.remove('active');
    document.getElementById('screen-end').classList.add('active');

    const graphicContainer = document.getElementById('end-graphic-container');
    graphicContainer.innerHTML = `<div class="case-closed-stamp" style="border-color:#bc8cff; color:#bc8cff;">VICTORY</div>`;

    document.getElementById('end-header').textContent = "WORKSPACE SECURED";
    document.getElementById('end-header').style.color = "#bc8cff";
    document.getElementById('end-text').innerHTML = `
                * All malicious matrices have been purged successfully. Conan and Kogoro have neutralised the active internal cyber threats. Extraordinary logical execution, Agent.
            `;
    document.getElementById('end-action-trigger').textContent = "Restart Simulation";
    document.getElementById('end-action-trigger').onclick = () => {
        location.reload();
    };
}

    < !--3. NIGHT / TRANSITION SCREEN-- >
        <div id="overlay-screen">
            <div class="night-text" id="overlay-text">THE NIGHT PASSES...</div>
            <div class="dripping-blood-ui"></div>
        </div>

        