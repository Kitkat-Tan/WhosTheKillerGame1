// Game configurations containing completely isolated rounds (Different environments, targets, and culprits)
const roundsData = {
    1: {
        location: "The Cybersecurity Complex Labs",
        victim: "Professor Arisugawa (Discovered slumped over the console grid)",
        suspects: ["Kazuto (Network Core Intern)", "Asuka (System Config Supervisor)", "Ren (Firewall Vendor Admin)"],
        killer: "Asuka",
        q: "A malicious packet trail left a binary footprint: '01000011'. Which ASCII character matches this value?",
        options: ["A", "B", "C", "D"],
        correct: "C",
        conanCorrect: "Ah-le-le? Look at the conversion code! 01000011 is exactly 67, which represents 'C'! (Heh, Asuka's terminal console config was explicitly logged on that byte stream...)",
        conanWrong: "Eh? Big brother, look closely at the bit sequence! '01000011' translates to decimal 67. That's ASCII character 'C'!"
    },
    2: {
        location: "The Automated Mainframe Crypt",
        victim: "Dean Tanaka (Found pinned behind server rack unit 4B)",
        suspects: ["Emi (Database Engineer)", "Daiki (SysOps Architect)", "Hiroshi (Junior Script Dev)"],
        killer: "Hiroshi",
        q: "The intruder bypassed network boundaries. If a subnetwork is scaled at a /26 mask, how many actual usable host addresses remain?",
        options: ["32", "64", "62", "126"],
        correct: "62",
        conanCorrect: "Wow! You computed it fast! 2^(32-26) - 2 equals 62 usable addresses! (Wait... Hiroshi's routing script assignment explicitly requested a 62-host test block!)",
        conanWrong: "Oh... Uncle Mouri always forgets to subtract the network address and broadcast channels! 2^6 - 2 leaves exactly 62 usable routes."
    },
    3: {
        location: "The Central Database Cloud Array",
        victim: "Dr. Kenji (Found dead near the power generator rooms)",
        suspects: ["Yuka (Frontend UI Designer)", "Sora (SQL DB Specialist)", "Taiga (DevOps Automation Manager)"],
        killer: "Yuka",
        q: "The server recorded a breach string: 'SELECT * FROM users WHERE id = ' + user_input. What type of vulnerability is this?",
        options: ["Cross-Site Scripting (XSS)", "SQL Injection (SQLi)", "Buffer Overflow", "Zero-Day Kernel Bug"],
        correct: "SQL Injection (SQLi)",
        conanCorrect: "Bingo! That's a classic SQL Injection syntax string. (But hold on... Sora is a master of SQL, he would never make a messy string concatenation error like this. This looks like an imitation error by Yuka!)",
        conanWrong: "Geez... look at the database query formatting. It directly concatenates input parameters into an execution query! That's a textbook SQL Injection hole!"
    },
    4: {
        location: "The High-Security Kernel Lab",
        victim: "Chief Engineer Sato (Found inside the climate chambers)",
        suspects: ["Misaki (Crypto-Analyst)", "Kaito (Hardware Support)", "Rin (Cloud Security Principal)"],
        killer: "Misaki",
        q: "The system logs show a shared secret key was stolen. Which of the following cryptography designs is fully Symmetric?",
        options: ["RSA", "ECC", "AES", "Diffie-Hellman"],
        correct: "AES",
        conanCorrect: "Hooray, correct! AES uses standard shared-key symmetric models. (Interesting... Misaki wrote her entire graduate thesis covering symmetric cipher optimization...)",
        conanWrong: "Ah-le-le? RSA and ECC use mathematical public-private asymmetry keys. Only AES relies completely on a single shared symmetric key block."
    },
    5: {
        location: "The Forbidden Root Quantum Mainframe Room",
        victim: "The Chancellor of Science (Found dead in front of the master core console)",
        suspects: ["Goro (System Kernel Architect)", "Naomi (AI Infrastructure Director)"],
        killer: "Goro",
        q: "CRITICAL REBOOT: An unchangeable terminal file lock was compiled via command 'chmod 751 log.dat'. Under standard UNIX permissions, who maintains absolute 'Write/Modify' rights over this asset?",
        options: ["Only the File Owner", "The Assigned Work Group", "All Users Globally", "Absolutely Nobody"],
        correct: "Only the File Owner",
        conanCorrect: "(Incredible! Octal conversion: 7 means read-write-execute for Owner, 5 means read-execute for Group, 1 means execute-only for Others. Only the owner can overwrite it... and Goro was the registered creator of the log file setup! This is checkmate!)",
        conanWrong: "Look at the numbers, uncle! 7-5-1. The first octal index represents the file's creator/owner. 7 provides write rights; group and others can't change it."
    }
};

// Global Trackers
let currentRound = 1;
let totalCasualties = 1;
let currentKiller = "";
let currentSuspects = [];
let unlockedHints = [];

function startGame() {
    document.getElementById("opening-screen").classList.remove("active");
    document.getElementById("game-screen").classList.add("active");
    loadRoundSetup();
}

function loadRoundSetup() {
    let roundInfo = roundsData[currentRound];
    currentKiller = roundInfo.killer;
    currentSuspects = [...roundInfo.suspects];

    // Reset layout UI stats
    document.getElementById("round-txt").innerText = `${currentRound}/5`;
    document.getElementById("suspect-count").innerText = currentSuspects.length;
    document.getElementById("victim-count").innerText = totalCasualties;

    // Build the dynamic Crime Scene logs
    let sceneHTML = `<h3>🚨 INVESTIGATION LAYER: ${roundInfo.location}</h3><br>`;
    sceneHTML += `<p class="blood-splatter">☠️ DECEASED: ${roundInfo.victim}</p>`;
    sceneHTML += `<p>The area is dark. Splattered blood paths streak across the glowing server interfaces. You must decipher the digital panel logic before the killer strikes again.</p>`;
    document.getElementById("crime-scene").innerHTML = sceneHTML;

    // Reset and compile hints log
    unlockedHints = [`• Potential Suspects: ${currentSuspects.join(", ")}`];
    refreshHintsBox();

    // Render logic problems
    document.getElementById("logic-question").innerText = `[ENCRYPTION NODE ${currentRound}]: ${roundInfo.q}`;

    let optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    roundInfo.options.forEach(opt => {
        let btn = document.createElement("button");
        btn.innerText = opt;
        btn.onclick = () => verifyAnswer(opt);
        optionsContainer.appendChild(btn);
    });

    updateAccusationBox();
}

function refreshHintsBox() {
    document.getElementById("case-hints").innerHTML = unlockedHints.map(h => `<div>${h}</div>`).join("<br>");
}

function verifyAnswer(selectedOption) {
    let roundInfo = roundsData[currentRound];
    let dialBox = document.getElementById("dialogue-history");

    if (selectedOption === roundInfo.correct) {
        dialBox.innerHTML += `<p><span class="char-conan">Conan:</span> "${roundInfo.conanCorrect}"</p>`;
        unlockedHints.push(`• [SYSTEM CRACKED]: Clue pointing directly at the signature behaviors of <strong>${roundInfo.killer}</strong>.`);
        refreshHintsBox();

        if (currentRound < 5) {
            currentRound++;
            setTimeout(() => {
                alert("🔒 TERMINAL DECRYPTED! Advancing to the next crime zone...");
                loadRoundSetup();
            }, 1500);
        } else {
            dialBox.innerHTML += `<p><span class="char-conan">Conan:</span> "(Everything is solved! Hey Uncle Kogoro, stop sleeping and look closely at the compiled profile hints!)"</p>`;
        }
    } else {
        dialBox.innerHTML += `<p><span class="char-conan">Conan:</span> "${roundInfo.conanWrong}"</p>`;
        triggerMurderSequences("A logic error triggered the defense security system! The killer sneaked through the ventilation grids!");
    }
    dialBox.scrollTop = dialBox.scrollHeight;
}

function triggerMurderSequences(reasonMessage) {
    // TRIGGER VISUAL BLOOD SPLATTER ON SCREEN
    let bloodFx = document.getElementById("blood-screen-effect");
    bloodFx.classList.add("splatter-active");
    setTimeout(() => bloodFx.classList.remove("splatter-active"), 1500);

    let overlay = document.getElementById("overlay-screen");
    let overlayText = document.getElementById("overlay-text");

    overlay.style.display = "flex";
    overlayText.innerHTML = `NIGHTTIME FALLS...<br><span style='font-size:1.1rem; color:#ff5577;'>${reasonMessage}</span>`;

    setTimeout(() => {
        // Filter out the actual killer from getting eliminated
        let innocentSuspects = currentSuspects.filter(sus => sus !== currentKiller);

        if (innocentSuspects.length > 0) {
            let murderedPerson = innocentSuspects[Math.floor(Math.random() * innocentSuspects.length)];

            // Remove target from alive list
            currentSuspects = currentSuspects.filter(sus => sus !== murderedPerson);
            totalCasualties++;

            overlayText.innerHTML = `<span class="text-red" style="font-size:2.5rem;">💥 FRESH BLOODSTAIN FOUND!</span><br><br>Morning arrived... ${murderedPerson} was discovered brutally taken down at the terminal grid base!`;

            // Update counts immediately
            document.getElementById("suspect-count").innerText = currentSuspects.length;
            document.getElementById("victim-count").innerText = totalCasualties;

            // Re-update dropdown
            updateAccusationBox();
            unlockedHints.push(`• [AUTOPSY EVIDENCE]: ${murderedPerson} was innocent. Crimson blood prints left behind rule them out.`);
            refreshHintsBox();
        } else {
            overlayText.innerHTML = `<span class="text-blood">MASSACRE COMPLETE</span><br><br>The killer cleared out the whole campus floor. Game Over...`;
            setTimeout(() => location.reload(), 3000);
            return;
        }

        setTimeout(() => {
            overlay.style.display = "none";
        }, 3000);

    }, 2000);
}

function updateAccusationBox() {
    let selectBox = document.getElementById("suspect-select-box");
    selectBox.innerHTML = "";
    currentSuspects.forEach(sus => {
        let opt = document.createElement("option");
        opt.value = sus;
        opt.innerText = sus;
        selectBox.appendChild(opt);
    });
}

function makeAccusation() {
    let target = document.getElementById("suspect-select-box").value;
    let dialBox = document.getElementById("dialogue-history");

    if (!target) return;

    dialBox.innerHTML += `<p><span class="char-kogoro">Kogoro Mouri:</span> "Hah! The puzzle is fully unlocked! I point my finger of justice directly at you, <strong>${target}</strong>! Yield yourself!"</p>`;

    if (target === currentKiller) {
        alert(`🎉 CASE CLOSED SUCCESSFULLY!\n\nKogoro Mouri strikes again! (With Conan's dart support). You successfully arrested ${currentKiller} and prevented further cyber slaughter!`);
        location.reload();
    } else {
        dialBox.innerHTML += `<p><span class="char-conan">Conan:</span> "(Sigh... Here we go again. Uncle Mouri accused an innocent bystander without scanning the network log profiles!)"</p>`;
        setTimeout(() => {
            triggerMurderSequences(`Kogoro pinned the wrong target! The real killer mocked the investigation and struck again under the dark cover of night!`);
        }, 1200);
    }
    dialBox.scrollTop = dialBox.scrollHeight;
}