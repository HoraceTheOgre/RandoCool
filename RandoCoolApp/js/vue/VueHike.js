class VueHike {
  constructor() {
    this.html = document.getElementById("html-vue-randonnee").innerHTML;
    this.randonnee = null;
    this.listeRandonnees = [];
    this.indexActuel = 0;
  }

  initializeHike(randonnee) {
    this.randonnee = randonnee;
  }

  setHikeList(liste, index) {
    this.listeRandonnees = liste;
    this.indexActuel = index;
  }

  display() {
    document.getElementsByTagName("body")[0].innerHTML = this.html;

    this.showDetails();
    this.initializeSwipe();
    this.showHikeMap(this.randonnee.latitude, this.randonnee.longitude, this.randonnee.nom);
  }

  showDetails() {
    document.getElementById("randonnee-nom").textContent = this.randonnee.nom;
    document.getElementById("randonnee-difficulte").textContent = "Difficulté : " + this.randonnee.difficulte + "/5";
    document.getElementById("randonnee-longueur").textContent = "Longueur : " + this.randonnee.longueur + "km";
    document.getElementById("randonnee-longitude").textContent = "Longitude : " + this.randonnee.longitude;
    document.getElementById("randonnee-latitude").textContent = "Latitude : " + this.randonnee.latitude;
    document.getElementById("randonnee-denivele").textContent = "Dénivelé : " + this.randonnee.denivele + "m";
  }

  initializeSwipe() {
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
          this.swipeLeft();
        } else if (difference < -SEUIL) {
          this.swipeRight();
        }

        glissementEnCours = false;
      });
    }

    if (btnLeft) btnLeft.addEventListener("click", () => this.swipeLeft());
    if (btnRight) btnRight.addEventListener("click", () => this.swipeRight());
  }
  
  swipeLeft() {
    let newIndex = this.indexActuel - 1;
    if (newIndex < this.listeRandonnees[0].id) newIndex = this.listeRandonnees[0].id;
    window.location.hash = "#randonnee/" + newIndex;
  }

  swipeRight() {
    let newIndex = this.indexActuel + 1;
    if (newIndex > this.listeRandonnees[this.listeRandonnees.length-1].id) newIndex = this.listeRandonnees[this.listeRandonnees.length-1].id;
    window.location.hash = "#randonnee/" + newIndex;
  }

  showHikeMap(lat, lon, nom) {
    if (typeof L === "undefined") return;

    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    if (mapContainer._leaflet_id) {
      mapContainer._leaflet_id = null;
      mapContainer.innerHTML = "";
    }

    const map = L.map("map").setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([lat, lon]).addTo(map).bindPopup(`<b>${nom}</b><br>Randonnée ici.`).openPopup();
  }
}
