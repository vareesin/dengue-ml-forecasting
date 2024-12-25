export interface DengueCase {
    month: string
    cases: number
  }
  
  export interface ModelConfig {
    title: string
    details: Array<{
      label: string
      value: string
    }>
  }
  
  export interface RadarDataPoint {
    subject: string
    ARIMA: number
    RF: number
    ANN: number
  }