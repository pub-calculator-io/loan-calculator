// CHART_DONUT_BIG CHART_LOAN
'use strict'
let switchTheme = null;

import("./assets/js/lib/chartjs/chart.js").then((e) => {
	let Chart = e.Chart
	let registerables = e.registerables
	Chart.register(...registerables)

	const theme = localStorage.getItem('theme') !== 'system' ? localStorage.getItem('theme') : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	const colors = {
		light: {
			purple: '#A78BFA',
			yellow: '#FBBF24',
			sky: '#7DD3FC',
			blue: '#1D4ED8',
			textColor: '#6B7280',
			yellowGradientStart: 'rgba(250, 219, 139, 0.33)',
			purpleGradientStart: 'rgba(104, 56, 248, 0.16)',
			skyGradientStart: 'rgba(56, 187, 248, 0.16)',
			tealGradientStart: 'rgba(56, 248, 222, 0.16)',
			yellowGradientStop: 'rgba(250, 219, 139, 0)',
			purpleGradientStop: 'rgba(104, 56, 248, 0)',
			skyGradientStop: 'rgba(56, 248, 222, 0.16)',
			gridColor: '#DBEAFE',
			tooltipBackground: '#fff',
			fractionColor: '#EDE9FE',
		},
		dark: {
			purple: '#7C3AED',
			yellow: '#D97706',
			sky: '#0284C7',
			blue: '#101E47',
			textColor: '#fff',
			yellowGradientStart: 'rgba(146, 123, 67, 0.23)',
			purpleGradientStart: 'rgba(78, 55, 144, 0.11)',
			skyGradientStart: 'rgba(56, 187, 248, 0.16)',
			tealGradientStart: 'rgba(56, 248, 222, 0.16)',
			yellowGradientStop: 'rgba(250, 219, 139, 0)',
			purpleGradientStop: 'rgba(104, 56, 248, 0)',
			skyGradientStop: 'rgba(56, 248, 222, 0.16)',
			gridColor: '#162B64',
			tooltipBackground: '#1C3782',
			fractionColor: '#41467D',
		},
	};

	let data = [
		{
			data: [25, 75],
			labels: ['25%', '75%'],
			backgroundColor: [colors[theme].sky, colors[theme].purple],
			borderColor: '#DDD6FE',
			borderWidth: 0,
		},
	];

	let options = {
		rotation: 0,
		cutout: '37%',
		hover: {mode: null},
		responsive: false,
		layout: {
			padding: 30,
		},
		plugins: {
			tooltip: {
				enabled: false,
			},
			legend: {
				display: false,
			},
		},
	};

	const customDataLabels = {
		id: 'customDataLabel',
		afterDatasetDraw(chart, args, pluginOptions) {
			const {
				ctx,
				data,
				chartArea: { top, bottom, left, right, width, height },
			} = chart;
			ctx.save();

			data.datasets[0].data.forEach((datapoint, index) => {
				const { x, y } = chart.getDatasetMeta(0).data[index].tooltipPosition();

				ctx.textAlign = 'center';
				ctx.font = '14px Inter';
				ctx.fillStyle = '#fff';
				ctx.textBaseline = 'middle';
				let toolTipText = datapoint != '0' ? datapoint + '%' : '';
				ctx.fillText(toolTipText, x, y);
			});
		},
	};

	let donutSmall = new Chart(document.getElementById('chartDonutSmall'), {
		type: 'doughnut',
		data: {
			datasets: data,
		},
		options: options,
		plugins: [customDataLabels],
	});

	let switchThemeDonut = function(theme) {
		donutSmall.destroy()

		const customDataLabels = {
			id: 'customDataLabel',
			afterDatasetDraw(chart, args, pluginOptions) {
				const {
					ctx,
					data,
					chartArea: { top, bottom, left, right, width, height },
				} = chart;
				ctx.save();

				data.datasets[0].data.forEach((datapoint, index) => {
					const { x, y } = chart.getDatasetMeta(0).data[index].tooltipPosition();

					ctx.textAlign = 'center';
					ctx.font = '14px Inter';
					ctx.fillStyle = '#fff';
					ctx.textBaseline = 'middle';
					let toolTipText = datapoint != '0' ? datapoint + '%' : '';
					ctx.fillText(toolTipText, x, y);
				});
			},
		};

		donutSmall = new Chart(document.getElementById('chartDonutSmall'), {
			type: 'doughnut',
			data: {
				datasets: data,
			},
			options: options,
			plugins: [customDataLabels],
		});

		donutSmall.data.datasets[0].backgroundColor = [colors[theme].sky, colors[theme].purple];
		donutSmall.update()
	}

	// LOAN CHART

	let ctx = document.getElementById('chartLoan').getContext('2d');

	let yellowGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	yellowGradient.addColorStop(0, colors[theme].yellowGradientStart);
	yellowGradient.addColorStop(1, colors[theme].yellowGradientStop);

	let purpleGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	purpleGradient.addColorStop(0, colors[theme].purpleGradientStart);
	purpleGradient.addColorStop(1, colors[theme].purpleGradientStop);

	let skyGradient = ctx.createLinearGradient(0, 0, 0, 1024);
	skyGradient.addColorStop(0, colors[theme].skyGradientStart);
	skyGradient.addColorStop(1, colors[theme].skyGradientStop);

	let tooltip = {
		enabled: false,
		external: function (context) {
			let tooltipEl = document.getElementById('chartjs-tooltip');

			// Create element on first render
			if (!tooltipEl) {
				tooltipEl = document.createElement('div');
				tooltipEl.id = 'chartjs-tooltip';
				tooltipEl.innerHTML = '<table></table>';
				document.body.appendChild(tooltipEl);
			}

			// Hide if no tooltip
			const tooltipModel = context.tooltip;
			if (tooltipModel.opacity === 0) {
				tooltipEl.style.opacity = 0;
				return;
			}

			// Set caret Position
			tooltipEl.classList.remove('above', 'below', 'no-transform');
			if (tooltipModel.yAlign) {
				tooltipEl.classList.add(tooltipModel.yAlign);
			} else {
				tooltipEl.classList.add('no-transform');
			}

			function getBody(bodyItem) {
				return bodyItem.lines;
			}

			if (tooltipModel.body) {
				const bodyLines = tooltipModel.body.map(getBody);

				let innerHtml = '<thead>';

				let year = +(Number(tooltipModel.title)).toFixed(0);
				let yearText = `Period ${year}`;
				innerHtml += '<tr><th class="loan-chart__title">' + yearText + '</th></tr>';

				innerHtml += '</thead><tbody>';
				bodyLines.forEach(function (body, i) {
					innerHtml += '<tr><td class="loan-chart__text">' + body + '</td></tr>';
				});
				innerHtml += '</tbody>';

				let tableRoot = tooltipEl.querySelector('table');
				tableRoot.innerHTML = innerHtml;
			}

			const position = context.chart.canvas.getBoundingClientRect();

			// Display, position, and set styles for font
			tooltipEl.style.opacity = 1;
			tooltipEl.style.position = 'absolute';
			tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipEl.clientWidth / 2 + 'px';
			tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - tooltipEl.clientHeight / 2 + 'px';
			// tooltipEl.style.font = bodyFont.string;
			tooltipEl.classList.add('loan-chart');
		},
	};

	const dataCharts = {
		labels: [
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17,
			18,
			19,
			20,
			21,
			22,
			23,
			24,
			25,
			26,
			27,
			28,
			29,
			30,
			31,
			32,
			33,
			34,
			35,
			36,
			37,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			46,
			47,
			48,
			49,
			50,
			51,
			52,
			53,
			54,
			55,
			56,
			57,
			58,
			59,
			60,
			61,
			62,
			63,
			64,
			65,
			66,
			67,
			68,
			69,
			70,
			71,
			72,
			73,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			82,
			83,
			84,
			85,
			86,
			87,
			88,
			89,
			90,
			91,
			92,
			93,
			94,
			95,
			96,
			97,
			98,
			99,
			100,
			101,
			102,
			103,
			104,
			105,
			106,
			107,
			108,
			109,
			110,
			111,
			112,
			113,
			114,
			115,
			116,
			117,
			118,
			119,
			120
		],
		datasets: [
			{
				data: [
					99389.79,
					98776.54,
					98160.22,
					97540.81,
					96918.31,
					96292.7,
					95663.96,
					95032.07,
					94397.03,
					93758.81,
					93117.4,
					92472.78,
					91824.94,
					91173.86,
					90519.52,
					89861.91,
					89201.02,
					88536.82,
					87869.3,
					87198.44,
					86524.23,
					85846.64,
					85165.67,
					84481.29,
					83793.49,
					83102.26,
					82407.56,
					81709.4,
					81007.74,
					80302.57,
					79593.88,
					78881.64,
					78165.85,
					77446.47,
					76723.5,
					75996.91,
					75266.69,
					74532.82,
					73795.28,
					73054.05,
					72309.11,
					71560.46,
					70808.05,
					70051.89,
					69291.94,
					68528.2,
					67760.63,
					66989.23,
					66213.97,
					65434.84,
					64651.81,
					63864.86,
					63073.98,
					62279.14,
					61480.34,
					60677.53,
					59870.71,
					59059.86,
					58244.96,
					57425.98,
					56602.9,
					55775.71,
					54944.39,
					54108.9,
					53269.24,
					52425.38,
					51577.3,
					50724.99,
					49868.41,
					49007.54,
					48142.38,
					47272.88,
					46399.04,
					45520.83,
					44638.23,
					43751.22,
					42859.77,
					41963.86,
					41063.48,
					40158.59,
					39249.18,
					38335.22,
					37416.69,
					36493.57,
					35565.83,
					34633.45,
					33696.42,
					32754.69,
					31808.26,
					30857.1,
					29901.18,
					28940.48,
					27974.98,
					27004.65,
					26029.47,
					25049.41,
					24064.45,
					23074.57,
					22079.73,
					21079.93,
					20075.12,
					19065.29,
					18050.41,
					17030.46,
					16005.41,
					14975.23,
					13939.9,
					12899.4,
					11853.69,
					10802.75,
					9746.56,
					8685.09,
					7618.31,
					6546.2,
					5468.72,
					4385.86,
					3297.58,
					2203.87,
					1104.68,
					0
				],
				type: 'line',
				order: 1,
				label: 'Balance',
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				stacked: true,
				borderColor: colors[theme].yellow,
				backgroundColor: yellowGradient,
				fill: true,
			},
			{
				label: 'Interest',
				data: [
					500,
					996.95,
					1490.83,
					1981.63,
					2469.34,
					2953.93,
					3435.39,
					3913.71,
					4388.87,
					4860.86,
					5329.65,
					5795.24,
					6257.6,
					6716.73,
					7172.6,
					7625.19,
					8074.5,
					8520.51,
					8963.19,
					9402.54,
					9838.53,
					10271.15,
					10700.39,
					11126.21,
					11548.62,
					11967.59,
					12383.1,
					12795.14,
					13203.68,
					13608.72,
					14010.24,
					14408.2,
					14802.61,
					15193.44,
					15580.67,
					15964.29,
					16344.28,
					16720.61,
					17093.27,
					17462.25,
					17827.52,
					18189.07,
					18546.87,
					18900.91,
					19251.17,
					19597.63,
					19940.27,
					20279.07,
					20614.02,
					20945.09,
					21272.26,
					21595.52,
					21914.85,
					22230.22,
					22541.61,
					22849.01,
					23152.4,
					23451.75,
					23747.05,
					24038.28,
					24325.41,
					24608.42,
					24887.3,
					25162.02,
					25432.57,
					25698.91,
					25961.04,
					26218.93,
					26472.55,
					26721.89,
					26966.93,
					27207.64,
					27444.01,
					27676,
					27903.61,
					28126.8,
					28345.55,
					28559.85,
					28769.67,
					28974.99,
					29175.78,
					29372.03,
					29563.71,
					29750.79,
					29933.26,
					30111.09,
					30284.25,
					30452.74,
					30616.51,
					30775.55,
					30929.84,
					31079.34,
					31224.04,
					31363.92,
					31498.94,
					31629.09,
					31754.34,
					31874.66,
					31990.03,
					32100.43,
					32205.83,
					32306.21,
					32401.53,
					32491.78,
					32576.94,
					32656.96,
					32731.84,
					32801.54,
					32866.04,
					32925.3,
					32979.32,
					33028.05,
					33071.48,
					33109.57,
					33142.3,
					33169.64,
					33191.57,
					33208.06,
					33219.08,
					33224.6
				],
				type: 'line',
				order: 1,
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				stack: 'combined',
				stacked: true,
				borderColor: colors[theme].sky,
				backgroundColor: skyGradient,
				fill: true,
			},
			{
				label: 'Principal',
				data: [
					610.21,
					1223.46,
					1839.78,
					2459.19,
					3081.69,
					3707.3,
					4336.04,
					4967.93,
					5602.97,
					6241.19,
					6882.6,
					7527.22,
					8175.06,
					8826.14,
					9480.48,
					10138.09,
					10798.98,
					11463.18,
					12130.7,
					12801.56,
					13475.77,
					14153.36,
					14834.33,
					15518.71,
					16206.51,
					16897.74,
					17592.44,
					18290.6,
					18992.26,
					19697.43,
					20406.12,
					21118.36,
					21834.15,
					22553.53,
					23276.5,
					24003.09,
					24733.31,
					25467.18,
					26204.72,
					26945.95,
					27690.89,
					28439.54,
					29191.95,
					29948.11,
					30708.06,
					31471.8,
					32239.37,
					33010.77,
					33786.03,
					34565.16,
					35348.19,
					36135.14,
					36926.02,
					37720.86,
					38519.66,
					39322.47,
					40129.29,
					40940.14,
					41755.04,
					42574.02,
					43397.1,
					44224.29,
					45055.61,
					45891.1,
					46730.76,
					47574.62,
					48422.7,
					49275.01,
					50131.59,
					50992.46,
					51857.62,
					52727.12,
					53600.96,
					54479.17,
					55361.77,
					56248.78,
					57140.23,
					58036.14,
					58936.52,
					59841.41,
					60750.82,
					61664.78,
					62583.31,
					63506.43,
					64434.17,
					65366.55,
					66303.58,
					67245.31,
					68191.74,
					69142.9,
					70098.82,
					71059.52,
					72025.02,
					72995.35,
					73970.53,
					74950.59,
					75935.55,
					76925.43,
					77920.27,
					78920.07,
					79924.88,
					80934.71,
					81949.59,
					82969.54,
					83994.59,
					85024.77,
					86060.1,
					87100.6,
					88146.31,
					89197.25,
					90253.44,
					91314.91,
					92381.69,
					93453.8,
					94531.28,
					95614.14,
					96702.42,
					97796.13,
					98895.32,
					100000
				],
				type: 'line',
				order: 1,
				pointHoverBackgroundColor: '#FFFFFF',
				pointHoverBorderWidth: 2,
				pointHoverRadius: 6,
				pointHoverBorderColor: '#5045E5',
				stacked: true,
				borderColor: colors[theme].purple,
				backgroundColor: purpleGradient,
				fill: true,
			},
		],
	};

	let chartLoan = new Chart(document.getElementById('chartLoan'), {
		data: dataCharts,
		options: {
			stepSize: 1,
			response: true,
			elements: {
				point: {
					radius: 0,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
				tooltip: tooltip,
			},
			interaction: {
				mode: 'index',
				intersect: false,
			},
			grid: {
				display: false,
			},
			scales: {
				y: {
					grid: {
						tickLength: 0,
						display: false,
						color: colors[theme].gridColor,
					},
					ticks: {
						display: false,
					},
					border: {
						color: colors[theme].gridColor,
					},
				},
				x: {
					border: {
						color: colors[theme].gridColor,
					},
					ticks: {
						display: false,
						color: colors[theme].gridColor,
						// stepSize: 10000,
					},
					grid: {
						display: false,
						tickLength: 0,
						color: colors[theme].gridColor,
					},
				},
			},
		},
	});

	let switchThemeLoan = function(theme) {
		yellowGradient.addColorStop(0, colors[theme].yellowGradientStart);
		yellowGradient.addColorStop(1, colors[theme].yellowGradientStop);
		purpleGradient.addColorStop(0, colors[theme].purpleGradientStart);
		purpleGradient.addColorStop(1, colors[theme].purpleGradientStop);
		chartLoan.data.datasets[0].backgroundColor = yellowGradient;
		chartLoan.data.datasets[0].borderColor = colors[theme].yellow;
		chartLoan.data.datasets[2].backgroundColor = purpleGradient;
		chartLoan.data.datasets[2].borderColor = colors[theme].purple;
		chartLoan.data.datasets[1].borderColor = colors[theme].sky;
		chartLoan.data.datasets[1].backgroundColor = skyGradient;
		chartLoan.options.scales.y.grid.color = colors[theme].gridColor;
		chartLoan.options.scales.x.grid.color = colors[theme].gridColor;
		chartLoan.options.scales.y.ticks.color = colors[theme].gridColor;
		chartLoan.options.scales.x.ticks.color = colors[theme].gridColor;
		chartLoan.options.scales.y.border.color = colors[theme].gridColor;
		chartLoan.options.scales.x.border.color = colors[theme].gridColor;
		chartLoan.update()
	}

	window.changeChartData = function(values, values_two) {
		donutSmall.data.datasets[0].data = values
		donutSmall.data.datasets[0].labels = values.map(value => `${value}%`)
		donutSmall.update()

		chartLoan.data.labels = values_two[0]
		chartLoan.data.datasets[0].data = values_two[1]
		chartLoan.data.datasets[1].data = values_two[2]
		chartLoan.data.datasets[2].data = values_two[3]
		chartLoan.update()
	}


	switchTheme = [switchThemeLoan, switchThemeDonut]

})
