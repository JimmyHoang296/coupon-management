// global variable
var USER_NAME
var USER_TYPE
var SITE
var IS_LOG_IN
var DATA
const URL = "https://script.google.com/macros/s/AKfycbzzwANelXMFEZz-23EqLzY5wAEfpOduBUW8YzELdAiGcfHTK-dKxRO57pwOCBzx4cpP/exec"
// nav function

const useServiceSelector = document.querySelector('.use-service-selector')
const searchCouponSelector = document.querySelector('.search-coupon-selector')
const createCouponSelector = document.querySelector('.create-coupon-selector')
const createUserSelector = document.querySelector('.create-user-selector')

const useService = document.querySelector('.use-service')
const searchCoupon = document.querySelector('.search-coupon')
const createCoupon = document.querySelector('.create-coupon')
const userManagement = document.querySelector('.user-management')

const hidePage = () =>{
    useService.classList.add('hidden')
    searchCoupon.classList.add ('hidden')
    createCoupon.classList.add ('hidden')
    userManagement.classList.add ('hidden')
}
const unselectNav = () =>{
    useServiceSelector.classList.remove('selected')
    searchCouponSelector.classList.remove('selected')
    createCouponSelector.classList.remove('selected')
    createUserSelector.classList.remove('selected')
}

useServiceSelector.addEventListener('click', ()=>{
    if(!useServiceSelector.classList.contains('selected')){
        unselectNav()
        useServiceSelector.classList.add('selected');
        hidePage()
        useService.classList.remove('hidden')
    }
})

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


const renderData = (data) => {
    const roomList = data.roomList
    const roomListElement = document.querySelector('.room-list')
    roomListElement.innerHTML = ''
    roomList.forEach (room => {
        [CS,roomID,roomCap,roomType,roomAvail] = room
        roomListElement.innerHTML =  roomListElement.innerHTML + `
                <div class="room-infor">
                    <h3 class="id">Phòng ${roomID}</h3>
                    <h3 class="number">${roomAvail}</h3>
                    <h3 class="type">${roomCap} ${roomType}</h3>
                </div>
        `
    })

    const empList = data.emp
    const empListElement = document.querySelector('.emp-list')
    empListElement.innerHTML = ''
    empList.forEach (emp => { 
        empListElement.innerHTML += `
            <div class="emp-infor">${emp[4]}</div>
        `
    })

    const billList = data.bill
    const billListElement = document.querySelector('.bill-service')
    billListElement.innerHTML = ''
    billList.forEach(bill => {
        if (bill[24] === true) return
        billListElement.innerHTML += `
            <form class="onwork-service">
                <div >
                    <label for="locker">Locker</label>
                    <input type="text" class="locker" value="${bill[2]}" disabled>
                </div>
                <div>
                    <label for="room">Phòng</label>
                    <input type="text" class="room" value="${bill[3]}" disabled>
                </div>
                <div>
                    <label for="service">Dịch vụ</label>
                    <input type="text" class="service" value="${bill[5]}" disabled>
                </div>
                
                <div>
                    <label for="ktv">Kỹ thuật viên</label>
                    <input type="text" class="ktv" value="${bill[7]}" disabled>
                </div>
                <div>
                    <label for="intime">Giờ vào</label>
                    <input type="text" class="intime" value="${bill[8]}" disabled>
                </div>
                <div>
                    <label for="outtime">Giờ ra</label>
                    <input type="text" class="outtime">
                </div>
                <div>
                    <label for="drink">Đồ uống</label>
                    <input type="text" class="drink">
                </div>
                <div>
                    <label for="tip">tip</label>
                    <input type="text" class="tip">
                </div>
            </form>
        `
    })
}

const renderSelectBtn = (targetForm) => {
    const availEmpList = DATA.emp.filter(emp => emp[7] !=='busy')
    const selectEmpElement = targetForm.querySelector('.ktv')
    availEmpList.forEach (emp => {
        selectEmpElement.innerHTML  += `
            <option value='${emp[3]}'>${emp[3]}</option>
        `
    })
    
    const roomList = DATA.roomList.filter(room => room[4]>0)
    const selectRoomElement = targetForm.querySelector('.room')
    roomList.forEach(room => {
        selectRoomElement.innerHTML  += `
        <option value='${room[1]}'>${room[1]}</option>
        `
    })

    const serviceList = DATA.service
    const selectServiceElement = targetForm.querySelector('.service')
    serviceList.forEach(service => {
        selectServiceElement.innerHTML  += `
            <option value='${service[1]}'>${service[1]}</option>
        `
    })
}

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


    renderData(DATA)

    const targetForm = document.querySelector('.user-service-form')
    renderSelectBtn(targetForm)

    loginPage.classList.add('hidden')
    navList.classList.remove('hidden')
    if(USER_TYPE ==='admin'){
        document.querySelector('.create-user-selector').classList.remove('hidden')
    }
    useServiceSelector.classList.add('selected');
    useService.classList.remove('hidden')

}

// create service function
const addCustomer = () => {
    const target = document.querySelector('.btn-group').parentElement
    const newEle = document.createElement('form')
    newEle.classList.add('user-service-form')
    const newForm =`
            <div >
                <label for="locker">Locker</label>
                <input type="text" class="locker">
            </div>
            <div>
                <label for="room">Phòng</label>
                <select name="room" class="room">
                </select>
            </div>
            <div>
                <label for="service">Dịch vụ</label>
                <select name="service" class="service">
                </select>
            </div>
            
            <div>
                <label for="ktv">Kỹ thuật viên</label>
                <select name="ktv" class="ktv">
                </select>
            </div>
            <div>
                <label for="intime">Giờ vào</label>
                <input type="time" class="intime" value = "08:00"
                min="08:00" max="24:00" >
            </div>
        `
    newEle.innerHTML = newForm
    target.insertBefore(newEle, target.firstChild)

    const targetForm = document.querySelector('.user-service-form')
    renderSelectBtn(targetForm)    

}

const addCustomerBtn = document.querySelector('#add-more-service')
addCustomerBtn.addEventListener('click', addCustomer)

const getToday = () =>{
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    return today = dd + '/' + mm + '/' + yyyy;
}

const handleSubmit = () =>{
    renderData(DATA)
}
const submitNewService = () => {
    // get data
    const serviceInfo =[]
    const formList = document.querySelectorAll('.user-service-form')
    const modal = document.querySelector('.modal')
    modal.classList.remove('hidden')
    formList.forEach(form => {
        const locker = form.querySelector('.locker').value
        const room = form.querySelector('.room').value
        const service = form.querySelector('.service').value
        const ktv = form.querySelector('.ktv').value
        const intime = form.querySelector('.intime').value
        const today = getToday()

        const data = Array(20).fill('')
        data[1] = SITE
        data[2] = locker
        data[3] = room
        data[4] = today
        data[5] = service
        data[7] = ktv
        data[8] = intime
        data[17] = USER_NAME
        serviceInfo.push(data)
    })
    // submit
    let submitData = {
        "type": "newService",
        "data": serviceInfo
    }

    fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(submitData) // body data type must match "Content-Type" header
    })
    .then (response => response.json())
    .then (data => {
        console.log (data)
        DATA = data.data
        modal.classList.add('hidden')
        handleSubmit();
    }).catch(error => {
        modal.classList.add('hidden')
        console.error('Error:', error);
    });

}

const createServiceBtn = document.querySelector('#create-service')
createServiceBtn.addEventListener('click', submitNewService)
// end of create service

// search coupon

const handelSearchCoupon = (e) =>{
    e.preventDefault();
    const phoneNo = document.querySelector('.search-coupon input').value
    const couponList = DATA.coupon.filter(coupon => coupon[2].replace(/\s/g,'') === phoneNo.replace(/\s/g,''))
    console.log (couponList)

    const searchResultElement = document.querySelector('.search-result')
    searchResultElement.innerHTML = ''
    couponList.forEach(coupon => {
        searchResultElement.innerHTML  += `
        <div class="coupon-id">
                <label for="coupon-id">Coupon ID: </label>
                <input id="coupon-id" value="${coupon[0]}" readonly/>
            </div>
            <div class="coupon-owner">
                <label for="coupon-owner">Khách hàng: </label>
                <input id="coupon-owner" value="${coupon[1]}" readonly/>
            </div>
            <div class="phone-number">
                <label for="phone-number">Số điện thoại: </label>
                <input id="phone-number" value="${coupon[2].replace(/\s/g,'')}" readonly/>
            </div>
            <div class="coupon-value">
                <label for="coupon-value">Giá trị còn/Tổng: </label>
                <input id="coupon-value" value="${coupon[22]}/${coupon[6]}" readonly/>
            </div>
            <div class="coupon-date">
                <label for="coupon-date">Hạn coupon: </label>
                <input id="coupon-date" value="${coupon[5]}" readonly/>
        </div>
        `
    })

}
const searchCouponBtn = document.querySelector('.search-coupon button')
searchCouponBtn.addEventListener('click',handelSearchCoupon)
// end of search coupon

