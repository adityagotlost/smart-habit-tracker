const stars = document.querySelectorAll('.mood-selector .mood-option');
let currentrating = 0;

function updatestars(rating) {
    stars.forEach((star) => {
        const starvalue = parseInt(star.getAttribute('data-value'));
        if (starvalue <= rating){
            star.classList.add('active');

        } else {
            star.classList.remove('active');
        }
    });
}

stars.forEach((star) => {
    star.addEventListener('click', () => {
        currentrating = parseInt(star.getAttribute('data-value'));
        updatestars(currentrating);

        const radioinput = star.querySelector('input[type="radio"]');
        if (radioinput) radioinput.checked = true;
        selectedrating = currentrating;
        const emojispan = star.querySelector('.emoji');
        selectedemoji = emojispan? emojispan.textContent: "";
        
    });
    star.addEventListener('mouseover', () => {
        const hovervalue = parseInt(star.getAttribute('data-value'));
        updatestars(hovervalue);
    });
});
const moodselectorel = document.querySelector('.mood-selector');
if(moodselectorel) {
    moodselectorel.addEventListener('mouseleave', () => {
        updatestars(currentrating);
    });
}


let selectedrating = null;
let selectedemoji = "";

const moodform = document.getElementById('mood-form');
const noteinput = document.getElementById('mood-note');
const historycontainer = document.getElementById('mood-history-list');

moodform.addEventListener('submit', (e) => {
    e.preventDefault();
    const notetext = noteinput.value.trim();
    if(!selectedrating){
        alert("phele star");
        return;
    }

    const newentry = {
        id: Date.now(),
        date: new Date().toLocaleDateString(undefined, {weekday: 'short', month: 'short', day: 'numeric'}),
        rating: selectedrating,
        emoji: selectedemoji,
        note: notetext || "no text"
    };
    const alreadyentries = JSON.parse(localStorage.getItem('moodentries')) || [];
    alreadyentries.unshift(newentry);
    localStorage.setItem('moodentries', JSON.stringify(alreadyentries));

    noteinput.value = "";
    currentrating = 0;
    selectedrating = null;
    selectedemoji = "";
    updatestars(0);

    displayhistory();
});


function displayhistory() {
    historycontainer.innerHTML = "";
    const entries = JSON.parse(localStorage.getItem('moodentries')) || [];
    if(entries.length === 0){
        historycontainer.innerHTML = "No entries yet no logging";
        return;
    }
    entries.forEach(entry => {
        const entrycard = document.createElement('div');
        entrycard.classList.add('history-item');
        const starratingvisual = "⭐".repeat(entry.rating);
        entrycard.innerHTML = `
          <div class="history-left">
            <span class="history-emoji">${entry.emoji}</span>
            <div class="history-details">
                <p class="history-date">${entry.date} <span style="font-size:0.8rem; opacity:0.7;">(${starratingvisual})</span></p>
                <p class="history-note">${entry.note}</p>
            </div>
          </div>
        `;
    historycontainer.appendChild(entrycard);
    });
}
document.addEventListener('DOMContentLoaded', displayhistory);