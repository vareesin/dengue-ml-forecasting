import pandas as pd
import numpy as np
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf
import matplotlib.pyplot as plt
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
from math import sqrt

class ARIMAModel:
    def __init__(self, order=(1,1,0)):
        self.order = order
        self.model = None
        self.predictions = None
        
    def load_data(self, filepath):
        """Load and prepare the dengue fever dataset"""
        data = pd.read_csv(filepath)
        data['date'] = pd.date_range(start='2015-01-01', periods=len(data), freq='M')
        data = data.set_index('date')
        return data['n']
        
    def test_stationarity(self, series):
        """Perform Augmented Dickey-Fuller test"""
        result = adfuller(series)
        print('ADF Statistic:', result[0])
        print('p-value:', result[1])
        print('Critical values:')
        for key, value in result[4].items():
            print(f'\t{key}: {value}')
        return result[1] < 0.05

    def plot_diagnostics(self, series):
        """Plot ACF and PACF"""
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))
        plot_acf(series, ax=ax1)
        plot_pacf(series, ax=ax2)
        plt.show()

    def train_test_split(self, data, train_size=0.8):
        """Split data into training and testing sets"""
        train_size = int(len(data) * train_size)
        train = data[:train_size]
        test = data[train_size:]
        return train, test

    def fit(self, train_data):
        """Fit ARIMA model"""
        self.model = ARIMA(train_data, order=self.order)
        self.model_fit = self.model.fit()
        return self.model_fit

    def predict(self, n_periods):
        """Make predictions"""
        self.predictions = self.model_fit.forecast(steps=n_periods)
        return self.predictions

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

    def plot_results(self, train_data, test_data, predictions):
        """Plot results"""
        plt.figure(figsize=(12, 6))
        plt.plot(train_data.index, train_data.values, label='Training Data', color='blue')
        plt.plot(test_data.index, test_data.values, label='Actual Test Data', color='green')
        plt.plot(test_data.index, predictions, label='Predictions', color='red')
        plt.title('Dengue Fever Cases Forecast')
        plt.xlabel('Date')
        plt.ylabel('Number of Cases')
        plt.legend()
        plt.grid(True)
        plt.show()

def main():
    # Initialize model
    model = ARIMAModel(order=(1,1,0))
    
    # Load data
    data = model.load_data('data/dataset_dengue.csv')
    
    # Test stationarity
    is_stationary = model.test_stationarity(data)
    print(f"Time series is {'stationary' if is_stationary else 'non-stationary'}")
    
    # Plot diagnostics
    model.plot_diagnostics(data)
    
    # Split data
    train_data, test_data = model.train_test_split(data)
    
    # Fit model
    model.fit(train_data)
    
    # Make predictions
    predictions = model.predict(len(test_data))
    
    # Evaluate model
    metrics = model.evaluate(test_data, predictions)
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    model.plot_results(train_data, test_data, predictions)

if __name__ == "__main__":
    main()