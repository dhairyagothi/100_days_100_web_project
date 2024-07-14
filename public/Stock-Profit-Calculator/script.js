function calculateProfit() {
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
    const sellPrice = parseFloat(document.getElementById('sellPrice').value);
    const buyCommission = parseFloat(document.getElementById('buyCommission').value);
    const sellCommission = parseFloat(document.getElementById('sellCommission').value);

    const purchasedFor = (shares * purchasePrice) + buyCommission;
    const soldFor = (shares * sellPrice) - sellCommission;
    const profitAmount = soldFor - purchasedFor;

    document.getElementById('purchasedFor').innerText = purchasedFor.toFixed(2);
    document.getElementById('soldFor').innerText = soldFor.toFixed(2);
    document.getElementById('profitAmount').innerText = profitAmount.toFixed(2);
}
