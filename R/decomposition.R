# Time Series Decomposition Analysis
library(stats)
library(forecast)

# Load data
load_data <- function() {
  data <- read.csv("data/dataset_dengue.csv")
  return(data)
}

# Create time series object
create_ts <- function(data) {
  ts_data <- ts(data$n, frequency=12)
  return(ts_data)
}

# Linear regression trend
fit_linear_trend <- function(data) {
  time <- 1:length(data)
  linear_model <- lm(data ~ time)
  return(linear_model)
}

# Quadratic regression trend
fit_quadratic_trend <- function(data) {
  time <- 1:length(data)
  quad_model <- lm(data ~ time + I(time^2))
  return(quad_model)
}

# Calculate seasonal indices
calculate_seasonal_indices <- function(data) {
  decomp <- decompose(data)
  seasonal_indices <- decomp$seasonal
  return(seasonal_indices)
}

# Calculate error metrics
calculate_metrics <- function(actual, fitted) {
  mse <- mean((actual - fitted)^2)
  rmse <- sqrt(mse)
  mape <- mean(abs((actual - fitted)/actual)) * 100
  return(list(MSE=mse, RMSE=rmse, MAPE=mape))
}

# Plot trend comparisons
plot_trends <- function(data, linear_fitted, quad_fitted) {
  plot(data, type="l",
       xlab="Time", ylab="Number of Cases",
       main="Trend Comparison")
  lines(linear_fitted, col="red")
  lines(quad_fitted, col="blue")
  legend("topright",
         legend=c("Original", "Linear Trend", "Quadratic Trend"),
         col=c("black", "red", "blue"),
         lty=1)
}

# Plot seasonal pattern
plot_seasonal <- function(seasonal_indices) {
  plot(seasonal_indices, type="l",
       xlab="Month", ylab="Seasonal Index",
       main="Seasonal Pattern")
}

# Combine trend and seasonal components
combine_components <- function(time, trend_coef, seasonal_indices) {
  trend <- trend_coef[1] + trend_coef[2]*time + trend_coef[3]*time^2
  n_cycles <- length(time) %/% 12
  seasonal_pattern <- rep(seasonal_indices, n_cycles + 1)[1:length(time)]
  return(trend + seasonal_pattern)
}

# Main execution
main <- function() {
  # Load data
  data <- load_data()
  ts_data <- create_ts(data)
  
  # Fit trends
  linear_model <- fit_linear_trend(ts_data)
  quad_model <- fit_quadratic_trend(ts_data)
  
  # Calculate seasonal indices
  seasonal_indices <- calculate_seasonal_indices(ts_data)
  
  # Calculate metrics for both models
  linear_metrics <- calculate_metrics(ts_data, fitted(linear_model))
  quad_metrics <- calculate_metrics(ts_data, fitted(quad_model))
  
  # Print results
  print("Linear Trend Metrics:")
  print(linear_metrics)
  print("Quadratic Trend Metrics:")
  print(quad_metrics)
  
  # Plot results
  plot_trends(ts_data, fitted(linear_model), fitted(quad_model))
  plot_seasonal(seasonal_indices)
  
  # Create combined model
  time <- 1:length(ts_data)
  combined_fit <- combine_components(time, coef(quad_model), seasonal_indices)
  
  # Plot final model
  plot(ts_data, type="l",
       main="Combined Trend and Seasonal Model")
  lines(combined_fit, col="red")
  legend("topright",
         legend=c("Original", "Combined Model"),
         col=c("black", "red"),
         lty=1)
}

# Run main function
main()