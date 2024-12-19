# Artificial Neural Network Implementation
library(forecast)
library(neuralnet)
library(zoo)

# Load and prepare data
load_data <- function() {
  data <- read.csv("data/dataset_dengue.csv")
  return(data)
}

# Convert to time series
convert_to_ts <- function(data) {
  ts_data <- ts(data$n, frequency=12)
  return(ts_data)
}

# Split data
split_data <- function(data, train_percent = 0.8) {
  train_size <- floor(train_percent * length(data))
  train_data <- data[1:train_size]
  test_data <- data[(train_size + 1):length(data)]
  return(list(train=train_data, test=test_data))
}

# Create NNAR model
create_nnar_model <- function(train_data, hidden_nodes = c(2,1,2)) {
  model <- nnetar(train_data, hidden=hidden_nodes)
  return(model)
}

# Calculate error metrics
calculate_metrics <- function(actual, predicted) {
  # Remove NA values
  residuals <- na.omit(actual - predicted)
  mse <- mean(residuals^2)
  rmse <- sqrt(mse)
  mape <- mean(abs(residuals/actual), na.rm=TRUE) * 100
  return(list(MSE=mse, RMSE=rmse, MAPE=mape))
}

# Plot results
plot_results <- function(actual, fitted, title="NNAR Model Predictions") {
  plot(actual, type="l",
       xlab="Time", ylab="Number of Cases",
       main=title)
  lines(fitted, col="red")
  legend("topright", legend=c("Actual", "Fitted"),
         col=c("black", "red"), lty=1)
}

# Plot diagnostics
plot_diagnostics <- function(residuals) {
  par(mfrow=c(1,3))
  # QQ plot
  qqnorm(residuals, pch=19, col="blue")
  qqline(residuals, col="red")
  # Residuals plot
  plot(residuals, type="p", main="Residuals",
       xlab="Time", ylab="Residuals")
  abline(h=0, col="red")
  # Histogram
  hist(residuals, col="lightblue", main="Histogram of Residuals")
}

# Main execution
main <- function() {
  # Load and prepare data
  data <- load_data()
  ts_data <- convert_to_ts(data)
  
  # Split data
  splits <- split_data(ts_data)
  
  # Create and train model
  model <- create_nnar_model(splits$train)
  
  # Make forecast
  forecast_values <- forecast(model, h=length(splits$test))
  
  # Calculate metrics
  metrics <- calculate_metrics(splits$test, forecast_values$mean)
  print(metrics)
  
  # Plot results
  plot_results(ts_data, model$fitted)
  
  # Plot diagnostics
  plot_diagnostics(model$residuals)
}

# Run main function
main()