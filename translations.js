// Language system for Quentin Bouard portfolio
let currentLang = localStorage.getItem('language') || 'fr';

// Comprehensive translations
const translations = {
    fr: {
        // Navigation
        work: "WORK",
        cv: "CV", 
        contact: "CONTACT",
        
        // Work titles (French only)
        "retour_experience_title": "Retour d'expérience —",
        "danse_pineale_title": "Danse Pinéale —",
        "articulation_title": "Articulation —",
        "corps_tete_panneau_title": "Corps Tête Panneau —",
        "synthese_title": "Synthèse —",
        "don_contre_don_title": "Don contre don —",
        "t_title": "T",
        "monument_mobile_title": "Monument mobile —",
        "fluxus_encore_title": "Fluxus encore ? —",
        "alba_title": "Alba —",
        "immeuble_title": "Immeuble —",
        "cher_joachim_title": "Cher Joachim —",
        "sans_titre_title": "Sans titre —",
        "supports_title": "Supports —",
        
        // Captions and descriptions
        "retour_experience_caption": "Collaboration avec Brune de Maurin.",
        "danse_pineale_caption": "Séance en visio live avec un psychiatre secteur 1. Un problème de caméra cassée a été prétexté pour que le psychiatre ignore le procédé. Le public est placé face à la visio. L'analysé danse et dialogue par le microphone. Pinéale : adjectif en référence à Descartes, définissant la glande pinéale comme le point de rencontre de l'esprit et du corps.",
        "synthese_caption": "Récolte de larmes sur papier buvard conçu pour le stockage du LSD. Chaque larme est nommée selon l'initiale de son·sa producteur·ice.",
        "fluxus_encore_caption": "Collaboration avec Amalia Soubise.",
        "alba_caption": "Collaboration avec Lino Jaricot Garcia",
        "immeuble_caption": "Vidéo chorégraphiée la caméra est placée en équilibre au bout d'un trépied sur mon menton, les immeubles (qui ne peut être déplacé) de la ville me reflètent.",
        "cher_joachim_caption": "J'envoie une carte postale à Joachim, avec écrit au dos un lien. Le lien envoie sur une vidéo du postage de la lettre.",
        "cher_joachim_photo": "Photo Brune de Maurin",
        "csav_caption": "Pendant la résidence XXIX CSAV, chaque jour, j'ai ajouté des fleurs à la statut du saint Jean de Népomucène tournant le dos au lac de Como."
    },
    en: {
        // Navigation
        work: "WORK",
        cv: "CV",
        contact: "CONTACT",
        
        // Work titles (French with English translation in parentheses)
        "retour_experience_title": "Retour d'expérience (Return of Experience) —",
        "danse_pineale_title": "Danse Pinéale (Pineal Dance) —",
        "articulation_title": "Articulation (Articulation) —",
        "corps_tete_panneau_title": "Corps Tête Panneau (Body Head Panel) —",
        "synthese_title": "Synthèse (Synthesis) —",
        "don_contre_don_title": "Don contre don (Gift for Gift) —",
        "t_title": "T (T)",
        "monument_mobile_title": "Monument mobile (Mobile Monument) —",
        "fluxus_encore_title": "Fluxus encore ? (Fluxus Again?) —",
        "alba_title": "Alba (Alba) —",
        "immeuble_title": "Immeuble (Building) —",
        "cher_joachim_title": "Cher Joachim (Dear Joachim) —",
        "sans_titre_title": "Sans titre (Untitled) —",
        "supports_title": "Supports (Supports) —",
        
        // Captions and descriptions (translated to English)
        "retour_experience_caption": "Collaboration with Brune de Maurin.",
        "danse_pineale_caption": "Live video session with a sector 1 psychiatrist. A broken camera problem was used as pretext so that the psychiatrist would ignore the process. The audience is placed facing the video call. The analysand dances and dialogues through the microphone. Pineal: adjective in reference to Descartes, defining the pineal gland as the meeting point of mind and body.",
        "synthese_caption": "Tear collection on blotter paper designed for LSD storage. Each tear is named according to the initial of its producer.",
        "fluxus_encore_caption": "Collaboration with Amalia Soubise.",
        "alba_caption": "Collaboration with Lino Jaricot Garcia",
        "immeuble_caption": "Choreographed video where the camera is placed in balance at the end of a tripod on my chin, the buildings (which cannot be moved) of the city reflect me.",
        "cher_joachim_caption": "I send a postcard to Joachim, with a link written on the back. The link leads to a video of mailing the letter.",
        "cher_joachim_photo": "Photo by Brune de Maurin",
        "csav_caption": "During the XXIX CSAV residency, every day, I added flowers to the statue of Saint John of Nepomuk turning his back to Lake Como.",
        
        // CV Page
        "formation": "Formation",
        "stage_assistance": "Stage / Assistance", 
        "residences_expositions": "Résidences / Expositions",
        "formation_en": "Education",
        "stage_assistance_en": "Internships / Assistance",
        "residences_expositions_en": "Residencies / Exhibitions"
    }
};

function toggleLanguage() {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('language', currentLang);
    updateContent();
    updateToggleButton();
}

function updateContent() {
    // Handle data attributes
    document.querySelectorAll('[data-fr][data-en]').forEach(element => {
        const text = currentLang === 'fr' ? element.getAttribute('data-fr') : element.getAttribute('data-en');
        element.textContent = text;
    });

    // Handle translation keys
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            element.textContent = translations[currentLang][key];
        }
    });
}

function updateToggleButton() {
    const toggle = document.getElementById('langToggle');
    if (toggle) {
        toggle.textContent = currentLang === 'fr' ? 'EN' : 'FR';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateContent();
    updateToggleButton();
});