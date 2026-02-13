class VueListeRandonnee {
    constructor() {
        this.html = document.getElementById("html-vue-liste-randonnee").innerHTML;
        this.listeRandonneeDonnee = null;
        this.cardTemplate = null; 
    }

    initialiserListeRandonnee(listeRandonneeDonnee) {
        this.listeRandonneeDonnee = listeRandonneeDonnee;
    }

    afficher() {
        document.getElementsByTagName("body")[0].innerHTML = this.html;
        let listeContainer = document.getElementById("liste-randonnee-container");
        const templateElement = listeContainer.querySelector(".randonnee-card"); // Peut pas mettre de [0] sinon l'affichage marche pu
        
        if (templateElement) {
            this.cardTemplate = templateElement.outerHTML;
            templateElement.remove(); 
        }

        this.afficherListe(this.listeRandonneeDonnee);
        this.initialiserRecherche();
    }

    afficherListe(listeFiltree) {
        let listeContainer = document.getElementById("liste-randonnee-container");
        console.log(listeFiltree);
        let listeHTML = "";

        if (this.cardTemplate) {
            for (var numero in listeFiltree) {
                let cardHTMLRemplacement = this.cardTemplate;
                cardHTMLRemplacement = cardHTMLRemplacement.replace(/\{Randonnee\.id\}/g, listeFiltree[numero].id);
                cardHTMLRemplacement = cardHTMLRemplacement.replace("{Randonnee.nom}", listeFiltree[numero].nom);
                cardHTMLRemplacement = cardHTMLRemplacement.replace("{Randonnee.difficulte}", listeFiltree[numero].difficulte + "/5");
                cardHTMLRemplacement = cardHTMLRemplacement.replace("{Randonnee.longueur}", listeFiltree[numero].longueur + "km");

                listeHTML += cardHTMLRemplacement;
            }
        }

        listeContainer.innerHTML = listeHTML;
    }

    initialiserRecherche() {
        const entreeRecherche = document.getElementById("search-input");
        if (entreeRecherche) {
            entreeRecherche.addEventListener("input", async (evenement) => {
                const terme = evenement.target.value.toLowerCase();
                let randonneeDAO = new RandonneeDAO(); 
                const listeFiltree = await randonneeDAO.lister(terme);
                this.afficherListe(listeFiltree);
            });
        }
    }
}