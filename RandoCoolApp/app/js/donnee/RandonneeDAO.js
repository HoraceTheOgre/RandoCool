class RandonneeDAO {
  constructor() {
    this.URL = "https://rando.julienotis.com/";
  }

  lister(filtre) {
    const USER = "randocool";
    const PASS = "Maintenanceweb1234!";

    const AUTH = "Basic " + btoa(`${USER}:${PASS}`);

    return fetch(this.URL + "controlleur/rando.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: AUTH,
      },
      body: "filtre="+encodeURIComponent(filtre),
    })
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((xml) => {
        const randos = xml.getElementsByTagName("rando");
        let listeRando = [];
        for (let i = 0; i < randos.length; i++) {
          const r = randos[i];
          let rando = new Randonnee(
            r.getElementsByTagName("id")[0].textContent,
            r.getElementsByTagName("nom")[0].textContent,
            parseFloat(r.getElementsByTagName("longitude")[0].textContent),
            parseFloat(r.getElementsByTagName("latitude")[0].textContent),
            parseFloat(r.getElementsByTagName("longueur")[0].textContent),
            parseFloat(r.getElementsByTagName("denivele")[0].textContent),
            parseInt(r.getElementsByTagName("difficulte")[0].textContent)
          );
          listeRando.push(rando);
        }
        return listeRando;
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des randonnées :", err);
        return [];
      });
  }

  chercher(id) {
    const USER = "randocool";
    const PASS = "Maintenanceweb1234!";

    const AUTH = "Basic " + btoa(`${USER}:${PASS}`);

    return fetch(this.URL + "controlleur/detail.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: AUTH,
      },
      body: "id=" + id, // SELECT * WHERE id = ?
    })
      .then((response) => response.text())
      .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
      .then((xml) => {
        const r = xml.getElementsByTagName("rando")[0];
        if (!r) {
          console.error("Randonnée introuvable dans le XML");
          return null;
        }

        let rando = new Randonnee(
          r.getElementsByTagName("id")[0].textContent,
          r.getElementsByTagName("nom")[0].textContent,
          parseFloat(r.getElementsByTagName("longitude")[0].textContent),
          parseFloat(r.getElementsByTagName("latitude")[0].textContent),
          parseFloat(r.getElementsByTagName("longueur")[0].textContent),
          parseFloat(r.getElementsByTagName("denivele")[0].textContent),
          parseInt(r.getElementsByTagName("difficulte")[0].textContent)
        );

        return rando;
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération de la randonnée :", err);
        return null;
      });
  }

}
