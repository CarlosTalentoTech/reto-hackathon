// Datos del CSV cargados automáticamente
const datosConsumo = [
    { estrato: 1, consumo_promedio: 100, tarifa: 250, horas_sol: 5.2 },
    { estrato: 2, consumo_promedio: 130, tarifa: 300, horas_sol: 5.5 },
    { estrato: 3, consumo_promedio: 160, tarifa: 350, horas_sol: 5.8 }
];

let chart = null;

// Función para cargar datos automáticamente según el estrato
document.getElementById('estrato').addEventListener('change', function() {
    const estratoSeleccionado = parseInt(this.value);
    if (estratoSeleccionado) {
        const datos = datosConsumo.find(d => d.estrato === estratoSeleccionado);
        if (datos) {
            document.getElementById('consumo').value = datos.consumo_promedio;
        }
    }
});

function calcularAhorro() {
    // Obtener valores del formulario
    const estrato = parseInt(document.getElementById('estrato').value);
    const consumoInput = parseFloat(document.getElementById('consumo').value);
    const municipio = document.getElementById('municipio').value;
    const eficiencia = parseFloat(document.getElementById('eficiencia').value) / 100;
    
    // Validaciones
    if (!estrato || !consumoInput || !municipio || !eficiencia) {
        alert('Por favor, completa todos los campos.');
        return;
    }
    
    // Buscar datos del estrato
    const datos = datosConsumo.find(d => d.estrato === estrato);
    if (!datos) {
        alert('Estrato no válido.');
        return;
    }
    
    // Cálculos
    const horasSol = datos.horas_sol;
    const tarifa = datos.tarifa;
    
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
    
    document.getElementById('results').style.display = 'block';
    
    // Crear gráfico
    crearGrafico(costoActualMensual, ahorroMensual, energiaGeneradaMensual, consumoInput);
}

function crearGrafico(costoActual, ahorro, energiaGenerada, consumo) {
    const ctx = document.getElementById('ahorroChart').getContext('2d');
    
    // Destruir gráfico anterior si existe
    if (chart) {
        chart.destroy();
    }
    
    const costoConPaneles = costoActual - ahorro;
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sin Paneles Solares', 'Con Paneles Solares', 'Energía Generada (kWh)'],
            datasets: [{
                label: 'Costo/Energía',
                data: [costoActual, costoConPaneles, energiaGenerada * 10], // Escalar energía para visualización
                backgroundColor: [
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(40, 167, 69, 0.8)',
                    'rgba(255, 193, 7, 0.8)'
                ],
                borderColor: [
                    'rgba(220, 53, 69, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Comparativa de Costos y Energía Generada',
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
       