class VueRandonnee {
  constructor() {
    this.html = document.getElementById("html-vue-randonnee").innerHTML;
    this.randonnee = null;
    this.listeRandonnees = [];
    this.indexActuel = 0;
  }

  initialiserRandonnee(randonnee) {
    this.randonnee = randonnee;
  }

  setListeRandonnees(liste, index) {
    this.listeRandonnees = liste;
    this.indexActuel = index;
  }

  afficher() {
    document.getElementsByTagName("body")[0].innerHTML = this.html;

    this.afficherDetails();
    this.initialiserSwipe();
    this.afficherCarteRandonnee(this.randonnee.latitude, this.randonnee.longitude, this.randonnee.nom);
  }

  afficherDetails() {
    document.getElementById("randonnee-nom").textContent = this.randonnee.nom;
    document.getElementById("randonnee-difficulte").textContent = "Difficulté : " + this.randonnee.difficulte + "/5";
    document.getElementById("randonnee-longueur").textContent = "Longueur : " + this.randonnee.longueur + "km";
    document.getElementById("randonnee-longitude").textContent = "Longitude : " + this.randonnee.longitude;
    document.getElementById("randonnee-latitude").textContent = "Latitude : " + this.randonnee.latitude;
    document.getElementById("randonnee-denivele").textContent = "Dénivelé : " + this.randonnee.denivele + "m";
  }

  initialiserSwipe() {
    const btnLeft = document.querySelector(".swipe-left");
    const btnRight = document.querySelector(".swipe-right");
    const conteneur = document.querySelector(".page-detail");
    let positionDepartX = 0;
    let glissementEnCours = false;
    const SEUIL = 60;

    if (conteneur) {
      conteneur.addEventListener("pointerdown", (evenement) => {
        positionDepartX = evenement.clientX;
        glissementEnCours = true;
      });

      conteneur.addEventListener("pointermove", (evenement) => {
        if (!glissementEnCours) return;
      });

      conteneur.addEventListener("pointerup", (evenement) => {
        if (!glissementEnCours) return;

        const difference = evenement.clientX - positionDepartX;

        if (difference > SEUIL) {
          this.swipeGauche();
        } else if (difference < -SEUIL) {
          this.swipeDroite();
        }

        glissementEnCours = false;
      });
    }

    if (btnLeft) btnLeft.addEventListener("click", () => this.swipeGauche());
    if (btnRight) btnRight.addEventListener("click", () => this.swipeDroite());
  }
  
  swipeGauche() {
    let newIndex = this.indexActuel - 1;
    if (newIndex < this.listeRandonnees[0].id) newIndex = this.listeRandonnees[0].id;
    window.location.hash = "#randonnee/" + newIndex;
  }

  swipeDroite() {
    let newIndex = this.indexActuel + 1;
    if (newIndex > this.listeRandonnees[this.listeRandonnees.length-1].id) newIndex = this.listeRandonnees[this.listeRandonnees.length-1].id;
    window.location.hash = "#randonnee/" + newIndex;
  }

  afficherCarteRandonnee(lat, lon, nom) {
    // Vérifier si Leaflet existe déjà (pour éviter doublons)
    if (typeof L === "undefined") return;

    // S’assurer que l’élément #map existe
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    // Si une ancienne carte existe, on la nettoie
    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    // Initialisation
    const map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Ajouter un marqueur
    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${nom}</b><br>Randonnée ici.`).openPopup();
  }
}
