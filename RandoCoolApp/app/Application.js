class Application {
  constructor(window, RandonneeDAO, vueAccueil, vueListeRandonnee, vueRandonnee, vueMeteo) {
    this.window = window;
    this.RandonneeDAO = RandonneeDAO;
    this.vueAccueil = vueAccueil;
    this.vueListeRandonnee = vueListeRandonnee;
    this.vueRandonnee = vueRandonnee;
    this.vueMeteo = vueMeteo;

    window.app = this;

    if (window.cordova) {
      document.addEventListener("deviceready", () => this.initialiserNavigation(), false);
    } else {
      this.initialiserNavigation();
    }
  }

  initialiserNavigation() {
    console.log("Application-->initialiserNavigation");
    this.window.addEventListener("hashchange", () => this.naviguer());
    this.naviguer();
  }

  naviguer() {
    let hash = window.location.hash;

    if (!hash) {
      this.vueAccueil.afficher();
    }
    else if (hash.match(/^#meteo/)) {
      this.vueMeteo.afficher();
    }
    else if (hash.match(/^#liste-randonnee/)) {
      this.RandonneeDAO.lister("").then((randonnees) => {
        this.vueListeRandonnee.initialiserListeRandonnee(randonnees);
        this.vueListeRandonnee.afficher();
      });
    }
    else {
      let navigation = hash.match(/^#randonnee\/([0-9]+)/);
      if (navigation) {
        let idRandonnee = navigation[1];
        this.RandonneeDAO.chercher(idRandonnee).then((randonnee) => {
          this.vueRandonnee.initialiserRandonnee(randonnee);
          this.RandonneeDAO.lister("").then((listeRandonnee) => {
            this.vueRandonnee.setListeRandonnees(listeRandonnee, parseInt(idRandonnee));
          });
          this.vueRandonnee.afficher();
        });
      }
    }
  }
}

new Application(
  window,
  new RandonneeDAO(),
  new VueAccueil(),
  new VueListeRandonnee(),
  new VueRandonnee(),
  new VueMeteo()
);
