class HikeDAO {
    constructor() {
        this.URL = "https://rando.julienotis.com/";
    }

    lister(filter) {
        const USER = "randocool";
        const PASS = "Maintenanceweb1234!";
        const AUTH = "Basic " + btoa(`${USER}:${PASS}`);

        return fetch(this.URL + "controlleur/rando.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": AUTH,
            },
            body: "filtre=" + encodeURIComponent(filter),
        })
        .then((response) => response.text())
        .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
        .then((xml) => {
            const randos = xml.getElementsByTagName("rando");
            let hikeList = [];
            for (let i = 0; i < randos.length; i++) {
                const r = randos[i];
                let hike = new Hike(
                    r.getElementsByTagName("id")[0].textContent.trim(),
                    r.getElementsByTagName("nom")[0].textContent.trim(),
                    parseFloat(r.getElementsByTagName("longitude")[0].textContent),
                    parseFloat(r.getElementsByTagName("latitude")[0].textContent),
                    parseFloat(r.getElementsByTagName("longueur")[0].textContent),
                    parseFloat(r.getElementsByTagName("denivele")[0].textContent),
                    parseInt(r.getElementsByTagName("difficulte")[0].textContent)
                );
                hikeList.push(hike);
            }
            return hikeList;
        })
        .catch((err) => {
            console.error("Error loading hikes:", err);
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
                "Authorization": AUTH,
            },
            body: "id=" + id,
        })
        .then((response) => response.text())
        .then((str) => {
            try {
                return decodeURIComponent(escape(str));
            } catch (e) {
                return str;
            }
        })
        .then((decodedStr) => new window.DOMParser().parseFromString(decodedStr, "text/xml"))
        .then((xml) => {
            const r = xml.getElementsByTagName("rando")[0];
            if (!r) {
                console.error("Hike not found in XML");
                return null;
            }

            let hike = new Hike(
                r.getElementsByTagName("id")[0].textContent.trim(),
                r.getElementsByTagName("nom")[0].textContent.trim(),
                parseFloat(r.getElementsByTagName("longitude")[0].textContent),
                parseFloat(r.getElementsByTagName("latitude")[0].textContent),
                parseFloat(r.getElementsByTagName("longueur")[0].textContent),
                parseFloat(r.getElementsByTagName("denivele")[0].textContent),
                parseInt(r.getElementsByTagName("difficulte")[0].textContent)
            );

            return hike;
        })
        .catch((err) => {
            console.error("Error fetching hike details:", err);
            return null;
        });
    }
}
