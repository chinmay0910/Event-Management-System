// import React from 'react';
// import { 
//   BarChart, Bar, 
//   PieChart, Pie, Cell, 
//   XAxis, YAxis, CartesianGrid, 
//   Tooltip, Legend, ResponsiveContainer 
// } from 'recharts';

// export default function SentimentAnalysisDashboard() {
//   // Event data from the input
//   const eventData = [
//     {
//       eventId: "65dac40cab204e7ed09fbbcd",
//       eventName: "Unlocking Intelligence - AI ML Workshop",
//       totalFeedback: 5,
//       Feedbacks: [
//         {
//           userId: "65da3092437c70fdac4866f3",
//           comments: "Well organized"
//         },
//         {
//           userId: "65da3092437c70fdac4866f3",
//           comments: "Well oraginzed"
//         },
//         {
//           userId: "65da3092437c70fdac4866f3",
//           comments: "dfgbhn"
//         },
//         {
//           userId: "65da3092437c70fdac4866f3",
//           comments: "great event"
//         },
//         {
//           userId: "65da3092437c70fdac4866f3",
//           comments: "Event was fun and enjoyed working on AI. Speakers inspired a lot."
//         }
//       ]
//     },
//     {
//       eventId: "65dac4f0ab204e7ed09fbbcf",
//       eventName: "Data Science Summit 2024",
//       totalFeedback: 0,
//       Feedbacks: []
//     }
//   ];

//   // Simple sentiment analysis function
//   const analyzeSentiment = (comment) => {
//     const positiveWords = ['great', 'fun', 'enjoyed', 'inspired', 'well', 'good', 'organized'];
//     const negativeWords = ['bad', 'poor', 'boring', 'disappointing', 'waste'];
    
//     const lowerComment = comment.toLowerCase();
    
//     let positiveScore = 0;
//     let negativeScore = 0;
    
//     positiveWords.forEach(word => {
//       if (lowerComment.includes(word)) positiveScore++;
//     });
    
//     negativeWords.forEach(word => {
//       if (lowerComment.includes(word)) negativeScore++;
//     });
    
//     if (!comment || comment.length < 3 || comment === "dfgbhn") return "Neutral";
//     if (positiveScore > negativeScore) return "Positive";
//     if (negativeScore > positiveScore) return "Negative";
//     return "Neutral";
//   };

//   // Process the data for sentiment analysis
//   const processEvents = () => {
//     return eventData.map(event => {
//       const sentiments = event.Feedbacks.map(feedback => analyzeSentiment(feedback.comments));
      
//       const positive = sentiments.filter(s => s === "Positive").length;
//       const negative = sentiments.filter(s => s === "Negative").length;
//       const neutral = sentiments.filter(s => s === "Neutral").length;
      
//       return {
//         eventName: event.eventName,
//         positive,
//         negative,
//         neutral,
//         total: event.totalFeedback,
//         sentiments
//       };
//     });
//   };
  
//   const processedData = processEvents();
  
//   // Extract words for word cloud
//   const extractKeywords = () => {
//     const words = [];
//     eventData.forEach(event => {
//       event.Feedbacks.forEach(feedback => {
//         const commentWords = feedback.comments
//           .toLowerCase()
//           .replace(/[^\w\s]/gi, '')
//           .split(/\s+/)
//           .filter(word => word.length > 2 && !['the', 'and', 'was', 'for', 'that', 'with'].includes(word));
        
//         commentWords.forEach(word => {
//           const existingWord = words.find(w => w.text === word);
//           if (existingWord) {
//             existingWord.value += 1;
//           } else {
//             words.push({ text: word, value: 1 });
//           }
//         });
//       });
//     });
//     return words.sort((a, b) => b.value - a.value).slice(0, 10).map(word => ({
//       keyword: word.text,
//       count: word.value
//     }));
//   };
  
//   const keywords = extractKeywords();
  
//   // Calculate overall sentiment data for pie chart
//   const calculateOverallSentiment = () => {
//     let positive = 0, negative = 0, neutral = 0;
    
//     processedData.forEach(event => {
//       positive += event.positive;
//       negative += event.negative;
//       neutral += event.neutral;
//     });
    
//     return [
//       { name: "Positive", value: positive, color: "#00C49F" },
//       { name: "Neutral", value: neutral, color: "#AAAAAA" },
//       { name: "Negative", value: negative, color: "#FF8042" }
//     ];
//   };
  
//   const sentimentData = calculateOverallSentiment();
  
//   // Format data for stacked bar chart
//   const formatStackedBarData = () => {
//     return processedData.map(event => ({
//       name: event.eventName.length > 15 ? `${event.eventName.substring(0, 15)}...` : event.eventName,
//       positive: event.positive,
//       neutral: event.neutral,
//       negative: event.negative,
//       fullName: event.eventName
//     }));
//   };
  
//   const stackedBarData = formatStackedBarData();
  
//   // Get example comments for each sentiment category
//   const getExampleComments = () => {
//     const examples = {
//       positive: [],
//       neutral: [],
//       negative: []
//     };
    
//     eventData.forEach(event => {
//       event.Feedbacks.forEach(feedback => {
//         const sentiment = analyzeSentiment(feedback.comments);
//         if (feedback.comments.length > 3 && feedback.comments !== "dfgbhn") {
//           examples[sentiment.toLowerCase()].push(feedback.comments);
//         }
//       });
//     });
    
//     return examples;
//   };
  
//   const exampleComments = getExampleComments();
  
//   // Custom tooltip for bar chart
//   const CustomBarTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       const event = stackedBarData.find(e => e.name === label);
//       return (
//         <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
//           <p className="font-semibold">{event?.fullName || label}</p>
//           {payload.map((entry, index) => (
//             <p key={`item-${index}`} style={{ color: entry.color }}>
//               {entry.name}: {entry.value}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };
  
//   // Custom tooltip for pie chart
//   const CustomPieTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
//           <p style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="bg-gray-100 p-6 min-h-screen">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Event Feedback Sentiment Analysis</h1>
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* Overall Sentiment Pie Chart */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4 text-center">Overall Sentiment Distribution</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={sentimentData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   outerRadius={100}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 >
//                   {sentimentData.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip content={<CustomPieTooltip />} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
          
//           {/* Event-wise Sentiment Bar Chart */}
//           <div className="bg-white rounded-lg shadow-lg p-6">
//             <h2 className="text-xl font-semibold mb-4 text-center">Event-wise Sentiment Analysis</h2>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart
//                 data={stackedBarData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip content={<CustomBarTooltip />} />
//                 <Legend />
//                 <Bar dataKey="positive" stackId="a" fill="#00C49F" name="Positive" />
//                 <Bar dataKey="neutral" stackId="a" fill="#AAAAAA" name="Neutral" />
//                 <Bar dataKey="negative" stackId="a" fill="#FF8042" name="Negative" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
        
//         {/* Keyword Analysis */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4 text-center">Common Keywords in Feedback</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart
//               data={keywords}
//               layout="vertical"
//               margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis type="number" />
//               <YAxis dataKey="keyword" type="category" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#8884d8" name="Frequency" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
        
//         {/* Sample Comments Section */}
//         <div className="bg-white rounded-lg shadow-lg p-6">
//           <h2 className="text-xl font-semibold mb-4">Sample Feedback Comments</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
//               <h3 className="font-semibold text-green-700 mb-2">Positive Feedback</h3>
//               <ul className="list-disc pl-5">
//                 {exampleComments.positive.map((comment, idx) => (
//                   <li key={idx} className="mb-2 text-sm">{comment}</li>
//                 ))}
//                 {exampleComments.positive.length === 0 && <li className="text-sm italic">No positive comments found</li>}
//               </ul>
//             </div>
            
//             <div className="border-l-4 border-gray-400 bg-gray-50 p-4 rounded">
//               <h3 className="font-semibold text-gray-700 mb-2">Neutral Feedback</h3>
//               <ul className="list-disc pl-5">
//                 {exampleComments.neutral.map((comment, idx) => (
//                   <li key={idx} className="mb-2 text-sm">{comment}</li>
//                 ))}
//                 {exampleComments.neutral.length === 0 && <li className="text-sm italic">No neutral comments found</li>}
//               </ul>
//             </div>
            
//             <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
//               <h3 className="font-semibold text-red-700 mb-2">Negative Feedback</h3>
//               <ul className="list-disc pl-5">
//                 {exampleComments.negative.map((comment, idx) => (
//                   <li key={idx} className="mb-2 text-sm">{comment}</li>
//                 ))}
//                 {exampleComments.negative.length === 0 && <li className="text-sm italic">No negative comments found</li>}
//               </ul>
//             </div>
//           </div>
//         </div>
        
//         {/* Event Statistics */}
//         <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
//           <h2 className="text-xl font-semibold mb-4">Event Statistics</h2>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">Event Name</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Total Feedback</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Positive</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Neutral</th>
//                   <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Negative</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {processedData.map((event, idx) => (
//                   <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
//                     <td className="py-2 px-4 border-b border-gray-200 text-sm">{event.eventName}</td>
//                     <td className="py-2 px-4 border-b border-gray-200 text-sm text-center">{event.total}</td>
//                     <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-green-600 font-medium">{event.positive}</td>
//                     <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-gray-600 font-medium">{event.neutral}</td>
//                     <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-red-600 font-medium">{event.negative}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, 
  PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import axios from 'axios';

export default function SentimentAnalysisDashboard() {
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/events/all');
        setEventData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading sentiment analysis data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">Error loading data: {error}</div>
      </div>
    );
  }

  // Calculate overall sentiment data for pie chart
  const calculateOverallSentiment = () => {
    let positive = 0, negative = 0, neutral = 0;
    
    eventData.forEach(event => {
      positive += event.positiveCount;
      negative += event.negativeCount;
      neutral += event.neutralCount;
    });
    
    return [
      { name: "Positive", value: positive, color: "#00C49F" },
      { name: "Neutral", value: neutral, color: "#AAAAAA" },
      { name: "Negative", value: negative, color: "#FF8042" }
    ];
  };
  
  const sentimentData = calculateOverallSentiment();
  
  // Format data for stacked bar chart
  const formatStackedBarData = () => {
    return eventData.map(event => ({
      name: event.eventName.length > 15 ? `${event.eventName.substring(0, 15)}...` : event.eventName,
      positive: event.positiveCount,
      neutral: event.neutralCount,
      negative: event.negativeCount,
      fullName: event.eventName,
      total: event.totalFeedback
    }));
  };
  
  const stackedBarData = formatStackedBarData();
  
  // Extract words for word cloud
  const extractKeywords = () => {
    const words = [];
    eventData.forEach(event => {
      event.Feedbacks.forEach(feedback => {
        const commentWords = feedback.comments
          ?.toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .split(/\s+/)
          .filter(word => word.length > 2 && !['the', 'and', 'was', 'for', 'that', 'with'].includes(word));
        
        commentWords?.forEach(word => {
          const existingWord = words.find(w => w.text === word);
          if (existingWord) {
            existingWord.value += 1;
          } else {
            words.push({ text: word, value: 1 });
          }
        });
      });
    });
    return words.sort((a, b) => b.value - a.value).slice(0, 10).map(word => ({
      keyword: word.text,
      count: word.value
    }));
  };
  
  const keywords = extractKeywords();
  
  // Get example comments for each sentiment category
  const getExampleComments = () => {
    const examples = {
      positive: [],
      neutral: [],
      negative: []
    };
    
    eventData.forEach(event => {
      event.Feedbacks.forEach(feedback => {
        if (feedback.comments && feedback.comments.length > 3) {
          examples[feedback.sentiment?.toLowerCase() || 'neutral'].push(feedback.comments);
        }
      });
    });
    
    return examples;
  };
  
  const exampleComments = getExampleComments();
  
  // Custom tooltip for bar chart
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const event = stackedBarData.find(e => e.name === label);
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p className="font-semibold">{event?.fullName || label}</p>
          <p>Total Feedback: {event?.total || 0}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Custom tooltip for pie chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-md rounded-md border border-gray-200">
          <p style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-100 p-6 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Event Feedback Sentiment Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Overall Sentiment Pie Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Overall Sentiment Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Event-wise Sentiment Bar Chart */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">Event-wise Sentiment Analysis</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stackedBarData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar dataKey="positive" stackId="a" fill="#00C49F" name="Positive" />
                <Bar dataKey="neutral" stackId="a" fill="#AAAAAA" name="Neutral" />
                <Bar dataKey="negative" stackId="a" fill="#FF8042" name="Negative" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Keyword Analysis */}
        {keywords.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-center">Common Keywords in Feedback</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={keywords}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="keyword" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Frequency" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Sample Comments Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Feedback Comments</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded">
              <h3 className="font-semibold text-green-700 mb-2">Positive Feedback</h3>
              <ul className="list-disc pl-5">
                {exampleComments.positive.slice(0, 5).map((comment, idx) => (
                  <li key={idx} className="mb-2 text-sm">{comment}</li>
                ))}
                {exampleComments.positive.length === 0 && <li className="text-sm italic">No positive comments found</li>}
              </ul>
            </div>
            
            <div className="border-l-4 border-gray-400 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-700 mb-2">Neutral Feedback</h3>
              <ul className="list-disc pl-5">
                {exampleComments.neutral.slice(0, 5).map((comment, idx) => (
                  <li key={idx} className="mb-2 text-sm">{comment}</li>
                ))}
                {exampleComments.neutral.length === 0 && <li className="text-sm italic">No neutral comments found</li>}
              </ul>
            </div>
            
            <div className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
              <h3 className="font-semibold text-red-700 mb-2">Negative Feedback</h3>
              <ul className="list-disc pl-5">
                {exampleComments.negative.slice(0, 5).map((comment, idx) => (
                  <li key={idx} className="mb-2 text-sm">{comment}</li>
                ))}
                {exampleComments.negative.length === 0 && <li className="text-sm italic">No negative comments found</li>}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Event Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Event Statistics</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">Event Name</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Total Feedback</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Positive</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Neutral</th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-700">Negative</th>
                </tr>
              </thead>
              <tbody>
                {eventData.map((event, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm">{event.eventName}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-center">{event.totalFeedback}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-green-600 font-medium">{event.positiveCount}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-gray-600 font-medium">{event.neutralCount}</td>
                    <td className="py-2 px-4 border-b border-gray-200 text-sm text-center text-red-600 font-medium">{event.negativeCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}