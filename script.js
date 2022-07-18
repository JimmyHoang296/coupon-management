// global variable
var USER_NAME
var USER_TYPE
var IS_LOG_IN

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
const dangerComponent = document.querySelector('.danger')
loginBtn.addEventListener('click', (e)=>{ 
    e.preventDefault()

    // check blank input
    if (!userNameInput.value||!passwordInput.value ){
        dangerComponent.innerHTML = "Nhập đầy đủ username và password"
        dangerComponent.classList.remove('hidden')
        return
    }

    // send request

    console.log ('loginnn...')

    let isSuccess = true

    if (!isSuccess){
        console.log ('login fail')
        dangerComponent.innerHTML = "Tên đăng nhập hoặc mật khẩu sai"
        dangerComponent.classList.remove('hidden')
        return
    }
    // Login success

    if(isSuccess){
        console.log ('login success')
        
        alert ('Đăng nhập thành công')
        USER_NAME = userNameInput.value
        USER_TYPE = 'user'
        IS_LOG_IN = true

        loginPage.classList.add('hidden')
        navList.classList.remove('hidden')
        searchCouponSelector.classList.add('selected');
        searchCoupon.classList.remove('hidden')
    }

})