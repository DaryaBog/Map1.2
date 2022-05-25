const modalAuth = document.querySelector('.modal-auth')
const modalTown = document.querySelector('.modal-town')
const modalInfo = document.querySelector('.modal-info')
//
const modalTownImg = `<img class="modal-town"
src="https://sun2-4.userapi.com/s/v1/if2/1i55gC1oMe0B2ZJGYrwtrUpmezC7tRrO53-P14k0vPqfifY4Spj0tQgcwkyh4eoTOHMI2IXyq_eele_lhlDkMY3k.jpg?size=845x843&quality=96&type=album"
alt="">`
modalTown.addEventListener('click', openModalTown)
function openModalTown() {
    createModal(modalTownImg, 'Населенныйе пункты', getTownForm())
}
//
const modalInfoImg = `<img class="modal-info"
src="https://sun9-78.userapi.com/s/v1/if2/nnbGZ6T_GF1De0hw3equkwGgGnp3I7Xgoie38_8PvhX7Gn5EgF5_yZp0f8i-S_99xUym19kFuZ1LYGpgUkEfK8NS.jpg?size=842x843&quality=96&type=album"
alt="">`
modalInfo.addEventListener('click', openModalInfo)
function openModalInfo() {
    createModal('', 'Информация', getInfoForm())
}
//
modalAuth.addEventListener('click', openModalAuth)
const modalAuthImg = `<img class="modal-auth"
src="https://sun2-10.userapi.com/s/v1/if2/yc3FoUjVVFufXdcp1Siyd1WA-YCKe8seivrgc_5k-kSSKXR7HbCK2bD5NMCkx2B6Y7r0XHuHjx8zHPX3Ya_dPQ_r.jpg?size=848x843&quality=96&type=album"
alt="">`

function openModalAuth() {
    createModal(modalAuthImg, 'Администратор', getAuthForm())

    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, { onse: true })
}

function authFormHandler(event) {
    event.preventDefault()
    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Point.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') createModal(modalAuthImg, 'Ошибка!', content)
    else {
        // если авторизовались и есть точки
        myMap.destroy()
        myMap = new ymaps.Map("map", {
            center: [46.880673, 40.147947],
            zoom: 15,
            controls: ['zoomControl']
        })
        content.map(point => {
            const lan = point.coordinate[0]
            const lat = point.coordinate[1]
            var myPlacemark = new ymaps.Placemark([lan, lat], {
                // Чтобы балун и хинт открывались на метке, необходимо задать ей определенные свойства.
                balloonContentHeader: point.strits,
                balloonContentBody: point.status,
                balloonContentFooter: point.open ? `<button id="${point.id}" class="btn btn_open ${point.open}">Закрыть водоповильон</button>` : `<button id="${point.id}" class="btn btn_close">Открыть водоповильон</button>`,
                hintContent: point.strits
            }, {
                preset: 'islands#circleDotIcon',
                iconColor: point.open ? '#0095b6' : '#a74b4b'
            })
            myMap.geoObjects.add(myPlacemark);
        })

        document.addEventListener('click', event => {
            const btn = event.target.closest('.btn')

            if (btn) {
                if (event.target.closest('.btn_open')) {
                    btn.innerHTML = `Открыть водоповильон`
                    btn.classList.remove('btn_open')
                    btn.classList.add('btn_close')
                    getPoint().then(points => {
                        points.map(point => {
                            if (point.id === event.target.id) {
                                const newPoint = {
                                    coordinate: point.coordinate,
                                    strits: point.strits,
                                    status: `<span class="close"> Закрыто </span>`,
                                    mode: `Режим работы: круглосуточно`,
                                    open: false,
                                }
                                postPoint(newPoint)
                            }
                        })
                    })
                    const API_URL = `https://map-of-pavilions-default-rtdb.asia-southeast1.firebasedatabase.app/points/${event.target.id}.json`
                    fetch(API_URL, {
                        method: 'DELETE',
                    })
                } else {
                    btn.classList.remove('btn_close')
                    btn.classList.add('btn_open')
                    btn.innerHTML = `Закрыть водоповильон`
                    getPoint().then(points => {
                        points.map(point => {
                            if (point.id === event.target.id) {
                                const newPoint = {
                                    coordinate: point.coordinate,
                                    strits: point.strits,
                                    status: `<span class="open"> Открыто </span>`,
                                    mode: `Режим работы: круглосуточно`,
                                    open: true,
                                }
                                postPoint(newPoint)
                            }
                        })
                    })
                    const API_URL = `https://map-of-pavilions-default-rtdb.asia-southeast1.firebasedatabase.app/points/${event.target.id}.json`
                    fetch(API_URL, {
                        method: 'DELETE',
                    })
                }
            }
        })
    }
}



window.addEventListener('load', () => {
    Point.renderPoints()
})

function getPoint() {
    return fetch(responseURL)
        .then(response => response.json())
        .then(response => {
            return response ? Object.keys(response).map(key => ({
                ...response[key],
                id: key
            })) : []
        })
}

function postPoint(point) {
    return fetch(responseURL, {
        method: 'POST',
        body: JSON.stringify(point),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(response => console.log(response))
}

