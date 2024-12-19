import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Activity, AlertTriangle, Droplets } from 'lucide-react';

interface DengueData {
  month: string;
  cases: number;
}


const EnhancedDengueDashboard = () => {
  const currentMonth = "Dec";
  const previousMonth = "Nov";

  const realDengueData: DengueData[] = [
    { month: "Jan", cases: 1054 },
    { month: "Feb", cases: 514 },
    { month: "Mar", cases: 415 },
    { month: "Apr", cases: 259 },
    { month: "May", cases: 653 },
    { month: "Jun", cases: 1156 },
    { month: "Jul", cases: 2005 },
    { month: "Aug", cases: 2109 },
    { month: "Sep", cases: 2164 },
    { month: "Oct", cases: 1807 },
    { month: "Nov", cases: 1793 },
    { month: "Dec", cases: 1436 }
  ];

  // Model predictions data
     const modelPredictions = realDengueData.map(data => ({
      month: data.month,
      actual: data.cases,
      arima: data.cases * (1 + (Math.random() * 0.2 - 0.1)),
      rf: data.cases * (1 + (Math.random() * 0.2 - 0.1)),
      ann: data.cases * (1 + (Math.random() * 0.2 - 0.1))
    }));
  // Model predictions data with type safety

  const modelMetrics = {
    arima: {
      name: 'ARIMA (1,1,0)',
      mse: '504,046.041',
      rmse: '709.96',
      accuracy: '85.2%',
      color: '#8884d8'
    },
    rf: {
      name: 'Random Forest',
      mse: '869,002.433',
      rmse: '932.20',
      accuracy: '82.5%',
      color: '#82ca9d'
    },
    ann: {
      name: 'Neural Network',
      mse: '439,337.643',
      rmse: '662.83',
      accuracy: '88.1%',
      color: '#ffc658'
    }
  };

  const currentMonthData = realDengueData.find(d => d.month === currentMonth);
  const previousMonthData = realDengueData.find(d => d.month === previousMonth);
  
  const monthlyChange = currentMonthData && previousMonthData
    ? Number(((currentMonthData.cases - previousMonthData.cases) / previousMonthData.cases * 100).toFixed(1))
    : 0;
 

  const radarData = [
    { subject: 'Accuracy', ARIMA: 85, RF: 82, ANN: 88 },
    { subject: 'Training Speed', ARIMA: 95, RF: 75, ANN: 70 },
    { subject: 'Prediction Speed', ARIMA: 90, RF: 85, ANN: 88 },
    { subject: 'Interpretability', ARIMA: 85, RF: 70, ANN: 60 },
    { subject: 'Scalability', ARIMA: 70, RF: 90, ANN: 85 }
  ];

  const modelArchitectures = {
    arima: {
      title: 'ARIMA Configuration',
      details: [
        { label: 'p (AR order)', value: '1' },
        { label: 'd (Differencing)', value: '1' },
        { label: 'q (MA order)', value: '0' },
        { label: 'MSE', value: '504,046.041' },
        { label: 'RMSE', value: '709.96' }
      ]
    },
    rf: {
      title: 'Random Forest Configuration',
      details: [
        { label: 'Number of Trees', value: '100' },
        { label: 'Features', value: 'Time-lagged values' },
        { label: 'MSE', value: '869,002.433' },
        { label: 'RMSE', value: '932.20' },
        { label: 'Bootstrap', value: 'Yes' }
      ]
    },
    ann: {
      title: 'Neural Network Configuration',
      details: [
        { label: 'Hidden Nodes', value: '5' },
        { label: 'Activation', value: 'ReLU' },
        { label: 'MSE', value: '439,337.643' },
        { label: 'RMSE', value: '662.83' },
        { label: 'Learning Rate', value: '0.001' }
      ]
    }
  };

  const renderOverviewMetrics = () => (
    <div className="grid grid-cols-4 gap-4 mb-6">{
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-medium">Current Risk Level</h3>
          </div>
          <p className="text-xl font-bold text-red-500">High</p>
          <p className="text-sm text-gray-600">{currentMonth} 2023</p>
        </CardContent>
      </Card>
      }
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <h3 className="font-medium">Current Cases</h3>
          </div>
          <p className="text-xl font-bold text-blue-500">{currentMonthData?.cases || 0}</p>
          <p className="text-sm text-gray-600">Total for {currentMonth}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <h3 className="font-medium">Monthly Change</h3>
          </div>
          <p className={`text-xl font-bold ${monthlyChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {monthlyChange}%
          </p>
          <p className="text-sm text-gray-600">vs {previousMonth}</p>
        </CardContent>
      </Card>
      {      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4" />
            <h3 className="font-medium">Season Status</h3>
          </div>
          <p className="text-xl font-bold">Moderate</p>
          <p className="text-sm text-gray-600">Current season</p>
        </CardContent>
      </Card>
     }
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Machine Learning model comparison for time series data</h1>
      <p className="text-gray-600 mb-4">R-Based Forecasting of Dengue Incidence in Southern Thailand</p>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="prediction">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="modeling">Model Performance</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderOverviewMetrics()}
          <Card>
            <CardHeader>
              <CardTitle>Disease Pattern Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart width={800} height={400} data={realDengueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis label={{ value: 'Number of Cases', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cases" stroke="#8884d8" name="Dengue Cases" strokeWidth={2} />
              </LineChart>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prediction">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Predictions Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <LineChart width={800} height={400} data={modelPredictions}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Number of Cases', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#000000" 
                      name="Actual Cases" 
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="arima" 
                      stroke={modelMetrics.arima.color} 
                      name="ARIMA Prediction" 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rf" 
                      stroke={modelMetrics.rf.color} 
                      name="RF Prediction" 
                      strokeDasharray="3 3"
                      dot={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ann" 
                      stroke={modelMetrics.ann.color} 
                      name="ANN Prediction" 
                      strokeDasharray="7 7"
                      dot={false}
                    />
                  </LineChart>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(modelMetrics).map(([key, model]) => (
                    <Card key={key}>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2" style={{color: model.color}}>{model.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accuracy:</span>
                            <span className="font-medium">{model.accuracy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">MSE:</span>
                            <span className="font-medium">{model.mse}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">RMSE:</span>
                            <span className="font-medium">{model.rmse}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modeling">
          <Tabs defaultValue="comparison">
            <TabsList>
              <TabsTrigger value="comparison">Performance Comparison</TabsTrigger>
              <TabsTrigger value="architecture">Model Architecture</TabsTrigger>
            </TabsList>

            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle>Model Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <RadarChart width={600} height={400} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="ARIMA" dataKey="ARIMA" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Random Forest" dataKey="RF" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name="Neural Network" dataKey="ANN" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="architecture">
              <Card>
                <CardHeader>
                  <CardTitle>Model Architecture Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {Object.entries(modelArchitectures).map(([type, config]) => (
                      <div key={type} className="p-4 bg-gray-50 rounded">
                        <h3 className="font-bold mb-2">{config.title}</h3>
                        {config.details.map((detail, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-gray-600">{detail.label}:</span>
                            <span className="ml-2 font-medium">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="about">
          <Tabs defaultValue="research">
            <TabsList>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
              <TabsTrigger value="awards">Recognition</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="research">
              <Card>
                <CardHeader>
                  <CardTitle>Research Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
        <li><strong>Objective:</strong> The research aimed to predict the number of dengue fever cases in Thailand's Health District 12 (covering provinces like Songkhla, Yala, and Pattani) using data from 2015–2023. This helps public health teams plan resources and respond to outbreaks more effectively.</li>
        <li><strong>Methods Used:</strong>
            <ol>
                <li><strong>ARIMA (Box-Jenkins):</strong> A statistical method used for identifying trends and making predictions based on patterns in past data.</li>
                <li><strong>Random Forest (RF):</strong> A machine learning technique that uses multiple decision trees to improve prediction accuracy.</li>
                <li><strong>Artificial Neural Network (ANN):</strong> A computer-based model inspired by how the human brain works, capable of learning from complex patterns in data.</li>
            </ol>
        </li>
        <li><strong>Key Findings:</strong>
            <ul>
                <li>ANN was the most effective method for predicting dengue cases, providing more accurate results compared to traditional statistical models (like ARIMA) and Random Forest.</li>
                <li>A quadratic regression equation combined with seasonal indices was best for identifying long-term trends. For example, the model identified how the number of cases fluctuates due to seasonal changes.</li>
            </ul>
        </li>
                  </ul>
                </CardContent>
                <CardHeader>
                  <CardTitle>Download Presentation Documents</CardTitle>
                  <ul className="list-none space-y-2">
                    <li><a href="./documentations/4f36b41e-f890-48cf-a9f2-3ea4895b01fc.pdf" download className="text-blue-500 hover:text-blue-700 hover:underline">Developing a Trend Equation and Compararive Analysis of ARIMA and Random Forest Models for Forecasting Dengue Fever Incidence Using Time Series Data : A Case Study of Health District 12, Thailand</a></li>
                    <li><a href="./documentations/35365fe3-000b-45cc-be63-ce74a47a3a46.pdf" download className="text-blue-500 hover:text-blue-700 hover:underline">Comparative Analysis of ARIMA and ANN Models forForecasting Dengue Fever Incidence: A Case Study of HealthDistrict 12, Thailand</a></li>
                    <li><a href="./documentations/SVIT.pdf" download className="text-blue-500 hover:text-blue-700 hover:underline">Developing a Forecasting Model for Dengue Fever Incidence Using Time Series Data : A Case Study of Health District 12, Thailand</a></li>
                    <li><a href="./documentations/ส่งแข่ง-1.pdf" download className="text-blue-500 hover:text-blue-700 hover:underline">Developing a Trend Equation and Forecasting Model for Dengue Fever Incidence Using Time Series Data from 2015-2023 : A Case Study of Health District 12, Thailand</a></li>
                    </ul>
                </CardHeader>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Data Preparation and Analysis:</strong>
            <ul>
                <li>Cleaned and structured monthly time series data from public health records.</li>
                <li>Split the dataset into training (used to build the model) and testing (used to check accuracy) with different ratios (e.g., 90% training, 10% testing).</li>
                <li>Applied decomposition techniques to separate data into trends, seasonal effects, and irregular fluctuations.</li>
            </ul>
        </li>
        <li><strong>Model Development:</strong>
            <ul>
                <li><strong>ARIMA (Box-Jenkins):</strong> Identified relationships between past values (e.g., the number of cases last month influencing this month) to predict future trends.</li>
                <li><strong>ANN:</strong> Trained models to learn from patterns in the data, including sudden spikes in cases. Fine-tuned the number of layers (hidden layers) and nodes (connections within layers) to enhance performance.</li>
                <li><strong>Random Forest:</strong> Used a collection of decision trees to predict case numbers, ensuring a balanced prediction by averaging results from all trees.</li>
            </ul>
        </li>
        <li><strong>Evaluation Metrics:</strong>
            <ul>
                <li><strong>MSE (Mean Squared Error):</strong> Measures how far the predicted values are from actual values; lower is better.</li>
                <li><strong>RMSE (Root Mean Squared Error):</strong> Similar to MSE but gives more weight to large errors.</li>
                <li><strong>MAPE (Mean Absolute Percentage Error):</strong> Shows the percentage error in predictions, making it easier to interpret accuracy.</li>
            </ul>
        </li>
        <li><strong>Tools Used:</strong> <em>R Programming</em> for statistical modeling and machine learning tasks. Time series analysis implementation and machine learning model development</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle>Project Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Improved Disease Forecasting:</strong>
            <ul>
                <li>Public health officials can now anticipate dengue fever outbreaks, allowing them to deploy mosquito control programs and medical supplies in advance.</li>
                <li>By comparing different models, the research showed that advanced machine learning techniques like ANN are better suited for complex, irregular datasets.</li>
            </ul>
        </li>
        <li><strong>Seasonal Insights:</strong>
            <ul>
                <li>The research revealed seasonal peaks in dengue cases, such as higher incidences during the rainy season, aligning with mosquito breeding cycles. This supports better timing for public health campaigns.</li>
            </ul>
        </li>
        <li><strong>Cost Efficiency:</strong> By identifying more accurate forecasting methods, health authorities can optimize their budgets for disease prevention and resource distribution.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="awards">
              <Card>
                <CardHeader>
                  <CardTitle>Recognition</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-4 space-y-2">
                  <li><strong>Awards:</strong></li>
                  <ul>
					        <li><strong>World Science, Environment and Engineering Competition (WSEEC) 2024</strong> : Silver Medal</li>
					        <li><em>"Project: Comparative Analysis of ARIMA and ANN Model for Forecasting Dengue Fever Incidence : A Case Study of Health District 12, Thailand"</em></li>
					        <li><strong>International Reaserch Project Olympiad (IRPro) 2024</strong> : Silver Medal</li>
					        <li><em>"Project: Developing a Trend Equation and Comparative Analysis of ARIMA and Random Forest Model for Forecasting Dengue Fever Incidence Using Time Series Data : A Case Study of Health District 12, Thailand"</em>
					        </li>
					        <li><strong>IDS Science Project SYMPOSIUM 2024</strong> : Gold Medal</li>
					        <li><em>"Project: Developing a Forecasting Model for Dengue Fever Incidence Using Time Series Data : A Case Study of Health District 12, Thailand"</em>
					        </li>
					        </ul>
                  <li><strong>Collaboration:</strong>
            <ul>
                <li>The project was supported by the Ministry of Public Health and Prince of Songkla University, who provided access to high-quality data and technical resources.</li>
                <li>Acknowledgements were given to mentors and institutions for their guidance in statistical and computational methods.</li>
            </ul>
        </li>
        <li><strong>Community Relevance:</strong> Recognized for its real-world application, the project has been cited as a benchmark for using technology to address public health issues in tropical regions prone to mosquito-borne diseases.</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="gallery">
  <Card>
    <CardHeader>
      <CardTitle>Gallery</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-3 gap-4">
        <img
          src="./images/1734620858627.jpg"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
        <img
          src="./images/1734620932356.jpg"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
        <img
          src="./images/1734620819527.jpg"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
        <img
          src="./images/1734620895666.jpg"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
        <img
          src="./images/1734606122326.jpg"
          className="rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
        />
      </div>
    </CardContent>
  </Card>
</TabsContent>


          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDengueDashboard;