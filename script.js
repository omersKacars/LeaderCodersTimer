// --- YouTube Oynatıcı Değişkeni ---
let ytPlayer;

// --- YouTube API'ı Hazır Olduğunda Çalışacak Ana Fonksiyon ---
// Bu fonksiyon global scope'ta olmalıdır, tarayıcı tarafından çağrılır.
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '315',
        width: '560',
        videoId: 'y6TZHLAzg5o', // Lofi Girl video ID'si
        playerVars: {
            'playsinline': 1,
            'autoplay': 0, // Otomatik başlamasın
            'controls': 0, // YouTube kontrollerini gizle
            'disablekb': 1, // Klavye kontrolünü devre dışı bırak
            'origin': window.location.origin // Güvenlik için
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    // Oynatıcı hazır olduğunda, başlangıç ses seviyesini ayarla
    const initialVolume = document.getElementById('music-volume-slider').value;
    event.target.setVolume(initialVolume * 100);
}

document.addEventListener('DOMContentLoaded', () => {
    // --- SABİTLER ---
    const MS_IN_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;
    const COUNTDOWN_TICK_START_S = 10;
    
    // --- DOM ELEMENTLERİ ---
    const mainContent = document.getElementById('main-content');
    const logo = document.getElementById('logo');
    const fullscreenLogo = document.getElementById('fullscreen-logo');
    const tickAudio = document.getElementById('tick-audio');
    const quoteDisplay = document.getElementById('quote-display');
    const topBarPresetsContainer = document.getElementById('top-bar-presets');
    const startBreakBtn = document.getElementById('start-break-btn');
    const startExerciseBtn = document.getElementById('start-exercise-btn');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const fullscreenIcon = document.getElementById('fullscreen-icon');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings-btn');
    const modeTimerBtn = document.getElementById('mode-timer');
    const modeStopwatchBtn = document.getElementById('mode-stopwatch');
    const timeDisplay = document.getElementById('time-display');
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const presetButtonsContainer = document.getElementById('preset-buttons');
    const progressCircle = document.querySelector('.progress-ring__circle');
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const swStartStopBtn = document.getElementById('sw-start-stop-btn');
    const swLapResetBtn = document.getElementById('sw-lap-reset-btn');
    const lapsList = document.getElementById('laps-list');
    const alarmScreen = document.getElementById('alarm-screen');
    const alarmTitle = document.getElementById('alarm-title');
    const alarmMessage = document.getElementById('alarm-message');
    const stopAlarmBtn = document.getElementById('stop-alarm-btn');
    const alarmAudio = document.getElementById('alarm-audio');
    const previewAudio = document.getElementById('preview-audio');
    const themeSelect = document.getElementById('theme-select');
    const alarmSoundSelect = document.getElementById('alarm-sound');
    const previewSoundBtn = document.getElementById('preview-sound-btn');
    const endMessageInput = document.getElementById('end-message');
    const countdownTickToggle = document.getElementById('countdown-tick-toggle');
    const showQuotesToggle = document.getElementById('show-quotes-toggle');
    const smartRandomToggle = document.getElementById('smart-random-toggle');
    const quoteDurationInput = document.getElementById('quote-duration-input');
    const quoteFrequencyInput = document.getElementById('quote-frequency-input');
    const importSettingsBtn = document.getElementById('import-settings-btn');
    const exportSettingsBtn = document.getElementById('export-settings-btn');
    const presetLabelInput = document.getElementById('preset-label');
    const presetMinutesInput = document.getElementById('preset-minutes');
    const addPresetBtn = document.getElementById('add-preset-btn');
    const presetList = document.getElementById('preset-list');
    const quoteInput = document.getElementById('quote-input');
    const addQuoteBtn = document.getElementById('add-quote-btn');
    const quoteList = document.getElementById('quote-list');
    const sessionModal = document.getElementById('session-modal');
    const sessionModalTitle = document.getElementById('session-modal-title');
    const sessionModalDescription = document.getElementById('session-modal-description');
    const sessionMinutesInput = document.getElementById('session-minutes-input');
    const startSessionTimerBtn = document.getElementById('start-session-timer-btn');
    const cancelSessionModalBtn = document.getElementById('cancel-session-modal-btn');
    const musicPlayPauseBtn = document.getElementById('music-play-pause-btn');
    const musicPlayIcon = document.getElementById('music-play-icon');
    const musicVolumeSlider = document.getElementById('music-volume-slider');

    // --- UYGULAMA DURUMU (STATE) ---
    let appState = {
        currentMode: 'timer',
        timer: { countdown: null, totalSeconds: 0, initialTime: 0, state: 'idle', quoteInterval: null, activePresetIndex: -1 },
        stopwatch: { requestID: null, startTime: 0, elapsedTime: 0, laps: [], state: 'idle' },
        quotes: { shuffledQuotes: [], currentIndex: 0 },
        music: { isPlaying: false, volume: 0.5 },
        settings: {
            theme: 'dark', alarmSound: 'profesyonel-zil.mp3', endMessage: 'Süre doldu!', countdownTick: true,
            presets: [
                { label: '5 dk Hızlı Mola', minutes: 5 }, { label: '25 dk Pomodoro', minutes: 25 }, { label: '45 dk Ders', minutes: 45 }
            ],
            quotes: ["Bir bug'ı düzeltmek için kodun bir satırını değiştirirsin ve 42 yeni bug belirir.", "Uyku, RAM'in insan versiyonudur.", "Kod asla yalan söylemez, yorumlar bazen söyler.", "Programcı: Problemleri anlamadığınız şekillerde çözen kişidir.", "It's not a bug, it's a feature.", "Her zaman kodunuzu, onu sizden sonra devralacak kişinin baltalı bir katil olduğunu bilerek yazın."],
            quoteSettings: {
                show: true,
                smartRandom: true,
                duration: 5,
                frequency: 15
            }
        }
    };

    // --- INIT & AYARLAR ---
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

    const saveSettings = () => localStorage.setItem('leaderCodersTimerSettings', JSON.stringify(appState.settings));
    const loadSettings = () => {
        const saved = localStorage.getItem('leaderCodersTimerSettings');
        if (saved) {
            const parsedSettings = JSON.parse(saved);
            appState.settings = { ...appState.settings, ...parsedSettings };
            appState.settings.quoteSettings = { ...appState.settings.quoteSettings, ...parsedSettings.quoteSettings };
        }
        applySettings();
    };

    function applySettings() {
        const isDark = appState.settings.theme === 'dark';
        document.body.setAttribute('data-theme', appState.settings.theme);
        const logoSrc = isDark ? 'sirket-logo-light.png' : 'sirket-logo-dark.png';
        logo.src = logoSrc;
        fullscreenLogo.src = logoSrc;
        themeSelect.value = appState.settings.theme;
        alarmSoundSelect.value = appState.settings.alarmSound;
        endMessageInput.value = appState.settings.endMessage;
        countdownTickToggle.checked = appState.settings.countdownTick;
        showQuotesToggle.checked = appState.settings.quoteSettings.show;
        smartRandomToggle.checked = appState.settings.quoteSettings.smartRandom;
        quoteDurationInput.value = appState.settings.quoteSettings.duration;
        quoteFrequencyInput.value = appState.settings.quoteSettings.frequency;
        renderPresets();
        renderPresetList();
        renderTopBarPresets();
        renderQuoteList();
    }

    // --- YouTube MÜZİK ÇALAR KONTROL FONKSİYONLARI ---
    function togglePlayMusic() {
        if (!ytPlayer || typeof ytPlayer.getPlayerState !== 'function') {
            console.error("YouTube oynatıcı henüz hazır değil.");
            return;
        }

        const playerState = ytPlayer.getPlayerState();
        if (playerState === YT.PlayerState.PLAYING) {
            ytPlayer.pauseVideo();
            appState.music.isPlaying = false;
        } else {
            ytPlayer.playVideo();
            appState.music.isPlaying = true;
        }
        updateMusicUI();
    }

    function updateMusicUI() {
        musicPlayIcon.textContent = appState.music.isPlaying ? 'pause' : 'play_arrow';
    }

    function switchMode(newMode) {
        if (appState.currentMode === newMode) return;
        if (appState.timer.state !== 'idle') resetTimer();
        if (appState.stopwatch.state !== 'idle') resetStopwatch();
        appState.currentMode = newMode;
        mainContent.setAttribute('data-active-mode', newMode);
        modeTimerBtn.classList.toggle('active', newMode === 'timer');
        modeStopwatchBtn.classList.toggle('active', newMode === 'stopwatch');
    }

    function startTimer(initialSeconds, presetIndex = -1) {
        if (appState.timer.state === 'running' || (initialSeconds <= 0 && appState.timer.state === 'idle')) return;
        if (appState.timer.state === 'idle') {
            appState.timer.initialTime = initialSeconds;
            appState.timer.totalSeconds = initialSeconds;
        }
        appState.timer.state = 'running';
        appState.timer.activePresetIndex = presetIndex;
        updateTimerControlsUI();
        updateActivePresetUI();
        if (appState.settings.quoteSettings.show && document.body.classList.contains('fullscreen-active')) {
            showRandomQuote();
            appState.timer.quoteInterval = setInterval(showRandomQuote, appState.settings.quoteSettings.frequency * MS_IN_SECOND);
        }
        appState.timer.countdown = setInterval(() => {
            if (appState.timer.totalSeconds <= 0) {
                clearInterval(appState.timer.countdown);
                triggerAlarm();
                return;
            }
            appState.timer.totalSeconds--;
            updateTimerDisplay(appState.timer.totalSeconds);
            if (appState.settings.countdownTick && appState.timer.totalSeconds < COUNTDOWN_TICK_START_S && appState.timer.totalSeconds >= 0) {
                tickAudio.currentTime = 0;
                tickAudio.play().catch(err => console.warn("Tick sesi çalınamadı:", err));
            }
        }, MS_IN_SECOND);
    }

    const pauseTimer = () => {
        clearInterval(appState.timer.countdown);
        clearInterval(appState.timer.quoteInterval);
        appState.timer.state = 'paused';
        updateTimerControlsUI();
    };

    function resetTimer() {
        clearInterval(appState.timer.countdown);
        clearInterval(appState.timer.quoteInterval);
        hideQuote();
        appState.timer.state = 'idle';
        appState.timer.totalSeconds = appState.timer.initialTime > 0 ? appState.timer.initialTime : 0;
        appState.timer.activePresetIndex = -1;
        updateTimerDisplay(appState.timer.totalSeconds);
        updateTimerControlsUI();
        updateActivePresetUI();
        document.title = "LeaderCoders Zaman Yönetimi";
    }

    const formatStopwatchTime = (time) => { const ms = String(time % 1000).padStart(3, '0'); const s = String(Math.floor(time / 1000) % 60).padStart(2, '0'); const m = String(Math.floor(time / 60000) % 60).padStart(2, '0'); const h = String(Math.floor(time / 3600000)).padStart(2, '0'); return `${h}:${m}:${s}.${ms}`; };
    function stopwatchLoop() { const currentTime = Date.now(); const totalElapsed = appState.stopwatch.elapsedTime + (currentTime - appState.stopwatch.startTime); stopwatchDisplay.textContent = formatStopwatchTime(totalElapsed); appState.stopwatch.requestID = requestAnimationFrame(stopwatchLoop); }
    function startStopStopwatch() { if (appState.stopwatch.state === 'running') { cancelAnimationFrame(appState.stopwatch.requestID); appState.stopwatch.elapsedTime += Date.now() - appState.stopwatch.startTime; appState.stopwatch.state = 'paused'; } else { appState.stopwatch.startTime = Date.now(); appState.stopwatch.state = 'running'; stopwatchLoop(); } updateStopwatchControlsUI(); }
    function lapResetStopwatch() { if (appState.stopwatch.state === 'running') { const lapTime = appState.stopwatch.elapsedTime + (Date.now() - appState.stopwatch.startTime); appState.stopwatch.laps.unshift({ index: appState.stopwatch.laps.length + 1, time: lapTime }); renderLaps(); } else if (appState.stopwatch.state === 'paused' || appState.stopwatch.state === 'idle') { resetStopwatch(); } }
    function resetStopwatch() { cancelAnimationFrame(appState.stopwatch.requestID); appState.stopwatch = { requestID: null, startTime: 0, elapsedTime: 0, laps: [], state: 'idle' }; stopwatchDisplay.textContent = '00:00:00.000'; renderLaps(); updateStopwatchControlsUI(); }
    const updateTimerDisplay = (seconds) => { const h = Math.floor(seconds / (SECONDS_IN_MINUTE * SECONDS_IN_MINUTE)); const m = Math.floor((seconds % (SECONDS_IN_MINUTE * SECONDS_IN_MINUTE)) / SECONDS_IN_MINUTE); const s = seconds % SECONDS_IN_MINUTE; const displayString = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; timeDisplay.textContent = displayString; if (appState.timer.state !== 'idle') { document.title = `(${displayString}) Geri Sayım`; } const progress = appState.timer.initialTime > 0 ? (appState.timer.initialTime - seconds) / appState.timer.initialTime : 0; progressCircle.style.strokeDashoffset = circumference - progress * circumference; };
    const updateTimerControlsUI = () => { startPauseBtn.textContent = appState.timer.state === 'running' ? 'DURAKLAT' : (appState.timer.state === 'paused' ? 'DEVAM ET' : 'BAŞLAT'); };
    const updateStopwatchControlsUI = () => { swStartStopBtn.textContent = appState.stopwatch.state === 'running' ? 'DURDUR' : 'BAŞLAT'; swLapResetBtn.textContent = appState.stopwatch.state === 'running' ? 'TUR' : 'SIFIRLA'; };
    const updateActivePresetUI = () => { document.querySelectorAll('.preset-btn').forEach((btn, index) => btn.classList.toggle('active', index === appState.timer.activePresetIndex)); };
    function renderLaps() { lapsList.innerHTML = ''; appState.stopwatch.laps.forEach(lap => { const li = document.createElement('li'); li.innerHTML = `<span class="lap-index">Tur ${lap.index}</span> <span>${formatStopwatchTime(lap.time)}</span>`; lapsList.appendChild(li); }); }
    function renderPresets() { presetButtonsContainer.innerHTML = ''; appState.settings.presets.forEach((preset, index) => { const button = document.createElement('button'); button.className = 'preset-btn'; button.textContent = preset.label; button.addEventListener('click', () => { if (appState.timer.state !== 'idle') resetTimer(); startTimer(preset.minutes * SECONDS_IN_MINUTE, index); }); presetButtonsContainer.appendChild(button); }); }
    function renderTopBarPresets() { topBarPresetsContainer.innerHTML = ''; appState.settings.presets.forEach((preset, index) => { const button = document.createElement('button'); button.className = 'top-preset-btn'; button.textContent = preset.label; button.addEventListener('click', () => { switchMode('timer'); if (appState.timer.state !== 'idle') resetTimer(); startTimer(preset.minutes * SECONDS_IN_MINUTE, index); }); topBarPresetsContainer.appendChild(button); }); }
    const renderPresetList = () => { presetList.innerHTML = ''; appState.settings.presets.forEach((preset, index) => { const li = document.createElement('li'); li.innerHTML = `<span>${preset.label} (${preset.minutes} dk)</span><button class="delete-btn" data-index="${index}">&times;</button>`; presetList.appendChild(li); }); };
    const renderQuoteList = () => { quoteList.innerHTML = ''; appState.settings.quotes.forEach((quote, index) => { const li = document.createElement('li'); li.innerHTML = `<span>${quote}</span><button class="delete-btn" data-index="${index}">&times;</button>`; quoteList.appendChild(li); }); };

    const showRandomQuote = () => {
        if (appState.settings.quotes.length === 0) return;
        let quote = '';
        if (appState.settings.quoteSettings.smartRandom) {
            if (appState.quotes.shuffledQuotes.length === 0) {
                const a = [...appState.settings.quotes];
                for (let i = a.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [a[i], a[j]] = [a[j], a[i]];
                }
                appState.quotes.shuffledQuotes = a;
            }
            quote = appState.quotes.shuffledQuotes.pop();
        } else {
            const randomIndex = Math.floor(Math.random() * appState.settings.quotes.length);
            quote = appState.settings.quotes[randomIndex];
        }
        quoteDisplay.textContent = `“${quote}”`;
        quoteDisplay.classList.add('show');
        setTimeout(hideQuote, appState.settings.quoteSettings.duration * MS_IN_SECOND);
    };
    const hideQuote = () => quoteDisplay.classList.remove('show');

    const triggerAlarm = () => {
        if (appState.music.isPlaying && ytPlayer) ytPlayer.setVolume(appState.music.volume * 100 * 0.2);
        alarmTitle.textContent = "SÜRE DOLDU!";
        alarmMessage.textContent = appState.settings.endMessage;
        alarmScreen.classList.remove('hidden');
        alarmAudio.src = `audio/${appState.settings.alarmSound}`;
        alarmAudio.loop = true;
        alarmAudio.play().catch(err => console.warn("Alarm sesi çalınamadı:", err));
    };

    const stopAlarm = () => {
        if (appState.music.isPlaying && ytPlayer) ytPlayer.setVolume(appState.music.volume * 100);
        alarmAudio.loop = false;
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        alarmScreen.classList.add('hidden');
        resetTimer();
    };

    function openSessionModal(type) { switchMode('timer'); sessionModalTitle.textContent = type === 'break' ? 'Teneffüs Süresi' : 'Alıştırma Süresi'; sessionModalDescription.textContent = `Kaç dakika ${type === 'break' ? 'teneffüs' : 'alıştırma'} yapmak istediğinizi girin.`; sessionMinutesInput.value = type === 'break' ? 10 : 25; sessionModal.classList.remove('hidden'); sessionMinutesInput.focus(); }
    const closeSessionModal = () => sessionModal.classList.add('hidden');
    function addPreset() { const label = presetLabelInput.value.trim(); const minutes = parseInt(presetMinutesInput.value); if (!label || !minutes || minutes <= 0) { alert("Lütfen geçerli bir etiket ve süre (0'dan büyük) girin."); return; } appState.settings.presets.push({ label, minutes }); saveSettings(); applySettings(); presetLabelInput.value = ''; presetMinutesInput.value = ''; }
    const deletePreset = (index) => { appState.settings.presets.splice(index, 1); saveSettings(); applySettings(); };
    function addQuote() { const quote = quoteInput.value.trim(); if (!quote) { alert("Lütfen bir özlü söz girin."); return; } appState.settings.quotes.push(quote); saveSettings(); renderQuoteList(); quoteInput.value = ''; }
    const deleteQuote = (index) => { appState.settings.quotes.splice(index, 1); saveSettings(); renderQuoteList(); };
    function exportSettings() { const blob = new Blob([JSON.stringify(appState.settings, null, 2)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'leadercoders-timer-settings.json'; a.click(); URL.revokeObjectURL(a.href); }
    function importSettings() { const input = document.createElement('input'); input.type = 'file'; input.accept = '.json'; input.onchange = e => { const file = e.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = re => { try { const imported = JSON.parse(re.target.result); if (imported && typeof imported === 'object') { appState.settings = { ...appState.settings, ...imported }; saveSettings(); applySettings(); alert('Ayarlar başarıyla içe aktarıldı!'); } else { alert('Geçersiz ayar dosyası.'); } } catch (err) { alert('Ayar dosyası okunamadı.'); } }; reader.readAsText(file); }; input.click(); }

    // --- EVENT LISTENERS ---
    modeTimerBtn.addEventListener('click', () => switchMode('timer'));
    modeStopwatchBtn.addEventListener('click', () => switchMode('stopwatch'));
    startPauseBtn.addEventListener('click', () => { if (appState.timer.state === 'running') pauseTimer(); else if (appState.timer.state === 'paused') startTimer(); else if (appState.timer.totalSeconds > 0) startTimer(appState.timer.totalSeconds, appState.timer.activePresetIndex); });
    resetBtn.addEventListener('click', resetTimer);
    swStartStopBtn.addEventListener('click', startStopStopwatch);
    swLapResetBtn.addEventListener('click', lapResetStopwatch);
    fullscreenBtn.addEventListener('click', () => { if (!document.fullscreenElement) document.documentElement.requestFullscreen(); else if (document.exitFullscreen) document.exitFullscreen(); });
    startBreakBtn.addEventListener('click', () => openSessionModal('break'));
    startExerciseBtn.addEventListener('click', () => openSessionModal('exercise'));
    settingsBtn.addEventListener('click', () => { settingsModal.classList.remove('hidden'); closeSettingsBtn.focus(); });
    closeSettingsBtn.addEventListener('click', () => settingsModal.classList.add('hidden'));
    startSessionTimerBtn.addEventListener('click', () => { const minutes = parseInt(sessionMinutesInput.value); if (minutes > 0) { if (appState.timer.state !== 'idle') resetTimer(); startTimer(minutes * SECONDS_IN_MINUTE); closeSessionModal(); } });
    cancelSessionModalBtn.addEventListener('click', closeSessionModal);
    stopAlarmBtn.addEventListener('click', stopAlarm);
    addPresetBtn.addEventListener('click', addPreset);
    presetList.addEventListener('click', (e) => { const btn = e.target.closest('.delete-btn'); if (btn) deletePreset(btn.getAttribute('data-index')); });
    addQuoteBtn.addEventListener('click', addQuote);
    quoteList.addEventListener('click', (e) => { const btn = e.target.closest('.delete-btn'); if (btn) deleteQuote(btn.getAttribute('data-index')); });
    themeSelect.addEventListener('change', () => { appState.settings.theme = themeSelect.value; saveSettings(); applySettings(); });
    alarmSoundSelect.addEventListener('change', () => { appState.settings.alarmSound = alarmSoundSelect.value; saveSettings(); });
    previewSoundBtn.addEventListener('click', () => { previewAudio.src = `audio/${alarmSoundSelect.value}`; previewAudio.play().catch(err => console.warn("Önizleme sesi çalınamadı:", err)); });
    endMessageInput.addEventListener('input', () => { appState.settings.endMessage = endMessageInput.value; saveSettings(); });
    countdownTickToggle.addEventListener('change', () => { appState.settings.countdownTick = countdownTickToggle.checked; saveSettings(); });
    showQuotesToggle.addEventListener('change', () => { appState.settings.quoteSettings.show = showQuotesToggle.checked; saveSettings(); });
    smartRandomToggle.addEventListener('change', () => { appState.settings.quoteSettings.smartRandom = smartRandomToggle.checked; saveSettings(); });
    quoteDurationInput.addEventListener('input', () => { appState.settings.quoteSettings.duration = parseInt(quoteDurationInput.value) || 5; saveSettings(); });
    quoteFrequencyInput.addEventListener('input', () => { appState.settings.quoteSettings.frequency = parseInt(quoteFrequencyInput.value) || 15; saveSettings(); });
    importSettingsBtn.addEventListener('click', importSettings);
    exportSettingsBtn.addEventListener('click', exportSettings);

    musicPlayPauseBtn.addEventListener('click', togglePlayMusic);
    musicVolumeSlider.addEventListener('input', (e) => {
        appState.music.volume = parseFloat(e.target.value);
        if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
            ytPlayer.setVolume(appState.music.volume * 100);
        }
    });

    document.addEventListener('fullscreenchange', () => {
        const isFullscreen = !!document.fullscreenElement;
        document.body.classList.toggle('fullscreen-active', isFullscreen);
        fullscreenIcon.textContent = isFullscreen ? 'fullscreen_exit' : 'fullscreen';
        if (isFullscreen && appState.timer.state === 'running' && appState.settings.quoteSettings.show) {
            showRandomQuote();
            appState.timer.quoteInterval = setInterval(showRandomQuote, appState.settings.quoteSettings.frequency * MS_IN_SECOND);
        } else {
            clearInterval(appState.timer.quoteInterval);
            hideQuote();
        }
    });

    // --- UYGULAMAYI BAŞLAT ---
    loadSettings();
    updateTimerDisplay(0);
    resetStopwatch();

        // --- YENİ: ESC Tuşu ile Modalları Kapatma ---
    document.addEventListener('keydown', (event) => {
        // Eğer basılan tuş 'Escape' değilse hiçbir şey yapma
        if (event.key !== 'Escape') return;

        // Ayarlar modalı açıksa kapat
        if (!settingsModal.classList.contains('hidden')) {
            settingsModal.classList.add('hidden');
        }

        // Teneffüs/Alıştırma modalı açıksa kapat
        if (!sessionModal.classList.contains('hidden')) {
            closeSessionModal();
        }

        // Alarm ekranı açıksa, alarmı durdur ve kapat
        if (!alarmScreen.classList.contains('hidden')) {
            stopAlarm();
        }
    });
});