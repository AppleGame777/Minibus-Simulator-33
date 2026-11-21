window.addEventListener('DOMContentLoaded', function () {
    var ACHIEVEMENTS_CONFIG = {
        rage_explode: {
            title: 'Довел до кипения',
            desc: 'Довести водителя до взрыва криками'
        },
        bus_ram: {
            title: 'На кнопку надо нажимать вообще-то',
            desc: 'Свергнуть водителя тараном второй маршрутки'
        },
        bus_leave: {
            title: 'Хороший мальчик',
            desc: 'Дождаться, пока автобус уедет по маршруту'
        },
        doshirak_full: {
            title: 'Кто тебе сказал что там говядина?',
            desc: 'Превратить маршрутку в Доширак и полностью наесться'
        },
        friday_13: {
            title: 'МММ СЕГОДНЯ ТАКОЙ ЧУДОВЫЙ ДЕНЬ',
            desc: 'Нажать 10 раз на автобус и открыть секретный календарь'
        },
        bomb_nuke: {
            title: 'Я же сказал взрыво-опасно',
            desc: 'Уничтожить сайт обычной бомбой'
        },
        supernova: {
            title: 'КАКАЯ БЛИН СУПЕРНОВА',
            desc: 'Взорвать Супернову'
        },
        potato_boom: {
            title: 'Опасная картошка',
            desc: 'Нажать на редкую картошку в углу'
        },
        verity_hit: {
            title: 'Не в том месте, не в то время',
            desc: 'Увидеть, как маршрутка сбивает Верити'
        }
    };

    var STORAGE_KEY = 'marshrutka_achievements_v1';
    var unlockedAchievements = {};
    try {
        unlockedAchievements = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
        unlockedAchievements = {};
    }

    var achToast = document.getElementById('achToast');
    var achToastTitle = document.getElementById('achToastTitle');
    var achToastDesc = document.getElementById('achToastDesc');
    var achOpenBtn = document.getElementById('achOpenBtn');
    var achCloseBtn = document.getElementById('achCloseBtn');
    var achResetBtn = document.getElementById('achResetBtn');
    var achModal = document.getElementById('achModal');
    var achList = document.getElementById('achList');
    var achCounter = document.getElementById('achCounter');
    var toastQueue = [];
    var isToastShowing = false;

    function updateAchUI() {
        var keys = Object.keys(ACHIEVEMENTS_CONFIG);
        var unlockedCount = keys.filter(function (k) { return !!unlockedAchievements[k]; }).length;
        if (achCounter) {
            achCounter.textContent = unlockedCount + '/' + keys.length;
        }
        if (achList) {
            achList.innerHTML = '';
            keys.forEach(function (key) {
                var itemData = ACHIEVEMENTS_CONFIG[key];
                var isUnlocked = !!unlockedAchievements[key];

                var row = document.createElement('div');
                row.className = 'ach-item' + (isUnlocked ? '' : ' locked');

                var img = document.createElement('img');
                img.src = 'Resources/achievement.png';
                img.alt = 'Кубок';

                var textWrap = document.createElement('div');
                var titleEl = document.createElement('div');
                titleEl.className = 'ach-item-title';
                titleEl.textContent = itemData.title;

                var descEl = document.createElement('div');
                descEl.className = 'ach-item-desc';
                descEl.textContent = itemData.desc;

                textWrap.appendChild(titleEl);
                textWrap.appendChild(descEl);
                row.appendChild(img);
                row.appendChild(textWrap);
                achList.appendChild(row);
            });
        }
    }

    function showNextToast() {
        if (isToastShowing || toastQueue.length === 0 || !achToast) return;
        isToastShowing = true;
        var nextAch = toastQueue.shift();

        if (achToastTitle) achToastTitle.textContent = nextAch.title;
        if (achToastDesc) achToastDesc.textContent = nextAch.desc;

        playGameSound('soundAchievement');
        achToast.classList.add('show');
        setTimeout(function () {
            achToast.classList.remove('show');
            setTimeout(function () {
                isToastShowing = false;
                showNextToast();
            }, 450);
        }, 2800);
    }

    function unlockAchievement(id) {
        if (!ACHIEVEMENTS_CONFIG[id] || unlockedAchievements[id]) return;
        unlockedAchievements[id] = true;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedAchievements));
        } catch (e) {}

        updateAchUI();
        toastQueue.push(ACHIEVEMENTS_CONFIG[id]);
        showNextToast();
    }

    if (achOpenBtn && achModal) {
        achOpenBtn.addEventListener('click', function () {
            updateAchUI();
            achModal.classList.add('active');
        });
    }
    if (achCloseBtn && achModal) {
        achCloseBtn.addEventListener('click', function () {
            achModal.classList.remove('active');
        });
    }
    if (achResetBtn) {
        achResetBtn.addEventListener('click', function () {
            if (confirm('Точно сбросить все полученные достижения?')) {
                unlockedAchievements = {};
                try {
                    localStorage.removeItem(STORAGE_KEY);
                } catch (e) {}
                updateAchUI();
            }
        });
    }
    if (achModal) {
        achModal.addEventListener('click', function (e) {
            if (e.target === achModal) achModal.classList.remove('active');
        });
    }
    updateAchUI();

    var gameTitle = document.getElementById('gameTitle');
    var shoutBtn = document.getElementById('shoutBtn');
    var barLabel = document.getElementById('barLabel');
    var rageBar = document.getElementById('rageBar');
    var bus = document.getElementById('bus');
    var bus2 = document.getElementById('bus2');
    var driverShout = document.getElementById('driverShout');
    var resultText = document.getElementById('result');
    var smoke = document.getElementById('smoke');
    var gameContainer = document.querySelector('.game-container');

    var verityScene = document.getElementById('verityScene');
    var verityBox = document.getElementById('verityBox');
    var verityChar = document.getElementById('verityChar');
    var veritySpeech = document.getElementById('veritySpeech');
    var verityBus = document.getElementById('verityBus');

    var cornerBomb = document.getElementById('cornerBomb');
    var supernovaCore = document.getElementById('supernovaCore');
    var supernovaWave = document.getElementById('supernovaWave');
    var flashOverlay = document.getElementById('flashOverlay');
    var nukeMessage = document.getElementById('nukeMessage');
    var supernovaText = document.getElementById('supernovaText');

    var fallingCalendar = document.getElementById('fallingCalendar');
    var memeOverlay = document.getElementById('memeOverlay');
    var closeMemeBtn = document.getElementById('closeMemeBtn');
    var memeAudio = document.getElementById('memeAudio');

    var cornerPotato = document.getElementById('cornerPotato');
    var potatoAudio = document.getElementById('potatoAudio');

    var audioCtx = null;
    function getAudioCtx() {
        if (!audioCtx) {
            var Ctx = window.AudioContext || window.webkitAudioContext;
            if (Ctx) audioCtx = new Ctx();
        }
        return audioCtx;
    }

    function playSynthFallback(type) {
        try {
            var ctx = getAudioCtx();
            if (!ctx) return;
            var now = ctx.currentTime;
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'soundAchievement') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(783.99, now + 0.2);
                osc.frequency.setValueAtTime(1046.50, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);
                osc.start(now); osc.stop(now + 0.65);
            } else if (type === 'soundShout') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(380, now + 0.18);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
                osc.start(now); osc.stop(now + 0.18);
            } else if (type === 'soundBusClick') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(550, now + 0.08);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
                osc.start(now); osc.stop(now + 0.16);
            } else if (type === 'soundDoshirak') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(750, now + 0.45);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
                osc.start(now); osc.stop(now + 0.45);
            } else if (type === 'soundEat') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(180, now);
osc.frequency.exponentialRampToValueAtTime(420, now + 0.22);
gain.gain.setValueAtTime(0.25, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
osc.start(now); osc.stop(now + 0.22);
} else if (type === 'soundRam') {
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(120, now);
osc.frequency.linearRampToValueAtTime(260, now + 0.6);
gain.gain.setValueAtTime(0.3, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
osc.start(now); osc.stop(now + 0.6);
} else if (type === 'soundBusLeave') {
osc.type = 'sine';
osc.frequency.setValueAtTime(240, now);
osc.frequency.exponentialRampToValueAtTime(70, now + 1.1);
gain.gain.setValueAtTime(0.25, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);
osc.start(now); osc.stop(now + 1.1);
} else if (type === 'soundVerity' || type === 'soundCalendar') {
osc.type = 'sine';
osc.frequency.setValueAtTime(520, now);
osc.frequency.setValueAtTime(680, now + 0.12);
gain.gain.setValueAtTime(0.25, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
osc.start(now); osc.stop(now + 0.3);
} else if (type === 'soundBusExplode' || type === 'soundBombExplode' || type === 'soundSupernova') {
var dur = (type === 'soundSupernova') ? 1.8 : 0.9;
osc.type = 'sawtooth';
osc.frequency.setValueAtTime(140, now);
osc.frequency.exponentialRampToValueAtTime(28, now + dur);
gain.gain.setValueAtTime(0.45, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + dur);
osc.start(now); osc.stop(now + dur);
} else if (type === 'soundPotatoExplode') {
osc.type = 'square';
osc.frequency.setValueAtTime(260, now);
osc.frequency.exponentialRampToValueAtTime(42, now + 1.1);
gain.gain.setValueAtTime(0.5, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 1.1);
osc.start(now); osc.stop(now + 1.1);
} else if (type === 'potatoAudio') {
osc.type = 'triangle';
osc.frequency.setValueAtTime(520, now);
osc.frequency.exponentialRampToValueAtTime(85, now + 4.8);
gain.gain.setValueAtTime(0.35, now);
gain.gain.exponentialRampToValueAtTime(0.01, now + 4.8);
osc.start(now); osc.stop(now + 4.8);
}
} catch (e) {}
}
function playGameSound(audioId, onFinishCallback, fallbackDelayMs) {
var el = document.getElementById(audioId);
var done = false;
var finish = function () {
if (done) return;
done = true;
if (typeof onFinishCallback === 'function') onFinishCallback();
};
var timer = null;
if (typeof onFinishCallback === 'function' && fallbackDelayMs) {
timer = setTimeout(finish, fallbackDelayMs);
}
if (el && el.getAttribute('src')) {
el.currentTime = 0;
if (typeof onFinishCallback === 'function') {
el.onended = function () {
if (timer) clearTimeout(timer);
finish();
};
}
el.play().catch(function () {
playSynthFallback(audioId);
});
} else {
playSynthFallback(audioId);
}
}

var rage = 0;
var maxRage = 100;
var isBusy = false;
var isDoshirakMode = false;
var busClickCount = 0;
var calendarDropped = false;
var busHoldStartTime = 0;

var busHoldTimer = null, shoutHoldTimer = null, bombTimer = null, bombHoldTimer = null, bombGrowInterval = null, verityTimer = null;
var busLeaveTimer = null, potatoTimer = null;
var verityEventTimers = [];
var isHoldingBus = false, isHoldingShout = false, isHoldingBomb = false;
var supernovaTriggered = false;
var BUS_HOLD_DURATION = 10000;
var SHOUT_HOLD_DURATION = 3000;
var BOMB_DELAY = 15000;
var BOMB_HOLD_DURATION = 6000;
var VERITY_DELAY = 4000;
var VERITY_CHANCE = 0.33;
var POTATO_DELAY = 12000;
var POTATO_CHANCE = 0.20;
var BUS_LEAVE_DELAY = 30000;
var RELOAD_DELAY = 2500;
var shouts = ['ЭЙ, ТОРМОЗИ!', 'КУДА ПРЕШЬ?!', 'Я ТЕБЯ МОГНУ!', 'УСТУПИ ДОРОГУ!', 'БИП-БИП, ЧЕРТ!'];

function reloadWholeSite(delay) {
isBusy = true;
clearTimeout(busLeaveTimer);
clearTimeout(potatoTimer);
if (shoutBtn) shoutBtn.disabled = true;
if (bus) bus.style.pointerEvents = 'none';
if (cornerBomb) cornerBomb.style.pointerEvents = 'none';
if (cornerPotato) cornerPotato.style.pointerEvents = 'none';
setTimeout(function () {
location.reload();
}, delay !== undefined ? delay : RELOAD_DELAY);
}

function explodeBus(message) {
playGameSound('soundBusExplode');
if (bus) {
bus.textContent = '💥';
bus.classList.remove('charging', 'doshirak-pop', 'drive-away');
bus.classList.add('exploded');
}
if (smoke) smoke.classList.add('active');
if (resultText && message) {
resultText.textContent = message;
resultText.style.color = '#e74c3c';
}
shakeScreen();
}

function startBusLeaveTimer() {
clearTimeout(busLeaveTimer);
busLeaveTimer = setTimeout(function () {
if (isBusy || isDoshirakMode) return;
isBusy = true;
unlockAchievement('bus_leave');
playGameSound('soundBusLeave');
if (shoutBtn) shoutBtn.disabled = true;
if (driverShout) {
driverShout.textContent = 'НУ ВАС, Я ПОЕХАЛ!';
driverShout.classList.add('active');
driverShout.style.opacity = '1';
driverShout.style.transform = 'scale(1)';
}
if (resultText) {
resultText.textContent = 'АВТОБУС УЕХАЛ ПО МАРШРУТУ!';
resultText.style.color = '#f1c40f';
}
if (bus) {
bus.classList.remove('charging');
bus.classList.add('drive-away');
}
reloadWholeSite(2000);
}, BUS_LEAVE_DELAY);
}

function clearVerityEventTimers() {
verityEventTimers.forEach(function (t) { clearTimeout(t); });
verityEventTimers = [];
}
function resetVerityScene() {
clearVerityEventTimers();
if (!verityScene) return;
verityScene.style.display = 'none';
if (verityBox) verityBox.classList.remove('shaking', 'hit');
if (verityChar) verityChar.classList.remove('pop-out', 'hit');
if (veritySpeech) veritySpeech.classList.remove('active');
if (verityBus) verityBus.classList.remove('attack');
}
function triggerVerityEvent() {
if (!verityScene || !verityBox || !verityChar || !veritySpeech || !verityBus) return;
clearVerityEventTimers();
verityScene.style.display = 'block';
verityEventTimers.push(setTimeout(function () { verityBox.classList.add('shaking'); }, 600));
verityEventTimers.push(setTimeout(function () {
verityBox.classList.remove('shaking');
verityChar.classList.add('pop-out');
veritySpeech.textContent = 'Hello! Im Verity!';
veritySpeech.classList.add('active');
playGameSound('soundVerity');
}, 1200));
verityEventTimers.push(setTimeout(function () {
verityBus.classList.add('attack');
playGameSound('soundRam');
}, 2500));
verityEventTimers.push(setTimeout(function () {
veritySpeech.classList.remove('active');
verityChar.classList.add('hit');
verityBox.classList.add('hit');
unlockAchievement('verity_hit');
playGameSound('soundBusExplode');
shakeScreen();
}, 3350));
verityEventTimers.push(setTimeout(function () { resetVerityScene(); }, 4800));
}
function startVerityTimer() {
clearTimeout(verityTimer);
resetVerityScene();
if (Math.random() < VERITY_CHANCE) {
verityTimer = setTimeout(function () { triggerVerityEvent(); }, VERITY_DELAY);
}
}

function handleShoutClick() {
if (isBusy) return;
if (isDoshirakMode) {
playGameSound('soundEat');
rage = Math.min(rage + 25, maxRage);
if (rageBar) rageBar.style.width = rage + '%';
if (resultText) {
resultText.textContent = (rage >= maxRage ? 'ВЫ ПОЛНОСТЬЮ НАЕЛИСЬ!' : 'ОЧЕНЬ ВКУСНО! (+25% сытости)');
resultText.style.color = '#2ecc71';
}
if (bus) {
bus.classList.add('shake-bus');
setTimeout(function () { bus.classList.remove('shake-bus'); }, 300);
}
if (rage >= maxRage) {
unlockAchievement('doshirak_full');
reloadWholeSite(2000);
}
return;
}
if (!isHoldingShout) {
rage = Math.min(rage + 20, maxRage);
if (rageBar) rageBar.style.width = rage + '%';
if (rage >= maxRage) {
if (driverShout) {
driverShout.classList.remove('active');
driverShout.style.opacity = '0';
}
unlockAchievement('rage_explode');
explodeBus('БА-БАХ! ВОДИТЕЛЬ ВЗОРВАЛСЯ ОТ ЯРОСТИ!');
reloadWholeSite(2500);
return;
}
playGameSound('soundShout');
if (resultText) {
resultText.textContent = shouts[Math.floor(Math.random() * shouts.length)];
resultText.style.color = '#e74c3c';
}
if (driverShout) {
driverShout.textContent = (rage >= 80 ? 'НУ ВСЁ, ТЫ ДОИГРАЛСЯ!' : 'ЧЕ ОРЕШЬ?!');
driverShout.classList.add('active');
driverShout.style.opacity = '1';
driverShout.style.transform = 'scale(1)';
setTimeout(function () {
if (driverShout) {
driverShout.classList.remove('active');
driverShout.style.opacity = '0';
driverShout.style.transform = 'scale(0.5)';
}
}, 1000);
}
if (bus) {
bus.classList.add('angry-shake');
setTimeout(function () { bus.classList.remove('angry-shake'); }, 300);
}
}
}
function startShoutHold() {
if (isBusy || isDoshirakMode) return;
isHoldingShout = true;
shoutHoldTimer = setTimeout(triggerSecondDriver, SHOUT_HOLD_DURATION);
}
function cancelShoutHold() {
if (!isHoldingShout) return;
clearTimeout(shoutHoldTimer);
isHoldingShout = false;
}
function triggerSecondDriver() {
if (isBusy) return;
isBusy = true;
isHoldingShout = false;
clearTimeout(busLeaveTimer);
if (shoutBtn) shoutBtn.disabled = true;
unlockAchievement('bus_ram');
playGameSound('soundRam');
if (bus2) {
bus2.style.visibility = 'visible';
bus2.style.pointerEvents = 'none';
bus2.classList.add('ramming');
}
if (resultText) {
resultText.textContent = 'ВОДИТЕЛЬ СВЕРГНУТ ТАРАНОМ!';
resultText.style.color = '#9b59b6';
}
if (driverShout) {
driverShout.textContent = 'НЕТ, ТОЛЬКО НЕ ЭТО!';
driverShout.classList.add('active');
driverShout.style.opacity = '1';
driverShout.style.transform = 'scale(1)';
}
setTimeout(function () {
if (driverShout) driverShout.style.opacity = '0';
explodeBus('БА-БАХ! АВТОБУС ВЗОРВАЛСЯ ПРИ ТАРАНЕ!');
}, 650);
reloadWholeSite(2500);
}
if (shoutBtn) {
shoutBtn.addEventListener('click', handleShoutClick);
shoutBtn.addEventListener('mousedown', startShoutHold);
shoutBtn.addEventListener('mouseup', cancelShoutHold);
shoutBtn.addEventListener('mouseleave', cancelShoutHold);
shoutBtn.addEventListener('touchstart', startShoutHold, { passive: false });
shoutBtn.addEventListener('touchend', cancelShoutHold);
}

function startBusHold(e) {
if (e && e.type === 'touchstart') e.preventDefault();
if (isBusy || isDoshirakMode || !bus) return;
isHoldingBus = true;
busHoldStartTime = Date.now();
bus.classList.add('charging');
busHoldTimer = setTimeout(function () {
isHoldingBus = false;
bus.classList.remove('charging');
transformToDoshirak();
}, BUS_HOLD_DURATION);
}
function endBusInteraction(isClick) {
if (isHoldingBus && bus) {
clearTimeout(busHoldTimer);
busHoldTimer = null;
isHoldingBus = false;
bus.classList.remove('charging');
}
if (isClick && !isBusy && !isDoshirakMode) {
var holdDuration = Date.now() - busHoldStartTime;
if (holdDuration < 400) {
playGameSound('soundBusClick');
bus.style.transform = 'scale(1.12)';
setTimeout(function () { if (bus) bus.style.transform = ''; }, 100);
if (!calendarDropped) {
busClickCount++;
if (busClickCount >= 10) {
dropCalendar();
}
}
}
}
}
function dropCalendar() {
calendarDropped = true;
playGameSound('soundCalendar');
if (fallingCalendar) {
fallingCalendar.classList.add('dropped');
}
}
if (fallingCalendar) {
fallingCalendar.addEventListener('click', function () {
clearTimeout(busLeaveTimer);
unlockAchievement('friday_13');
if (memeOverlay) memeOverlay.classList.add('active');
if (memeAudio) {
memeAudio.currentTime = 0;
memeAudio.play().catch(function (err) {
console.log('Ошибка воспроизведения звука:', err);
});
}
});
}
function closeMemeModal() {
if (memeOverlay) memeOverlay.classList.remove('active');
if (memeAudio) {
memeAudio.pause();
memeAudio.currentTime = 0;
}
if (!isBusy && !isDoshirakMode) {
startBusLeaveTimer();
}
}
if (closeMemeBtn) {
closeMemeBtn.addEventListener('click', closeMemeModal);
}
if (memeOverlay) {
memeOverlay.addEventListener('click', function (e) {
if (e.target === memeOverlay) closeMemeModal();
});
}
function transformToDoshirak() {
isDoshirakMode = true;
clearTimeout(busLeaveTimer);
rage = 0;
playGameSound('soundDoshirak');
if (bus) { bus.textContent = '🍜'; bus.classList.add('doshirak-pop'); }
if (gameTitle) gameTitle.textContent = 'Доширак с говядиной';
if (barLabel) barLabel.textContent = 'Сытость';
if (rageBar) { rageBar.style.width = '0%'; rageBar.classList.add('satiety-bar'); }
if (shoutBtn) { shoutBtn.textContent = 'Съесть горячий супчик с говядиной'; shoutBtn.classList.add('eat-mode'); }
if (resultText) { resultText.textContent = 'МММ, ПАХНЕТ ГОВЯДИНОЙ!'; resultText.style.color = '#2ecc71'; }
}
if (bus) {
bus.addEventListener('mousedown', startBusHold);
bus.addEventListener('mouseup', function () { endBusInteraction(true); });
bus.addEventListener('mouseleave', function () { endBusInteraction(false); });
bus.addEventListener('touchstart', startBusHold, { passive: false });
bus.addEventListener('touchend', function () { endBusInteraction(true); });
}

function startBombTimer() {
if (!cornerBomb) return;
clearTimeout(bombTimer);
cornerBomb.style.display = 'none';
cornerBomb.classList.remove('charging');
cornerBomb.style.transform = '';
cornerBomb.style.filter = '';
bombTimer = setTimeout(function () {
if (!isBusy) cornerBomb.style.display = 'block';
}, BOMB_DELAY);
}
function startBombHold(e) {
if (e && e.type === 'touchstart') e.preventDefault();
if (!cornerBomb || isBusy) return;
isHoldingBomb = true;
supernovaTriggered = false;
cornerBomb.classList.add('charging');
var startTime = Date.now();
bombGrowInterval = setInterval(function () {
var elapsed = Date.now() - startTime;
var progress = Math.min(elapsed / BOMB_HOLD_DURATION, 1);
var scale = 1 + progress * 3.5;
var shakeX = (Math.random() - 0.5) * 14 * progress;
var shakeY = (Math.random() - 0.5) * 14 * progress;
var glowSize = 15 + progress * 55;
cornerBomb.style.transform = 'translate(' + shakeX + 'px, ' + shakeY + 'px) scale(' + scale + ')';
cornerBomb.style.filter = 'drop-shadow(0 0 ' + glowSize + 'px #ffffff) brightness(' + (1 + progress * 1.2) + ')';
}, 25);
bombHoldTimer = setTimeout(function () {
supernovaTriggered = true;
isHoldingBomb = false;
clearInterval(bombGrowInterval);
triggerSupernova();
}, BOMB_HOLD_DURATION);
}
function endBombHold() {
if (!isHoldingBomb) return;
clearTimeout(bombHoldTimer);
clearInterval(bombGrowInterval);
isHoldingBomb = false;
if (!supernovaTriggered) {
triggerNormalBomb();
}
}
function triggerNormalBomb() {
if (isBusy) return;
isBusy = true;
unlockAchievement('bomb_nuke');
playGameSound('soundBombExplode');
if (flashOverlay) flashOverlay.classList.add('active');
if (nukeMessage) {
nukeMessage.textContent = '💥 САЙТ УНИЧТОЖЕН 💥';
nukeMessage.classList.add('show');
}
if (cornerBomb) {
cornerBomb.style.display = 'none';
cornerBomb.classList.remove('charging');
cornerBomb.style.transform = '';
cornerBomb.style.filter = '';
}
shakeScreen();
reloadWholeSite(2500);
}
function triggerSupernova() {
if (isBusy) return;
isBusy = true;
unlockAchievement('supernova');
playGameSound('soundSupernova');
if (cornerBomb) cornerBomb.style.display = 'none';
if (supernovaCore) supernovaCore.classList.add('active');
if (supernovaWave) supernovaWave.classList.add('active');
shakeScreen();
setTimeout(function () {
if (flashOverlay) flashOverlay.classList.add('active');
if (supernovaText) {
supernovaText.textContent = '💥 СУПЕРНОВА ВЗОРВАЛАСЬ 💥';
supernovaText.classList.add('show');
}
}, 600);
reloadWholeSite(3000);
}
if (cornerBomb) {
cornerBomb.addEventListener('mousedown', startBombHold);
cornerBomb.addEventListener('mouseup', endBombHold);
cornerBomb.addEventListener('mouseleave', endBombHold);
cornerBomb.addEventListener('touchstart', startBombHold, { passive: false });
cornerBomb.addEventListener('touchend', endBombHold);
}

function startPotatoTimer() {
if (!cornerPotato) return;
clearTimeout(potatoTimer);
cornerPotato.style.display = 'none';
if (Math.random() < POTATO_CHANCE) {
potatoTimer = setTimeout(function () {
if (!isBusy) {
cornerPotato.style.display = 'block';
}
}, POTATO_DELAY);
}
}
function triggerPotatoExplosion() {
playGameSound('soundPotatoExplode');
if (cornerPotato) cornerPotato.style.display = 'none';
if (flashOverlay) flashOverlay.classList.add('active');
if (nukeMessage) {
nukeMessage.textContent = '💥 КАРТОШКА ВЗОРВАЛАСЬ! 💥';
nukeMessage.classList.add('show');
}
shakeScreen();
reloadWholeSite(2500);
}
if (cornerPotato) {
cornerPotato.addEventListener('click', function () {
if (isBusy) return;
isBusy = true;
unlockAchievement('potato_boom');
clearTimeout(busLeaveTimer);
if (shoutBtn) shoutBtn.disabled = true;
if (bus) bus.style.pointerEvents = 'none';
cornerPotato.style.pointerEvents = 'none';
cornerPotato.classList.add('active-potato');
if (resultText) {
resultText.textContent = 'ОХ...';
resultText.style.color = '#f1c40f';
}
setTimeout(function () {
if (resultText) {
resultText.textContent = 'КАРТОШЕЧКА...';
resultText.style.color = '#e67e22';
}
if (gameContainer) {
gameContainer.classList.add('potato-shrink');
}
}, 2000);
playGameSound('potatoAudio', triggerPotatoExplosion, 5000);
});
}
function shakeScreen() {
if (!gameContainer) return;
gameContainer.classList.add('shake-screen');
setTimeout(function () { gameContainer.classList.remove('shake-screen'); }, 400);
}

startVerityTimer();
startBombTimer();
startBusLeaveTimer();
startPotatoTimer();
});

function hidePreloader() {
var preloader = document.getElementById('pagePreloader');
if (preloader && !preloader.dataset.hidden) {
preloader.dataset.hidden = 'true';
preloader.style.opacity = '0';
preloader.style.visibility = 'hidden';
setTimeout(function () {
preloader.remove();
}, 400);
}
}
if (document.readyState === 'complete') {
hidePreloader();
} else {
window.addEventListener('load', hidePreloader);
}
setTimeout(hidePreloader, 3000);