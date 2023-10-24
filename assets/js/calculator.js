function calculate(){
	const amount = input.get('loan_amount').gt(0).val();
	let interest = input.get('interest_rate').gt(0).val();
	const years = +input.get('loan_term_year').val();
	const months = +input.get('loan_term_month').val();
	const loanTerm = years + months / 12;
	const compound = input.get('compound').index().val();
	const payBack = input.get('pay_back').index().val();
	const payBackText = input.get('pay_back').raw();
	if(!loanTerm) {
		input.error('loan_term_year', 'Please enter loan term');
	}
	if(!input.valid()) return;
	interest = interest / 100;
	let compoundPayments = 12;
	let payBackPayments = 12;
	switch(compound) {
		case 0:
			compoundPayments = 12;
			break;
		case 1:
			compoundPayments = 2;
			break;
		case 2:
			compoundPayments = 4;
			break;
		case 3:
			compoundPayments = 24;
			break;
		case 4:
			compoundPayments = 26;
			break;
		case 5:
			compoundPayments = 52;
			break;
		case 6:
			compoundPayments = 365;
			break;
		case 7:
			compoundPayments = 1;
			break;
		case 8:
			compoundPayments = 0;
			break;
	}

	switch(payBack) {
		case 0:
			payBackPayments = 365;
			break;
		case 1:
			payBackPayments = 52;
			break;
		case 2:
			payBackPayments = 26;
			break;
		case 3:
			payBackPayments = 24;
			break;
		case 4:
			payBackPayments = 12;
			break;
		case 5:
			payBackPayments = 4;
			break;
		case 6:
			payBackPayments = 2;
			break;
		case 7:
			payBackPayments = 1;
			break;
	}
	const cc = compoundPayments / payBackPayments
	const i = interest / compoundPayments
	let ratePayB = Math.pow(1 + i, cc) - 1;
	if(compoundPayments === 0) {
		ratePayB = Math.pow(Math.E, interest / payBackPayments) - 1
	}

	var paybackN = payBackPayments * loanTerm;
	var loanAmount = amount;
	const paybackPeriodPayment = loanAmount * (ratePayB + ratePayB / (Math.pow(1 + ratePayB, paybackN) - 1));
	var resultTable = [];
	const chartData = [[], [], [], []];
	var totalInterestPayment = 0;
	var totalPrincipalPayment = 0;
	while(paybackN > 0) {
		let periodPayment = loanAmount * (ratePayB + ratePayB / (Math.pow(1 + ratePayB, paybackN) - 1));
		let interestPayment = loanAmount * ratePayB;
		let principalPayment = periodPayment - interestPayment;
		let beginningBalance = loanAmount;
		paybackN--;
		loanAmount -= principalPayment;
		totalInterestPayment += interestPayment;
		totalPrincipalPayment += principalPayment;
		resultTable.push({
			beginningBalance,
			interestPayment,
			principalPayment,
			endBalance: loanAmount,
			totalInterestPayment,
			totalPrincipalPayment,
		})
	}
	let annualResultsHtml = '';
	resultTable.forEach((item, index) => {
		chartData[0].push((index + 1));
		chartData[1].push(+item.endBalance.toFixed(2));
		chartData[2].push(+item.totalInterestPayment.toFixed(2));
		chartData[3].push(+item.totalPrincipalPayment.toFixed(2));
		annualResultsHtml += `<tr>
			<td class="text-center">${index + 1}</td>
			<td>${currencyFormat(item.beginningBalance)}</td>
			<td>${currencyFormat(item.interestPayment)}</td>
			<td>${currencyFormat(item.principalPayment)}</td>
			<td>${currencyFormat(item.endBalance)}</td>
	</tr>`;
	});
	const totalInterest = resultTable.reduce((acc, item) => acc + item.interestPayment, 0);
	const totalPrincipal = resultTable.reduce((acc, item) => acc + item.principalPayment, 0);

	let chartLegendHtml = '';
	for(let i = 0; i <= loanTerm / 5; i++){
		chartLegendHtml += `<p class="result-text result-text--small">${i * 5} yr</p>`;
	}
	if(years % 5 !== 0){
		chartLegendHtml += `<p class="result-text result-text--small">${loanTerm} yr</p>`;
	}
	const totalPayment = totalInterest + totalPrincipal;
	const interestPercent = +(totalInterest / totalPayment * 100).toFixed(0);
	const principalPercent = +(totalPrincipal / totalPayment * 100).toFixed(0);
	const donutData = [interestPercent, principalPercent];
	_('chart__legend').innerHTML = chartLegendHtml;
	changeChartData(donutData, chartData);
	output.val(annualResultsHtml).set('annual-results');

	output.val('Payment ' + payBackText + ': ' + currencyFormat(paybackPeriodPayment)).set('monthly-payment');
	output.val('Total Interest: $33,224.60').replace('$33,224.60', currencyFormat(totalInterest)).set('total-interest');
	output.val('Total of {120} Payments: $133,224.60').replace('{120}', payBackPayments * loanTerm).replace('$133,224.60', currencyFormat(totalPrincipal + totalInterest)).set('total-payments');
}

function currencyFormat(num) {
	return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
