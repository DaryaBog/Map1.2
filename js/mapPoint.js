const responseURL = 'https://map-of-pavilions-default-rtdb.asia-southeast1.firebasedatabase.app/points.json'
var myMap
class Point {
    static renderPoints() {
        return fetch(responseURL)
            .then(response => response.json())
            .then(response => {
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
            .then(points => {
                myMap = new ymaps.Map("map", {
                    center: [46.880673, 40.147947],
                    zoom: 15,
                    controls: ['zoomControl']
                })
                points.map(point => {
                    const lan = point.coordinate[0]
                    const lat = point.coordinate[1]
                    var myPlacemark = new ymaps.Placemark([lan, lat], {
                        // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                        balloonContentHeader: point.strits,
                        balloonContentBody: point.status,
                        //balloonContentFooter: point.open ? `<button id="${point.id}" class="btn btn_open">Закрыть водоповильон</button>` : `<button class="btn btn_close">Открыть водоповильон</button>`,
                        hintContent: point.strits
                    }, {
                        preset: 'islands#circleDotIcon',
                        iconColor: point.open ? '#0095b6' : '#a74b4b'
                    })
                    myMap.geoObjects.add(myPlacemark);
                })
            })
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve(`<p class="error">Логин или пароль введены не верно</p>`)
        }
        return fetch(`https://map-of-pavilions-default-rtdb.asia-southeast1.firebasedatabase.app/points.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }
}
