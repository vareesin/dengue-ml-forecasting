# Random Forest Model Implementation
library(randomForest)
library(forecast)
library(xts)
library(dplyr)

# Load and prepare data
load_data <- function() {
  data <- read.csv("data/dataset_dengue.csv")
  data$Date <- as.Date(data$time, format="%Y-%m-%d")
  return(data)
}

# Create lag features
create_features <- function(data) {
  ts_xts <- xts(data$n, order.by=data$Date)
  lags <- 1:12
  lagged_data <- lag(ts_xts)
  lagged_df <- data.frame(lagged_data)
  final_data <- cbind(data, lagged_df)
  final_data <- final_data[complete.cases(final_data),]
  return(final_data)
}

# Split data into training and test sets
split_data <- function(data, train_percent = 0.8) {
  train_size <- floor(train_percent * nrow(data))
  train_data <- data[1:train_size,]
  test_data <- data[(train_size + 1):nrow(data),]
  return(list(train=train_data, test=test_data))
}

# Train Random Forest model
train_rf_model <- function(train_data) {
  rf_model <- randomForest(n ~ ., data=train_data, ntree=100)
  return(rf_model)
}

# Calculate error metrics
calculate_metrics <- function(actual, predicted) {
  mse <- mean((actual - predicted)^2)
  rmse <- sqrt(mse)
  mape <- mean(abs((actual - predicted)/actual)) * 100
  return(list(MSE=mse, RMSE=rmse, MAPE=mape))
}

# Plot results
plot_results <- function(actual, predicted, title="Random Forest Predictions") {
  plot(actual, type="l", col="black", 
       xlab="Time", ylab="Number of Cases",
       main=title)
  lines(predicted, col="red")
  legend("topright", legend=c("Actual", "Predicted"),
         col=c("black", "red"), lty=1)
}

# Main execution
main <- function() {
  # Load and prepare data
  data <- load_data()
  featured_data <- create_features(data)
  
  # Split data
  splits <- split_data(featured_data)
  
  # Train model
  rf_model <- train_rf_model(splits$train)
  
  # Make predictions
  predictions <- predict(rf_model, splits$test)
  
  # Calculate metrics
  metrics <- calculate_metrics(splits$test$n, predictions)
  print(metrics)
  
  # Plot results
  plot_results(splits$test$n, predictions)
}

# Run main function
main()