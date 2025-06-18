const datosConsumo = [
    { ciudad: 'valledupar', estrato: 1, consumo_promedio: 100, tarifa: 380, valor_kwh: 380, horas_sol: 12.4 },
    { ciudad: 'valledupar', estrato: 2, consumo_promedio: 130, tarifa: 475, valor_kwh: 475, horas_sol: 12.4 },
    { ciudad: 'valledupar', estrato: 3, consumo_promedio: 160, tarifa: 949, valor_kwh: 949, horas_sol: 12.4 },
    { ciudad: 'barranquilla', estrato: 1, consumo_promedio: 100, tarifa: 400, valor_kwh: 400, horas_sol: 12.36 },
    { ciudad: 'barranquilla', estrato: 2, consumo_promedio: 130, tarifa: 500, valor_kwh: 500, horas_sol: 12.36 },
    { ciudad: 'barranquilla', estrato: 3, consumo_promedio: 160, tarifa: 980, valor_kwh: 980, horas_sol: 12.36 },
    { ciudad: 'santa marta', estrato: 1, consumo_promedio: 100, tarifa: 390, valor_kwh: 390, horas_sol: 11.30 },
    { ciudad: 'santa marta', estrato: 2, consumo_promedio: 130, tarifa: 490, valor_kwh: 490, horas_sol: 11.30 },
    { ciudad: 'santa marta', estrato: 3, consumo_promedio: 160, tarifa: 960, valor_kwh: 960, horas_sol: 11.30 },
    { ciudad: 'cartagena', estrato: 1, consumo_promedio: 100, tarifa: 410, valor_kwh: 410, horas_sol: 11.45 },
    { ciudad: 'cartagena', estrato: 2, consumo_promedio: 130, tarifa: 505, valor_kwh: 505, horas_sol: 11.45 },
    { ciudad: 'cartagena', estrato: 3, consumo_promedio: 160, tarifa: 995, valor_kwh: 995, horas_sol: 11.45 },
    { ciudad: 'sincelejo', estrato: 1, consumo_promedio: 100, tarifa: 370, valor_kwh: 370, horas_sol: 11 },
    { ciudad: 'sincelejo', estrato: 2, consumo_promedio: 130, tarifa: 465, valor_kwh: 465, horas_sol: 11 },
    { ciudad: 'sincelejo', estrato: 3, consumo_promedio: 160, tarifa: 930, valor_kwh: 930, horas_sol: 11 }
];

let chart = null;

// Eficiencia por tipo de panel
const eficienciaPanel = {
    mono: 22,
    poli: 18, 
    delgada: 12 
};

// Llenar dinámicamente el select de estrato según el municipio seleccionado
const municipioSelect = document.getElementById('municipio');
const estratoSelect = document.getElementById('estrato');

municipioSelect.addEventListener('change', function() {
    const municipio = this.value;
    // Limpiar opciones actuales
    estratoSelect.innerHTML = '<option value="">Selecciona tu estrato</option>';
    if (!municipio) return;
    // Buscar los datos de consumo para el municipio seleccionado
    const estratos = datosConsumo.filter(d => d.ciudad === municipio);
    estratos.forEach(d => {
        const option = document.createElement('option');
        option.value = d.estrato;
        option.textContent = `Estrato ${d.estrato} (${d.valor_kwh} COP/kWh)`;
        estratoSelect.appendChild(option);
    });
});

function calcularAhorro() {
    // Obtener valores del formulario
    const municipio = document.getElementById('municipio').value;
    const estrato = parseInt(document.getElementById('estrato').value);
    const consumoInput = parseFloat(document.getElementById('consumo').value);
    const tipoPanel = document.getElementById('tipo').value;
    // Usar eficiencia solo del objeto eficienciaPanel
    let eficiencia = 0;
    if (eficienciaPanel[tipoPanel]) {
        eficiencia = eficienciaPanel[tipoPanel] / 100;
    }

    // Validaciones
    if (!municipio || !estrato || isNaN(consumoInput) || consumoInput <= 0 || !eficiencia) {
        alert('Por favor, completa todos los campos e ingresa un consumo mensual válido.');
        document.getElementById('results').style.display = 'none';
        return;
    }

    // Buscar datos del municipio y estrato
    const datos = datosConsumo.find(d => d.ciudad === municipio && d.estrato === estrato);
    if (!datos) {
        alert('Combinación de municipio y estrato no válida.');
        document.getElementById('results').style.display = 'none';
        return;
    }

    // Cálculos
    const horasSol = datos.horas_sol;
    const tarifa = datos.valor_kwh;

    // Fórmula: Ahorro = Horas_sol * Eficiencia_panel * 30 * Tarifa - Consumo_actual
    const energiaGeneradaDiaria = horasSol * eficiencia; // kWh por día
    const energiaGeneradaMensual = energiaGeneradaDiaria * 30; // kWh por mes

    const costoActualMensual = consumoInput * tarifa;
    const valorEnergiaGenerada = energiaGeneradaMensual * tarifa;

    const ahorroMensual = Math.min(valorEnergiaGenerada, costoActualMensual);
    const ahorroAnual = ahorroMensual * 12;
    const porcentajeAhorro = (ahorroMensual / costoActualMensual) * 100;

    // Mostrar resultados
    document.getElementById('energiaGenerada').textContent = energiaGeneradaMensual.toFixed(1) + ' kWh';
    document.getElementById('ahorroMensual').textContent = '$' + ahorroMensual.toLocaleString('es-CO');
    document.getElementById('ahorroMensual').className = 'result-value ' + (ahorroMensual > 0 ? 'savings-positive' : 'savings-negative');

    document.getElementById('ahorroAnual').textContent = '$' + ahorroAnual.toLocaleString('es-CO');
    document.getElementById('ahorroAnual').className = 'result-value ' + (ahorroAnual > 0 ? 'savings-positive' : 'savings-negative');

    document.getElementById('porcentajeAhorro').textContent = porcentajeAhorro.toFixed(1) + '%';
    document.getElementById('porcentajeAhorro').className = 'result-value ' + (porcentajeAhorro > 0 ? 'savings-positive' : 'savings-negative');

    // Mostrar pago actual mensual sin panel
    document.getElementById('pagoActual').textContent = '$' + costoActualMensual.toLocaleString('es-CO');
    document.getElementById('pagoActual').className = 'result-value';

    // Mostrar pago mensual con panel
    const pagoConPanel = costoActualMensual - ahorroMensual;
    document.getElementById('pagoConPanel').textContent = '$' + pagoConPanel.toLocaleString('es-CO');
    document.getElementById('pagoConPanel').className = 'result-value';

    document.getElementById('results').style.display = 'block';

    // Crear gráfico
    crearGrafico(costoActualMensual, ahorroMensual, energiaGeneradaMensual, consumoInput);
}

function crearGrafico(costoActual, ahorro, consumo) {
    const ctx = document.getElementById('ahorroChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    const costoConPaneles = costoActual - ahorro;

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [
                'Sin Paneles Solares',
                'Con Paneles Solares',
            ],
            datasets: [{
                label: 'Costo/Energía',
                data: [costoActual, costoConPaneles], 
                backgroundColor: [
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                ],
                borderColor: [
                    'rgba(220, 53, 69, 1)',
                    'rgba(40, 167, 69, 1)',
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativa de Costos',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Pesos COP / kWh×10'
                    }
                }
            }
        }
    });
}
       