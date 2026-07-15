(function () {
    'use strict';

    var STORAGE_KEY = 'zapp-cookie-consent';
    var banner = document.getElementById('cookie-consent-banner');
    var overlay = document.getElementById('cookie-consent-overlay');
    var modal = document.getElementById('cookie-consent-modal');
    var acceptBtn = document.getElementById('cookie-accept-btn');
    var manageBtn = document.getElementById('cookie-manage-btn');
    var closeModalBtn = document.getElementById('cookie-close-modal');
    var saveBtn = document.getElementById('cookie-save-btn');
    var acceptAllBtn = document.getElementById('cookie-accept-all-btn');
    var declineBtn = document.getElementById('cookie-decline-btn');
    var switches = Array.prototype.slice.call(document.querySelectorAll('.cookie-category input[type="checkbox"]'));

    function getStoredConsent() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            return null;
        }
    }

    function setConsent(consent) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
        updateGoogleConsent(consent);
    }

    function updateGoogleConsent(consent) {
        var consentState = {
            ad_storage: consent.marketing ? 'granted' : 'denied',
            ad_user_data: consent.marketing ? 'granted' : 'denied',
            ad_personalization: consent.marketing ? 'granted' : 'denied',
            analytics_storage: consent.statistics ? 'granted' : 'denied',
            functionality_storage: consent.preferences ? 'granted' : 'denied',
            personalization_storage: consent.preferences ? 'granted' : 'denied',
            security_storage: 'granted',
            wait_for_update: 500
        };

        if (window.gtag) {
            if (!consent.hasOwnProperty('decisionMade')) {
                window.gtag('consent', 'default', consentState);
            } else {
                window.gtag('consent', 'update', consentState);
            }
        }

        if (window.dataLayer) {
            window.dataLayer.push({ event: consent.hasOwnProperty('decisionMade') ? 'cookie_consent_updated' : 'cookie_consent_default', consent: consentState });
        }
    }

    function showBanner() {
        if (!banner) return;
        banner.classList.add('is-visible');
    }

    function hideBanner() {
        if (!banner) return;
        banner.classList.remove('is-visible');
    }

    function openModal() {
        if (!modal || !overlay) return;
        overlay.hidden = false;
        modal.classList.add('is-visible');
        document.body.classList.add('cookie-banner-open');
    }

    function closeModal() {
        if (!modal || !overlay) return;
        overlay.hidden = true;
        modal.classList.remove('is-visible');
        document.body.classList.remove('cookie-banner-open');
    }

    function applySavedConsent() {
        var storedConsent = getStoredConsent();
        if (!storedConsent) {
            updateGoogleConsent({
                necessary: true,
                statistics: false,
                marketing: false,
                preferences: false,
                decisionMade: false
            });
            showBanner();
            return;
        }

        hideBanner();
        updateGoogleConsent(storedConsent);
    }

    function getCurrentPreferences() {
        return {
            necessary: true,
            statistics: switches.some(function (input) { return input.value === 'statistics' && input.checked; }),
            marketing: switches.some(function (input) { return input.value === 'marketing' && input.checked; }),
            preferences: switches.some(function (input) { return input.value === 'preferences' && input.checked; })
        };
    }

    function persistAndClose(preferences) {
        var consent = Object.assign({}, preferences, { decisionMade: true });
        setConsent(consent);
        hideBanner();
        closeModal();
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            persistAndClose({
                necessary: true,
                statistics: true,
                marketing: true,
                preferences: true
            });
        });
    }

    if (manageBtn) {
        manageBtn.addEventListener('click', function () {
            openModal();
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', function () {
            persistAndClose(getCurrentPreferences());
        });
    }

    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', function () {
            switches.forEach(function (input) {
                if (!input.disabled) {
                    input.checked = true;
                }
            });
            persistAndClose({
                necessary: true,
                statistics: true,
                marketing: true,
                preferences: true
            });
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', function () {
            switches.forEach(function (input) {
                if (input.value !== 'necessary' && !input.disabled) {
                    input.checked = false;
                }
            });
            persistAndClose({
                necessary: true,
                statistics: false,
                marketing: false,
                preferences: false
            });
        });
    }

    applySavedConsent();
})();

// Galeria de produto
function trocar(thumb) {
    var thumbs = document.querySelectorAll('.thumb-item');
    thumbs.forEach(function (t) { t.classList.remove('active'); });
    thumb.classList.add('active');
    document.getElementById('mainImage').src = thumb.querySelector('img').src;
}

// FAQ accordion
function toggleFaq(btn) {
    var answer = btn.nextElementSibling;
    var icon = btn.querySelector('.faq-icon');
    var isOpen = answer.classList.contains('open');

    // Fecha todos
    document.querySelectorAll('.faq-answer').forEach(function (a) { a.classList.remove('open'); });
    document.querySelectorAll('.faq-icon').forEach(function (i) { i.textContent = '+'; });

    if (!isOpen) {
        answer.classList.add('open');
        icon.textContent = '−';
    }
}