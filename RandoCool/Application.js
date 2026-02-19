class Application {
  constructor(window, hikeDAO, vueHome, vueListHike, vueHike, vueWeather, vuePlanner, vueMyPlans) {
    this.window = window;
    this.hikeDAO = hikeDAO;


    this.vueHome = vueHome;
    this.vueListHike = vueListHike;
    this.vueHike = vueHike;
    this.vueWeather = vueWeather;
    this.vuePlanner = vuePlanner;
    this.vueMyPlans = vueMyPlans;

    window.app = this;

    if (window.cordova) {
      document.addEventListener("deviceready", () => this.initializeNavigation(), false);
    } else {
      this.initializeNavigation();
    }
  }

  initializeNavigation() {
    console.log("Application-->initializeNavigation");
    this.window.addEventListener("hashchange", () => this.navigate());
    this.navigate();
  }

  navigate() {
    let hash = window.location.hash;

    if (!hash) {
      this.vueHome.display();
    }
    else if (hash.match(/^#planificateur/)) {
      this.vuePlanner.display();
    }
    else if (hash.match(/^#mes-plans/)) {
      this.vueMyPlans.display();
    }
    else if (hash.match(/^#meteo/)) {
      // Was: this.vueMeteo.afficher();
      this.vueWeather.display();
    }
    else if (hash.match(/^#liste-randonnee/)) {
      this.hikeDAO.lister("").then((hikes) => {
        this.vueListHike.initializeList(hikes);
        this.vueListHike.display();
      });
    }
    else {
      let navigation = hash.match(/^#randonnee\/([0-9]+)/);
      if (navigation) {
        let hikeId = navigation[1];

        this.hikeDAO.chercher(hikeId).then((hike) => {
          this.vueHike.initializeHike(hike);

          this.hikeDAO.lister("").then((hikeList) => {
            this.vueHike.setHikeList(hikeList, parseInt(hikeId));
          });
          this.vueHike.display();
        });
      }
    }
  }

  modifyPlan(planId) {
    const plans = JSON.parse(localStorage.getItem("mes_plans")) || [];
    const planToEdit = plans.find(p => p.id === planId);

    if (planToEdit) {
      window.location.hash = "#planificateur";

      setTimeout(() => {
        this.vuePlanner.display();
        this.vuePlanner.loadPlanForModification(planToEdit);
      }, 50);
    }
  }
}

new Application(
  window,
  new HikeDAO(),
  new VueHome(),
  new VueListHike(),
  new VueHike(),
  new VueWeather(),
  new VuePlanner(),
  new VueMyPlans()
);
