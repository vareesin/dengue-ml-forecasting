# 🦟 Dengue Fever Forecasting Model

> Advanced time series forecasting models for predicting dengue fever cases in Thailand's Health District 12

## 🔍 Project Overview

This research focuses on forecasting dengue fever cases in Thailand's Health District 12

📊 **Project information and Interactive Dashboard**: [View Here](https://vareesin.github.io/dengue-ml-forecasting/)


## 📁 Repository Structure

```plaintext
dengue-ml-forecasting/
├── 📂 data/
│   └── 📄 dataset_dengue.csv
├── 📂 R/
│   ├── 📄 arima_model.R
│   ├── 📄 random_forest_model.R
│   ├── 📄 ann_model.R
│   └── 📄 decomposition.R
├── 📂 results/
│   └── 📂 figures/
├── 📄 renv.lock
└── 📄 README.md
```

## 💻 Installation

### 📊 R Setup

1. **Install Required Packages**
```r
# Install renv
install.packages("renv")

# Initialize and restore dependencies
renv::init()
renv::restore()
```

## 🚀 Usage

### 📊 Data Format
Place your data in `data/dataset_dengue.csv`:
```csv
time,n
2015-01,123
2015-02,456
```

### R Implementation

1. **NNAR Model**
```r
source("R/ann_model.R")
```

2. **ARIMA Model**
```r
source("R/arima_model.R")
```

3. **Random Forest**
```r
source("R/random_forest_model.R")
```

4. **Decomposition Analysis**
```r
source("R/decomposition.R")
```

### 📊 Model Outputs

Each model generates:

- 📈 Performance Metrics
  - MSE (Mean Squared Error)
  - RMSE (Root Mean Squared Error)
  - MAPE (Mean Absolute Percentage Error)

- 🎨 Visualizations
  - Actual vs Predicted plots
  - Residual analysis
  - Feature importance (Random Forest)
  - Training history (NNAR)
  - Seasonal decomposition plots

## 👥 Authors
- 👩‍💻 **Varees Adulyasas**
- 👨‍💻 **Wafeeqismail Noipom**
- 👩‍💻 **Rattifa Kasa**
- 👨‍🏫 **Marusdee Yusoh**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Citation

```bibtex
@article{noipom2023dengue,
  title={Developing a Trend Equation and Forecasting Model for 
         Dengue Fever Incidence Using Time Series Data from 2015-2023},
  author={Noipom, Wafeeqismail and Adulyasas, Varees and 
          Kasa, Rattifa and Yusoh, Marusdee},
  year={2023}
}
```

## 🙏 Acknowledgments

- **Ministry of Health Thailand** for the dataset
- **Prince of Songkla University Pattani Campus**
- **Islamic Science Demonstration School**

---
Made with ❤️ by the Research Team
