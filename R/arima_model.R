# ARIMA Model Implementation
library(tseries)
library(forecast)

# Load and prepare data
load_data <- function() {
  data <- read.csv("data/dataset_dengue.csv")
  return(data)
}

# Split data into training and test sets
split_data <- function(data, train_percent = 0.8) {
  train_size <- floor(train_percent * nrow(data))
  train_data <- data$n[1:train_size]
  test_data <- data$n[(train_size + 1):nrow(data)]
  return(list(train=train_data, test=test_data))
}

# Test stationarity using ADF test
test_stationarity <- function(train_data) {
  adf_result <- adf.test(train_data)
  return(adf_result)
}

# Create ARIMA model
create_arima_model <- function(train_data) {
  model <- auto.arima(train_data, ic="aic", trace=TRUE)
  return(model)
}

# Calculate error metrics
calculate_metrics <- function(actual, predicted) {
  mse <- mean((actual - predicted)^2)
  rmse <- sqrt(mse)
  mape <- mean(abs((actual - predicted)/actual)) * 100
  return(list(MSE=mse, RMSE=rmse, MAPE=mape))
}

# Plot results
plot_results <- function(model, forecast_values, data) {
  plot(forecast_values, 
       ylim=c(min(data)-1000, max(data)+1000),
       xlab="Time", ylab="Number of Cases",
       main="Dengue Fever Cases Forecast")
  lines(model$fitted, col="red")
  points(model$fitted, col="red", pch=16)
}

# Main execution
main <- function() {
  # Load data
  data <- load_data()
  
  # Split data
  splits <- split_data(data)
  
  # Test stationarity
  adf_test <- test_stationarity(splits$train)
  print(adf_test)
  
  # Create and fit model
  model <- create_arima_model(splits$train)
  
  # Make forecast
  forecast_values <- forecast(model, h=length(splits$test))
  
  # Calculate metrics
  metrics <- calculate_metrics(splits$test, forecast_values$mean)
  print(metrics)
  
  # Plot results
  plot_results(model, forecast_values, data$n)
}

# Run main function
main()