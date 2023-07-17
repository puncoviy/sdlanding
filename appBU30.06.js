const unfocusableElems = document.querySelectorAll('button, input, textarea');
unfocusableElems.forEach(el => {
    el.setAttribute('tabindex', '-1')
});
console.log(window.visualViewport.height)
const mainPlug = document.querySelector('.sd__main-plug')
const mainInner = document.querySelector('.sd__main-inner')

let enterBtn = document.querySelector('.sd__btn[onclick="startStep()"]')
let isInCityInput = false
let lastCityInList = null

const firstScreen = document.querySelector('.sd__firstscreen')
const mainWrapper = document.querySelector('.sd__main')
const btns = document.querySelector('.sd__btns')
const footer = document.querySelector('.sd__footer')
const percentBoxes = document.querySelectorAll('.sd__step-chance .sd__step-percent')
const textInputs = document.querySelectorAll('input[type="text"]:not([onblur])')
const mobileVH = window.visualViewport.height <= 660
const selectBody = document.querySelector('.select__body')
let phoneNavBtns = null

window.onload = function() {
    mainPlug.classList.remove('_active')
    mainInner.classList.add('_active')
    phoneAdapt()
}

// обработчик клика по Enter
document.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.keyCode === 13) {
        if (isInCityInput) {
            if (lastCityInList) {
                lastCityInList.click()
            } else
            if (focusedCity) {
                focusedCity.click()
            }
        }
        if (phoneNavBtns && document.activeElement.getAttribute('onblur') === 'checkOnError(this)' && currentFillPercent >= 98) {
            document.activeElement.blur()
            window.scroll(0, 0)
        }
        setTimeout(() => {
            enterBtn.click()
        }, 10)
        document.activeElement.blur()
        enterBtn = nextStepBtn
    }
})

// выбор города по клавишам вверх-вниз
let focusedCity = null
let focusedCityIndex = 0
let focusCityInited = false
function cityNavigate(e) {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault()

        const cityWrapper = document.querySelector('.select__body')
        const wrapperBottom = cityWrapper.getBoundingClientRect().bottom;
        const wrapperTop = cityWrapper.getBoundingClientRect().top;
        const activeCityArr = document.querySelectorAll('.select__item[style="display: flex"]').length > 0
            ? document.querySelectorAll('.select__item[style="display: flex"]')
            : cityArr

        if (e.code === 'ArrowUp') {
            activeCityArr[focusedCityIndex] && activeCityArr[focusedCityIndex].classList.remove('_hover')
            if (activeCityArr[focusedCityIndex - 1]) {
                focusedCity = activeCityArr[focusedCityIndex - 1]
                focusedCity.classList.add('_hover')
                scrollWrapper(focusedCity)
            }
            focusedCityIndex > 0 && focusedCityIndex --
        }

        if (e.code === 'ArrowDown') {
            if (!focusCityInited) {
                focusedCity = activeCityArr[0]
                focusedCity.classList.add('_hover')
                focusCityInited = true
            } else {
                // scrollWrapper(activeCityArr[focusedCityIndex])
                activeCityArr[focusedCityIndex - 1] && activeCityArr[focusedCityIndex - 1].classList.remove('_hover')

                if (activeCityArr[focusedCityIndex]) {
                    focusedCity = activeCityArr[focusedCityIndex]
                    focusedCity.classList.add('_hover')
                    scrollWrapper(focusedCity)
                }

                focusedCityIndex < activeCityArr.length && focusedCityIndex ++
            }
        }

        function scrollWrapper(el) {
            const elementBottom = el.getBoundingClientRect().bottom;
            const elementTop = el.getBoundingClientRect().top;
            const distanceToBottom = wrapperBottom - elementBottom;
            const distanceToTop = elementTop - wrapperTop;

            if (distanceToBottom < 10) {
                cityWrapper.scrollBy(0, 48);
            } else
            if (distanceToTop < 10) {
                cityWrapper.scrollBy(0, -48);
            }
        }

    }
}

// клик по кнопке "Рассчитать"
function startStep() {
    const checkmarkBox = document.querySelector('.sd_main-decor__checkmarkbox')
    const mainInner = document.querySelector('.sd__main-inner')
    const firstStep = document.querySelector('.sd__step[data-step="1"]')
    const header = document.querySelector('.sd__header')

    checkmarkBox.classList.remove('_hidden')
    checkmarkBox.classList.add('_active')
    setTimeout(() => {
        mobileVH && header.classList.add('_inactive')

        mainInner.classList.add('_completed')
    }, 1000)
    setTimeout(() => {
        mainInner.classList.remove('_active')
        firstStep.classList.add('_active')
        if (phoneNavBtns) {
            firstScreen.after(phoneNavBtns)
            firstScreen.style.minHeight = '100svh'
            mainWrapper.style.paddingBottom = '0'
            mainPlug.style.top = '-20px'
            mainPlug.style.bottom = '0'
            footer.remove()
            if (mobileVH) {
                header.remove()
                selectBody.style.maxHeight = 'calc(100svh - 480px)'
            }
        }
    }, 1500)

    enterBtn = nextStepBtn
}

// изменение bgc для слайдера

const debtSlider = document.querySelector(".sd__step-range input")
const debtText = document.querySelector(".sd__step-summ")

const debtHatchBox = debtSlider.nextElementSibling
const debtHatches = debtHatchBox.querySelectorAll('span')

const minVal = debtSlider.getAttribute('min')
const maxVal = debtSlider.getAttribute('max')

const summaryTotal = document.querySelector('.sd_step-summary__total')
const summaryAvailable = document.querySelector('.sd_step-summary__available')
const summaryPercent = document.querySelector('.sd_step-summary__percent')

const nextStepBtn = document.querySelector('.sd__step-questions .sd__btn')
const prevStepBtn = document.querySelector('.sd__step-questions .sd__prev')

const questions = document.querySelectorAll('.sd__step-questionbox')
let questionNumber = document.querySelector('.sd__step-total span')
let questionCounter = questionNumber.parentNode

const lastStep = document.querySelector('.sd__step-questionbox[data-step="11"]')
const lastStepCheckmark = document.querySelector('.sd_step-summary__completed')

let currentFillPercent = 10

const lastStepInputs =  document.querySelectorAll('.sd__step-input input[id^="sd-"]')

function debtRangeSet() {
    const percent = debtSlider.value / maxVal * 100
    let res
    let stringRes

    if (percent < 33.34) {
        debtHatches[1].classList.remove('_green')
        debtHatches[2].classList.remove('_green')
        res = Math.round(+debtSlider.value * 1000)
        stringRes = res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    } else
    if (percent > 33.34 && percent <= 66.66) {
        debtHatches[1].classList.add('_green')
        debtHatches[2].classList.remove('_green')
        const minRatio = 1000
        const maxRatio = 1666
        const ratioStep = (maxRatio - minRatio) / 300
        const ratioMultiplier = +debtSlider.value - 300
        res = Math.round((+debtSlider.value * (minRatio + ratioStep * ratioMultiplier))/10000) * 10000
        stringRes = res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    } else
    if (percent > 66.66) {
        debtHatches[1].classList.add('_green')
        debtHatches[2].classList.add('_green')
        const minRatio = 1666
        const maxRatio = 5555
        const ratioStep = (maxRatio - minRatio) / 300
        const ratioMultiplier = +debtSlider.value - 600
        res = Math.round((+debtSlider.value * (minRatio + ratioStep * ratioMultiplier))/100000) * 100000
        stringRes = res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    }

    debtText.value = stringRes
    summaryTotal.innerText = stringRes
    summaryAvailable.innerText = (res/2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    debtSlider.setAttribute('data-sum', res)
    debtSlider.style.background = `linear-gradient(to right, #54B268 ${percent}%, #EAEAEA ${percent}%)`
    nextStepBtn.setAttribute('data-available', res/2)
    prevStepBtn.setAttribute('data-available', res/2)
    nextStepBtn.setAttribute('data-step', res/20)
    prevStepBtn.setAttribute('data-step', res/20)
}
debtRangeSet()

// изменение суммы долга в текстовом инпуте
function debtSummSet(input) {
    if (input.value === '.' || input.value === ',') {
        input.value = ''
        return
    }
    if (input.value[0] === '0') input.value = input.value.slice(1)

    const minValue = 10000
    const minRange = 10
    const step1Value = 300000
    const step1Range = 300
    const step2Value = 1000000
    const step2Range = 600
    const step3Value = 5000000
    const stepsPerRange = 300
    const currentValue = input.value.replace(/[^-0-9]/g, '').replace(/(\..*)\./g, '$1').replace(/[\s-]/g, '')

    if (currentValue <= minValue) {
        debtSlider.value = minRange
    } else
    if (currentValue > minValue && currentValue <= step1Value) {
        debtSlider.value = currentValue / (step1Value / stepsPerRange)
    } else
    if (currentValue > step1Value && currentValue <= step2Value) {
        debtSlider.value = step1Range + ((currentValue - step1Value) / ((step2Value - step1Value) / stepsPerRange))
    } else
    if (currentValue > step2Value) {
        debtSlider.value = step2Range + ((currentValue - step2Value) / ((step3Value - step2Value) / stepsPerRange))
    }

    // заполняем штрихи слайдера
    const fillPercent = debtSlider.value / maxVal * 100
    if (fillPercent < 33.34) {
        debtSlider.setAttribute('data-sum', currentValue)
        debtHatches[1].classList.remove('_green')
        debtHatches[2].classList.remove('_green')
    } else
    if (fillPercent > 33.34 && fillPercent <= 66.66) {
        debtHatches[1].classList.add('_green')
        debtHatches[2].classList.remove('_green')
    } else
    if (fillPercent > 66.66) {
        debtHatches[1].classList.add('_green')
        debtHatches[2].classList.add('_green')
    }
    debtSlider.style.background = `linear-gradient(to right, #54B268 ${fillPercent}%, #EAEAEA ${fillPercent}%)`

    // debtSlider.value = currentValue
    // debtRangeSet()
    const stringRes = currentValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    if (currentValue < 10000) {
        summaryTotal.innerText = '10 000 ₽'
        summaryAvailable.innerText = '5 000 ₽'
    } else
    if (currentValue >= 10000 && currentValue < 5000000) {
        summaryTotal.innerText = stringRes
        summaryAvailable.innerText = (currentValue/2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽'
    } else {
        summaryTotal.innerText = '5 000 000 ₽'
        summaryAvailable.innerText = '2 500 000 ₽'
    }
    input.value = stringRes.slice(0, -2)

    nextStepBtn.setAttribute('data-available', currentValue/2)
    prevStepBtn.setAttribute('data-available', currentValue/2)
    nextStepBtn.setAttribute('data-step', currentValue/20)
    prevStepBtn.setAttribute('data-step', currentValue/20)
}

// фокус/расфокус инпута суммы долга
function debtSummRemoveSymbol(input) {
    input.value = input.value.slice(0, -2)
}
function debtSummAddSymbol(input) {
    const inputNumber = +input.value.replace(/\s/g, '')
    if (input.value.length > 0 && inputNumber > 10000) {
        if (inputNumber > 5000000) {
            input.value = '5 000 000 ₽'
        } else {
            input.value = input.value + ' ₽'
        }
    }
    else {
        input.value = '10 000 ₽'
    }

    // адаптив
    if (phoneNavBtns) blurIt(input)
}

// убираем _disabled с кнопки "Далее"
async function removeDisabled(input) {
    const disabled = document.querySelector('.sd__btn[onclick^="nextStep"]')

    const inputType = input.getAttribute('type')
    switch (inputType) {
        case 'radio':
            nextStepBtn.classList.remove('_disabled')
            nextStepBtn.classList.add('_loading')
            nextStepBtn.click()
            break

        case 'checkbox':
            const stepWrapper = input.closest('.sd__step-questionwrapper')
            const checkedInputs = stepWrapper.querySelectorAll('input:checked')
            if (checkedInputs.length === 0) {
                disabled.classList.add('_disabled')
            } else {
                disabled.classList.remove('_disabled')
            }
            break

        case 'text':
            const cityAttr = input.getAttribute('city')

            if (cityAttr) {
                disabled.classList.remove('_disabled')
            } else {
                disabled.classList.add('_disabled')
            }
            break
    }
}

 // переключение между формами по кнопке "Далее"
function nextStep(btn, step) {
    if (btn.classList.contains('_disabled')) return
    const dataAvailable = +btn.getAttribute('data-available')
    const dataStep = +btn.getAttribute('data-step')
    const prevBtn = btn.previousElementSibling

    const currentQuestion = questions[+step - 1]
    const nextQuestion = questions[+step]

    btn.classList.add('_disabled')

    switch (step) {
        case 1:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 5, '%')
            currentFillPercent += 5
            break

        case 2:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 5, '%')
            currentFillPercent += 5
            break

        case 3:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 5, '%')
            currentFillPercent += 5
            break

        case 4:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 5, '%')
            currentFillPercent += 5
            break

        case 5:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 7, '%')
            currentFillPercent += 7
            break

        case 6:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 7, '%')
            currentFillPercent += 7
            break

        case 7:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 7, '%')
            currentFillPercent += 7
            break

        case 8:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 7, '%')
            currentFillPercent += 7
            break

        case 9:
            document.removeEventListener('keydown', cityNavigate)
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 10, '%')
            currentFillPercent += 10
            break

        case 10:
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent + 10, '%')
            if (phoneNavBtns) {
                lastStepInputs[0].setAttribute('tabindex', 2)
                lastStepInputs[1].setAttribute('tabindex', 1)
                lastStepInputs[2].setAttribute('tabindex', 3)
            } else {
                lastStepInputs.forEach((input, index) => input.setAttribute('tabindex', index + 1))
            }
            currentFillPercent += 10
            nextStepBtn.innerHTML = `<span>Завершить расчет</span>`
            lastStep.style.display = 'flex'
            break

        case 11:
            break

        default:
            break
    }

    if (step === 11) {
        btn.classList.add('_loading')
        prevStepBtn.classList.add('_disabled')
        setTimeout(() => {
            mainPlug.classList.add('_active')
            if (phoneNavBtns) {
                currentQuestion.classList.remove('_active')
                currentQuestion.classList.add('_completed')
                phoneNavBtns.remove()
            }
        }, 500)
        return
    }

    setTimeout(() => {
        document.addEventListener('click', preventClick)
    }, 10)

    btn.classList.add('_loading')
    animateCounter(summaryAvailable, dataAvailable, dataAvailable + dataStep, ' ₽')

    setTimeout(() => {
        // проверяем следующий вопрос на наличие ответа
        const nextQuestionChecked = nextQuestion.querySelector('input:checked')
        const nextQuestionAnswer =  nextQuestion.querySelector('input[type="text"]')

        if (nextQuestionChecked) {
            btn.classList.remove('_disabled')
        } else
        if (nextQuestionAnswer && nextQuestionAnswer.value.length > 0) {
            if (step !== 10) {
                btn.classList.remove('_disabled')
            } else
            if (step === 10) {
                currentFillPercent >= 98 ? btn.classList.remove('_disabled') : btn.classList.add('_disabled')
            }
        }

        prevBtn.classList.add('_active')
        btn.classList.remove('_loading')
        currentQuestion.classList.remove('_active')
        currentQuestion.classList.add('_completed')
        nextQuestion.classList.add('_active')

        if (+step === 10) {
            questionCounter.innerText = `Последний шаг`
            lastStepCheckmark.classList.add('_active')
        } else {
            questionNumber.setAttribute('data-step', +step + 1)
        }

        document.removeEventListener('click', preventClick)
    }, 500)

    btn.setAttribute('data-available', dataStep + dataAvailable)
    prevBtn.setAttribute('data-available', dataStep + dataAvailable)
    btn.setAttribute('onclick', `nextStep(this, ${+step + 1})`)
    prevBtn.setAttribute('onclick', `prevStep(this, ${+step + 1})`)

    function preventClick(e) {
        console.log('click')
        e.preventDefault()
    }
}

// переключение на предыдущую форму
function prevStep(btn, step) {
    if (btn.classList.contains('_disabled')) return

    const dataAvailable = +btn.getAttribute('data-available')
    const dataStep = +btn.getAttribute('data-step')

    nextStepBtn.classList.add('_loading')
    nextStepBtn.classList.add('_disabled')
    btn.classList.add('_disabled')

    animateCounter(summaryAvailable, dataAvailable, dataAvailable - dataStep, ' ₽')

    switch (step) {
        case 2 :
            setTimeout(() => {
                btn.classList.remove('_active')
            }, 500)
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 5, '%')
            currentFillPercent -= 5
            break

        case 3 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 5, '%')
            currentFillPercent -= 5
            break

        case 4 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 5, '%')
            currentFillPercent -= 5
            break

        case 5 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 5, '%')
            currentFillPercent -= 5
            break

        case 6 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 7, '%')
            currentFillPercent -= 7
            break

        case 7 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 7, '%')
            currentFillPercent -= 7
            break

        case 8 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 7, '%')
            currentFillPercent -= 7
            break

        case 9 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 7, '%')
            currentFillPercent -= 7
            break

        case 10 :
            document.addEventListener('keydown', cityNavigate)
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 10, '%')
            currentFillPercent -= 10
            break

        case 11 :
            animateCounter(summaryPercent, currentFillPercent, currentFillPercent - 10, '%')
            lastStepInputs.forEach(input => input.setAttribute('tabindex', -1))
            currentFillPercent -= 10
            nextStepBtn.innerHTML = `<span>Далее</span>`
            lastStepCheckmark.classList.remove('_active')
            setTimeout(() => {
                lastStep.style.display = 'none'
            }, 500)
            break

    }

    setTimeout(() => {
        nextStepBtn.classList.remove('_loading')
        questions[+step - 1].classList.remove('_active')
        questions[+step - 2].classList.remove('_completed')
        questions[+step - 2].classList.add('_active')
        if (+step === 11) {
            // const questionCounter = questionNumber.parentNode
            questionCounter.innerHTML = `Шаг <span data-step="10"></span> из 10`
            questionNumber = questionCounter.querySelector('span')
        } else {
            questionNumber.setAttribute('data-step', +step - 1)
        }
        nextStepBtn.classList.remove('_disabled')
        btn.classList.remove('_disabled')
    }, 500)

    btn.setAttribute('data-available', dataAvailable - dataStep)
    nextStepBtn.setAttribute('data-available', dataAvailable - dataStep)
    btn.setAttribute('onclick', `prevStep(this, ${+step - 1})`)
    nextStepBtn.setAttribute('onclick', `nextStep(this, ${+step - 1})`)
}

// анимация цифр
let animationSpeed = 500;

function animateCounter(el, start, end, symbol) {
    start = +start
    end = +end
    let steps = end - start
    let nextStepFunc = false
    if (steps > 0) nextStepFunc = true

    steps = Math.abs(steps)
    const isSum = steps >= 10000
    if (isSum) steps /= 1000
    const timeoutStep = animationSpeed / steps

    if (isSum && nextStepFunc) {
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                el.innerText = Math.round(start + i * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + symbol
            }, (timeoutStep * i))
        }
    } else
    if (isSum && !nextStepFunc) {
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                el.innerText = Math.round(start - i * 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + symbol
            }, (timeoutStep * i))
        }
    } else
    if (!isSum && nextStepFunc) {
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                el.innerText = Math.round(start + i) + symbol
            }, (timeoutStep * i))
        }
    } else {
        for (let i = 1; i <= steps; i++) {
            setTimeout(() => {
                el.innerText = Math.round(start - i) + symbol
            }, (timeoutStep * i))
        }
    }

    if (el.classList.contains('sd_step-summary__available')) {
        setTimeout(() => {
            el.innerText = Math.round(end).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + symbol
        }, animationSpeed)
    }
}

// последний шаг - валидация инпутов
const phoneMask = IMask(
    document.getElementById('sd-phone'), {
        mask: '+{7}(#00)000-00-00',
        definitions: {
            '#': /[1-69]/
        }
    }
)

function validateEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
}

// последний шаг - пересчет процентов вероятнсоти списания
function inputPercentRecalc(input) {
    const dataPercent = input.getAttribute('data-percent')
    const inputBox = input.closest('.sd__step-inputbox')
    const percentIsFilled = input.getAttribute('data-filled')

    inputBox.classList.remove('_error')

    if (input.value !== '') {
        if (input.id === 'sd-mail') {
            if (!validateEmail(input.value)) {
                percentIsFilled === 'true' && removePercent()
                actualFillCheck()
                return
            }
        } else
        if (input.id === 'sd-phone') {
            if (input.value.length < 16) {
                percentIsFilled === 'true' && removePercent()
                actualFillCheck()
                return
            }
        }

        percentIsFilled === 'false' && addPercent()
        actualFillCheck()
    } else {
        percentIsFilled === 'true' && removePercent()

        if (inputBox.classList.contains('_required')) {
            inputBox.classList.add('_error')
        }
    }

    function actualFillCheck() {
        if (currentFillPercent >= 98) {
            nextStepBtn.classList.remove('_disabled')
        } else {
            nextStepBtn.classList.add('_disabled')
        }
    }

    function addPercent() {
        animateCounter(summaryPercent, currentFillPercent, currentFillPercent + +dataPercent, '%')
        currentFillPercent += +dataPercent

        input.setAttribute('data-filled', true)
    }

    function removePercent() {
        animateCounter(summaryPercent, currentFillPercent, currentFillPercent - +dataPercent, '%')
        currentFillPercent -= +dataPercent

        input.setAttribute('data-filled', 'false')
    }
}

// проверяем инпуты на заполненность
function checkOnError(input) {
    const inputBox = input.closest('.sd__step-inputbox')

    if (input.id === 'sd-mail') {
        if (input.value !== '' && !validateEmail(input.value)) {
            inputBox.classList.add('_error')
        }
    } else
    if (input.id === 'sd-phone') {
        if (input.value.length < 16) {
            inputBox.classList.add('_error')
        }
    } else {
        if (input.value === '') {
            inputBox.classList.add('_error')
        }
    }

    // mobileVH && blurIt(input)

    // mobileVH && window.scrollBy({
    //     top: document.body.scrollHeight,
    //     left: 0,
    //     behavior: 'instant'
    // })
}

// убираем _error по фокусу на инпуте последнего шага
function removeError(input) {
    phoneNavBtns && input.scrollIntoView()

    const wrapper = input.closest('.sd__step-inputbox')
    wrapper.classList.remove('_error')
}












// SELECT

function removeCity() {
    isInCityInput = false
    if (!window.event.target.closest('.select__inner')) {
        const el = document.querySelector('#city-select')
        console.log('city-remove')
        if ($(el).attr('city') === '') {
            $(el).val('')
        } else {
            $(el).val($(el).attr('city'))
        }
        $(el).closest('.select').removeClass('_active')
        el.blur()
        document.removeEventListener('click', removeCity)
    }
}

// function removeOnEnter() {
//     if (window.event.key === 'Enter') {
//         removeCity()
//         document.removeEventListener('keydown', removeOnEnter)
//     }
// }
// фокус на инпуте выбора города
function focusIt(el) {
    const select = el.closest('.select')
    const selectItem = select.querySelectorAll('.select__item')

    isInCityInput = true

    el.select()

    selectItem.forEach(item => item.removeAttribute('style'))
    select.classList.add('_active')

    setTimeout(() => {
        document.addEventListener('click', removeCity)
        document.addEventListener('keydown', cityNavigate)
        // document.addEventListener('keydown', removeOnEnter)
    }, 100)
}

// выбор города (клик по элементу селекта)
function chooseIt(el) {
    const select = el.closest('.select'),
        input = select.querySelector('input'),
        text = el.textContent

    input.value = text
    input.setAttribute('city', text)
    select.classList.remove('_active')
    removeCity()
    removeDisabled(input)
    document.removeEventListener('click', removeCity)
}

// поиск в инпуте выбора города
const cityArr = document.querySelectorAll('.select__item')
const cityNamesArr = []

cityArr.forEach(item => {
    cityNamesArr.push(item.textContent.toLowerCase())
})

function searchIt(el) {
    // сбрасываем активный город после навигации кнопками
    focusedCityIndex = 0
    if (focusedCity) {
        focusedCity.classList.remove('_hover')
        focusedCity = null
    }

    const inputValue = el.value.toLowerCase()

    const inputIsEnglish = /^[А-ЯЁа-яё1-9]+$/
    if (inputValue !== '' && !inputIsEnglish.test(inputValue)) {
        el.placeholder = 'Смените раскладку клавиатуры ⌨️ 👈'
    } else {
        el.placeholder = 'Начните вводить город'
    }


    let relevantCounter = 0
    let identicalCity = ''

    lastCityInList = null

    nextStepBtn.classList.add('_disabled')
    cityNamesArr.forEach((item, index) => {
        if (item === inputValue) {
            console.log(item)
            identicalCity = item
            relevantCounter ++
            nextStepBtn.classList.remove('_disabled')
        } else {
            if (item.includes(inputValue)) {
                // cityArr[index].style.display = 'flex'
                // cityArr[index].classList.remove('_hidden')
                cityArr[index].setAttribute('style', 'display: flex')
                relevantCounter ++
            } else {
                // cityArr[index].style = 'display:none'
                // cityArr[index].classList.add('_hidden')
                cityArr[index].setAttribute('style', 'display: none')
            }
        }
    })

    if (relevantCounter === 0) {
        el.value = ''
        cityArr.forEach((city) => city.removeAttribute('style'))
    } else if (relevantCounter === 1) {
        if (window.event.inputType === 'deleteContentBackward') return
        nextStepBtn.classList.remove('_disabled')
        lastCityInList = document.querySelector('.select__item[style="display: flex"]')
        el.setAttribute('city', lastCityInList.textContent)
        return
    }

    el.setAttribute('city', identicalCity)
}








// адаптив

function phoneAdapt() {
    const vw = window.visualViewport.width
    if (vw > 1024) return

    mainInner.append(enterBtn)
    phoneNavBtns = btns

    percentBoxes.forEach(btn => {
        btn.setAttribute('onclick', 'showPercentHint(this)')
    })

    textInputs.forEach(input => {
        input.setAttribute('onblur', 'blurIt(this)')
    })
}

// показать подсказку над процентом
function showPercentHint(btn) {
    setTimeout(() => {
        document.addEventListener('click', hidePercentHint)
    }, 200)

    function hidePercentHint() {
        document.removeEventListener('click', hidePercentHint)
    }
}

// блюр инпута городов
function blurIt(input) {
    setTimeout(() => {
        window.scroll(0, document.body.scrollHeight)
    }, 10)
}















// проверка на сафари
isSafari()
function isSafari() {
    let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari) {
        document.addEventListener('keydown', function () {
            if (window.event.key == 'Tab') {
                window.event.preventDefault();
            }
        })
    }
}