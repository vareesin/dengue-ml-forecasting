import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import matplotlib.pyplot as plt
from math import sqrt

class TimeSeriesDecomposition:
    def __init__(self):
        self.linear_trend = None
        self.quadratic_trend = None
        self.seasonal_indices = None
        
    def load_data(self, filepath):
        """Load and prepare the dengue fever dataset"""
        data = pd.read_csv(filepath)
        data['date'] = pd.date_range(start='2015-01-01', periods=len(data), freq='M')
        data = data.set_index('date')
        return data['n']
        
    def fit_linear_trend(self, data):
        """Fit linear trend to the data"""
        x = np.arange(len(data))
        coefficients = np.polyfit(x, data, 1)
        self.linear_trend = np.poly1d(coefficients)
        return self.linear_trend(x)
        
    def fit_quadratic_trend(self, data):
        """Fit quadratic trend to the data"""
        x = np.arange(len(data))
        coefficients = np.polyfit(x, data, 2)
        self.quadratic_trend = np.poly1d(coefficients)
        return self.quadratic_trend(x)
        
    def calculate_seasonal_indices(self, data):
        """Calculate seasonal indices using decomposition"""
        decomposition = seasonal_decompose(data, period=12)
        self.seasonal_indices = decomposition.seasonal[:12]
        return self.seasonal_indices
        
    def combine_components(self, data, trend_type='quadratic'):
        """Combine trend and seasonal components"""
        x = np.arange(len(data))
        
        # Get trend
        if trend_type == 'linear':
            trend = self.linear_trend(x)
        else:
            trend = self.quadratic_trend(x)
            
        # Repeat seasonal indices for the full length of data
        seasonal = np.tile(self.seasonal_indices, len(data)//12 + 1)[:len(data)]
        
        # Combine components
        return trend + seasonal
        
    def evaluate(self, actual, predicted):
        """Calculate error metrics"""
        mse = mean_squared_error(actual, predicted)
        rmse = sqrt(mse)
        mape = mean_absolute_percentage_error(actual, predicted) * 100
        return {
            'MSE': mse,
            'RMSE': rmse,
            'MAPE': mape
        }
        
    def plot_trends(self, data, linear_fitted, quad_fitted):
        """Plot trend comparisons"""
        plt.figure(figsize=(12, 6))
        plt.plot(data.index, data.values, label='Original', color='black')
        plt.plot(data.index, linear_fitted, label='Linear Trend', color='red')
        plt.plot(data.index, quad_fitted, label='Quadratic Trend', color='blue')
        plt.title('Trend Comparison')
        plt.xlabel('Date')
        plt.ylabel('Number of Cases')
        plt.legend()
        plt.grid(True)
        plt.show()
        
    def plot_seasonal_pattern(self):
        """Plot seasonal pattern"""
        plt.figure(figsize=(10, 6))
        plt.plot(range(1, 13), self.seasonal_indices, marker='o')
        plt.title('Seasonal Pattern')
        plt.xlabel('Month')
        plt.ylabel('Seasonal Index')
        plt.grid(True)
        plt.show()
        
    def plot_final_model(self, data, combined_fit):
        """Plot final model with combined components"""
        plt.figure(figsize=(12, 6))
        plt.plot(data.index, data.values, label='Original', color='black')
        plt.plot(data.index, combined_fit, label='Combined Model', color='red')
        plt.title('Combined Trend and Seasonal Model')
        plt.xlabel('Date')
        plt.ylabel('Number of Cases')
        plt.legend()
        plt.grid(True)
        plt.show()

def main():
    # Initialize model
    model = TimeSeriesDecomposition()
    
    # Load data
    data = model.load_data('data/dataset_dengue.csv')
    
    # Fit trends
    linear_fitted = model.fit_linear_trend(data)
    quad_fitted = model.fit_quadratic_trend(data)
    
    # Calculate seasonal indices
    seasonal_indices = model.calculate_seasonal_indices(data)
    
    # Combine components
    combined_fit = model.combine_components(data)
    
    # Evaluate models
    linear_metrics = model.evaluate(data, linear_fitted)
    quad_metrics = model.evaluate(data, quad_fitted)
    combined_metrics = model.evaluate(data, combined_fit)
    
    # Print results
    print("\nLinear Trend Metrics:")
    for metric, value in linear_metrics.items():
        print(f"{metric}: {value:.2f}")
        
    print("\nQuadratic Trend Metrics:")
    for metric, value in quad_metrics.items():
        print(f"{metric}: {value:.2f}")
        
    print("\nCombined Model Metrics:")
    for metric, value in combined_metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    model.plot_trends(data, linear_fitted, quad_fitted)
    model.plot_seasonal_pattern()
    model.plot_final_model(data, combined_fit)

if __name__ == "__main__":
    main()