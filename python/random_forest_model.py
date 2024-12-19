import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import matplotlib.pyplot as plt
from math import sqrt

class RandomForestModel:
    def __init__(self, n_trees=100):
        self.n_trees = n_trees
        self.model = RandomForestRegressor(n_estimators=n_trees, random_state=42)
        
    def load_data(self, filepath):
        """Load and prepare the dengue fever dataset"""
        data = pd.read_csv(filepath)
        data['date'] = pd.date_range(start='2015-01-01', periods=len(data), freq='M')
        return data
    
    def create_features(self, data):
        """Create lag features"""
        df = data.copy()
        for i in range(1, 13):  # Create 12 lag features
            df[f'lag_{i}'] = df['n'].shift(i)
        df = df.dropna()  # Remove rows with NaN values
        return df
    
    def train_test_split(self, data, train_size=0.8):
        """Split data into training and testing sets"""
        train_size = int(len(data) * train_size)
        train = data.iloc[:train_size]
        test = data.iloc[train_size:]
        return train, test
    
    def prepare_features(self, data):
        """Prepare feature matrix X and target vector y"""
        feature_cols = [col for col in data.columns if col.startswith('lag_')]
        X = data[feature_cols]
        y = data['n']
        return X, y
    
    def fit(self, X_train, y_train):
        """Fit Random Forest model"""
        self.model.fit(X_train, y_train)
        return self.model
    
    def predict(self, X_test):
        """Make predictions"""
        return self.model.predict(X_test)
    
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
    
    def plot_feature_importance(self):
        """Plot feature importance"""
        feature_imp = pd.Series(self.model.feature_importances_,
                              index=[f'lag_{i}' for i in range(1, 13)])
        plt.figure(figsize=(10, 6))
        feature_imp.sort_values().plot(kind='barh')
        plt.title('Feature Importance')
        plt.xlabel('Importance Score')
        plt.tight_layout()
        plt.show()
    
    def plot_results(self, actual, predicted, title="Random Forest Predictions"):
        """Plot actual vs predicted values"""
        plt.figure(figsize=(12, 6))
        plt.plot(actual.index, actual.values, label='Actual', color='blue')
        plt.plot(actual.index, predicted, label='Predicted', color='red')
        plt.title(title)
        plt.xlabel('Date')
        plt.ylabel('Number of Cases')
        plt.legend()
        plt.grid(True)
        plt.show()

def main():
    # Initialize model
    model = RandomForestModel(n_trees=100)
    
    # Load and prepare data
    data = model.load_data('data/dataset_dengue.csv')
    data_with_features = model.create_features(data)
    
    # Split data
    train_data, test_data = model.train_test_split(data_with_features)
    
    # Prepare features
    X_train, y_train = model.prepare_features(train_data)
    X_test, y_test = model.prepare_features(test_data)
    
    # Train model
    model.fit(X_train, y_train)
    
    # Make predictions
    predictions = model.predict(X_test)
    
    # Evaluate model
    metrics = model.evaluate(y_test, predictions)
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    model.plot_feature_importance()
    model.plot_results(y_test, predictions)

if __name__ == "__main__":
    main()