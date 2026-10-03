/**
 * Digital Climate Change Monitoring: Tracking Temperature and Rainfall Trends
 * Interactive Chart.js Visualizations for Temperature and Rainfall
 */

class ClimateChartsManager {
  constructor() {
    this.tempChart = null;
    this.rainfallChart = null;
    this.dashboardTrendChart = null;

    this.currentLocation = 'global';
    this.currentYear = '2024';
    this.tempViewMode = 'monthly'; // 'monthly' or 'yearly'
    this.rainViewMode = 'monthly'; // 'monthly' or 'yearly'

    this.colors = {
      primaryDark: '#0f3822',
      forestGreen: '#195632',
      emerald: '#10b981',
      mint: '#34d399',
      mintGlow: 'rgba(52, 211, 153, 0.25)',
      softGreenFill: 'rgba(16, 185, 129, 0.12)',
      waterBlue: '#0284c7',
      waterLight: '#38bdf8',
      waterFill: 'rgba(56, 189, 248, 0.25)',
      accentAmber: '#f59e0b',
      accentRed: '#ef4444',
      gridColor: 'rgba(15, 56, 34, 0.08)'
    };
  }

  init() {
    this.initTempChart();
    this.initRainfallChart();
    this.initDashboardTrendChart();
    this.updateAllStats();
    this.bindChartControls();
  }

  getLocationData() {
    return window.CLIMATE_LOCATIONS[this.currentLocation] || window.CLIMATE_LOCATIONS.global;
  }

  // ==========================================
  // 1. TEMPERATURE CHART
  // ==========================================
  initTempChart() {
    const ctx = document.getElementById('tempTrendChartCanvas');
    if (!ctx) return;

    const locData = this.getLocationData();
    const yearData = locData.years[this.currentYear] || locData.years["2024"];

    const labels = yearData.monthly.map(m => m.month);
    const avgTemps = yearData.monthly.map(m => m.temp);
    const maxTemps = yearData.monthly.map(m => m.max);
    const minTemps = yearData.monthly.map(m => m.min);

    this.tempChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Average Temperature (°C)',
            data: avgTemps,
            borderColor: this.colors.emerald,
            backgroundColor: this.colors.softGreenFill,
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: this.colors.emerald,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: 'Maximum Recorded (°C)',
            data: maxTemps,
            borderColor: this.colors.accentRed,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.3,
            pointBackgroundColor: this.colors.accentRed,
            pointRadius: 3
          },
          {
            label: 'Minimum Recorded (°C)',
            data: minTemps,
            borderColor: this.colors.waterBlue,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [4, 4],
            tension: 0.3,
            pointBackgroundColor: this.colors.waterBlue,
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
              color: '#1e3a29'
            }
          },
          tooltip: {
            backgroundColor: '#0f3822',
            titleColor: '#a7f3d0',
            bodyColor: '#ffffff',
            borderColor: '#2ea44f',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toFixed(1)} °C`
            }
          }
        },
        scales: {
          x: {
            grid: { color: this.colors.gridColor },
            ticks: {
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '500' },
              color: '#374151'
            }
          },
          y: {
            grid: { color: this.colors.gridColor },
            ticks: {
              callback: (val) => `${val}°C`,
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              color: '#374151'
            },
            title: {
              display: true,
              text: 'Temperature (°C)',
              font: { weight: 'bold', size: 12 },
              color: '#195632'
            }
          }
        }
      }
    });

    this.updateTempExplanation();
  }

  // ==========================================
  // 2. RAINFALL CHART
  // ==========================================
  initRainfallChart() {
    const ctx = document.getElementById('rainfallTrendChartCanvas');
    if (!ctx) return;

    const locData = this.getLocationData();
    const yearData = locData.years[this.currentYear] || locData.years["2024"];

    const labels = yearData.monthly.map(m => m.month);
    const rainfall = yearData.monthly.map(m => m.rain);
    const rainyDays = yearData.monthly.map(m => m.rainyDays);

    this.rainfallChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            type: 'bar',
            label: 'Monthly Precipitation (mm)',
            data: rainfall,
            backgroundColor: (ctx) => {
              const canvas = ctx.chart.ctx;
              const gradient = canvas.createLinearGradient(0, 0, 0, 320);
              gradient.addColorStop(0, '#0284c7');
              gradient.addColorStop(1, '#a7f3d0');
              return gradient;
            },
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: 'Rainy Days Count',
            data: rainyDays,
            borderColor: this.colors.forestGreen,
            backgroundColor: this.colors.mintGlow,
            borderWidth: 3,
            tension: 0.35,
            pointBackgroundColor: this.colors.forestGreen,
            pointRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
              color: '#1e3a29'
            }
          },
          tooltip: {
            backgroundColor: '#0f3822',
            titleColor: '#38bdf8',
            bodyColor: '#ffffff',
            borderColor: '#0284c7',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (context) => {
                if (context.dataset.type === 'line') {
                  return ` Rainy Days: ${context.parsed.y} days`;
                }
                return ` Rainfall: ${context.parsed.y} mm`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: this.colors.gridColor },
            ticks: {
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '500' },
              color: '#374151'
            }
          },
          y: {
            position: 'left',
            grid: { color: this.colors.gridColor },
            ticks: {
              callback: (val) => `${val} mm`,
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              color: '#374151'
            },
            title: {
              display: true,
              text: 'Precipitation (mm)',
              font: { weight: 'bold', size: 12 },
              color: '#0284c7'
            }
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: {
              callback: (val) => `${val} d`,
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              color: '#195632'
            },
            title: {
              display: true,
              text: 'Rainy Days',
              font: { weight: 'bold', size: 12 },
              color: '#195632'
            }
          }
        }
      }
    });

    this.updateRainfallExplanation();
  }

  // ==========================================
  // 3. DASHBOARD DECADAL TREND CHART
  // ==========================================
  initDashboardTrendChart() {
    const ctx = document.getElementById('dashboardTrendChartCanvas');
    if (!ctx) return;

    const locData = this.getLocationData();
    const trendData = locData.yearlyTrends || window.CLIMATE_LOCATIONS.global.yearlyTrends;

    const labels = trendData.map(d => d.year);
    const temps = trendData.map(d => d.temp);
    const rain = trendData.map(d => d.rainfall);

    this.dashboardTrendChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Annual Mean Temp (°C)',
            data: temps,
            borderColor: this.colors.emerald,
            backgroundColor: this.colors.softGreenFill,
            borderWidth: 3,
            tension: 0.3,
            fill: true,
            yAxisID: 'yTemp',
            pointRadius: 4,
            pointBackgroundColor: this.colors.emerald
          },
          {
            label: 'Total Annual Rainfall (mm)',
            data: rain,
            borderColor: this.colors.waterBlue,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 4],
            tension: 0.3,
            yAxisID: 'yRain',
            pointRadius: 4,
            pointBackgroundColor: this.colors.waterBlue
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 14,
              font: { family: "'Plus Jakarta Sans', sans-serif", weight: '600', size: 12 },
              color: '#1e3a29'
            }
          },
          tooltip: {
            backgroundColor: '#0f3822',
            padding: 10
          }
        },
        scales: {
          x: { grid: { color: this.colors.gridColor } },
          yTemp: {
            type: 'linear',
            position: 'left',
            grid: { color: this.colors.gridColor },
            title: { display: true, text: 'Mean Temp (°C)', color: '#10b981', font: { weight: 'bold' } }
          },
          yRain: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: 'Annual Precipitation (mm)', color: '#0284c7', font: { weight: 'bold' } }
          }
        }
      }
    });
  }

  // ==========================================
  // UPDATING CHARTS & STATS DYNAMICALLY
  // ==========================================
  updateAll() {
    this.updateTempChart();
    this.updateRainfallChart();
    this.updateDashboardTrendChart();
    this.updateAllStats();
  }

  updateTempChart() {
    if (!this.tempChart) return;
    const locData = this.getLocationData();

    if (this.tempViewMode === 'yearly') {
      const trends = locData.yearlyTrends;
      this.tempChart.data.labels = trends.map(t => t.year);
      this.tempChart.data.datasets = [
        {
          label: 'Annual Average Temp (°C)',
          data: trends.map(t => t.temp),
          borderColor: this.colors.emerald,
          backgroundColor: this.colors.softGreenFill,
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }
      ];
    } else {
      const yearData = locData.years[this.currentYear] || locData.years["2024"];
      this.tempChart.data.labels = yearData.monthly.map(m => m.month);
      this.tempChart.data.datasets = [
        {
          label: 'Average Temperature (°C)',
          data: yearData.monthly.map(m => m.temp),
          borderColor: this.colors.emerald,
          backgroundColor: this.colors.softGreenFill,
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: this.colors.emerald
        },
        {
          label: 'Maximum Recorded (°C)',
          data: yearData.monthly.map(m => m.max),
          borderColor: this.colors.accentRed,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          pointBackgroundColor: this.colors.accentRed
        },
        {
          label: 'Minimum Recorded (°C)',
          data: yearData.monthly.map(m => m.min),
          borderColor: this.colors.waterBlue,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderDash: [4, 4],
          tension: 0.3,
          pointBackgroundColor: this.colors.waterBlue
        }
      ];
    }

    this.tempChart.update();
    this.updateTempExplanation();
  }

  updateRainfallChart() {
    if (!this.rainfallChart) return;
    const locData = this.getLocationData();

    if (this.rainViewMode === 'yearly') {
      const trends = locData.yearlyTrends;
      this.rainfallChart.data.labels = trends.map(t => t.year);
      this.rainfallChart.data.datasets = [
        {
          type: 'bar',
          label: 'Annual Total Precipitation (mm)',
          data: trends.map(t => t.rainfall),
          backgroundColor: '#0284c7',
          borderRadius: 6,
          yAxisID: 'y'
        }
      ];
    } else {
      const yearData = locData.years[this.currentYear] || locData.years["2024"];
      this.rainfallChart.data.labels = yearData.monthly.map(m => m.month);
      this.rainfallChart.data.datasets = [
        {
          type: 'bar',
          label: 'Monthly Precipitation (mm)',
          data: yearData.monthly.map(m => m.rain),
          backgroundColor: (ctx) => {
            const canvas = ctx.chart.ctx;
            const gradient = canvas.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, '#0284c7');
            gradient.addColorStop(1, '#a7f3d0');
            return gradient;
          },
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          type: 'line',
          label: 'Rainy Days Count',
          data: yearData.monthly.map(m => m.rainyDays),
          borderColor: this.colors.forestGreen,
          backgroundColor: this.colors.mintGlow,
          borderWidth: 3,
          tension: 0.35,
          pointBackgroundColor: this.colors.forestGreen,
          pointRadius: 4,
          yAxisID: 'y1'
        }
      ];
    }

    this.rainfallChart.update();
    this.updateRainfallExplanation();
  }

  updateDashboardTrendChart() {
    if (!this.dashboardTrendChart) return;
    const locData = this.getLocationData();
    const trends = locData.yearlyTrends;

    this.dashboardTrendChart.data.labels = trends.map(t => t.year);
    this.dashboardTrendChart.data.datasets[0].data = trends.map(t => t.temp);
    this.dashboardTrendChart.data.datasets[1].data = trends.map(t => t.rainfall);
    this.dashboardTrendChart.update();
  }

  updateAllStats() {
    const locData = this.getLocationData();
    const yearData = locData.years[this.currentYear] || locData.years["2024"];

    // 1. Temperature stat cards
    this.setText('tempStatAvg', `${yearData.avgTemp.toFixed(1)}°C`);
    this.setText('tempStatMax', `${yearData.maxTemp.toFixed(1)}°C`);
    this.setText('tempStatMin', `${yearData.minTemp.toFixed(1)}°C`);
    this.setText('tempStatChange', yearData.tempChange);

    // 2. Rainfall stat cards
    this.setText('rainStatAvg', `${yearData.avgRainfall.toFixed(1)} mm/mo`);
    this.setText('rainStatMax', `${yearData.maxRainfall} mm`);
    this.setText('rainStatMin', `${yearData.minRainfall} mm`);
    this.setText('rainStatDays', `${yearData.rainyDays} days`);
    this.setText('rainStatVariation', yearData.rainfallVariation);

    // 3. Central Dashboard cards
    this.setText('dashStatTemp', `${yearData.avgTemp.toFixed(1)}°C`);
    this.setText('dashStatRain', `${yearData.totalRainfall} mm`);
    this.setText('dashStatTrend', yearData.tempChange);
    this.setText('dashStatStation', locData.name);
    this.setText('dashStatType', locData.stationType);

    // 4. Station details in sub-panels
    this.setText('stationCoordsBadge', `${locData.coordinates} • ${locData.elevation}`);
    this.setText('stationTypeBadge', locData.stationType);
    this.setText('stationIdBadge', `Station ID: ${locData.stationId}`);

    // Update active weather state preview according to highest sample month
    if (window.weatherEngine) {
      const topMonth = yearData.monthly.reduce((prev, curr) => (curr.rain > prev.rain) ? curr : prev, yearData.monthly[0]);
      if (topMonth.condition === 'Thunderstorm' && window.weatherEngine.mode !== 'clear') {
        window.weatherEngine.setMode('thunderstorm');
      }
    }
  }

  updateTempExplanation() {
    const el = document.getElementById('tempTrendExplanationText');
    if (!el) return;

    const locData = this.getLocationData();
    const yearData = locData.years[this.currentYear] || locData.years["2024"];

    if (this.tempViewMode === 'yearly') {
      const firstTrend = locData.yearlyTrends[0];
      const lastTrend = locData.yearlyTrends[locData.yearlyTrends.length - 1];
      el.innerHTML = `<strong>Multi-Decadal Warming Trajectory (2000 – 2026 - ${locData.shortName}):</strong> Sensor records demonstrate a sustained warming trajectory from 
      <strong>${firstTrend.temp}°C in ${firstTrend.year}</strong> to <strong>${lastTrend.temp}°C in ${lastTrend.year}</strong>. 
      This reflects heightened greenhouse radiative forcing and regional thermodynamic shifts, aligning with IPCC Sixth Assessment report projections.`;
    } else {
      el.innerHTML = `<strong>Seasonal Temperature Dynamics (${this.currentYear} - ${locData.shortName}):</strong> 
      Data illustrates a minimum baseline of <strong>${yearData.minTemp}°C</strong> rising to peak heat of <strong>${yearData.maxTemp}°C</strong>. 
      The multi-sensor telemetry demonstrates an average anomaly of <strong>${yearData.tempChange}</strong>, indicating noticeable upward thermal divergence from mid-century normal baselines.`;
    }
  }

  updateRainfallExplanation() {
    const el = document.getElementById('rainfallTrendExplanationText');
    if (!el) return;

    const locData = this.getLocationData();
    const yearData = locData.years[this.currentYear] || locData.years["2024"];

    if (this.rainViewMode === 'yearly') {
      const firstTrend = locData.yearlyTrends[0];
      const lastTrend = locData.yearlyTrends[locData.yearlyTrends.length - 1];
      el.innerHTML = `<strong>Multi-Decadal Precipitation Trajectory (2000 – 2026 - ${locData.shortName}):</strong> 
      Total annual precipitation tracked over 27 years demonstrates significant inter-annual fluctuation (${firstTrend.rainfall} mm in ${firstTrend.year} to ${lastTrend.rainfall} mm in ${lastTrend.year}), 
      illustrating how warming atmospheres hold ~7% more water vapor per °C (Clausius-Clapeyron relation), triggering erratic deluge cycles.`;
    } else {
      el.innerHTML = `<strong>Hydrological Distribution (${this.currentYear} - ${locData.shortName}):</strong> 
      Total accumulated precipitation is <strong>${yearData.totalRainfall} mm</strong> across <strong>${yearData.rainyDays} rainy days</strong>, with a peak monthly deluge of <strong>${yearData.maxRainfall} mm</strong>. 
      Rainfall variation anomaly registers at <strong>${yearData.rainfallVariation}</strong>, highlighting intensified localized downpours and erratic dry spells.`;
    }
  }

  setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  bindChartControls() {
    // Location selector
    const locationSelects = document.querySelectorAll('.climate-location-select');
    locationSelects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.currentLocation = e.target.value;
        // Keep all location selects in sync
        locationSelects.forEach(s => s.value = this.currentLocation);
        this.updateAll();
        this.updateActiveMapCard();
      });
    });

    // Year selector
    const yearSelects = document.querySelectorAll('.climate-year-select');
    yearSelects.forEach(sel => {
      sel.addEventListener('change', (e) => {
        this.currentYear = e.target.value;
        yearSelects.forEach(s => s.value = this.currentYear);
        this.updateAll();
      });
    });

    // Temp view toggle (monthly vs yearly)
    const btnTempMonthly = document.getElementById('btnTempMonthly');
    const btnTempYearly = document.getElementById('btnTempYearly');
    if (btnTempMonthly && btnTempYearly) {
      btnTempMonthly.addEventListener('click', () => {
        this.tempViewMode = 'monthly';
        btnTempMonthly.classList.add('active');
        btnTempYearly.classList.remove('active');
        this.updateTempChart();
      });
      btnTempYearly.addEventListener('click', () => {
        this.tempViewMode = 'yearly';
        btnTempYearly.classList.add('active');
        btnTempMonthly.classList.remove('active');
        this.updateTempChart();
      });
    }

    // Rainfall view toggle (monthly vs yearly)
    const btnRainMonthly = document.getElementById('btnRainMonthly');
    const btnRainYearly = document.getElementById('btnRainYearly');
    if (btnRainMonthly && btnRainYearly) {
      btnRainMonthly.addEventListener('click', () => {
        this.rainViewMode = 'monthly';
        btnRainMonthly.classList.add('active');
        btnRainYearly.classList.remove('active');
        this.updateRainfallChart();
      });
      btnRainYearly.addEventListener('click', () => {
        this.rainViewMode = 'yearly';
        btnRainYearly.classList.add('active');
        btnRainMonthly.classList.remove('active');
        this.updateRainfallChart();
      });
    }

    // Map station clicks
    document.querySelectorAll('.station-map-card').forEach(card => {
      card.addEventListener('click', () => {
        const loc = card.getAttribute('data-location');
        if (loc && window.CLIMATE_LOCATIONS[loc]) {
          this.currentLocation = loc;
          locationSelects.forEach(s => s.value = this.currentLocation);
          this.updateAll();
          this.updateActiveMapCard();
        }
      });
    });
  }

  updateActiveMapCard() {
    document.querySelectorAll('.station-map-card').forEach(card => {
      if (card.getAttribute('data-location') === this.currentLocation) {
        card.classList.add('active-station');
      } else {
        card.classList.remove('active-station');
      }
    });
  }
}

// Attach to window
window.ClimateChartsManager = ClimateChartsManager;
