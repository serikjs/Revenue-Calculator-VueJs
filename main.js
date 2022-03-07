var app = new Vue({
	el: '#calculator',
	data: {
		seniorityLevel: 16,
		workTime: 480,
		techStack: 0,
		yourRate: null,
		currency: 1,
		total: '0,000',
		totalProsent: '0',
		techStackData: [
			{
				title: 'Front End/WordPress',
				descr: [
					'HTML5',
					'CSS3 (flex boxed, grids, bootstrap)',
					'Java scritp (ES6, Jquery)',
					'SCSS',
					'Basic knowlage of PHP',
					'WordPress theme developemtn',
					'WooCoomerce theme developemtn',
				],
				value: 1,
				junior: 15,
				middle: 20,
				senior: 25,
			},
			{
				title: 'Backend PHP developer',
				descr: [
					'PHP',
					'MySQL',
					'Ability to work with PHP-framework: Laravel or and Yii 1/2 or cutome solutions',
					'Knowledge of object-oriented PHP programming',
					'MVC',
					'SSH/Linux',
					'GIT',
					'Basic knowledge of: HTML, CSS, JS, Bootstrap',
				],
				value: 2,
				junior: 15,
				middle: 20,
				senior: 25,
			},
			{
				title: 'Manual QA',
				descr: [
					'Testing of  web interfaces',
					'Testing methods, levels, types, technics',
					'Development of the Checklists, Test Cases, Test Plans, and Bug reports',
					'Functional and non-functional testing',
					'Project documentation base updates and maintenance',
					'Regular meetings with team members',
					'Dev tools',
				],
				value: 3,
				junior: 7,
				middle: 20,
				senior: 25,
			},
			{
				title: 'UI/UX designer',
				descr: [
					'Identify clients needs by drawing website specifications',
					'Research current design trends',
					'Creativity and market analyzing',
					'Present initial design ideas to clients',
					'Branding and general clients requirements',
					'Problem solving and presentation delivery ',
					'Design graphics, animations and layout samples',
				],
				value: 4,
				junior: 10,
				middle: 16,
				senior: 30,
			},
			{
				title: '3D designer',
				descr: [
					'Create 3D models, textures, mapping',
					'Conceptualizing creative ideas',
					'Drawing storyboards to visualize scenes and create a realistic environment for the product',
					'Creating 3D sculpts and assets to meet clients standards',
				],
				value: 5,
				junior: 8,
				middle: 16,
				senior: 30,
			},
		],
		seniorityLevelData: [
			{ title: 'Junior', id: 'junior', value: 10 },
			{ title: 'Middle', id: 'middle', value: 16 },
			{ title: 'Senior', id: 'senior', value: 30 },
		],
		workTimeData: [
			{
				title: '1 month',
				value: 160,
				id: '1month',
			},
			{
				title: '3 months',
				value: 480,
				id: '3months',
			},
			{
				title: '6 months',
				value: 960,
				id: '6months',
			},
		],
		currencyData: [
			{
				title: '$USD',
				value: 1,
				id: 'USD',
			},
			{
				title: '€EUR',
				value: 1.13,
				id: 'EUR',
			},
			{
				title: '£GBP',
				value: 1.32,
				id: 'GBP',
			},
			{
				title: '$AUD',
				value: 0.7,
				id: 'AUD',
			},
		],
		currencySymbol: '$',
	},

	methods: {
		open: function (event) {
			const target = event.target
			if (target.classList.contains('open')) {
				target.classList.remove('open')
				target.nextElementSibling.style.display = 'none'
			} else {
				document.querySelector('.select__head').classList.remove('open')
				target.classList.add('open')
				target.nextElementSibling.style.display = 'block'
			}
		},
		selected: function (event) {
			event.preventDefault()
			const target = event.target,
				parent = document.querySelector('.select__head'),
				list = document.querySelector('.select__list')

			if (!target.classList.contains('select__close')) {
				list.style.display = 'none'
				parent.classList.remove('open')

				parent.textContent = target.firstChild.textContent
				this.techStack = target.getAttribute('data-value')

				this.seniorityLevelData[0].value = target.getAttribute('data-junior')
				this.seniorityLevelData[1].value = target.getAttribute('data-middle')
				this.seniorityLevelData[2].value = target.getAttribute('data-senior')

				this.seniorityLevel = this.seniorityLevelData[1].value
			} else {
				const selectElement = target.parentNode,
					selectElements = document.querySelectorAll('.select__item')

				if (selectElement.classList.contains('open')) {
					selectElement.classList.remove('open')
				} else {
					selectElements.forEach((item) => {
						item.classList.remove('open')
					})
					selectElement.classList.add('open')
				}
			}
		},
		calculate: function (event) {
			event.preventDefault()
			document.querySelector('.calculator-result').classList.add('open')
			document.querySelector('.calculator-form').classList.add('modal-open')
			document
				.querySelector('.calculator .section-header')
				.classList.add('modal-open')

			let total = 0

			const yourTotal = this.yourRate * this.workTime * this.currency,
				ourTotal = this.seniorityLevel * this.workTime * this.currency

			this.currencyData.forEach((item) => {
				if (item.value == this.currency) {
					this.currencySymbol = item.title.slice(0, 1)
				}
			})

			if (yourTotal - ourTotal > 0 && ourTotal > 0) {
				total = Math.round(yourTotal - ourTotal)
				this.total = `${this.currencySymbol}${total}`
				this.totalProsent = Math.round((total / yourTotal) * 100)
			} else {
				this.total = `${this.currencySymbol}0,000`
				this.totalProsent = '0'
			}
		},
		closeResult: function (event) {
			event.preventDefault()
			console.log('clock')
			document.querySelector('.calculator-result').classList.remove('open')
			document.querySelector('.calculator-form').classList.remove('modal-open')
			document
				.querySelector('.calculator .section-header')
				.classList.remove('modal-open')
		},
	},
	//* Initialization rates and currencies
	beforeMount() {
		this.total = `${this.currencySymbol}0,000`

		//*Receiving data from the server
		const getData = async (url) => {
			let res = await fetch(url)
			if (!res.ok) {
				throw new Error(`Could not fetch ${url}, status : ${res.status}`)
			}
			return await res.json()
		}

		//*Get currencies
		let usdInUan = null
		let otherCurrencies = new Map()
		getData(
			'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json',
		).then((data) => {
			data.forEach((item) => {
				if (item.cc === 'USD') {
					usdInUan = item.rate
				} else if (
					item.cc === 'EUR' ||
					item.cc === 'GBP' ||
					item.cc === 'AUD'
				) {
					otherCurrencies.set(item.cc, item.rate)
				}
			})
			otherCurrencies.forEach((curr, key) => {
				curr = curr / usdInUan
				curr = curr.toFixed(2)
				otherCurrencies.set(key, curr)
			})
			this.currencyData.forEach((itemCurr) => {
				if (itemCurr.id != 'USD')
					itemCurr.value = otherCurrencies.get(itemCurr.id)
			})
		})
	},
	mounted() {
		const parent = document.querySelector('.select__head'),
			list = document.querySelectorAll('.select__item')
		parent.textContent = list[3].textContent
		this.techStack = list[3].getAttribute('data-value')
	},
})
