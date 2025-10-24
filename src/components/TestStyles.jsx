// src/components/TestStyles.jsx
const TestStyles = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold text-blue-600 bg-blue-100 p-4 rounded-lg">
      TailwindCSS Test
    </h1>

    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-red-100 p-4 rounded-lg text-red-800">Red Box</div>
      <div className="bg-green-100 p-4 rounded-lg text-green-800">Green Box</div>
      <div className="bg-blue-100 p-4 rounded-lg text-blue-800">Blue Box</div>
    </div>

    <button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
      Test Button
    </button>
  </div>
)

export default TestStyles
