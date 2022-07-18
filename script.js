// global variable
var USER_NAME
var USER_TYPE
var IS_LOG_IN
const URL = "https://script.google.com/macros/s/AKfycbwcnDPXOlbfuW_flSAwYMay7TZ4u0j1EF3PNb47irHZsZFi8FKFySzWHCe0B0EBz7G0/exec"
// nav function

const searchCouponSelector = document.querySelector('.search-coupon-selector')
const createCouponSelector = document.querySelector('.create-coupon-selector')
const createUserSelector = document.querySelector('.create-user-selector')

const searchCoupon = document.querySelector('.search-coupon')
const createCoupon = document.querySelector('.create-coupon')
const userManagement = document.querySelector('.user-management')

const hidePage = () =>{
    searchCoupon.classList.add ('hidden')
    createCoupon.classList.add ('hidden')
    userManagement.classList.add ('hidden')
}
const unselectNav = () =>{
    searchCouponSelector.classList.remove('selected')
    createCouponSelector.classList.remove('selected')
    createUserSelector.classList.remove('selected')
}

searchCouponSelector.addEventListener('click', ()=>{
    if(!searchCouponSelector.classList.contains('selected')){
        unselectNav()
        searchCouponSelector.classList.add('selected');
        hidePage()
        searchCoupon.classList.remove('hidden')
    }
})

createCouponSelector.addEventListener('click', ()=>{
    if(!createCouponSelector.classList.contains('selected')){
        unselectNav()
        createCouponSelector.classList.add('selected');
        hidePage()
        createCoupon.classList.remove('hidden')
    }
})

createUserSelector.addEventListener('click', ()=>{
    if(!createUserSelector.classList.contains('selected')){
        unselectNav()
        createUserSelector.classList.add('selected');
        hidePage()
        userManagement.classList.remove('hidden')
    }
})

// login function

const navList = document.querySelector('.page-selector')
const loginPage = document.querySelector('.login-page')
const userNameInput =document.querySelector('#user-name')
const passwordInput =document.querySelector('#password')

const loginBtn = document.querySelector('#login')
const waitingComponent = document.querySelector('.waiting')
const dangerComponent = document.querySelector('.danger')

userNameInput.addEventListener('input', ()=>{
    dangerComponent.classList.add('hidden')
})
passwordInput.addEventListener('input', ()=>{
    dangerComponent.classList.add('hidden')
})


loginBtn.addEventListener('click', (e)=>{ 
    e.preventDefault()

    // check blank input
    if (!userNameInput.value||!passwordInput.value ){
        dangerComponent.innerHTML = "Nhập đầy đủ username và password"
        dangerComponent.classList.remove('hidden')
        return
    }
    waitingComponent.classList.remove('hidden')
    // send request
    let submitData = {
        "type": "login",
        "data": {
            "user": userNameInput.value,
            "password": passwordInput.value
        }
    }

    fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(submitData) // body data type must match "Content-Type" header
    })
    .then (response => {
        // console.log(response.json())
        
        return response.json()})
    .then (data => {
        waitingComponent.classList.add('hidden')
        console.log (data)
        handleLogin(data);
    }).catch(error => {
        console.error('Error:', error);
    });
})

const handleLogin = (response) => {
    if (response.status === false){
        dangerComponent.innerHTML = "Tên đăng nhập hoặc mật khẩu sai"
        dangerComponent.classList.remove('hidden')
        return
    }
       
    alert ('Đăng nhập thành công')
    USER_NAME = userNameInput.value
    USER_TYPE = response.userType
    IS_LOG_IN = true

    loginPage.classList.add('hidden')
    navList.classList.remove('hidden')
    if(USER_TYPE ==='admin'){
        document.querySelector('.create-user-selector').classList.remove('hidden')
    }
    searchCouponSelector.classList.add('selected');
    searchCoupon.classList.remove('hidden')

}