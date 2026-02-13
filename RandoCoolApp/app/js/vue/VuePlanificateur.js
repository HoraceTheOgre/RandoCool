class VuePlanificateur {
    constructor() {
        this.html = document.getElementById("html-vue-planificateur").innerHTML;
        this.listeRandonnees = [];
        this.randoSelectionnee = null;
        
        this.baseItems = [
            { id: 1, nom: "Bottes de marche", cat: "Vêtements" },
            { id: 2, nom: "Manteau de pluie", cat: "Vêtements" },
            { id: 3, nom: "Trousse de secours", cat: "Équipement" },
            { id: 4, nom: "Lampe frontale", cat: "Équipement" },
            { id: 5, nom: "Collations / Barres", cat: "Nourriture" },
            { id: 6, nom: "Eau", cat: "Nourriture" }
        ];
    }

    afficher() {
        document.body.innerHTML = this.html;
        
        window.app.RandonneeDAO.lister("").then(liste => {
            this.listeRandonnees = liste;
            this.remplirDropdown();
        });

        this.attacherEvenements();
    }

    remplirDropdown() {
        const select = document.getElementById("choix-rando");
        select.innerHTML = '<option value="" disabled selected>Choisir...</option>';
        
        this.listeRandonnees.forEach(rando => {
            const option = document.createElement("option");
            option.value = rando.id;
            option.textContent = rando.nom;
            select.appendChild(option);
        });
    }

    attacherEvenements() {
        document.getElementById("choix-rando").addEventListener("change", () => this.calculerPrevisions());
        document.getElementById("date-depart").addEventListener("change", () => this.calculerPrevisions());

        document.getElementById("btn-vers-step-2").addEventListener("click", () => {
            this.genererListeEquipement(); // Charger la liste mixte ici
            this.changerEtape("step-1", "step-2");
        });
        
        document.getElementById("btn-vers-step-3").addEventListener("click", () => {
            this.afficherRecap();
            this.changerEtape("step-2", "step-3");
        });

        document.getElementById("btn-back-step-1").addEventListener("click", () => this.changerEtape("step-2", "step-1"));
        document.getElementById("btn-back-step-2").addEventListener("click", () => this.changerEtape("step-3", "step-2"));

        document.getElementById("btn-add-item").addEventListener("click", () => this.ajouterItemPerso());
    }

    changerEtape(fromId, toId) {
        document.getElementById(fromId).classList.add("hidden");
        document.getElementById(fromId).classList.remove("active");
        document.getElementById(toId).classList.remove("hidden");
        document.getElementById(toId).classList.add("active");
    }

    calculerPrevisions() {
        const idRando = document.getElementById("choix-rando").value;
        const dateStr = document.getElementById("date-depart").value;

        if (!idRando || !dateStr) return;

        this.randoSelectionnee = this.listeRandonnees.find(r => r.id == idRando);
        if(!this.randoSelectionnee) return;

        const dureeEstimeeMinutes = 180;
        
        const dateDepart = new Date(dateStr);
        const dateRetour = new Date(dateDepart.getTime() + dureeEstimeeMinutes * 60000);
        
        const heureRetour = dateRetour.getHours().toString().padStart(2, '0') + ":" + 
                            dateRetour.getMinutes().toString().padStart(2, '0');

        document.getElementById("calc-retour").textContent = heureRetour;

        let temperature = 20; // À remplacer par API Météo si tu veux
        let besoinEau = (dureeEstimeeMinutes / 60) * 0.5;
        if (temperature > 25) besoinEau *= 1.5;
        
        document.getElementById("calc-eau").textContent = besoinEau.toFixed(1) + " L";
        document.getElementById("prev-temp").textContent = temperature + "°C";

        document.getElementById("resultats-prevision").classList.remove("hidden");
        document.getElementById("btn-vers-step-2").disabled = false;
    }

    genererListeEquipement() {
        const container = document.getElementById("liste-equipement");
        container.innerHTML = "";

        let customItems = JSON.parse(localStorage.getItem("mes_items_rando")) || [];

        const listeComplete = [
            ...this.baseItems.map(i => ({...i, isCustom: false})),
            ...customItems.map(i => ({...i, isCustom: true}))
        ];

        const categories = { "Vêtements": [], "Équipement": [], "Nourriture": [], "Autre": [] };
        
        listeComplete.forEach(item => {
            if (categories[item.cat]) categories[item.cat].push(item);
            else categories["Autre"].push(item);
        });

        for (const [catNom, items] of Object.entries(categories)) {
            if (items.length === 0) continue;

            const catTitle = document.createElement("h4");
            catTitle.textContent = catNom;
            container.appendChild(catTitle);

            items.forEach(item => {
                const div = document.createElement("div");
                div.className = "checklist-item";
                div.innerHTML = `
                    <label>
                        <input type="checkbox" value="${item.nom}" checked>
                        ${item.nom} 
                        ${item.isCustom ? '<span class="tag-perso">(Perso)</span>' : ''}
                    </label>
                `;
                container.appendChild(div);
            });
        }
    }

    ajouterItemPerso() {
        const input = document.getElementById("nouvel-objet");
        const nom = input.value.trim();
        if (!nom) return;

        const newItem = { id: Date.now(), nom: nom, cat: "Autre" };

        let customItems = JSON.parse(localStorage.getItem("mes_items_rando")) || [];
        customItems.push(newItem);
        localStorage.setItem("mes_items_rando", JSON.stringify(customItems));

        input.value = "";
        this.genererListeEquipement();
    }

    afficherRecap() {
        document.getElementById("recap-titre-rando").textContent = this.randoSelectionnee.nom;
        document.getElementById("recap-date").textContent = document.getElementById("date-depart").value.replace("T", " à ");
        document.getElementById("recap-retour").textContent = document.getElementById("calc-retour").textContent;
        document.getElementById("recap-eau").textContent = document.getElementById("calc-eau").textContent;

        // Compter les cases cochées
        const nbItems = document.querySelectorAll("#liste-equipement input:checked").length;
        document.getElementById("recap-items-count").textContent = nbItems;
    }
}
