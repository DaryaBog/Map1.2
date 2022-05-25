function getAuthForm() {
    return `
    <form class="mui-form" id="auth-form">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="email" id="email" required>
            <label for="email">Логин (email)</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
            <input type="password" id="password" required>
            <label for="password">Пароль</label>
        </div>
        <div class="btn-auth">
        <button 
        type="submit" 
        class="mui-btn mui-btn--raised">
        Войти
        </button>
        </div>
    </form>
    `;
}

function getTownForm() {
    return `
    <div>
        Кагальницкая
    </div>
    <div class="mui-divider"></div>
    `;
}
function getInfoForm() {
    return `
    <div class="info">
        <div class="info__img"><img src="point_open.png" alt=""></div>
        <div class="info__text">Водопавильон</div>
    </div>
    <div class="mui-divider"></div>
    <div class="info">
        <div class="info__img"><img src="point_close.png" alt=""></div>
        <div class="info__text">Водопавильон на техническом обслуживании</div>
    </div>
    `;
}

function authWithEmailAndPassword(email, password) {
    const apiKey = 'AIzaSyDJLvht71XBISh_5X6FIGXOskb3Jus7wqY'
    return fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
        method: "POST",
        body: JSON.stringify({
            email, password,
            returnSecureToken: true
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => data.idToken)
}