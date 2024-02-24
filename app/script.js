function resetForm() {
    // Limpar os campos de entrada
    document.getElementById("initial-amount").value = "";
    document.getElementById("monthly-contribution").value = "";
    document.getElementById("annual-interest-rate").value = "";
    document.getElementById("period-months").value = "";
    document.getElementById("ir-rate").value = "";
    document.getElementById("iof-rate").value = "";
  
    // Limpar o resultado da calculadora
    document.getElementById("total-final").textContent = "";
    document.getElementById("total-invested").textContent = "";
    document.getElementById("total-interest-bruto").textContent = "";
    document.getElementById("total-interest-liquido").textContent = "";
    document.getElementById("total-taxes").textContent = "";
    document.getElementById("total-net-value").textContent = "";
    document.getElementById("monthly-results").innerHTML = ""; // Limpar a tabela
  }
  
  // Função para exibir o bloco de Resultado e a tabela
  function showResult() {
    document.getElementById("monthly-results").style.display = "block";
    document.getElementById("result-infos").style.display = "block";
  }
  
  function calculate() {
    // Ocultar a mensagem de alerta
    document.getElementById("message").style.display = "none";
    // Obter os valores dos inputs do usuário
    const initialAmount = parseFloat(
      document.getElementById("initial-amount").value
    );
  
    const monthlyContribution =
      parseFloat(document.getElementById("monthly-contribution").value) || 0;
    const annualInterestRate = parseFloat(
      document.getElementById("annual-interest-rate").value
    );
    const periodMonths = parseInt(document.getElementById("period-months").value);
    const irRate = parseFloat(document.getElementById("ir-rate").value) || 0;
    const iofRate = parseFloat(document.getElementById("iof-rate").value) || 0;
  
    // Verificar se todos os campos estão preenchidos
    if (
      isNaN(initialAmount) ||
      isNaN(annualInterestRate) ||
      isNaN(periodMonths) ||
      isNaN(irRate) ||
      isNaN(iofRate)
    ) {
      // Exibir mensagem na tela
      document.getElementById("message").textContent =
        "Por favor, preencha todos os campos antes de calcular.";
      document.getElementById("message").style.display = "block";
      return; // Sair da função se algum campo estiver vazio
    }
  
    // Inicializar variáveis para armazenar os resultados
    let balance = initialAmount;
    let totalInvested = initialAmount;
    let totalInterest = 0;
    let totalIR = 0;
    let totalIOF = 0;
  
    // Calcular a taxa de juros mensal em decimal para juros compostos
    const interestRate = Math.pow(1 + annualInterestRate / 100, 1 / 12) - 1;
  
    // Inicializar a string de resultado da tabela mensal
    let monthlyResultsHTML = "";
  
    // Calcular a taxa de IR em decimal
    const irRateDecimal = irRate / 100;
    // Calcular a taxa de IOF em decimal
    const iofRateDecimal = iofRate / 100;
  
    // Adicionar informações do mês 0 à tabela
    monthlyResultsHTML += `
        <tr>
            <td>0</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>${initialAmount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</td>
            <td>0.00</td>
            <td>${initialAmount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}</td>
            <td>0.00</td>
            <td>0.00</td>
        </tr>
    `;
  
    // Começar o loop a partir do mês 1
    for (let i = 1; i <= periodMonths; i++) {
      // Calcular o rendimento mensal antes dos descontos
      const monthlyInterest = balance * interestRate;
      // Calcular os descontos de IR e IOF
      const ir = monthlyInterest * irRateDecimal;
      const iof = monthlyInterest * iofRateDecimal;
      // const iof = (balance + totalInvested) * iofRateDecimal;
      // Calcular o rendimento líquido mensal
      const monthlyNetIncome = monthlyInterest - ir - iof;
  
      // Atualizar o saldo com o rendimento líquido e contribuições mensais
      balance += monthlyNetIncome + monthlyContribution;
      // Atualizar o total investido
      totalInvested += monthlyContribution;
      // Atualizar o total de juros
      totalInterest += monthlyInterest;
      // Atualizar o total de IR e IOF
      totalIR += ir;
      totalIOF += iof;
  
      // Adicionar uma linha na tabela para este mês
      monthlyResultsHTML += `
            <tr>
                <td>${i}</td>
                <td>${monthlyInterest.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${monthlyNetIncome.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${totalInvested.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${totalInterest.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${balance.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${ir.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
                <td>${iof.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}</td>
            </tr>
        `;
    }
  
    // Calcular o total de impostos (IR + IOF)
    const totalTaxes = totalIR + totalIOF;
  
    // Calcular o total em juros bruto
    //const totalInterestBruto = totalInterest.toFixed(2);
    const totalInterestBruto = totalInterest;
  
    // Calcular o total em juros líquido
    //const totalInterestLiquido = (totalInterest - totalIR - totalIOF).toFixed(2);
    const totalInterestLiquido = totalInterest - totalIR - totalIOF;
  
    // Calcular o valor total líquido
    const totalNetValue = totalInvested + totalInterestLiquido;
  
    // Calcular o valor total final como a soma do valor total investido e juros brutos totais
    const totalFinal = totalInvested + totalInterestBruto;
  
    // Atualizar os valores totais no bloco de resultado
  
    document.getElementById("total-final").textContent =
      totalFinal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    document.getElementById("total-invested").textContent =
      totalInvested.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    document.getElementById("total-interest-bruto").textContent =
      totalInterestBruto.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    document.getElementById("total-interest-liquido").textContent =
      totalInterestLiquido.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
  
    document.getElementById("total-taxes").textContent =
      totalTaxes.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  
    document.getElementById("total-net-value").textContent =
      totalNetValue.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
  
    // Atualizar a tabela mensal
    document.getElementById("monthly-results").innerHTML = `
        <tr>
            <th>Mês</th>
            <th>Juros Bruto</th>
            <th>Juros Líquido</th>
            <th>Total Investido</th>
            <th>Total Juros</th>
            <th>Total Acumulado</th>
            <th>IR (R$)</th>
            <th>IOF (R$)</th>
        </tr>
        ${monthlyResultsHTML}
    `;
    // Depois de calcular, mostrar o resultado
    showResult();
  }
  