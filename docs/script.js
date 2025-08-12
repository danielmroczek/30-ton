// Chart data management with Alpine.js
function chartData() {
    return {
        charts: [],
        selectedChartIndex: 0,
        currentChart: null,
        isLoading: true,
        
        // Initialize when component is loaded
        async init() {
            await this.loadChartData();
            if (this.charts.length > 0) {
                this.selectChart();
            }
            this.isLoading = false;
        },
        
        // Load chart data from JSON file
        async loadChartData() {
            try {
                const response = await fetch('charts.json');
                if (!response.ok) {
                    throw new Error('Failed to load chart data');
                }
                this.charts = await response.json();
                
                // Filter out charts with empty song lists
                this.charts = this.charts.filter(chart => chart.songs && chart.songs.length > 0);
                
                // Sort charts by date (newest first)
                this.charts.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });
            } catch (error) {
                console.error('Error loading chart data:', error);
                this.charts = [];
            }
        },
        
        // Select a chart based on the current index
        selectChart() {
            if (this.selectedChartIndex >= 0 && this.selectedChartIndex < this.charts.length) {
                this.currentChart = this.charts[this.selectedChartIndex];
                
            } else {
                this.currentChart = null;
            }
        },
        
        // Navigate to the previous chart
        previousChart() {
            if (this.hasPreviousChart) {
                this.selectedChartIndex--;
                this.selectChart();
            }
        },
        
        // Navigate to the next chart
        nextChart() {
            if (this.hasNextChart) {
                this.selectedChartIndex++;
                this.selectChart();
            }
        },
        
        // Format date for display
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('pl-PL', {
                year: 'numeric', 
                month: 'long', 
                day: 'numeric'
            });
        },
        
        // Format the chart option text for the dropdown
        formatChartOption(chart, index) {
            const chartNumber = index + 1;
            return `Notowanie #${chartNumber} - ${this.formatDate(chart.date)}`;
        },
        
        // Search for song using Google's "I'm Feeling Lucky".
        searchSong(song) {
            if (!song.title) return;

            const artist = song.artist || '';
            const title = song.title;
            const query = artist ? `${artist} ${title} youtube` : `${title} youtube`;
            const encodedQuery = encodeURIComponent(query);

            // Use Google's "I'm Feeling Lucky" feature.
            const luckyUrl = `https://www.google.com/search?btnI=1&q=${encodedQuery}`;
            window.open(luckyUrl, '_blank');
        },
        
        // Check if there's a previous chart available
        get hasPreviousChart() {
            return this.selectedChartIndex > 0;
        },
        
        // Check if there's a next chart available
        get hasNextChart() {
            return this.selectedChartIndex < this.charts.length - 1;
        }
    };
}
