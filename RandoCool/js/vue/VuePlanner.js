class VuePlanner {
    constructor() {
        this.html = document.getElementById("html-vue-planificateur").innerHTML;
        this.hikeList = [];
        this.selectedHike = null;
        this.currentPlanId = null;

        this.baseItems = [
            { id: 1, name: "Bottes de marche", category: "Vêtements" },
            { id: 2, name: "Manteau de pluie", category: "Vêtements" },
            { id: 3, name: "Trousse de secours", category: "Équipement" },
            { id: 4, name: "Lampe frontale", category: "Équipement" },
            { id: 5, name: "Collations / Barres", category: "Nourriture" },
            { id: 6, name: "Eau", category: "Nourriture" }
        ];
    }

    display() {
        document.body.innerHTML = this.html;
        this.currentPlanId = null;

        document.querySelector("header h1").textContent = "Planificateur";
        const btnConfirm = document.getElementById("btn-confirmer-plan");
        if(btnConfirm) btnConfirm.textContent = "C'est parti !";

        if(window.app && window.app.hikeDAO) {
            window.app.hikeDAO.lister("").then(list => {
                this.hikeList = list;
                this.populateDropdown();
            });
        }
        this.attachEvents();
    }

    decodeText(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    populateDropdown() {
        const select = document.getElementById("choix-rando");
        if (!select) return;

        select.innerHTML = '<option value="" disabled selected>Choisir...</option>';

        this.hikeList.forEach(hike => {
            const option = document.createElement("option");
            option.value = hike.id;
            option.textContent = this.decodeText(hike.nom);
            select.appendChild(option);
        });
    }

    attachEvents() {
        const hikeChoice = document.getElementById("choix-rando");
        const departureDate = document.getElementById("date-depart");

        if (hikeChoice) hikeChoice.addEventListener("change", () => this.calculateForecasts());
        if (departureDate) departureDate.addEventListener("change", () => this.calculateForecasts());

        this.bindClick("btn-vers-step-2", () => {
            const container = document.getElementById("liste-equipement");

            if (container.innerHTML.trim() === "") {
                this.generateEquipmentList();
            }

            this.changeStep("step-1", "step-2");
        });

        this.bindClick("btn-vers-step-3", () => {
            this.displayRecap();
            this.changeStep("step-2", "step-3");
        });

        this.bindClick("btn-back-step-1", () => this.changeStep("step-2", "step-1"));
        this.bindClick("btn-back-step-2", () => this.changeStep("step-3", "step-2"));
        this.bindClick("btn-add-item", () => this.addCustomItem());
        this.bindClick("btn-clear-items", () => this.clearCustomItems());

        this.bindClick("btn-confirmer-plan", () => {
            this.savePlan();
        });
    }

    bindClick(elementId, callback) {
        const el = document.getElementById(elementId);
        if (el) el.addEventListener("click", callback);
    }

    changeStep(fromId, toId) {
        document.getElementById(fromId).classList.add("hidden");
        document.getElementById(fromId).classList.remove("active");
        document.getElementById(toId).classList.remove("hidden");
        document.getElementById(toId).classList.add("active");
    }

    loadPlanForModification(plan) {
        console.log("Modification du plan :", plan);
        this.currentPlanId = plan.id;

        // Update Text
        document.querySelector("header h1").textContent = "Modifier le plan";
        const btnConfirm = document.getElementById("btn-confirmer-plan");
        if(btnConfirm) btnConfirm.textContent = "Sauvegarder les modifications";

        this.changeStep("step-3", "step-1");
        this.changeStep("step-2", "step-1");

        const dateInput = document.getElementById("date-depart");
        if(dateInput) dateInput.value = plan.dateRaw;

        const checkDropdown = setInterval(() => {
            const select = document.getElementById("choix-rando");

            // Check if options are loaded
            if (select && select.options.length > 1) {
                clearInterval(checkDropdown);

                // FORCE SELECTION (Handle String vs Number mismatch)
                select.value = plan.idRando.toString();

                // If standard setting failed, try to find it manually
                if (select.selectedIndex === -1 || select.selectedIndex === 0) {
                     for (let i = 0; i < select.options.length; i++) {
                        if (select.options[i].value == plan.idRando) {
                            select.selectedIndex = i;
                            break;
                        }
                    }
                }

                // Trigger calculation to update time/weather
                this.calculateForecasts();

                // Load the checklist items
                this.generateEquipmentList(plan.itemsList);
            }
        }, 100);
    }
    calculateForecasts() {
        const hikeId = document.getElementById("choix-rando").value;
        const fullDateStr = document.getElementById("date-depart").value;

        if (!hikeId || !fullDateStr) return;

        this.selectedHike = this.hikeList.find(r => r.id == hikeId);
        if(!this.selectedHike) return;

        const km = parseFloat(this.selectedHike.longueur) || 0;
        const elevation = parseInt(this.selectedHike.denivele) || 0;

        let estimatedDurationMinutes = (km * 15) + (elevation / 10);

        if (estimatedDurationMinutes < 30) estimatedDurationMinutes = 180;
        estimatedDurationMinutes = Math.round(estimatedDurationMinutes);

        const departureDate = new Date(fullDateStr);
        const returnDate = new Date(departureDate.getTime() + estimatedDurationMinutes * 60000);

        const returnTime = returnDate.getHours().toString().padStart(2, '0') + ":" +
                           returnDate.getMinutes().toString().padStart(2, '0');

        document.getElementById("calc-retour").textContent = returnTime;
        document.getElementById("resultats-prevision").classList.remove("hidden");
        document.getElementById("btn-vers-step-2").disabled = false;

        document.getElementById("prev-temp").textContent = "Chargement...";
        document.getElementById("calc-eau").textContent = "...";

        this.getWeatherAndWater(fullDateStr, estimatedDurationMinutes);
    }

    getWeatherAndWater(fullDateStr, durationMinutes) {
        if (!navigator.geolocation) {
            this.updateWeatherUI("GPS Inconnu", null, durationMinutes);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                const dateOnly = fullDateStr.split("T")[0];

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max&timezone=auto`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (data.daily && data.daily.time) {
                            const index = data.daily.time.indexOf(dateOnly);
                            if (index !== -1) {
                                const tempMax = data.daily.temperature_2m_max[index];
                                this.updateWeatherUI(tempMax + "°C", tempMax, durationMinutes);
                            } else {
                                this.updateWeatherUI("Indisponible", null, durationMinutes);
                            }
                        } else {
                            this.updateWeatherUI("Erreur", null, durationMinutes);
                        }
                    })
                    .catch(err => {
                        this.updateWeatherUI("Erreur", null, durationMinutes);
                    });
            },
            (error) => {
                this.updateWeatherUI("GPS Erreur", null, durationMinutes);
            }
        );
    }

    updateWeatherUI(messageOrTemp, tempValue, durationMinutes) {
        document.getElementById("prev-temp").textContent = messageOrTemp;
        let baseWater = (durationMinutes / 60) * 0.5;
        if (tempValue !== null && tempValue > 25) baseWater *= 1.5;
        document.getElementById("calc-eau").textContent = baseWater.toFixed(1) + " L";
    }

generateEquipmentList(itemsToCheck = null) {
        const container = document.getElementById("liste-equipement");
        if (!container) return;
        container.innerHTML = "";

        let customItems = JSON.parse(localStorage.getItem("mes_items_rando")) || [];

        const fullList = [
            ...this.baseItems.map(i => ({...i, isCustom: false})),
            ...customItems.map(i => ({...i, isCustom: true}))
        ];

        const categories = { "Vêtements": [], "Équipement": [], "Nourriture": [], "Autre": [] };

        fullList.forEach(item => {
            if (categories[item.category]) categories[item.category].push(item);
            else categories["Autre"].push(item);
        });

        for (const [catName, items] of Object.entries(categories)) {
            if (items.length === 0) continue;
            const catTitle = document.createElement("h4");
            catTitle.textContent = catName;
            container.appendChild(catTitle);

            items.forEach(item => {
                const isChecked = itemsToCheck ? itemsToCheck.includes(item.name) : true;

                const div = document.createElement("div");
                div.className = "checklist-item";

                let deleteBtnHtml = "";
                if (item.isCustom) {
                    deleteBtnHtml = `
                        <button class="btn-trash-item" onclick="window.app.vuePlanner.deleteCustomItem(${item.id})">
                             ×
                        </button>
                    `;
                }

                div.innerHTML = `
                    <label style="flex-grow: 1;">
                        <input type="checkbox" value="${item.name}" ${isChecked ? 'checked' : ''}>
                        ${item.name} ${item.isCustom ? '<span class="tag-perso">(Perso)</span>' : ''}
                    </label>
                    ${deleteBtnHtml}
                `;
                container.appendChild(div);
            });
        }
    }

    deleteCustomItem(id) {
        if(!confirm("Supprimer cet item ?")) return;

        const currentChecks = [];
        document.querySelectorAll("#liste-equipement input:checked").forEach(el => {
            currentChecks.push(el.value);
        });

        let customItems = JSON.parse(localStorage.getItem("mes_items_rando")) || [];
        customItems = customItems.filter(i => i.id !== id);
        localStorage.setItem("mes_items_rando", JSON.stringify(customItems));

        this.generateEquipmentList(currentChecks);
    }

    addCustomItem() {
        const input = document.getElementById("nouvel-objet");
        const name = input.value.trim();
        if (!name) return;

        const currentChecks = [];
        document.querySelectorAll("#liste-equipement input:checked").forEach(el => {
            currentChecks.push(el.value);
        });

        currentChecks.push(name);

        const newItem = { id: Date.now(), name: name, category: "Autre" };
        let customItems = JSON.parse(localStorage.getItem("mes_items_rando")) || [];
        customItems.push(newItem);
        localStorage.setItem("mes_items_rando", JSON.stringify(customItems));

        input.value = "";

        this.generateEquipmentList(currentChecks);
    }

    clearCustomItems() {
        if(confirm("Effacer tous vos objets personnalisés ?")) {
            localStorage.removeItem("mes_items_rando");
            this.generateEquipmentList();
        }
    }

    displayRecap() {
        if(this.selectedHike) {
            document.getElementById("recap-titre-rando").textContent = this.decodeText(this.selectedHike.nom);
        }
        const dateValue = document.getElementById("date-depart").value;
        document.getElementById("recap-date").textContent = dateValue.replace("T", " à ");
        document.getElementById("recap-retour").textContent = document.getElementById("calc-retour").textContent;
        document.getElementById("recap-eau").textContent = document.getElementById("calc-eau").textContent;

        const itemCount = document.querySelectorAll("#liste-equipement input:checked").length;
        document.getElementById("recap-items-count").textContent = itemCount;
    }

    savePlan() {
        const checkedItems = [];
        document.querySelectorAll("#liste-equipement input:checked").forEach(el => {
            checkedItems.push(el.value);
        });

        const planData = {
            id: this.currentPlanId ? this.currentPlanId : Date.now(),
            idRando: document.getElementById("choix-rando").value,
            nomRando: document.getElementById("recap-titre-rando").textContent,
            date: document.getElementById("recap-date").textContent,
            dateRaw: document.getElementById("date-depart").value,
            eau: document.getElementById("recap-eau").textContent,
            meteo: document.getElementById("prev-temp").textContent,
            itemsCount: checkedItems.length,
            itemsList: checkedItems
        };

        let savedPlans = JSON.parse(localStorage.getItem("mes_plans")) || [];

        if (this.currentPlanId) {
            const index = savedPlans.findIndex(p => p.id === this.currentPlanId);
            if (index !== -1) {
                savedPlans[index] = planData;
            } else {
                savedPlans.push(planData);
            }
        } else {
            savedPlans.push(planData);
        }

        localStorage.setItem("mes_plans", JSON.stringify(savedPlans));

        this.currentPlanId = null;
        alert("Plan sauvegardé !");
        window.location.hash = "#accueil";
    }
}
