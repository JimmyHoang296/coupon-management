// global variable
var USER_NAME
var USER_TYPE
var SITE
var IS_LOG_IN
var DATA
var COUPON = {}
const URL = "https://script.google.com/macros/s/AKfycbx7BOLQdpZwTWIPPwstSPHZo9MTSRaC-j2z-2VeViFBRzcreoksZbsB5mmMLGueiQG4/exec"
// nav function

const searchCouponSelector = document.querySelector('.search-coupon-selector')
const createCouponSelector = document.querySelector('.create-coupon-selector')

const searchCoupon = document.querySelector('.search-coupon')
const createCoupon = document.querySelector('.create-coupon')

const hidePage = () =>{
    searchCoupon.classList.add ('hidden')
    createCoupon.classList.add ('hidden')
}
const unselectNav = () =>{
    searchCouponSelector.classList.remove('selected')
    createCouponSelector.classList.remove('selected')
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
        
        return response.json()})
    .then (data => {
        waitingComponent.classList.add('hidden')
        handleLogin(data);
    }).catch(error => {
        console.error('Error:', error);
        alert ('Cập nhật không thành công, hãy thử lại')
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
    DATA = response.data
    SITE = response.user.site

    loginPage.classList.add('hidden')
    navList.classList.remove('hidden')

    searchCouponSelector.classList.add('selected');
    searchCoupon.classList.remove('hidden')

}

const getStrDay = (dateString) =>{ 
    if (dateString.length === 10){return dateString}

    mydate = dateString.slice(0,10)
    const dd = mydate.slice(8,10)
    const mm = mydate.slice(5,7)
    const yyyy = mydate.slice(0,4)

    return (`${dd}/${mm}/${yyyy}`)

}
const compareToday = (dateString) => {
    const today = new Date()
    const mydate = Date.parse(dateString)

    return (today > mydate)
}
// search coupon
const isName = document.querySelector('.search-coupon #isName')

isName.addEventListener('change',()=>{
    const searchText = document.querySelector('.search-coupon #searchText')
    if(isName.checked){
        searchText.placeholder  ="Nhập tên KH"
    }else{
        searchText.placeholder  ="Nhập số ĐT KH"
    }
})
const handleSearchCoupon = () =>{
    const searchText = document.querySelector('.search-coupon #searchText').value
    const isOD = document.querySelector('.search-coupon #isOD').checked
    const isName = document.querySelector('.search-coupon #isName').checked
    var data = isOD? DATA.odCoupon : DATA.coupon
    var couponList
   
    if (isName){
        couponList = data.filter(coupon => coupon.customerName.toUpperCase().includes(searchText.toUpperCase()))
    }else{
        couponList = data.filter(coupon => String(coupon.phoneNumber).replace(/\s/g,'') === searchText.replace(/\s/g,''))
    }

    const searchResultElement = document.querySelector('.search-result')
    searchResultElement.innerHTML = ''
    
    if (couponList.length === 0){
        searchResultElement.innerHTML = '<p class="danger">Không tìm thấy khách hàng</p>'
        
    }
    const couponHistory = (coupon) =>{
        var couponHistoryHtml = ''
        for (let i = 1; i<16;i++){
            if (coupon[i]!==""){
                couponHistoryHtml += `<p>Lần ${i}: ${coupon[i]}</p>`
            }
        }
        return couponHistoryHtml
    }

    couponList.forEach(coupon => {
        searchResultElement.innerHTML = `
        <div class="${compareToday(coupon.endDate)?'out-date':''}">
        ${compareToday(coupon.endDate)?'<p class="danger">Coupon hết hạn</p>':''}
        
        <div class="coupon-id " >
                <label >Coupon ID: </label>
                <input  value="${coupon.couponID}" readonly/>
            </div>
            <div class="coupon-owner">
                <label >Khách hàng: </label>
                <input value="${coupon.customerName}" readonly/>
            </div>
            <div class="phone-number">
                <label >Số điện thoại: </label>
                <input value="${String(coupon.phoneNumber).replace(/\s/g,'')}" readonly/>
            </div>
            <div class="coupon-value">
                <label>Giá trị còn/Tổng: </label>
                <input  value="${coupon.remain}/${coupon.total}" readonly/>
            </div>
            <div class="coupon-date">
                <label >Hạn coupon: </label>
                <input  value="${getStrDay(coupon.endDate)}" readonly/>
        </div>
        <div class="action-btns ${compareToday(coupon.endDate)?'hidden':''}">
        <button class="use-coupon" couponID=${coupon.couponID} couponRemain=${coupon.remain}>Sử dụng Coupon</button>
        </div>
        <div class="use-history">
            ${couponHistory(coupon)}
        </div>
        </div>
        ` + searchResultElement.innerHTML
    })
    const modal = document.querySelector('.use-coupon-value')
    const useBtns = document.querySelectorAll('.action-btns button')
    useBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            modal.classList.remove('hidden')
            COUPON.ID = btn.getAttribute('couponID')
            COUPON.REMAIN = btn.getAttribute('couponRemain')
        })
    })
}
const searchCouponBtn = document.querySelector('.search-coupon button')
searchCouponBtn.addEventListener('click',(e) => {
    e.preventDefault()
    handleSearchCoupon()})
// end of search coupon 

// submit use coupon
const cancelBtn = document.querySelector('.use-coupon-value .cancel')

cancelBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    const modal = document.querySelector('.use-coupon-value')
    modal.classList.add('hidden')
})

const submitBtn = document.querySelector('.use-coupon-value .submit')

submitBtn.addEventListener('click', (e)=>{
    e.preventDefault()
    const modal = document.querySelector('.modal')
    const useCouponValueEle = document.querySelector('.use-coupon-value')
    const value = document.querySelector('.use-coupon-value input').value
    const cautionEle = document.querySelector('.use-coupon-value .danger')
    if (isNaN(value)){
        
        cautionEle.innerHTML = 'Nhập đúng số sử dụng'
        cautionEle.classList.remove('hidden')
        return
    }
    if (value > COUPON.REMAIN*1 ){
        cautionEle.innerHTML = 'Giá trị còn lại không đủ'
        cautionEle.classList.remove('hidden')
        return
    }
    
    let submitData = {
        "type": "change",
        "data": {
            "couponID": COUPON.ID,
            "site": SITE,
            "date": getToday(),
            "time": getTime(),
            "useValue": value
        }
    }
    modal.classList.remove('hidden')
    fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(submitData) // body data type must match "Content-Type" header
    })
    .then (response => {
        
        return response.json()})
    .then (data => {
        modal.classList.add('hidden')
        handleSubmitChange(data);
        useCouponValueEle.classList.add('hidden')
        alert ('Cập nhật thành công')
    }).catch(error => {
        console.error('Error:', error);
        alert ('Cập nhật không thành công, hãy thử lại')
    });
})

const handleSubmitChange = (response) =>{
    DATA = response.data
   handleSearchCoupon()
    
}

// submit new coupon
const createCouponBtn = document.querySelector('#create-coupon')
const inputList = document.querySelectorAll('.create-coupon input')
const cautionEle = document.querySelector('.create-coupon .danger')
const couponID = document.querySelector('#coupon-id')
const couponOwner = document.querySelector('#coupon-owner')
const phoneNumber = document.querySelector('#phone-number')
const couponValue = document.querySelector('#coupon-value')
const couponDate = document.querySelector('#coupon-date')

inputList.forEach(input => {
    input.addEventListener('input', () => {
        if (cautionEle.classList.contains('hidden')) {return}
        cautionEle.classList.add('hidden')
    })
})

createCouponBtn.addEventListener('click', (e)=>{ 
    e.preventDefault()
    const modal = document.querySelector('.modal')

    // validate input
    var date_regex = /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
    if (!(date_regex.test(couponDate.value))) {
        cautionEle.innerHTML = 'Nhập đúng định dạng ngày dd/mm/yyyy'
        cautionEle.classList.remove('hidden')
        return
    }
    if (isNaN(couponValue.value)){
        cautionEle.innerHTML = 'Giá trị coupon phải là số'
        cautionEle.classList.remove('hidden')
        couponValue.value = ''
        return
    }
    if (DATA.coupon.map(coupon=> coupon.couponID).includes(couponID.value)){
        cautionEle.innerHTML = 'Coupon ID đã tồn tại'
        cautionEle.classList.remove('hidden')
        return
    }
    if(couponID.value === ''||
        couponOwner.value === ''||
        phoneNumber.value ===''||
        couponValue.value ===''||
        couponDate.value ===''){

        cautionEle.innerHTML = 'Nhập đủ thông tin trước khi tạo coupon'
        cautionEle.classList.remove('hidden')
        return
    }

// submit
    let submitData = {
        "type": "new",
        "data": {
            "couponID": couponID.value,
            "couponOwner": couponOwner.value,
            "phoneNumber": phoneNumber.value,
            "couponValue": couponValue.value,
            "couponDate": couponDate.value,
            "site": SITE,
            "creator": USER_NAME,
            "createDate": getToday()
        }
    }
    modal.classList.remove('hidden')
    fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(submitData) // body data type must match "Content-Type" header
    })
    .then (response => {
        
        return response.json()})
    .then (data => {
        modal.classList.add('hidden')
        handleSubmitNew(data);
        alert ('Cập nhật thành công')
    }).catch(error => {
        console.error('Error:', error);
        alert ('Cập nhật không thành công, hãy thử lại')
    });

})

const handleSubmitNew = (response) =>{ 
    DATA = response.data
    // switch to searchCoupon page
    searchCoupon.classList.add('selected');
    searchCoupon.classList.remove('hidden')
    createCouponSelector.classList.remove('selected')
    createCoupon.classList.add ('hidden')
    // find coupon to use
    const phoneNo = document.querySelector('.search-coupon input')
    phoneNo.value = phoneNumber.value
    handleSearchCoupon()

    inputList.forEach(input =>input.value ='')


}

const getToday = () =>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today
}

const getTime = () =>{
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    return time
}

// end submit new coupon