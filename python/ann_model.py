import pandas as pd
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_percentage_error
import matplotlib.pyplot as plt
from math import sqrt

class NNARModel:
    def __init__(self, p=2, P=1, k=2):
        """Initialize NNAR(p,P,k) model
        p: Number of lagged inputs
        P: Number of seasonal lagged inputs
        k: Number of hidden nodes
        """
        self.p = p  # Non-seasonal lags
        self.P = P  # Seasonal lags
        self.k = k  # Hidden nodes
        self.model = None
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.history = None
        
    def load_data(self, filepath):
        """Load and prepare the dengue fever dataset"""
        data = pd.read_csv(filepath)
        data['date'] = pd.date_range(start='2015-01-01', periods=len(data), freq='M')
        data = data.set_index('date')
        return data['n']
        
    def create_sequences(self, data):
        """Create sequences for NNAR model using both seasonal and non-seasonal lags"""
        values = data.values.reshape(-1, 1)
        scaled = self.scaler.fit_transform(values)
        
        X, y = [], []
        for i in range(max(self.p, self.P * 12), len(scaled)):
            # Add non-seasonal lags
            features = [scaled[i-j-1] for j in range(self.p)]
            # Add seasonal lags
            features.extend([scaled[i-j*12-1] for j in range(self.P)])
            X.append(features)
            y.append(scaled[i])
            
        return np.array(X), np.array(y)
    
    def build_model(self, input_shape):
        """Build NNAR model architecture"""
        model = Sequential([
            Dense(self.k, activation='relu', input_shape=(input_shape,)),
            Dropout(0.2),
            Dense(1)
        ])
        
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
        return model
    
    def train_test_split(self, X, y, train_size=0.8):
        """Split data into training and testing sets"""
        train_size = int(len(X) * train_size)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]
        return X_train, X_test, y_train, y_test
    
    def fit(self, X_train, y_train, epochs=100, batch_size=32, validation_split=0.1):
        """Fit the NNAR model"""
        self.model = self.build_model(X_train.shape[1])
        
        early_stopping = EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True
        )
        
        self.history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=validation_split,
            callbacks=[early_stopping],
            verbose=1
        )
        
        return self.history
    
    def predict(self, X):
        """Make predictions and inverse transform to original scale"""
        predictions = self.model.predict(X)
        predictions = self.scaler.inverse_transform(predictions)
        return predictions
    
    def evaluate(self, y_true, y_pred):
        """Calculate error metrics"""
        mse = mean_squared_error(y_true, y_pred)
        rmse = sqrt(mse)
        mape = mean_absolute_percentage_error(y_true, y_pred) * 100
        return {
            'MSE': mse,
            'RMSE': rmse,
            'MAPE': mape
        }
    
    def plot_training_history(self):
        """Plot training history"""
        plt.figure(figsize=(10, 6))
        plt.plot(self.history.history['loss'], label='Training Loss')
        plt.plot(self.history.history['val_loss'], label='Validation Loss')
        plt.title('Model Training History')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.legend()
        plt.grid(True)
        plt.show()
    
    def plot_predictions(self, y_true, y_pred, title="NNAR Model Predictions"):
        """Plot actual vs predicted values"""
        plt.figure(figsize=(12, 6))
        plt.plot(y_true.index[-len(y_true):], y_true, label='Actual', color='blue')
        plt.plot(y_true.index[-len(y_pred):], y_pred, label='Predicted', color='red')
        plt.title(title)
        plt.xlabel('Date')
        plt.ylabel('Number of Cases')
        plt.legend()
        plt.grid(True)
        plt.show()
    
    def plot_residuals(self, y_true, y_pred):
        """Plot residuals analysis"""
        residuals = y_true - y_pred.flatten()
        
        fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
        
        # Residuals over time
        ax1.scatter(range(len(residuals)), residuals)
        ax1.axhline(y=0, color='r', linestyle='-')
        ax1.set_title('Residuals over Time')
        ax1.set_xlabel('Time')
        ax1.set_ylabel('Residual')
        
        # Residuals distribution
        ax2.hist(residuals, bins=30)
        ax2.set_title('Residuals Distribution')
        ax2.set_xlabel('Residual')
        ax2.set_ylabel('Frequency')
        
        # Q-Q plot
        from scipy import stats
        stats.probplot(residuals, dist="norm", plot=ax3)
        ax3.set_title('Q-Q Plot')
        
        plt.tight_layout()
        plt.show()

def main():
    # Initialize model with NNAR(2,1,2) configuration
    model = NNARModel(p=2, P=1, k=2)
    
    # Load data
    data = model.load_data('data/dataset_dengue.csv')
    
    # Create sequences
    X, y = model.create_sequences(data)
    
    # Split data
    X_train, X_test, y_train, y_test = model.train_test_split(X, y)
    
    # Train model
    history = model.fit(X_train, y_train, epochs=100)
    
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Scale back the test data
    y_test_original = model.scaler.inverse_transform(y_test.reshape(-1, 1))
    
    # Evaluate model
    metrics = model.evaluate(y_test_original, y_pred)
    print("\nModel Performance Metrics:")
    for metric, value in metrics.items():
        print(f"{metric}: {value:.2f}")
    
    # Plot results
    model.plot_training_history()
    model.plot_predictions(data[-len(y_test_original):], y_pred)
    model.plot_residuals(y_test_original, y_pred)

if __name__ == "__main__":
    main()