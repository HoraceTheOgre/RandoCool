class VueMyPlans {
    constructor() {
        this.html = document.getElementById("html-vue-mes-plans").innerHTML;
    }

    display() {
        document.body.innerHTML = this.html;
        this.listPlans();
    }

    listPlans() {
        const listContainer = document.getElementById("liste-mes-plans");
        const savedPlans = JSON.parse(localStorage.getItem("mes_plans")) || [];

        if (savedPlans.length === 0) {
            listContainer.innerHTML = "<p>Aucun plan sauvegardé.</p>";
            return;
        }

        let htmlContent = "";

        savedPlans.reverse().forEach(plan => {

            let itemsHtml = "";
            if (plan.itemsList && plan.itemsList.length > 0) {
                plan.itemsList.forEach(item => {
                    itemsHtml += `<li class="plan-item-row">${item}</li>`;
                });
            } else {
                itemsHtml = `<li class="plan-item-row">Détails non disponibles</li>`;
            }

            htmlContent += `
                <div class="card result-card plan-card">
                    <div class="plan-header">
                        <h3 class="plan-title">${plan.nomRando}</h3>
                        <span class="plan-weather">${plan.meteo || "?"}</span>
                    </div>

                    <p class="plan-date"> ${plan.date}</p>

                    <div class="plan-stats">
                        <span class="stat-eau"> ${plan.eau}</span>
                        <span class="stat-items"> ${plan.itemsCount} objets</span>
                    </div>

                    <details class="plan-details-box">
                        <summary>Voir le sac à dos </summary>
                        <ul class="plan-items-list">
                            ${itemsHtml}
                        </ul>
                    </details>

                    <div class="plan-actions">
                        <button class="btn-small btn-modify" onclick="app.modifyPlan(${plan.id})">
                             Modifier
                        </button>

                        <button class="btn-small btn-delete" onclick="app.vueMyPlans.deletePlan(${plan.id})">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        });

        listContainer.innerHTML = htmlContent;
    }

    deletePlan(id) {
        if(!confirm("Supprimer ce plan ?")) return;

        let savedPlans = JSON.parse(localStorage.getItem("mes_plans")) || [];
        savedPlans = savedPlans.filter(p => p.id !== id);

        localStorage.setItem("mes_plans", JSON.stringify(savedPlans));
        this.listPlans();
    }
}
